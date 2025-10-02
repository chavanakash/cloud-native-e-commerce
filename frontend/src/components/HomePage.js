'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import api from '../utils/api';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get('/products'); // expects [{_id, title, price, image, description}]
        if (mounted) setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        // fallback demo data
        setProducts([
  { _id: '1', title: 'Handmade Pottery', price: 450,
    image: 'https://picsum.photos/400/300?random=1',
    description: 'Crafted with love.' },
  { _id: '2', title: 'Linen Cushion', price: 799,
    image: 'https://picsum.photos/400/300?random=2',
    description: 'Soft & breathable.' },
  { _id: '3', title: 'Oak Lamp', price: 1599,
    image: 'https://picsum.photos/400/300?random=3',
    description: 'Warm ambient light.' },
]);

      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="glow">
      <section className="container-page py-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .6 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900"
        >
          make yourself look good.
        </motion.h1>
        <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
          Minimal aesthetics, maximum joy. Explore our curated collection.
        </p>
      </section>

      <section id="featured" className="container-page pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card h-64 animate-pulse" />
            ))
          ) : (
            products.map(p => <ProductCard key={p._id} product={p} />)
          )}
        </div>
      </section>
    </div>
  );
}
