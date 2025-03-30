import React, { useEffect, useState } from 'react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);  // 로딩 상태 추가

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(data => {
        // 반환된 데이터가 배열인지 확인
        if (Array.isArray(data)) {
          setOrders(data);  // 배열이면 상태에 저장
        } else {
          console.error("Expected orders to be an array, but got:", data);  // 오류 처리
        }
      })
      .catch(error => {
        console.error("Error loading orders:", error);
        setOrders([]);  // 오류 발생 시 빈 배열로 설정
      })
      .finally(() => setLoading(false));  // 로딩 완료 처리
  }, []);
  

  // 로딩 중일 때
  if (loading) {
    return <div>Loading...</div>;
  }

  // orders가 배열이 아니라면 메시지 출력
  if (!Array.isArray(orders)) {
    return <div>Error: orders data is not an array.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">주문 목록</h2>
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">주문번호</th>
            <th className="border p-2">메뉴</th>
            <th className="border p-2">수량</th>
            <th className="border p-2">총액</th>
            <th className="border p-2">상태</th>
            <th className="border p-2">시간</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td className="border p-2">{order.id}</td>
              <td className="border p-2">
                {/* 메뉴 항목들 표시 */}
                {Array.isArray(order.items) ? order.items.map(item => item.name).join(', ') : 'No items'}
              </td>
              <td className="border p-2">
                {/* 수량 항목들 표시 */}
                {Array.isArray(order.items) ? order.items.map(item => item.quantity).join(', ') : 'No items'}
              </td>
              <td className="border p-2">{order.totalAmount}원</td>
              <td className="border p-2">{order.status}</td>
              <td className="border p-2">{new Date(order.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
