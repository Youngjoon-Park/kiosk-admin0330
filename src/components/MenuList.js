import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MenuList({ addToCart }) {
  const [menus, setMenus] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchMenus();
    // fetchOrders(); // 주석 처리 또는 제거
  }, []);

  const fetchMenus = () => {
    axios.get("http://localhost:8081/menu")
      .then(res => setMenus(res.data))
      .catch(err => console.error("메뉴 불러오기 실패:", err));
  };

  // const fetchOrders = () => {
  //   axios.get("http://localhost:8081/order")
  //     .then(res => setOrders(res.data))
  //     .catch(err => console.error("주문 내역 불러오기 실패:", err));
  // };

  // const handleOrder = (menuId) => {
  //   axios.post("http://localhost:8081/order", {
  //     items: [{ menuId: menuId, quantity: 1 }]
  //   })
  //   .then(() => {
  //     alert("✅ 주문 완료");
  //     fetchOrders(); // 주문 후 목록 갱신
  //   })
  //   .catch(err => {
  //     console.error("❌ 주문 실패:", err);
  //     alert("주문 실패");
  //   });
  // };

  // const updateStatus = (orderId) => {
  //   axios.patch(`http://localhost:8081/order/${orderId}/status`, null, {
  //     params: { status: "COMPLETED" }
  //   })
  //   .then(() => {
  //     alert("🔄 상태 변경 완료");
  //     fetchOrders(); // 변경 후 목록 새로고침
  //   })
  //   .catch(err => {
  //     console.error("상태 변경 실패:", err);
  //   });
  // };

  return (
    <div>
      <h2>메뉴 목록</h2>
      {menus.map(menu => (
        <div key={menu.id}>
          {menu.name} - {menu.price}원{" "}
          <button onClick={() => addToCart(menu)}>🛒 장바구니 담기</button>
        </div>
      ))}
    </div>
  );
}

export default MenuList;
