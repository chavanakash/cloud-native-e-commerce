'use client';

import Image from 'next/image';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { add } = useCart();

  return (
    <div className="card overflow-hidden group">
      <div className="relative aspect-[4/3]">
        <Image
          src={product.image || 'https://picsum.photos/800/600'}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{product.title}</h3>
        <p className="text-sm text-slate-600 line-clamp-2 mt-1">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-bold">₹{product.price}</span>
          <button onClick={() => add(product)} className="btn btn-primary">Add to cart</button>
        </div>
      </div>
    </div>
  );
}
