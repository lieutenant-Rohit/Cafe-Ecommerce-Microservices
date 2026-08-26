package com.bloomscafe.order.controller;

import com.bloomscafe.order.client.CartResponse;
import com.bloomscafe.order.entity.Order;
import com.bloomscafe.order.entity.OrderStatus;
import com.bloomscafe.order.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // GET: http://localhost:8084/api/orders/checkout
    @GetMapping("/checkout")
    public ResponseEntity<CartResponse> getCartForCheckout(
            Authentication authentication
    ) {

        Long userId = Long.parseLong(authentication.getName());

        return ResponseEntity.ok(
                orderService.getCartForCheckout(userId)
        );
    }

    // POST: http://localhost:8084/api/orders
    @PostMapping
    public ResponseEntity<Order> createOrder(
            Authentication authentication
    ) {

        Long userId = Long.parseLong(authentication.getName());

        return ResponseEntity.ok(
                orderService.createOrder(userId)
        );
    }

    // GET: http://localhost:8084/api/orders/2
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(
            Authentication authentication,
            @PathVariable Long orderId
    ) {

        Long userId = Long.parseLong(authentication.getName());
        boolean isAdmin = authentication.getAuthorities()
                .contains(new SimpleGrantedAuthority("ROLE_ADMIN"));

        return ResponseEntity.ok(
                orderService.getOrderById(orderId, userId, isAdmin)
        );
    }

    // GET: http://localhost:8084/api/orders
    @GetMapping
    public ResponseEntity<List<Order>> getOrdersByUserId(
            Authentication authentication
    ) {

        Long userId = Long.parseLong(authentication.getName());

        return ResponseEntity.ok(
                orderService.getOrdersByUserId(userId)
        );
    }

    // PATCH: http://localhost:8084/api/orders/2/status?status=CONFIRMED  (ADMIN only)
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

    // DELETE: http://localhost:8084/api/orders/2  (ADMIN only)
    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(
            @PathVariable Long orderId
    ) {
        orderService.deleteOrder(orderId);

        return ResponseEntity.noContent().build();
    }
}
