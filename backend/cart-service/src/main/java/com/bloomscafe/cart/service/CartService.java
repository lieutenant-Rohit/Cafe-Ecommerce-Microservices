package com.bloomscafe.cart.service;

import com.bloomscafe.cart.client.CatalogClient;
import com.bloomscafe.cart.entity.Cart;
import com.bloomscafe.cart.entity.CartItem;
import com.bloomscafe.cart.exception.ProductNotFoundException;
import com.bloomscafe.cart.repo.CartItemRepository;
import com.bloomscafe.cart.repo.CartRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public Cart getCartByUserId(Long userId){
        return cartRepository
                .findByUserId(userId)
                .orElseThrow(()->
                        new RuntimeException("Cart not found for user: " + userId));
    }

    public Cart createCart(Long userId){
        if(cartRepository.findByUserId(userId).isPresent()){
            throw new RuntimeException("Cart already exists for user: " + userId);
        }

        Cart cart = new Cart();
        cart.setUserId(userId);

        return cartRepository.save(cart);
    }

    @Transactional
    public CartItem addItem(Long userId, Long productId, Integer quantity){

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
        return cartItemRepository.save(cartItem);
    }

    @Transactional
    public CartItem updateItem(Long userId, Long productI, Integer quantity){
        Cart cart = cartRepository
                .findByUserId(userId)
                .orElseThrow(()->
                        new RuntimeException("Cart not found"));

        CartItem cartItem = cartItemRepository
                .findByCartIdAndProductId(cart.getId(), productI)
                .orElseThrow(()->
                        new RuntimeException("Cart item not found"));

        cartItem.setQuantity(quantity);
        return cartItemRepository.save(cartItem);
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

}
