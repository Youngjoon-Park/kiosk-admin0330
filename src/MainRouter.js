import React from "react";
import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import App from "./App";

import OrderDetailPage from './pages/OrderDetailPage';
import OrderCreatePage from './pages/OrderCreatePage';
import OrderCompletePage from './pages/OrderCompletePage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentPage from './pages/PaymentPage';
import AdminOrders from './pages/AdminOrders';

function MainRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<Navigate to="/admin/orders" />} /> {/* ✅ 수정됨 */}
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/order/new" element={<OrderCreatePage />} />
        <Route path="/order/:orderId" element={<OrderDetailPage />} /> {/* ✅ 추가 */}
        <Route path="/order/complete/:orderId" element={<OrderCompletePage />} />
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/payment/:orderId" element={<PaymentPage />} />
        
       
      </Routes>
    </BrowserRouter>
  );
}

export default MainRouter;
