package com.bloomscafe.cart.event;

import com.bloomscafe.cart.service.CartService;
import tools.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrderCreatedListener {

    private static final Logger log =
            LoggerFactory.getLogger(OrderCreatedListener.class);

    private final CartService cartService;
    private final ObjectMapper objectMapper;

    public OrderCreatedListener(CartService cartService) {
        this.cartService = cartService;
        this.objectMapper = new ObjectMapper();
    }

    @KafkaListener(
            topics = "order-created",
            groupId = "cart-service"
    )
    public void onOrderCreated(String payload) {

        try {

            OrderCreatedEvent event = objectMapper
                    .readValue(payload, OrderCreatedEvent.class);

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

        } catch (Exception e) {

            log.error(
                    "Failed to process OrderCreated event: {}",
                    e.getMessage()
            );
        }
    }
}

