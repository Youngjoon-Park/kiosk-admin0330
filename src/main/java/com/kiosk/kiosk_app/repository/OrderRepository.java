package com.kiosk.kiosk_app.repository;

import com.kiosk.kiosk_app.domain.Order;
import com.kiosk.kiosk_app.domain.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // ✅ 필드명이 orderDate였던 걸 createdAt으로 바꿨으므로, 메서드 이름도 수정 필요!
    List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status);

    List<Order> findAllByOrderByCreatedAtDesc();
}
