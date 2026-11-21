package com.bloomscafe.order.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Transactional outbox entity.
 * Stores events that need to be published to Kafka,
 * ensuring exactly-once delivery even if the service crashes
 * between the DB commit and the Kafka publish.
 *
 * Idempotency: eventId has a unique constraint, preventing duplicate
 * outbox entries for the same logical event. The consumer also
 * deduplicates by eventId.
 */
@Entity
@Table(name = "order_outbox", uniqueConstraints = {
        @UniqueConstraint(name = "uk_outbox_event_id", columnNames = {"event_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderOutbox {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_id", nullable = false, unique = true, length = 36)
    private String eventId;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(name = "event_type", nullable = false)
    private String eventType;

    @Column(name = "payload", nullable = false, columnDefinition = "TEXT")
    private String payload;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "attempt_count", nullable = false)
    private Integer attemptCount = 0;

    @Column(name = "last_error", columnDefinition = "TEXT")
    private String lastError;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
