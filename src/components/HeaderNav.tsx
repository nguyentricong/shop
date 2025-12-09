'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface User {
  email: string;
  name: string;
}

export default function HeaderNav() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    window.location.reload();
  };

  return (
    <header style={{ width: '100%', background: 'var(--primary)', color: '#fff', boxShadow: '0 2px 8px rgba(30,41,59,0.08)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 2rem' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: '#fff' }}>
          <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: 1 }}>AdBlock Pro</span>
          <span style={{ fontSize: 14, opacity: 0.8 }}>Chặn 100% Quảng Cáo YouTube & Facebook</span>
        </Link>
        
        <nav style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {!loading && (
            <>
              {user ? (
                <>
                  <span style={{ fontSize: 14, opacity: 0.9 }}>👤 {user.name}</span>
                  <Link href="/dashboard" style={{ fontSize: 14, textDecoration: 'none', color: '#fff', fontWeight: 600, opacity: 0.9 }}>
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} style={{ fontSize: 14, background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '0.5rem 1rem', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" style={{ fontSize: 14, textDecoration: 'none', color: '#fff', fontWeight: 600, opacity: 0.9 }}>
                    Đăng nhập
                  </Link>
                  <Link href="/auth/register" style={{ fontSize: 14, textDecoration: 'none', background: '#fff', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: 6, fontWeight: 600 }}>
                    Đăng ký
                  </Link>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
