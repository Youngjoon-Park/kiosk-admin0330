// src/pages/PaymentSuccessPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pgToken = searchParams.get("pg_token");
  const orderId = searchParams.get("orderId");
  const [paymentStatus, setPaymentStatus] = useState(null); // 결제 상태 추가

  useEffect(() => {
    if (!pgToken) {
      alert("pg_token이 없습니다");
      return;
    }

    axios
      .post("http://localhost:8081/payment/approve", {
        pgToken,
        orderId
      })
      .then(res => {
        setPaymentStatus("SUCCESS");
        alert("🎉 결제가 성공적으로 승인되었습니다!");
        navigate("/"); // 홈으로 이동
      })
      .catch(err => {
        setPaymentStatus("FAILED");
        alert("❌ 결제 승인 실패");
      });
  }, [pgToken, navigate, orderId]);

  return (
    <div style={{ padding: "20px" }}>
      {paymentStatus === "SUCCESS" ? (
        <h2>🎉 결제가 성공적으로 승인되었습니다!</h2>
      ) : paymentStatus === "FAILED" ? (
        <h2>❌ 결제 승인에 실패했습니다.</h2>
      ) : (
        <h2>⏳ 결제 승인 중입니다...</h2>
      )}
    </div>
  );
}

export default PaymentSuccessPage;
