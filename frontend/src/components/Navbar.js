'use client';

import { ShoppingCart, User, LogOut, Package, Menu, X, Store } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Navbar({ currentPage, setCurrentPage }) {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setCurrentPage('home');
    setMobileMenuOpen(false);
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavigation('home')}>
            <Store className="w-8 h-8" />
            <h1 className="text-2xl font-bold">ShopHub</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => handleNavigation('home')}
              className={`hover:bg-white/20 px-4 py-2 rounded-lg transition ${
                currentPage === 'home' ? 'bg-white/20' : ''
              }`}
            >
              Home
            </button>

            {user?.role === 'seller' && (
              <button
                onClick={() => handleNavigation('seller')}
                className={`flex items-center space-x-1 hover:bg-white/20 px-4 py-2 rounded-lg transition ${
                  currentPage === 'seller' ? 'bg-white/20' : ''
                }`}
              >
                <Package size={18} />
                <span>My Products</span>
              </button>
            )}

            {user ? (
              <>
                {user.role !== 'seller' && (
                  <button
                    onClick={() => handleNavigation('cart')}
                    className="relative hover:bg-white/20 p-2 rounded-lg transition"
                  >
                    <ShoppingCart size={24} />
                    {getCartCount() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-yellow-400 text-purple-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                        {getCartCount()}
                      </span>
                    )}
                  </button>
                )}

                <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg">
                  <User size={20} />
                  <span className="text-sm">{user.name}</span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 hover:bg-white/20 px-4 py-2 rounded-lg transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavigation('auth')}
                className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105"
              >
                Login / Sign Up
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/20 transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-purple-700 border-t border-white/20">
          <div className="px-4 py-3 space-y-2">
            <button
              onClick={() => handleNavigation('home')}
              className="block w-full text-left px-4 py-2 rounded-lg hover:bg-white/20 transition"
            >
              Home
            </button>

            {user?.role === 'seller' && (
              <button
                onClick={() => handleNavigation('seller')}
                className="block w-full text-left px-4 py-2 rounded-lg hover:bg-white/20 transition"
              >
                My Products
              </button>
            )}

            {user ? (
              <>
                {user.role !== 'seller' && (
                  <button
                    onClick={() => handleNavigation('cart')}
                    className="flex items-center justify-between w-full px-4 py-2 rounded-lg hover:bg-white/20 transition"
                  >
                    <span>Cart</span>
                    {getCartCount() > 0 && (
                      <span className="bg-yellow-400 text-purple-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        {getCartCount()}
                      </span>
                    )}
                  </button>
                )}

                <div className="px-4 py-2 bg-white/10 rounded-lg">
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-white/80">{user.email}</p>
                  <p className="text-xs mt-1 bg-white/20 inline-block px-2 py-1 rounded">
                    {user.role}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-4 py-2 rounded-lg hover:bg-white/20 transition text-red-200"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavigation('auth')}
                className="w-full bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}