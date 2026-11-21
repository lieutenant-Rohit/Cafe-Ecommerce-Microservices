package com.bloomscafe.cart.repo;

import com.bloomscafe.cart.entity.ProcessedEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcessedEventRepository extends JpaRepository<ProcessedEvent, Long> {

    /**
     * Check if an event with the given eventId has already been processed.
     */
    boolean existsByEventId(String eventId);
}
