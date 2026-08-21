package com.bloomscafe.order.service;

import com.bloomscafe.order.client.CartClient;
import com.bloomscafe.order.client.CartResponse;
import com.bloomscafe.order.entity.Order;
import com.bloomscafe.order.entity.OrderItem;
import com.bloomscafe.order.entity.OrderStatus;
import com.bloomscafe.order.repo.OrderRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final CartClient cartClient;

    public OrderService(OrderRepository orderRepository, CartClient cartClient) {
        this.orderRepository = orderRepository;
        this.cartClient = cartClient;
    }

    public CartResponse getCartForCheckout(Long userId) {

        return cartClient.getCart(userId);
    }

    @Transactional
    public Order createOrder(Long userId, List<OrderItem> items){
        Order order = new Order();
        order.setUserId(userId);
        order.setStatus(OrderStatus.CREATED);

        for(OrderItem item : items){
            item.setOrder(order);
        }

        order.setItems(items);

        return orderRepository.save(order);
    }

    public Order getOrderById(Long orderId){
        return orderRepository.findById(orderId)
                .orElseThrow(()->new RuntimeException("Order not found"));
    }

    public List<Order> getOrdersByUserId(Long userId){
        return orderRepository.findByUserId(userId);
    }

    public Order updateOrderStatus(Long orderId, OrderStatus status){
        Order order = orderRepository.findById(orderId)
                .orElseThrow(()->new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public void deleteOrder(Long orderId){
        orderRepository.deleteById(orderId);
    }
}
