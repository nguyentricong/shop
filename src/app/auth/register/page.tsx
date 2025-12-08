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
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 32 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 16 }}>Đăng ký</h1>
        <form onSubmit={handleRegister} style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gap: 6 }}>
            <label>Họ tên</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              minLength={2}
              style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: '10px 12px' }}
            />
          </div>
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
              minLength={6}
              style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: '10px 12px' }}
            />
          </div>
          {error && <p style={{ color: '#dc2626', fontSize: 14 }}>{error}</p>}
          {success && <p style={{ color: '#16a34a', fontSize: 14 }}>{success}</p>}
          <button type="submit" disabled={loading} style={{ background: 'var(--primary)', color: '#fff', padding: '12px', borderRadius: 8, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <p style={{ marginTop: 16, fontSize: 14 }}>
          Đã có tài khoản? <Link href="/auth/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
