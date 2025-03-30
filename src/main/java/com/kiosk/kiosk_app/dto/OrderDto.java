package com.kiosk.kiosk_app.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.kiosk.kiosk_app.domain.Order;
import com.kiosk.kiosk_app.domain.OrderItem; // ✅ 누락된 import 추가

@Data
public class OrderDto {
    private Long id;
    private List<ItemDto> items;
    private int totalAmount;
    private String status;
    private LocalDateTime createdAt;

    public static OrderDto fromEntity(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setItems(order.getItems().stream()
                .map(ItemDto::fromEntity)
                .collect(Collectors.toList()));
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus().name()); // ✅ enum → 문자열
        dto.setCreatedAt(order.getCreatedAt());
        return dto;
    }

    @Data
    public static class ItemDto {
        private String name;
        private int quantity;

        public static ItemDto fromEntity(OrderItem item) {
            ItemDto dto = new ItemDto();
            dto.setName(item.getMenu().getName());
            dto.setQuantity(item.getQuantity());
            return dto;
        }
    }
}
