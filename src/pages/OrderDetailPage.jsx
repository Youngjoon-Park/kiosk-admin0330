import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8081/order/${orderId}`)
      .then(res => setOrder(res.data))
      .catch(err => {
        console.error("상세 조회 실패:", err);
        alert("상세 조회 실패");
      });
  }, [orderId]);

  // ✅ 상태 변경 함수 추가
  const updateStatus = () => {
    axios.patch(`http://localhost:8081/order/${orderId}/status`, null, {
      params: { status: "COMPLETED" }
    })
      .then(() => {
        alert("✅ 상태가 COMPLETED로 변경되었습니다.");
        setOrder(prev => ({ ...prev, status: "COMPLETED" }));
      })
      .catch(err => {
        console.error("상태 변경 실패:", err);
        alert("❌ 상태 변경 실패");
      });
  };

  if (!order) return <p>불러오는 중...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>📋 주문 상세</h2>
      <p>주문번호: {order.orderId}</p>
      <p>총 금액: {order.totalPrice}원</p>
      <p>상태: {order.status}</p>

      <h4>🧾 항목</h4>
      <ul>
        {order.items.map((item, idx) => (
          <li key={idx}>
            {item.menuName} / 수량: {item.quantity}개 / 단가: {item.price}원
          </li>
        ))}
      </ul>

      {/* ✅ 상태가 PENDING일 때만 버튼 보여주기 */}
      {order.status === "PENDING" && (
        <button
          onClick={updateStatus}
          style={{ marginTop: "20px", marginRight: "10px" }}
        >
          ✅ 상태 변경 (COMPLETED)
        </button>
      )}

      <br />
      <button onClick={() => navigate(-1)} style={{ marginTop: "20px" }}>
        🔙 돌아가기
      </button>
    </div>
  );
}

export default OrderDetailPage;
