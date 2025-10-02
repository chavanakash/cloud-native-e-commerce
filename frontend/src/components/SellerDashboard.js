'use client';

import { useEffect, useState } from 'react';
import api from '../utils/api';
import ProductForm from './ProductForm';

export default function SellerDashboard() {
  const [items, setItems] = useState([]);

  async function load() {
    try {
      const { data } = await api.get('/seller/products');
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="container-page py-12 space-y-8">
      <h2 className="text-2xl font-bold">Seller Dashboard</h2>
      <ProductForm onCreated={load} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(p => (
          <div key={p._id} className="card p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{p.title}</h3>
              <span className="font-bold">₹{p.price}</span>
            </div>
            <p className="text-sm text-slate-600 mt-2 line-clamp-2">{p.description}</p>
          </div>
        ))}
        {items.length === 0 && <p className="text-slate-600">No products yet.</p>}
      </div>
    </div>
  );
}
