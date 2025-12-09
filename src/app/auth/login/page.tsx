'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });
    
    setLoading(false);
    
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Đăng nhập thất bại');
      return;
    }
    
    window.location.href = '/dashboard';
  };

  const handleGoogle = async () => {
    window.location.href = '/api/auth/signin?provider=google&callbackUrl=/dashboard';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 32 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 16 }}>Đăng nhập</h1>
        <form onSubmit={handleLogin} style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gap: 6 }}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: '10px 12px' }}
            />
          </div>
          <div style={{ display: 'grid', gap: 6 }}>
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: '10px 12px' }}
            />
          </div>
          {error && <p style={{ color: '#dc2626', fontSize: 14 }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ background: 'var(--primary)', color: '#fff', padding: '12px', borderRadius: 8, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div style={{ margin: '16px 0', textAlign: 'center', color: '#94a3b8' }}>hoặc</div>
        <button onClick={handleGoogle} style={{ width: '100%', border: '1px solid #e2e8f0', padding: '12px', borderRadius: 8, fontWeight: 600, background: '#fff', cursor: 'pointer' }}>
          Đăng nhập với Google
        </button>

        <p style={{ marginTop: 16, fontSize: 14 }}>
          Chưa có tài khoản? <Link href="/auth/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>Đăng ký</Link>
        </p>
      </div>
    </div>
  );
}
