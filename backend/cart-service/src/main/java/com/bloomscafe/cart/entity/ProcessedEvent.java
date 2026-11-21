package com.bloomscafe.cart.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Tracks order-created events that have already been processed by the cart service.
 * This provides idempotency — if the same Kafka message is consumed multiple
 * times (e.g., due to consumer rebalances or retries), the cart will only be
 * cleared once.
 */
@Entity
@Table(name = "processed_events", uniqueConstraints = {
        @UniqueConstraint(name = "uk_processed_event_id", columnNames = {"event_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProcessedEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_id", nullable = false, unique = true, length = 36)
    private String eventId;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(name = "event_type", nullable = false)
    private String eventType;

    @Column(name = "processed_at", nullable = false)
    private LocalDateTime processedAt;

    @PrePersist
    protected void onCreate() {
        this.processedAt = LocalDateTime.now();
    }
}
