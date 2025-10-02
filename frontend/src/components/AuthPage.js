'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    await login(email, password);
  }

  return (
    <div className="container-page py-16">
      <div className="max-w-md mx-auto card p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome back</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm">Email</label>
            <input className="input mt-1" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-sm">Password</label>
            <input type="password" className="input mt-1" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button className="btn btn-primary w-full">Sign in</button>
        </form>
      </div>
    </div>
  );
}
