package com.bloomscafe.cart.controller;

import com.bloomscafe.cart.entity.Cart;
import com.bloomscafe.cart.entity.CartItem;
import com.bloomscafe.cart.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carts")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // POST: http://localhost:8083/api/carts
    @PostMapping
    public ResponseEntity<Cart> createCart(
            Authentication authentication
    ) {

        Long userId = Long.parseLong(authentication.getName());

        return ResponseEntity.ok(
                cartService.createCart(userId)
        );
    }

    // GET: http://localhost:8083/api/carts
    @GetMapping
    public ResponseEntity<Cart> getCart(
            Authentication authentication
    ) {

        Long userId = Long.parseLong(authentication.getName());

        return ResponseEntity.ok(
                cartService.getCartByUserId(userId)
        );
    }

    // POST: http://localhost:8083/api/carts/items?productId=2&quantity=1
    @PostMapping("/items")
    public ResponseEntity<CartItem> addItem(
            Authentication authentication,
            @RequestParam Long productId,
            @RequestParam Integer quantity
    ) {

        Long userId = Long.parseLong(authentication.getName());

        return ResponseEntity.ok(
                cartService.addItem(
                        userId,
                        productId,
                        quantity
                )
        );
    }

    // PUT: http://localhost:8083/api/carts/items/2?quantity=3
    @PutMapping("/items/{productId}")
    public ResponseEntity<CartItem> updateItem(
            Authentication authentication,
            @PathVariable Long productId,
            @RequestParam Integer quantity
    ) {

        Long userId = Long.parseLong(authentication.getName());

        return ResponseEntity.ok(
                cartService.updateItem(
                        userId,
                        productId,
                        quantity
                )
        );
    }

    // DELETE: http://localhost:8083/api/carts/items/2
    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Void> removeItem(
            Authentication authentication,
            @PathVariable Long productId
    ) {

        Long userId = Long.parseLong(authentication.getName());

        cartService.removeItem(
                userId,
                productId
        );

        return ResponseEntity.noContent().build();
    }

    // DELETE: http://localhost:8083/api/carts/items
    @DeleteMapping("/items")
    public ResponseEntity<Void> clearCart(
            Authentication authentication
    ) {

        Long userId = Long.parseLong(authentication.getName());

        cartService.clearCart(userId);

        return ResponseEntity.noContent().build();
    }
}