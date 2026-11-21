package com.bloomscafe.inventory.config;

import com.bloomscafe.inventory.entity.Inventory;
import com.bloomscafe.inventory.repository.InventoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.stream.IntStream;

/**
 * Seeds stock for the products created by catalog-service's DataSeeder.
 * Catalog seeds 32 products with IDs 1..32 on a fresh database, so a new
 * Docker volume can place orders immediately without manual inventory setup.
 */
@Configuration
public class DataSeeder {

    private static final int SEEDED_PRODUCT_COUNT = 32;
    private static final int INITIAL_STOCK = 100;

    @Bean
    public CommandLineRunner seedInventory(
            InventoryRepository inventoryRepository) {

        return args -> {

            if (inventoryRepository.count() > 0) {
                return;
            }

            var inventory = IntStream.rangeClosed(1, SEEDED_PRODUCT_COUNT)
                    .mapToObj(productId -> Inventory.builder()
                            .productId((long) productId)
                            .availableQuantity(INITIAL_STOCK)
                            .reservedQuantity(0)
                            .build())
                    .toList();

            inventoryRepository.saveAll(inventory);

            System.out.println(
                    "Seeded inventory for " + inventory.size() + " products."
            );
        };
    }
}
