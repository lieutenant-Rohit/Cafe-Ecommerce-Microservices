package com.bloomscafe.cart.event;

import com.bloomscafe.cart.entity.ProcessedEvent;
import com.bloomscafe.cart.repo.ProcessedEventRepository;
import com.bloomscafe.cart.service.CartService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

@Component
public class OrderCreatedListener {

    private static final Logger log =
            LoggerFactory.getLogger(OrderCreatedListener.class);
    private static final String EVENT_TYPE = "ORDER_CREATED";

    private final CartService cartService;
    private final ProcessedEventRepository processedEventRepository;
    private final ObjectMapper objectMapper;

    public OrderCreatedListener(
            CartService cartService,
            ProcessedEventRepository processedEventRepository) {
        this.cartService = cartService;
        this.processedEventRepository = processedEventRepository;
        this.objectMapper = new ObjectMapper();
    }

    @KafkaListener(
            topics = "order-created",
            groupId = "cart-service"
    )
    @Transactional
    public void onOrderCreated(String payload) {

        try {

            OrderCreatedEvent event = objectMapper
                    .readValue(payload, OrderCreatedEvent.class);

            // IDEMPOTENCY CHECK: Skip if this event was already processed
            if (processedEventRepository.existsByEventId(event.eventId())) {
                log.info("Event {} for order {} already processed, skipping duplicate",
                        event.eventId(), event.orderId());
                return;
            }

            log.info(
                    "Received OrderCreated event for order {} — clearing cart for user {}",
                    event.orderId(),
                    event.userId()
            );

            cartService.clearCart(event.userId());

            log.info(
                    "Cart cleared for user {} after order {}",
                    event.userId(),
                    event.orderId()
            );

            // Mark event as processed (idempotency record)
            try {
                ProcessedEvent processedEvent = new ProcessedEvent();
                processedEvent.setEventId(event.eventId());
                processedEvent.setOrderId(event.orderId());
                processedEvent.setEventType(EVENT_TYPE);
                processedEventRepository.save(processedEvent);
            } catch (DataIntegrityViolationException e) {
                log.info("Event {} was already marked as processed by another thread",
                        event.eventId());
            }

        } catch (Exception e) {

            log.error(
                    "Failed to process OrderCreated event: {}",
                    e.getMessage()
            );
            throw e;
        }
    }
}

