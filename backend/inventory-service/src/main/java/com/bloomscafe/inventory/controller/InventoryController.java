package com.bloomscafe.inventory.controller;

import com.bloomscafe.inventory.entity.Inventory;
import com.bloomscafe.inventory.service.InventoryService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping("/{productId}")
    public Inventory getInventory(
            @PathVariable Long productId) {

        return inventoryService.getInventory(productId);
    }

    @PostMapping("/{productId}/reserve")
    public Inventory reserveStock(
            @PathVariable Long productId,
            @RequestParam Integer quantity) {

        return inventoryService.reserveStock(
                productId,
                quantity
        );
    }

    @PostMapping("/{productId}/release")
    public Inventory releaseStock(
            @PathVariable Long productId,
            @RequestParam Integer quantity) {

        return inventoryService.releaseStock(
                productId,
                quantity
        );
    }

    @PostMapping
    public Inventory createInventory(
            @RequestBody Inventory inventory) {

        return inventoryService.createInventory(inventory);
    }
}