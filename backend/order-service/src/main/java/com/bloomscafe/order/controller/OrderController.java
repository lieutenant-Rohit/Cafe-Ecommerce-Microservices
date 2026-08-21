package com.bloomscafe.order.controller;

import com.bloomscafe.order.client.CartResponse;
import com.bloomscafe.order.entity.Order;
import com.bloomscafe.order.entity.OrderItem;
import com.bloomscafe.order.entity.OrderStatus;
import com.bloomscafe.order.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/checkout/{userId}")
    public ResponseEntity<CartResponse> getCartForCheckout(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(
                orderService.getCartForCheckout(userId)
        );
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<Order> createOrder(
            @PathVariable Long userId,
            @RequestBody List<OrderItem> items
    ) {
        return ResponseEntity.ok(
                orderService.createOrder(userId, items)
        );
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(
            @PathVariable Long orderId
    ) {
        return ResponseEntity.ok(
                orderService.getOrderById(orderId)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUserId(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(
                orderService.getOrdersByUserId(userId)
        );
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status
    ) {
        return ResponseEntity.ok(
                orderService.updateOrderStatus(
                        orderId,
                        status
                )
        );
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(
            @PathVariable Long orderId
    ) {
        orderService.deleteOrder(orderId);

        return ResponseEntity.noContent().build();
    }
}