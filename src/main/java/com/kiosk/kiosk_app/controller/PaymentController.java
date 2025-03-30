package com.kiosk.kiosk_app.controller;

import com.kiosk.kiosk_app.entity.PaymentHistory;
import com.kiosk.kiosk_app.repository.PaymentHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Value("${kakao.admin-key}")
    private String adminKey;

    // 여러 사용자 동시 결제 대응용
    private final Map<Long, String> tidMap = new ConcurrentHashMap<>();

    // JPA 리포지토리 의존성 주입
    @Autowired
    private PaymentHistoryRepository paymentHistoryRepository;

    /**
     * 1단계 - 결제 준비 요청
     */
    @PostMapping("/{orderId}")
    public Map<String, String> requestPayment(@PathVariable Long orderId) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + adminKey);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", "TC0ONETIME");
        params.add("partner_order_id", orderId.toString());
        params.add("partner_user_id", "user123");
        params.add("item_name", "키오스크 주문");
        params.add("quantity", "1");
        params.add("total_amount", "1000");
        params.add("vat_amount", "100");
        params.add("tax_free_amount", "0");
        params.add("approval_url", "http://localhost:3000/payment/success?orderId=" + orderId);
        params.add("cancel_url", "http://localhost:3000/payment/cancel");
        params.add("fail_url", "http://localhost:3000/payment/fail");

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(params, headers);

        System.out.println("📦 요청 파라미터 = " + params);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                URI.create("https://kapi.kakao.com/v1/payment/ready"),
                requestEntity,
                Map.class);

        // tid 저장
        String tid = (String) response.getBody().get("tid");
        tidMap.put(orderId, tid);

        String redirectUrl = (String) response.getBody().get("next_redirect_pc_url");
        return Map.of("redirectUrl", redirectUrl);
    }

    /**
     * 2단계 - 결제 승인 요청
     */
    /**
     * 2단계 - 결제 승인 요청
     */
    /**
     * 2단계 - 결제 승인 요청
     */
    @PostMapping("/approve")
    public ResponseEntity<?> approvePayment(@RequestBody Map<String, String> payload) {
        String pgToken = payload.get("pgToken");
        String orderIdStr = payload.get("orderId");

        // 예외 방지
        if (pgToken == null || orderIdStr == null || !orderIdStr.matches("\\d+")) {
            return ResponseEntity.badRequest().body("pgToken 또는 orderId가 잘못되었습니다.");
        }

        Long orderId = Long.parseLong(orderIdStr);
        String tid = tidMap.get(orderId); // 해당 orderId에 맞는 tid 가져오기

        if (tid == null) {
            return ResponseEntity.badRequest().body("tid 정보가 없습니다. 결제를 다시 시도해주세요.");
        }

        // 이미 결제가 완료된 주문인지 확인
        PaymentHistory existingHistory = paymentHistoryRepository.findByOrderId(orderId);
        if (existingHistory != null && "SUCCESS".equals(existingHistory.getStatus())) {
            return ResponseEntity.badRequest().body("이미 결제가 완료된 주문입니다.");
        }

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + adminKey);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", "TC0ONETIME");
        params.add("tid", tid);
        params.add("partner_order_id", orderId.toString());
        params.add("partner_user_id", "user123");
        params.add("pg_token", pgToken);

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(params, headers);

        // 카카오페이 결제 승인 요청
        ResponseEntity<String> response = restTemplate.postForEntity(
                URI.create("https://kapi.kakao.com/v1/payment/approve"),
                requestEntity,
                String.class);

        // DB에 결제 성공 내역 저장
        PaymentHistory history = PaymentHistory.builder()
                .orderId(orderId)
                .tid(tid)
                .pgToken(pgToken)
                .status("SUCCESS")
                .approvedAt(LocalDateTime.now())
                .build();

        // DB에 결제 내역 저장
        paymentHistoryRepository.save(history);

        return ResponseEntity.ok(response.getBody());
    }

    /**
     * 결제 취소 요청
     */
    @PostMapping("/cancel")
    public ResponseEntity<?> paymentCancel(@RequestParam Long orderId) {
        String tid = tidMap.get(orderId);

        if (tid == null) {
            return ResponseEntity.badRequest().body("tid 정보가 없습니다. 결제를 다시 시도해주세요.");
        }

        // 결제 취소 내역 DB 저장
        PaymentHistory history = PaymentHistory.builder()
                .orderId(orderId)
                .tid(tid)
                .status("CANCELLED") // 결제 상태: CANCELLED
                .approvedAt(LocalDateTime.now()) // 취소 시간
                .build();

        // DB에 결제 취소 내역 저장
        paymentHistoryRepository.save(history);

        return ResponseEntity.ok("결제 취소 처리 완료");
    }

}
