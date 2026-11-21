package com.bloomscafe.order.event;

import com.bloomscafe.order.entity.OrderOutbox;
import com.bloomscafe.order.repo.OrderOutboxRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Publishes OrderCreated events using the transactional outbox pattern.
 *
 * Instead of directly calling Kafka (which risks event loss if the service
 * crashes between the DB commit and the Kafka publish), we insert a record
 * into the order_outbox table within the same transaction as the order save.
 * The OutboxScheduler then polls this table and publishes to Kafka.
 *
 * Idempotency: Each event is assigned a unique eventId (UUID). If the same
 * logical event is retried (e.g., due to a client retry), the unique constraint
 * on eventId prevents duplicate outbox entries.
 */
@Component
public class OrderEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(OrderEventPublisher.class);
    private static final String EVENT_TYPE = "ORDER_CREATED";

    private final OrderOutboxRepository outboxRepository;
    private final ObjectMapper objectMapper;

    public OrderEventPublisher(OrderOutboxRepository outboxRepository) {
        this.outboxRepository = outboxRepository;
        this.objectMapper = new ObjectMapper();
    }

    public void publishOrderCreated(OrderCreatedEvent event) {
        try {
            // Producer-side idempotency: skip if this event was already stored
            if (outboxRepository.existsByEventId(event.eventId())) {
                log.info("Event {} already exists in outbox, skipping duplicate", event.eventId());
                return;
            }

            String payload = objectMapper.writeValueAsString(event);

            OrderOutbox outbox = new OrderOutbox();
            outbox.setEventId(event.eventId());
            outbox.setOrderId(event.orderId());
            outbox.setEventType(EVENT_TYPE);
            outbox.setPayload(payload);
            outbox.setCreatedAt(LocalDateTime.now());
            outbox.setProcessedAt(null);
            outbox.setAttemptCount(0);

            outboxRepository.save(outbox);

            log.info("Stored OrderCreated event {} for order {} in outbox", event.eventId(), event.orderId());

        } catch (DataIntegrityViolationException e) {
            // Unique constraint violation on eventId — event already exists
            log.info("Event {} already exists in outbox (constraint violation), skipping duplicate",
                    event.eventId());
        } catch (Exception e) {
            log.error("Failed to store OrderCreated event in outbox for order {}: {}",
                    event.orderId(), e.getMessage());
            throw new RuntimeException("Failed to store event in outbox", e);
        }
    }
}
