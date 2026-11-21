package com.bloomscafe.notification.repo;

import com.bloomscafe.notification.entity.ProcessedEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcessedEventRepository extends JpaRepository<ProcessedEvent, Long> {

    /**
     * Check if an event with the given eventId has already been processed.
     * This is the primary idempotency check — eventId is a UUID that uniquely
     * identifies each event.
     */
    boolean existsByEventId(String eventId);

    /**
     * Check if an event for the given order has already been processed.
     * Secondary check useful for debugging and monitoring.
     */
    boolean existsByOrderId(Long orderId);
}
