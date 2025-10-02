'use client';

import SellerDashboard from './SellerDashboard';

export default function SellerPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container-page py-12">
        <h1 className="text-3xl font-bold mb-8">Seller Panel</h1>
        <SellerDashboard />
      </div>
    </div>
  );
}
