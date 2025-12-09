'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Đăng ký thất bại');
      return;
    }
    setSuccess('Đăng ký thành công! Bạn có thể đăng nhập.');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 420, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: 16, padding: 40, boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 8, background: 'linear-gradient(135deg, #f093fb, #f5576c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Đăng ký</h1>
        <p style={{ color: '#64748b', marginBottom: 24, fontSize: '0.95rem' }}>Tạo tài khoản miễn phí ngay!</p>
        <form onSubmit={handleRegister} style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gap: 6 }}>
            <label>Họ tên</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              minLength={2}
              style={{ border: '2px solid #e2e8f0', borderRadius: 10, padding: '12px 14px', fontSize: '1rem', transition: 'all 0.2s', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = '#f093fb'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
          <div style={{ display: 'grid', gap: 6 }}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ border: '2px solid #e2e8f0', borderRadius: 10, padding: '12px 14px', fontSize: '1rem', transition: 'all 0.2s', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = '#f093fb'}
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
              minLength={6}
              style={{ border: '2px solid #e2e8f0', borderRadius: 10, padding: '12px 14px', fontSize: '1rem', transition: 'all 0.2s', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = '#f093fb'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
          {error && <p style={{ color: '#dc2626', fontSize: 14 }}>{error}</p>}
          {success && <p style={{ color: '#16a34a', fontSize: 14 }}>{success}</p>}
          <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)', color: '#fff', padding: '14px', borderRadius: 10, fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem', boxShadow: '0 4px 15px rgba(240, 147, 251, 0.4)', transition: 'all 0.3s', opacity: loading ? 0.7 : 1 }}>
            {loading ? '⏳ Đang đăng ký...' : '✨ Đăng ký ngay'}
          </button>
        </form>

        <p style={{ marginTop: 16, fontSize: 14 }}>
          Đã có tài khoản? <Link href="/auth/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
