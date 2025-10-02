'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

export default function CheckoutPage() {
  const { items, clear, total } = useCart();
  const [placing, setPlacing] = useState(false);
  const [status, setStatus] = useState('');

  async function placeOrder() {
    setPlacing(true);
    try {
      await api.post('/orders', { items, total });
      clear();
      setStatus('Order placed successfully!');
    } catch {
      setStatus('Failed to place order.');
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="container-page py-12">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>
      <div className="card p-6 space-y-3">
        <p className="text-slate-700">Total items: {items.length}</p>
        <p className="text-slate-700">Payable: ₹{total}</p>
        <button disabled={placing || items.length === 0} onClick={placeOrder} className="btn btn-primary">
          {placing ? 'Placing…' : 'Place Order'}
        </button>
        {status && <p className="text-sm text-slate-600">{status}</p>}
      </div>
    </div>
  );
}
