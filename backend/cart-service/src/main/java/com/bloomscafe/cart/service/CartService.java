package com.bloomscafe.cart.service;

import com.bloomscafe.cart.client.CatalogClient;
import com.bloomscafe.cart.client.ProductResponse;
import com.bloomscafe.cart.dto.CartResponse;
import com.bloomscafe.cart.entity.Cart;
import com.bloomscafe.cart.entity.CartItem;
import com.bloomscafe.cart.exception.ProductNotFoundException;
import com.bloomscafe.cart.repo.CartItemRepository;
import com.bloomscafe.cart.repo.CartRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CatalogClient catalogClient;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository, CatalogClient catalogClient) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.catalogClient = catalogClient;
    }

    public CartResponse getCartByUserId(Long userId){
        Cart cart = cartRepository
                .findByUserId(userId)
                .orElseThrow(()->
                        new RuntimeException("Cart not found for user: " + userId));
        return enrichCart(cart);
    }

    public CartResponse createCart(Long userId){
        if(cartRepository.findByUserId(userId).isPresent()){
            throw new RuntimeException("Cart already exists for user: " + userId);
        }

        Cart cart = new Cart();
        cart.setUserId(userId);

        Cart saved = cartRepository.save(cart);
        return new CartResponse(saved.getId(), saved.getUserId(), List.of());
    }

    @Transactional
    public CartResponse addItem(Long userId, Long productId, Integer quantity){

        if(!catalogClient.productExists(productId)){
            throw new ProductNotFoundException("Product not found: " + productId);
        }
        Cart cart = cartRepository
                .findByUserId(userId)
                .orElseThrow(()->
                        new RuntimeException("Cart not found"));

        CartItem cartItem = cartItemRepository
                .findByCartIdAndProductId(cart.getId(), productId)
                .orElse(null);

        if(cartItem != null){
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        }else{
            cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProductId(productId);
            cartItem.setQuantity(quantity);
        }
        cartItemRepository.save(cartItem);
        return getCartByUserId(userId);
    }

    @Transactional
    public CartResponse updateItem(Long userId, Long productId, Integer quantity){
        Cart cart = cartRepository
                .findByUserId(userId)
                .orElseThrow(()->
                        new RuntimeException("Cart not found"));

        CartItem cartItem = cartItemRepository
                .findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(()->
                        new RuntimeException("Cart item not found"));

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);
        return getCartByUserId(userId);
    }

    @Transactional
    public void removeItem(Long userId, Long productId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException("Cart not found"));

        CartItem cartItem = cartItemRepository
                .findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(()->
                        new RuntimeException("Product not found in cart"));

        cartItemRepository.delete(cartItem);
    }

    @Transactional
    public void clearCart(Long userId){
        Cart cart = cartRepository
                .findByUserId(userId)
                .orElseThrow(()->
                        new RuntimeException("Cart not found"));
        cartItemRepository.deleteByCartId(cart.getId());
    }

    private CartResponse enrichCart(Cart cart){
        List<Long> productIds = cart.getItems().stream()
                .map(CartItem::getProductId)
                .toList();

        Map<Long, ProductResponse> productMap = catalogClient.getProductsByIds(productIds)
                .stream()
                .collect(Collectors.toMap(ProductResponse::id, p -> p));

        List<CartResponse.CartItemResponse> items = cart.getItems().stream()
                .map(item -> new CartResponse.CartItemResponse(
                        item.getId(),
                        item.getProductId(),
                        item.getQuantity(),
                        productMap.get(item.getProductId())
                ))
                .toList();

        return new CartResponse(cart.getId(), cart.getUserId(), items);
    }
}
