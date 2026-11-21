package com.bloomscafe.order.event;

import com.bloomscafe.order.entity.OrderOutbox;
import com.bloomscafe.order.repo.OrderOutboxRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Background scheduler that polls the outbox table for unprocessed events
 * and publishes them to Kafka. This ensures reliable event delivery
 * even if the service crashes between the DB commit and the Kafka publish.
 *
 * Concurrency safety: Uses SELECT FOR UPDATE SKIP LOCKED (via JPA pessimistic
 * locking) so multiple scheduler instances can run in parallel without
 * publishing the same event twice.
 *
 * Retry & dead-letter: Events that fail to publish are retried up to
 * {@code outbox.max-attempts} times. After exceeding the limit, the event
 * is sent to a dead-letter topic for manual inspection.
 */
@Component
@ConditionalOnProperty(name = "outbox.scheduler.enabled", havingValue = "true", matchIfMissing = true)
public class OutboxScheduler {

    private static final Logger log = LoggerFactory.getLogger(OutboxScheduler.class);
    private static final String TOPIC = "order-created";
    private static final String DLQ_TOPIC = "order-created-dlt";

    private final OrderOutboxRepository outboxRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Value("${outbox.max-attempts:5}")
    private int maxAttempts;

    @Value("${outbox.scheduler.poll-interval-ms:5000}")
    private long pollIntervalMs;

    public OutboxScheduler(
            OrderOutboxRepository outboxRepository,
            KafkaTemplate<String, String> kafkaTemplate) {

        this.outboxRepository = outboxRepository;
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = new ObjectMapper();
    }

    @Scheduled(fixedDelayString = "${outbox.scheduler.poll-interval-ms:5000}")
    public void pollOutbox() {
        List<OrderOutbox> unprocessed = outboxRepository.findUnprocessed();

        if (unprocessed.isEmpty()) {
            return;
        }

        log.info("Outbox scheduler: found {} unprocessed event(s)", unprocessed.size());

        for (OrderOutbox outbox : unprocessed) {
            // Skip events that have exceeded the retry limit
            if (outbox.getAttemptCount() >= maxAttempts) {
                log.warn("Event {} for order {} exceeded max attempts ({}), sending to DLT",
                        outbox.getEventId(), outbox.getOrderId(), maxAttempts);
                sendToDlt(outbox);
                continue;
            }

            try {
                String kafkaKey = extractUserId(outbox.getPayload());

                kafkaTemplate.send(TOPIC, kafkaKey, outbox.getPayload())
                        .whenComplete((result, ex) -> {
                            if (ex != null) {
                                handlePublishFailure(outbox, ex.getMessage());
                            } else {
                                handlePublishSuccess(outbox);
                            }
                        });

            } catch (Exception e) {
                handlePublishFailure(outbox, e.getMessage());
            }
        }
    }

    private void handlePublishSuccess(OrderOutbox outbox) {
        outboxRepository.markAsProcessed(
                outbox.getId(),
                LocalDateTime.now(),
                LocalDateTime.now()
        );
        log.info("Published outbox event {} for order {} to topic {}",
                outbox.getEventId(), outbox.getOrderId(), TOPIC);
    }

    private void handlePublishFailure(OrderOutbox outbox, String error) {
        outboxRepository.incrementAttemptCount(outbox.getId(), error);
        log.error("Failed to publish outbox event {} for order {} (attempt {}/{}): {}",
                outbox.getEventId(), outbox.getOrderId(),
                outbox.getAttemptCount() + 1, maxAttempts, error);
    }

    private void sendToDlt(OrderOutbox outbox) {
        try {
            kafkaTemplate.send(DLQ_TOPIC, outbox.getEventId(), outbox.getPayload())
                    .whenComplete((result, ex) -> {
                        if (ex != null) {
                            log.error("Failed to send event {} to DLT: {}",
                                    outbox.getEventId(), ex.getMessage());
                        } else {
                            // Mark as processed so it won't be retried again
                            outboxRepository.markAsProcessed(
                                    outbox.getId(),
                                    LocalDateTime.now(),
                                    null  // publishedAt is null — it went to DLT, not the main topic
                            );
                            log.info("Event {} for order {} moved to DLT topic {}",
                                    outbox.getEventId(), outbox.getOrderId(), DLQ_TOPIC);
                        }
                    });
        } catch (Exception e) {
            log.error("Failed to send event {} to DLT: {}", outbox.getEventId(), e.getMessage());
        }
    }

    /**
     * Extract the userId from the JSON payload to use as the Kafka key.
     * This ensures events for the same user go to the same partition.
     */
    private String extractUserId(String payload) {
        try {
            var node = objectMapper.readTree(payload);
            return node.get("userId").asText();
        } catch (Exception e) {
            try {
                var node = objectMapper.readTree(payload);
                return node.get("orderId").asText();
            } catch (Exception ex) {
                return "unknown";
            }
        }
    }
}
