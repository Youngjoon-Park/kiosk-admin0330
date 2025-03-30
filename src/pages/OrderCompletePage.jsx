import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function OrderCompletePage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8081/order/${orderId}`)
      .then(res => setOrder(res.data))
      .catch(err => {
        console.error("주문 상세 조회 실패", err);
        alert("주문 정보를 불러오지 못했습니다.");
      });
  }, [orderId]);
  const handlePayment = () => {
    axios.post(`http://localhost:8081/payment/${orderId}`)
      .then(res => {
        const paymentUrl = res.data.redirectUrl;
        window.location.href = paymentUrl;
      })
      .catch(err => {
        console.error("결제 요청 실패", err);
        alert("결제 요청에 실패했습니다.");
      });
  };
  


  if (!order) return <p>로딩 중...</p>;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>🎉 주문이 완료되었습니다!</h2>
      <p>주문번호: <strong>{order.orderId}</strong></p>
      <p>총 금액: <strong>{order.totalPrice}원</strong></p>
      <p>주문 상태: {order.status}</p>

<button
  onClick={handlePayment}
  style={{
    marginTop: "20px",
    padding: "10px 20px",
    fontWeight: "bold",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px"
  }}
>
  💳 결제하기
</button>

      <button onClick={() => navigate("/")} style={{ marginTop: "20px" }}>
        🔙 처음으로
      </button>
    </div>
  );
}


export default OrderCompletePage;
