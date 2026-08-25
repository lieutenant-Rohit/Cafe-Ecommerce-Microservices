package com.bloomscafe.notification.consumer;

import com.bloomscafe.notification.dto.NotificationMessage;
import com.bloomscafe.notification.event.OrderCreatedEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

@Component
public class OrderCreatedConsumer {

    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate messagingTemplate;

    public OrderCreatedConsumer(
            ObjectMapper objectMapper,
            SimpMessagingTemplate messagingTemplate) {

        this.objectMapper = objectMapper;
        this.messagingTemplate = messagingTemplate;
    }

    @KafkaListener(
            topics = "order-created",
            groupId = "notification-service"
    )
    public void consume(String message) {

        try {

            OrderCreatedEvent event =
                    objectMapper.readValue(
                            message,
                            OrderCreatedEvent.class
                    );

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

            System.out.println(
                    "Notification sent for order: "
                            + event.orderId()
            );

        } catch (Exception e) {

            System.out.println(
                    "Failed to process OrderCreated event: "
                            + e.getMessage()
            );
        }
    }
}