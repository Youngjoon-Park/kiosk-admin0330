import { useEffect, useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

function OrderCreatePage() {
    const [menuList, setMenuList] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});
    const navigate = useNavigate();
  
    useEffect(() => {
      axios.get("http://localhost:8081/menu")
        .then(res => setMenuList(res.data))
        .catch(err => console.error("메뉴 불러오기 실패", err));
    }, []);
  
    const handleQuantityChange = (menuId, quantity) => {
      setSelectedItems(prev => ({
        ...prev,
        [menuId]: quantity
      }));
    };
  
    const calculateTotal = () => {
      if (!menuList || !selectedItems) return 0;
      return menuList.reduce((sum, menu) => {
        const quantity = Number(selectedItems[menu.id]) || 0;
        return sum + menu.price * quantity;
      }, 0);
    };
  
    const handleOrder = () => {
      const orderItems = Object.entries(selectedItems)
        .filter(([_, quantity]) => Number(quantity) > 0)
        .map(([menuId, quantity]) => ({
          menuId: parseInt(menuId),
          quantity: Number(quantity)
        }));
  
      if (orderItems.length === 0) {
        alert("메뉴를 선택해 주세요.");
        return;
      }
  
      axios.post("http://localhost:8081/order", { items: orderItems })
        .then(res => {
          alert(`주문 완료! 주문번호: ${res.data.orderId}`);
          navigate(`/order/complete/${res.data.orderId}`);

        })
        .catch(err => {
          console.error("주문 실패", err);
          alert("❌ 주문 실패");
        });
    };
  
    return (
      <div style={{ padding: "20px" }}>
        <h2>🍽 메뉴 선택</h2>
        <ul style={{ display: "flex", flexWrap: "wrap", gap: "20px", paddingLeft: 0 }}>
  {menuList.map(menu => (
    <li
      key={menu.id}
      style={{
        listStyle: "none",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "15px",
        width: "180px",
        boxShadow: "2px 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
        {menu.name}
      </div>
      <div>{menu.price}원</div>
      <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
  <button
    onClick={() =>
      handleQuantityChange(menu.id, Math.max((Number(selectedItems[menu.id]) || 0) - 1, 0))
    }
    style={{
      width: "30px",
      height: "30px",
      fontWeight: "bold",
      fontSize: "18px",
    }}
  >
    -
  </button>
  <span style={{ margin: "0 10px", minWidth: "20px", textAlign: "center" }}>
    {selectedItems[menu.id] || 0}
  </span>
  <button
    onClick={() =>
      handleQuantityChange(menu.id, (Number(selectedItems[menu.id]) || 0) + 1)
    }
    style={{
      width: "30px",
      height: "30px",
      fontWeight: "bold",
      fontSize: "18px",
    }}
  >
    +
  </button>
</div>

    </li>
  ))}
</ul>

  
        {/* ✅ 여기 총 금액 표시 */}
        <p style={{ marginTop: "20px", fontWeight: "bold" }}>
          💰 총 주문 금액: {calculateTotal()}원
        </p>
  {/* ✅ 선택된 메뉴만 보여주는 장바구니 영역 */}
<h3 style={{ marginTop: "30px", fontWeight: "bold" }}>🛒 장바구니</h3>
<ul>
  {Object.entries(selectedItems)
    .filter(([_, quantity]) => Number(quantity) > 0)
    .map(([menuId, quantity]) => {
      const menu = menuList.find(m => m.id === Number(menuId));
      if (!menu) return null;
      return (
        <li key={menu.id}>
          {menu.name} × {quantity} = {menu.price * quantity}원
        </li>
      );
    })}
</ul>

        <button
          onClick={handleOrder}
          style={{ marginTop: "10px", padding: "10px 20px" }}
        >
          ✅ 주문하기
        </button>
      </div>
      
    );
  }
  export default OrderCreatePage;

  