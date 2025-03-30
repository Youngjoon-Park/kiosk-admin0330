// src/pages/PaymentPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function PaymentPage() {
  const { orderId } = useParams();
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    axios
      .post(`http://localhost:8081/payment/${orderId}`)
      .then(response => {
        setLoading(false); // 결제 준비가 완료되면 로딩 상태 종료
        const redirectUrl = response.data.redirectUrl;
        window.location.href = redirectUrl;
      })
      .catch(error => {
        console.error("결제 준비 실패", error);
        alert("결제 준비에 실패했습니다.");
        setLoading(false);
      });
  }, [orderId]);

  return (
    <div style={{ padding: "20px" }}>
      {loading ? (
        <h2>⏳ 결제 준비 중...</h2> // 결제 준비 중 표시
      ) : (
        <h2>🛒 결제 진행 중입니다. 잠시만 기다려 주세요.</h2> // 결제 진행 중 표시
      )}
    </div>
  );
}

export default PaymentPage;
