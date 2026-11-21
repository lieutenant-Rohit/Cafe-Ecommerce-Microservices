package com.bloomscafe.notification.config;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.kafka.support.ExponentialBackOffWithMaxRetries;

/**
 * Kafka consumer error handling configuration.
 *
 * When a message fails to process, it is retried with exponential backoff.
 * After all retries are exhausted, the message is published to a dead-letter
 * topic (order-created-dlt) for manual inspection.
 *
 * This works alongside the consumer-side idempotency check (processed_events table)
 * to ensure messages are never silently dropped.
 */
@Configuration
public class KafkaConsumerConfig {

    private static final String DLQ_TOPIC = "order-created-dlt";

    /**
     * Configures the error handler with retry and dead-letter publishing.
     *
     * Retry strategy: 3 attempts with exponential backoff (1s, 2s, 4s).
     * After 3 failed attempts, the message is sent to the DLQ topic.
     */
    @Bean
    public DefaultErrorHandler kafkaErrorHandler(KafkaTemplate<String, String> kafkaTemplate) {

        // Exponential backoff: 1s, 2s, 4s between retries
        ExponentialBackOffWithMaxRetries backOff =
                new ExponentialBackOffWithMaxRetries(3);
        backOff.setInitialInterval(1000L);
        backOff.setMultiplier(2.0);
        backOff.setMaxInterval(4000L);

        // Dead-letter publishing: after retries are exhausted, publish to DLQ
        DeadLetterPublishingRecoverer recoverer =
                new DeadLetterPublishingRecoverer(kafkaTemplate,
                        (record, exception) -> {
                            System.err.println(
                                    "Dead-lettering message from topic "
                                            + record.topic()
                                            + " to DLQ: " + DLQ_TOPIC
                                            + ". Reason: " + exception.getMessage()
                            );
                            return new org.apache.kafka.common.TopicPartition(
                                    DLQ_TOPIC,
                                    record.partition()
                            );
                        });

        return new DefaultErrorHandler(recoverer, backOff);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<Object, Object> kafkaListenerContainerFactory(
            ConsumerFactory<Object, Object> consumerFactory,
            DefaultErrorHandler kafkaErrorHandler) {

        ConcurrentKafkaListenerContainerFactory<Object, Object> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory);
        factory.setCommonErrorHandler(kafkaErrorHandler);
        return factory;
    }
}
