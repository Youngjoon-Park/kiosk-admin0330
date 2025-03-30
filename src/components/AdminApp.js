// ✅ 올바른 상대 경로로 수정
import React from "react";
import OrderList from "./OrderList";  // ⬅️ 현재 폴더 내의 OrderList.js

function AdminApp() {
  return (
    <div>
      <h1>관리자 페이지</h1>
      <OrderList />
    </div>
  );
}

export default AdminApp;
