'use client';

import { useState } from 'react';
import api from '../utils/api';

export default function ProductForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      await api.post('/seller/products', { title, price: Number(price), image, description });
      setTitle(''); setPrice(''); setImage(''); setDescription('');
      onCreated?.();
    } catch {
      // no-op
    }
  }

  return (
    <div className="card p-6">
      <h3 className="font-semibold mb-4">Add Product</h3>
      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
        <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="input" placeholder="Price" value={price} onChange={e=>setPrice(e.target.value)} />
        <input className="input sm:col-span-2" placeholder="Image URL" value={image} onChange={e=>setImage(e.target.value)} />
        <textarea className="input sm:col-span-2" rows={3} placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <div className="sm:col-span-2">
          <button className="btn btn-primary">Create</button>
        </div>
      </form>
    </div>
  );
}
