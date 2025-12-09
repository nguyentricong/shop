'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check (replace with secure auth in production)
    if (password === 'admin123') {
      sessionStorage.setItem('admin_authenticated', 'true');
      setIsAuthenticated(true);
    } else {
      alert('Mật khẩu không đúng!');
    }
  };

  const generateLicenseKey = () => {
    const prefix = 'ADBLOCK-PRO';
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    const key = `${prefix}-${timestamp}-${random}`;
    setLicenseKey(key);
  };

  const handleCreateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !licenseKey) {
      setMessage('Vui lòng nhập email và tạo license key!');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Save license to database
      const response = await fetch('/api/admin/create-license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, licenseKey })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ Đã tạo và gửi license key cho ${email}`);
        setEmail('');
        setLicenseKey('');
      } else {
        setMessage(`❌ Lỗi: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 32, maxWidth: 400, width: '100%', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 24, color: '#1e293b', textAlign: 'center' }}>🔐 Admin Login</h1>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: '#334155' }}>Mật Khẩu Admin</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                required
                style={{ width: '100%', padding: '12px', borderRadius: 8, border: '2px solid #e2e8f0', fontSize: 16 }}
              />
            </div>
            <button
              type="submit"
              style={{ width: '100%', background: '#667eea', color: '#fff', fontWeight: 700, padding: '12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 16 }}
            >
              Đăng Nhập
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '2rem' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1e293b', margin: 0 }}>👨‍💼 Admin Panel</h1>
          <button
            onClick={handleLogout}
            style={{ background: '#ef4444', color: '#fff', padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            Đăng Xuất
          </button>
        </div>

        {/* Create License Form */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 20, color: '#1e293b' }}>Tạo License Key</h2>
          
          <form onSubmit={handleCreateLicense} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Email Input */}
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: '#334155' }}>Email Khách Hàng *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@email.com"
                required
                style={{ width: '100%', padding: '12px', borderRadius: 8, border: '2px solid #e2e8f0', fontSize: 16 }}
              />
              <p style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>Email nhận được từ nội dung chuyển khoản MoMo</p>
            </div>

            {/* License Key Generator */}
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: '#334155' }}>License Key *</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  type="text"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  placeholder="Click 'Tạo Key Mới' để generate"
                  required
                  style={{ flex: 1, padding: '12px', borderRadius: 8, border: '2px solid #e2e8f0', fontSize: 14, fontFamily: 'monospace' }}
                />
                <button
                  type="button"
                  onClick={generateLicenseKey}
                  style={{ background: '#10b981', color: '#fff', padding: '12px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}
                >
                  🎲 Tạo Key Mới
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', background: loading ? '#94a3b8' : '#667eea', color: '#fff', fontWeight: 700, padding: '14px', borderRadius: 8, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 16 }}
            >
              {loading ? '⏳ Đang Xử Lý...' : '✅ Tạo & Gửi Email'}
            </button>
          </form>

          {/* Message Display */}
          {message && (
            <div style={{ marginTop: 20, padding: 16, borderRadius: 8, background: message.includes('✅') ? '#f0fdf4' : '#fef2f2', border: `2px solid ${message.includes('✅') ? '#10b981' : '#ef4444'}`, color: message.includes('✅') ? '#059669' : '#dc2626', fontWeight: 600 }}>
              {message}
            </div>
          )}

          {/* Instructions */}
          <div style={{ marginTop: 24, padding: 16, background: '#f8fafc', borderRadius: 8 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 10, color: '#1e293b' }}>📝 Hướng Dẫn:</h3>
            <ol style={{ color: '#64748b', fontSize: 14, lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
              <li>Nhận email khách hàng từ nội dung chuyển khoản MoMo</li>
              <li>Nhập email vào form trên</li>
              <li>Click "Tạo Key Mới" để generate license key tự động</li>
              <li>Click "Tạo & Gửi Email" - hệ thống sẽ:
                <ul style={{ marginTop: 6, paddingLeft: 20 }}>
                  <li>Lưu license key vào database</li>
                  <li>Gửi email kèm key + link download extension cho khách</li>
                </ul>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
