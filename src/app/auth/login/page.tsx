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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 420, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: 16, padding: 40, boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 8, background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Đăng nhập</h1>
        <p style={{ color: '#64748b', marginBottom: 24, fontSize: '0.95rem' }}>Chào mừng bạn quay trở lại!</p>
        <form onSubmit={handleLogin} style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gap: 6 }}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ border: '2px solid #e2e8f0', borderRadius: 10, padding: '12px 14px', fontSize: '1rem', transition: 'all 0.2s', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
          <div style={{ display: 'grid', gap: 6 }}>
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ border: '2px solid #e2e8f0', borderRadius: 10, padding: '12px 14px', fontSize: '1rem', transition: 'all 0.2s', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
          {error && <p style={{ color: '#dc2626', fontSize: 14 }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', padding: '14px', borderRadius: 10, fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)', transition: 'all 0.3s', opacity: loading ? 0.7 : 1 }}>
            {loading ? '⏳ Đang đăng nhập...' : '🚀 Đăng nhập'}
          </button>
        </form>

        <div style={{ margin: '16px 0', textAlign: 'center', color: '#94a3b8' }}>hoặc</div>
        <button onClick={handleGoogle} style={{ width: '100%', border: '2px solid #e2e8f0', padding: '14px', borderRadius: 10, fontWeight: 600, background: '#fff', cursor: 'pointer', fontSize: '1rem', transition: 'all 0.3s', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#667eea'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}>
          🔐 Đăng nhập với Google
        </button>

        <p style={{ marginTop: 16, fontSize: 14 }}>
          Chưa có tài khoản? <Link href="/auth/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>Đăng ký</Link>
        </p>
      </div>
    </div>
  );
}
