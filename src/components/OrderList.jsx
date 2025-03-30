import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = () => {
    const url =
      filter === "ALL"
        ? "http://localhost:8081/order"
        : `http://localhost:8081/order?status=${filter}`;

    axios.get(url)
      .then(res => setOrders(res.data))
      .catch(err => console.error("주문 내역 불러오기 실패:", err));
  };

  const updateStatus = (orderId, newStatus) => {
    axios.patch(`http://localhost:8081/order/${orderId}/status`, null, {
      params: { status: newStatus }
    })
    .then(() => {
      alert("✅ 처리 완료");
      fetchOrders();
    })
    .catch(err => console.error("상태 변경 실패:", err));
  };

  return (
    <div>
      <h2>🧾 주문 내역</h2>

      <div style={{ marginBottom: "15px" }}>
        <label>필터: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="ALL">전체</option>
          <option value="PENDING">PENDING</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>
      </div>

      {orders.map(order => (
        <div key={order.orderId}>
          <Link
            to={`/order/${order.orderId}`}
            style={{ textDecoration: "underline", color: "blue" }}
          >
            주문번호: {order.orderId}
          </Link>{" "}
          / 총 금액: {order.totalPrice}원 / 상태: {order.status}
          {order.status === "PENDING" && (
            <>
              <button onClick={() => updateStatus(order.orderId, "COMPLETED")}>
                ✅ 완료 처리
              </button>
              <button
                onClick={() => updateStatus(order.orderId, "CANCELED")}
                style={{ marginLeft: "8px", color: "red" }}
              >
                ❌ 취소 처리
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default OrderList;
