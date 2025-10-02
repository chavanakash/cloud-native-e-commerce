'use client';

import Link from 'next/link';
import { Home, Package, ShoppingCart, User, LogIn, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen fixed top-0 left-0 flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-brand-600">AmazingStore</h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100">
          <Home size={18}/> Home
        </Link>

        <Link href="/cart" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100">
          <ShoppingCart size={18}/> Cart
        </Link>

        <Link href="/seller" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100">
          <Store size={18}/> Seller
        </Link>

        {user ? (
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 text-left"
          >
            <User size={18}/> Logout
          </button>
        ) : (
          <Link href="/auth" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100">
            <LogIn size={18}/> Login
          </Link>
        )}
      </nav>
    </aside>
  );
}
