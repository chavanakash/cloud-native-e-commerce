'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartCtx = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem('cart');
    if (raw) setItems(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  function add(product) {
    setItems(prev => {
      if (prev.find(p => p._id === product._id)) return prev;
      return [...prev, product];
    });
  }

  function remove(id) {
    setItems(prev => prev.filter(p => p._id !== id));
  }

  function clear() {
    setItems([]);
  }

  const total = useMemo(() => items.reduce((s, x) => s + Number(x.price || 0), 0), [items]);
  const count = items.length;

  return (
    <CartCtx.Provider value={{ items, add, remove, clear, total, count }}>
      {children}
    </CartCtx.Provider>
  );
}

export const useCart = () => useContext(CartCtx);
