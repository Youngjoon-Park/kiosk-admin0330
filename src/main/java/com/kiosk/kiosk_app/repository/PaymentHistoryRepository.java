package com.kiosk.kiosk_app.repository;

import com.kiosk.kiosk_app.entity.PaymentHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentHistoryRepository extends JpaRepository<PaymentHistory, Long> {
    // orderId로 PaymentHistory 조회
    PaymentHistory findByOrderId(Long orderId);
}
