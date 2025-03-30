package com.kiosk.kiosk_app.dto;

import com.kiosk.kiosk_app.domain.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderResponse {
    private Long orderId;
    private int totalPrice;
    private OrderStatus status;
}
