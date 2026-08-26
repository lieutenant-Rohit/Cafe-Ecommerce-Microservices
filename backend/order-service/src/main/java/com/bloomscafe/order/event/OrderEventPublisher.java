package com.bloomscafe.order.event;

import tools.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class OrderEventPublisher {

    private static final Logger log =
            LoggerFactory.getLogger(OrderEventPublisher.class);

    private static final String TOPIC = "order-created";

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public OrderEventPublisher(
            KafkaTemplate<String, String> kafkaTemplate) {

        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = new ObjectMapper();
    }

    public void publishOrderCreated(OrderCreatedEvent event) {

        try {

            String payload = objectMapper.writeValueAsString(event);

            kafkaTemplate.send(TOPIC, String.valueOf(event.userId()), payload)
                    .whenComplete((result, ex) -> {

                if (ex != null) {
                    log.error("Failed to publish OrderCreated event for order {}: {}", event.orderId(), ex.getMessage());
                } else {
                    log.info("Published OrderCreated event for order {} to topic {}", event.orderId(), TOPIC);
                }
            });

        } catch (Exception e) {

            log.error("Failed to serialize OrderCreated event for order {}: {}", event.orderId(), e.getMessage());
        }
    }
}
