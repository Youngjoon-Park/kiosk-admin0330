// App.js
import React, { useState } from "react";
import MenuList from "./components/MenuList";
import Cart from "./components/Cart";

function App() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (menu) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === menu.id);
      if (existing) {
        return prev.map(item =>
          item.id === menu.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...menu, quantity: 1 }];
    });
  };

  const updateQuantity = (menuId, diff) => {
    setCartItems(prev =>
      prev
        .map(item =>
          item.id === menuId ? { ...item, quantity: item.quantity + diff } : item
        )
        .filter(item => item.quantity > 0) // 0이 되면 제거
    );
  };

  const clearCart = () => setCartItems([]);

  return (
    <div>
      <h1>키오스크 메인</h1>
      <MenuList addToCart={addToCart} />
      <Cart cartItems={cartItems} clearCart={clearCart} updateQuantity={updateQuantity} />
    </div>
  );
}

export default App;
