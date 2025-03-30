package com.kiosk.kiosk_app.dto;

import lombok.Data;

@Data
public class OrderItemRequest {
    private Long menuId;
    private int quantity;
}
