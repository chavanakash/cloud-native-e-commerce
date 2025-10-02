'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogIn, Store } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="container-page flex items-center justify-between py-4">
        <Link href="/" className="text-xl font-bold text-slate-900">
          Amazing<span className="text-brand-600">Store</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <Link href="/#featured" className="hover:text-brand-600">Featured</Link>
          <Link href="/#new" className="hover:text-brand-600">New Arrivals</Link>
          <Link href="#" className="hover:text-brand-600 flex items-center gap-2">
            <Store size={18}/> Seller
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="#" className="btn btn-outline flex items-center gap-2">
            <ShoppingCart size={18} /> <span className="hidden sm:inline">Cart</span>
            <span className="ml-1 inline-flex items-center justify-center rounded-full bg-brand-600 text-white text-xs w-6 h-6">
              {count}
            </span>
          </Link>

          {user ? (
            <button onClick={logout} className="btn btn-primary flex items-center gap-2">
              <User size={18} /> Logout
            </button>
          ) : (
            <Link href="#" className="btn btn-primary flex items-center gap-2">
              <LogIn size={18}/> Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
