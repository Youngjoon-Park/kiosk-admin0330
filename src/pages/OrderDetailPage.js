// src/pages/OrderDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function OrderDetailPage() {
  const { orderId } = useParams(); // URL 파라미터에서 주문번호 가져옴
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8081/order/${orderId}`)
      .then(res => setOrder(res.data))
      .catch(err => {
        console.error("상세 조회 실패:", err);
      });
  }, [orderId]);

  if (!order) return <div>로딩 중...</div>;

  return (
    <div>
      <h2>📋 주문 상세 (주문번호: {order.id})</h2>
      <p>총 금액: {order.totalPrice}원</p>
      <p>상태: {order.status}</p>
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>
            {item.menuName} / 수량: {item.quantity}개 / 단가: {item.price}원
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrderDetailPage;
