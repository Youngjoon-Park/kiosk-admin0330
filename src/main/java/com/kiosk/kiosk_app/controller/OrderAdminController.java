package com.kiosk.kiosk_app.controller;

import com.kiosk.kiosk_app.dto.OrderDto;
import com.kiosk.kiosk_app.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class OrderAdminController {

    private final OrderService orderService;

    public OrderAdminController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/orders")
    public List<OrderDto> getAllOrders() {
        return orderService.getAllOrders();
    }
}
