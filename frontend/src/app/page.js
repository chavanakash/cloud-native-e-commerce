'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import AuthPage from '@/components/AuthPage';
import HomePage from '@/components/HomePage';
import SellerDashboard from '@/components/SellerDashboard';
import CartPage from '@/components/CartPage';
import CheckoutPage from '@/components/CheckoutPage';
import Footer from '@/components/Footer';

export default function MainApp() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    if (!user && currentPage !== 'home') {
      return <AuthPage onSuccess={() => setCurrentPage('home')} />;
    }

    switch (currentPage) {
      case 'auth':
        return <AuthPage onSuccess={() => setCurrentPage('home')} />;
      case 'home':
        return <HomePage />;
      case 'seller':
        return user?.role === 'seller' ? <SellerDashboard /> : <HomePage />;
      case 'cart':
        return <CartPage onCheckout={() => setCurrentPage('checkout')} />;
      case 'checkout':
        return <CheckoutPage onSuccess={() => setCurrentPage('home')} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}