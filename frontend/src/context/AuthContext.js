'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // hydrate from storage if needed
    const raw = localStorage.getItem('user');
    if (raw) setUser(JSON.parse(raw));
  }, []);

  async function login(email, password) {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data?.user || { email });
      localStorage.setItem('user', JSON.stringify(data?.user || { email }));
    } catch {
      setUser({ email }); // demo fallback
      localStorage.setItem('user', JSON.stringify({ email }));
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('user');
  }

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
