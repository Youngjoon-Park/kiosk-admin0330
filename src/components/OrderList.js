import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function OrderList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios.get("http://localhost:8081/order")
      .then(res => setOrders(res.data))
      .catch(err => console.error("주문 내역 불러오기 실패:", err));
  };

  const updateStatus = (orderId) => {
    axios.patch(`http://localhost:8081/order/${orderId}/status`, null, {
      params: { status: "COMPLETED" }
    })
      .then(() => {
        alert("✅ 상태가 COMPLETED로 변경되었습니다.");
        fetchOrders(); // 상태 변경 후 목록 갱신
      })
      .catch(err => console.error("상태 변경 실패:", err));
  };

  return (
    <div>
      <h2>🧾 주문 내역</h2>
      {orders.map(order => (
        <div key={order.orderId} style={{ marginBottom: "8px" }}>
          <Link to={`/order/${order.orderId}`} style={{ textDecoration: "underline", color: "blue" }}>
            주문번호: {order.orderId}
          </Link>
          {" "} / 총 금액: {order.totalPrice}원 / 상태: {order.status}{" "}
          {order.status === "PENDING" && (
            <button onClick={() => updateStatus(order.orderId)}>처리 완료</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default OrderList;
