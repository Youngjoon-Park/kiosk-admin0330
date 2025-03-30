package com.kiosk.kiosk_app.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor // 추가해 주세요!y
public class OrderItemDetail {
    private String menuName;
    private int quantity;
    private int price;

    public OrderItemDetail(String menuName, int quantity, int price) {
        this.menuName = menuName;
        this.quantity = quantity;
        this.price = price;
    }

    // getter 추가 or lombok @Getter
}
