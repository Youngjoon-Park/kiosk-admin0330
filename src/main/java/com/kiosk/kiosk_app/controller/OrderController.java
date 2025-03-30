package com.kiosk.kiosk_app.controller;

import com.kiosk.kiosk_app.domain.Order;
import com.kiosk.kiosk_app.domain.Menu;
import com.kiosk.kiosk_app.domain.OrderItem;
import com.kiosk.kiosk_app.domain.OrderStatus;
import com.kiosk.kiosk_app.dto.*;
import com.kiosk.kiosk_app.repository.MenuRepository;
import com.kiosk.kiosk_app.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/order")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private MenuRepository menuRepository;

    // 주문 생성
    @PostMapping
    @Transactional
    public OrderResponse createOrder(@RequestBody OrderRequest request) {
        Order order = new Order();
        order.setCreatedAt(LocalDateTime.now()); // 주문 시간
        order.setStatus(OrderStatus.PENDING); // 초기 상태

        List<OrderItem> orderItems = new ArrayList<>();
        int totalPrice = 0;
        int totalAmount = 0;

        for (OrderItemRequest item : request.getItems()) {
            Menu menu = menuRepository.findById(item.getMenuId())
                    .orElseThrow(() -> new IllegalArgumentException("없는 메뉴 ID"));

            OrderItem orderItem = new OrderItem();
            orderItem.setMenu(menu);
            orderItem.setOrder(order);
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPrice(menu.getPrice()); // 가격 설정

            orderItems.add(orderItem);

            totalPrice += menu.getPrice() * item.getQuantity(); // 총 금액
            totalAmount += item.getQuantity(); // 총 수량
        }

        order.setItems(orderItems); // 주문 항목 설정
        order.setTotalPrice(totalPrice); // 총 가격 설정
        order.setTotalAmount(totalAmount); // 총 수량 설정

        orderRepository.save(order); // 주문 저장

        return new OrderResponse(order.getId(), totalPrice, order.getStatus());
    }

    // 주문 목록 조회
    @GetMapping
    public List<OrderResponse> getOrders(@RequestParam(required = false) OrderStatus status) {
        List<Order> orders;

        // 상태가 주어지면 해당 상태에 맞는 주문만 반환
        if (status != null) {
            orders = orderRepository.findByStatusOrderByCreatedAtDesc(status);
        } else {
            // 상태가 주어지지 않으면 모든 주문을 반환
            orders = orderRepository.findAllByOrderByCreatedAtDesc();
        }

        // orders가 null일 경우 빈 배열로 처리
        if (orders == null) {
            orders = new ArrayList<>();
        }

        // 주문 목록을 OrderResponse 객체 리스트로 변환하여 반환
        return orders.stream()
                .map(order -> new OrderResponse(order.getId(), order.getTotalAmount(), order.getStatus()))
                .toList();
    }

    // 주문 상세 조회
    @GetMapping("/{orderId}")
    public OrderDetailResponse getOrderDetail(@PathVariable Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("해당 주문이 존재하지 않습니다."));

        List<OrderItemDetail> items = order.getItems().stream()
                .map(item -> new OrderItemDetail(
                        item.getMenu().getName(),
                        item.getQuantity(),
                        item.getMenu().getPrice()))
                .toList();

        return new OrderDetailResponse(order.getId(), order.getTotalAmount(), order.getStatus(), items);
    }

    // 주문 상태 업데이트
    @PatchMapping("/{orderId}/status")
    public OrderResponse updateOrderStatus(@PathVariable Long orderId, @RequestParam OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("해당 주문 없음"));

        order.setStatus(status);
        orderRepository.save(order);

        return new OrderResponse(order.getId(), order.getTotalAmount(), order.getStatus());
    }
}
