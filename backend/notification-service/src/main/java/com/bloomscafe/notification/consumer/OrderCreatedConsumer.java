package com.bloomscafe.notification.consumer;

import com.bloomscafe.notification.dto.NotificationMessage;
import com.bloomscafe.notification.entity.ProcessedEvent;
import com.bloomscafe.notification.event.OrderCreatedEvent;
import com.bloomscafe.notification.repo.ProcessedEventRepository;
import com.bloomscafe.notification.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

@Component
public class OrderCreatedConsumer {

    private static final Logger log = LoggerFactory.getLogger(OrderCreatedConsumer.class);
    private static final String EVENT_TYPE = "ORDER_CREATED";

    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate messagingTemplate;
    private final EmailService emailService;
    private final ProcessedEventRepository processedEventRepository;

    public OrderCreatedConsumer(
            ObjectMapper objectMapper,
            SimpMessagingTemplate messagingTemplate,
            EmailService emailService,
            ProcessedEventRepository processedEventRepository) {

        this.objectMapper = objectMapper;
        this.messagingTemplate = messagingTemplate;
        this.emailService = emailService;
        this.processedEventRepository = processedEventRepository;
    }

    @KafkaListener(
            topics = "order-created",
            groupId = "notification-service"
    )
    @Transactional
    public void consume(String message) {

        try {

            OrderCreatedEvent event =
                    objectMapper.readValue(
                            message,
                            OrderCreatedEvent.class
                    );

            // IDEMPOTENCY CHECK: Skip if this event was already processed.
            // We deduplicate by eventId (UUID) — a unique identifier assigned
            // by the producer. The unique constraint on processed_events.event_id
            // provides a race-condition-safe guard against concurrent duplicates.
            if (processedEventRepository.existsByEventId(event.eventId())) {
                log.info("Event {} for order {} already processed, skipping duplicate",
                        event.eventId(), event.orderId());
                return;
            }

            // 1. Send WebSocket notification
            NotificationMessage notification =
                    new NotificationMessage(
                            event.orderId(),
                            event.userId(),
                            "Your order #"
                                    + event.orderId()
                                    + " has been placed successfully!"
                    );

            messagingTemplate.convertAndSend(
                    "/topic/orders/" + event.userId(),
                    notification
            );

            log.info("WebSocket notification sent for order: {}", event.orderId());

            // 2. Send Email notification
            if (event.userEmail() != null && !event.userEmail().isBlank()) {
                double totalAmount = event.items().stream()
                        .mapToDouble(item -> item.price() * item.quantity())
                        .sum();

                String customerName = "Customer";
                emailService.sendOrderConfirmationEmail(
                        event.userEmail(),
                        event.orderId(),
                        customerName,
                        totalAmount
                );
                log.info("Email notification sent for order: {} to {}", event.orderId(), event.userEmail());
            } else {
                log.warn("No email found for order: {}, skipping email notification", event.orderId());
            }

            // 3. Mark event as processed (idempotency record).
            // The unique constraint on event_id ensures that even if two
            // consumer threads race to process the same event, only one
            // will succeed — the other gets a DataIntegrityViolationException
            // which we catch and treat as a no-op.
            try {
                ProcessedEvent processedEvent = new ProcessedEvent();
                processedEvent.setEventId(event.eventId());
                processedEvent.setOrderId(event.orderId());
                processedEvent.setEventType(EVENT_TYPE);
                processedEventRepository.save(processedEvent);
                log.info("Marked event {} for order {} as processed",
                        event.eventId(), event.orderId());
            } catch (DataIntegrityViolationException e) {
                log.info("Event {} was already marked as processed by another thread",
                        event.eventId());
            }

        } catch (Exception e) {
            log.error("Failed to process OrderCreated event: {}", e.getMessage(), e);
            throw e;
        }
    }
}
