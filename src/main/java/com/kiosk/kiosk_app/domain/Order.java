package com.kiosk.kiosk_app.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_date")
    private LocalDateTime createdAt; // 주문 생성 시간

    @Column(name = "total_price")
    private int totalPrice; // 총 금액

    @Column(name = "total_amount") // 총 수량
    private int totalAmount; // 총 수량 추가

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    // totalAmount는 주문 항목들의 수량 합계를 계산해서 리턴하는 메서드로 설정
    public int getTotalAmount() {
        return items.stream()
                .mapToInt(OrderItem::getQuantity)
                .sum(); // 각 OrderItem의 수량 합계
    }

    // 추가된 부분: setter 메서드 (총 수량 설정)
    public void setTotalAmount(int totalAmount) {
        this.totalAmount = totalAmount;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
