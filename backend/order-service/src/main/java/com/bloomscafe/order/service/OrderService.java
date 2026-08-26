package com.bloomscafe.order.service;

import com.bloomscafe.order.client.*;
import com.bloomscafe.order.entity.Order;
import com.bloomscafe.order.entity.OrderItem;
import com.bloomscafe.order.entity.OrderStatus;
import com.bloomscafe.order.event.OrderCreatedEvent;
import com.bloomscafe.order.event.OrderEventPublisher;
import com.bloomscafe.order.repo.OrderRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartClient cartClient;
    private final InventoryClient inventoryClient;
    private final CatalogClient catalogClient;
    private final OrderEventPublisher orderEventPublisher;

    public OrderService(
            OrderRepository orderRepository,
            CartClient cartClient,
            InventoryClient inventoryClient,
            CatalogClient catalogClient,
            OrderEventPublisher orderEventPublisher) {

        this.orderRepository = orderRepository;
        this.cartClient = cartClient;
        this.inventoryClient = inventoryClient;
        this.catalogClient = catalogClient;
        this.orderEventPublisher = orderEventPublisher;
    }

    public CartResponse getCartForCheckout(Long userId) {

        return cartClient.getCart(userId);
    }

    @Transactional
    public Order createOrder(Long userId) {

        // 1. Get the user's cart
        CartResponse cart = cartClient.getCart(userId);

        if (cart.items() == null || cart.items().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setUserId(userId);
        order.setStatus(OrderStatus.CREATED);

        List<OrderItem> items = new ArrayList<>();

        // Keep track of inventory reservations
        // that successfully happened.
        List<CartItemResponse> reservedItems = new ArrayList<>();

        try {

            // 2. Process every cart item
            for (CartItemResponse cartItem : cart.items()) {

                // Get authoritative product information
                ProductResponse product =
                        catalogClient.getProduct(
                                cartItem.productId()
                        );

                // 3. Reserve inventory
                inventoryClient.reserveStock(
                        cartItem.productId(),
                        cartItem.quantity()
                );

                // Reservation succeeded,
                // so remember this item.
                reservedItems.add(cartItem);

                // 4. Build OrderItem
                OrderItem item = new OrderItem();

                item.setProductId(
                        cartItem.productId()
                );

                item.setQuantity(
                        cartItem.quantity()
                );

                item.setPrice(
                        product.price()
                );

                item.setOrder(order);

                items.add(item);
            }

        } catch (Exception e) {

            // 5. Something failed.
            // Release every inventory reservation
            // that succeeded before the failure.
            for (CartItemResponse reservedItem : reservedItems) {

                try {

                    inventoryClient.releaseStock(
                            reservedItem.productId(),
                            reservedItem.quantity()
                    );

                } catch (Exception compensationException) {

                    // Compensation itself failed.
                    // Log this in a real production system.
                    System.err.println(
                            "Failed to release inventory for product: "
                                    + reservedItem.productId()
                    );
                }
            }

            // 6. Let the original failure propagate.
            throw e;
        }

        // 7. All reservations succeeded.
        order.setItems(items);

        // 8. Now save the order.
        Order savedOrder = orderRepository.save(order);

        // 9. Publish OrderCreated event to Kafka
        OrderCreatedEvent event = new OrderCreatedEvent(
                savedOrder.getId(),
                savedOrder.getUserId(),
                savedOrder.getItems().stream()
                        .map(item -> new OrderCreatedEvent.OrderItemEvent(
                                item.getProductId(),
                                item.getQuantity(),
                                item.getPrice()
                        ))
                        .toList(),
                savedOrder.getCreatedAt()
        );

        orderEventPublisher.publishOrderCreated(event);

        return savedOrder;
    }

    public Order getOrderById(
            Long orderId,
            Long userId,
            boolean isAdmin) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        if (!isAdmin &&
                !order.getUserId().equals(userId)) {

            throw new RuntimeException(
                    "Access denied: order does not belong to user"
            );
        }

        return order;
    }

    public List<Order> getOrdersByUserId(Long userId) {

        return orderRepository.findByUserId(userId);
    }

    public Order updateOrderStatus(
            Long orderId,
            OrderStatus status) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        order.setStatus(status);

        return orderRepository.save(order);
    }

    public void deleteOrder(Long orderId) {

        orderRepository.deleteById(orderId);
    }
}