package com.kiosk.kiosk_app.dto;

import com.kiosk.kiosk_app.domain.OrderStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor // 추가!!
public class OrderDetailResponse {
    private Long orderId;
    private int totalPrice;
    private OrderStatus status;
    private List<OrderItemDetail> items;

    public OrderDetailResponse(Long orderId, int totalPrice, OrderStatus status, List<OrderItemDetail> items) {
        this.orderId = orderId;
        this.totalPrice = totalPrice;
        this.status = status;
        this.items = items;
    }
}
