'use client';

import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, remove, total } = useCart();

  return (
    <div className="container-page py-12">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {items.length === 0 && <p className="text-slate-600">Your cart is empty.</p>}
          {items.map((it, idx) => (
            <div key={idx} className="card p-4 flex items-center justify-between">
              <div>
                <h4 className="font-semibold">{it.title}</h4>
                <p className="text-sm text-slate-600">₹{it.price}</p>
              </div>
              <button onClick={() => remove(it._id)} className="btn btn-outline">Remove</button>
            </div>
          ))}
        </div>
        <div className="card p-6 h-max">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Subtotal</span>
            <span className="font-bold">₹{total}</span>
          </div>
          <a href="#" className="btn btn-primary w-full mt-4 text-center">Proceed to Checkout</a>
        </div>
      </div>
    </div>
  );
}
