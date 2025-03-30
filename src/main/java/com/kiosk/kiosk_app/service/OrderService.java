package com.kiosk.kiosk_app.service;

import com.kiosk.kiosk_app.domain.Order;
import com.kiosk.kiosk_app.dto.OrderDto;

import com.kiosk.kiosk_app.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<OrderDto> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(OrderDto::fromEntity)
                .collect(Collectors.toList());
    }
}
