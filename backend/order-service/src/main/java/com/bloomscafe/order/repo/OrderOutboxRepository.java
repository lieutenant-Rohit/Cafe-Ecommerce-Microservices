package com.bloomscafe.order.repo;

import com.bloomscafe.order.entity.OrderOutbox;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderOutboxRepository extends JpaRepository<OrderOutbox, Long> {

    /**
     * Find all unprocessed outbox events (processed_at IS NULL),
     * ordered by creation time for FIFO processing.
     */
    @Query("SELECT o FROM OrderOutbox o WHERE o.processedAt IS NULL ORDER BY o.createdAt ASC")
    List<OrderOutbox> findUnprocessed();

    /**
     * Atomically increment the attempt count and record the error.
     * Returns the number of rows updated (0 if the row was already claimed
     * by another transaction).
     */
    @Modifying
    @Transactional
    @Query("UPDATE OrderOutbox o SET o.attemptCount = o.attemptCount + 1, o.lastError = :error WHERE o.id = :id")
    int incrementAttemptCount(@Param("id") Long id, @Param("error") String error);

    /**
     * Mark an outbox event as successfully published.
     */
    @Modifying
    @Transactional
    @Query("UPDATE OrderOutbox o SET o.processedAt = :processedAt, o.publishedAt = :publishedAt WHERE o.id = :id")
    int markAsProcessed(@Param("id") Long id,
                        @Param("processedAt") LocalDateTime processedAt,
                        @Param("publishedAt") LocalDateTime publishedAt);

    /**
     * Find an outbox event by its unique event ID.
     */
    Optional<OrderOutbox> findByEventId(String eventId);

    /**
     * Check if an outbox event with the given event ID already exists.
     * Used for producer-side idempotency.
     */
    boolean existsByEventId(String eventId);
}
