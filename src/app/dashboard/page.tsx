'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Copy, Eye, EyeOff } from 'lucide-react';

interface User {
  email: string;
  name: string;
  createdAt?: string;
}

export default function DashboardPage() {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  async function checkAuthAndFetchData() {
    try {
      // Get current user
      const authRes = await fetch('/api/auth/me', { credentials: 'include' });
      if (!authRes.ok) {
        window.location.href = '/auth/login';
        return;
      }
      
      const authData = await authRes.json();
      if (!authData.user) {
        window.location.href = '/auth/login';
        return;
      }
      
      setUser(authData.user);

      // Fetch orders for this user
      const ordersRes = await fetch(`/api/orders?email=${encodeURIComponent(authData.user.email)}`, {
        credentials: 'include'
      });
      
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        if (ordersData.success && ordersData.orders) {
          setOrders(ordersData.orders);
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Header */}
      <header style={{ width: '100%', background: 'var(--primary)', color: '#fff', boxShadow: '0 2px 8px rgba(30,41,59,0.08)', padding: '0.5rem 0', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: 1 }}>AdBlock Pro</span>
            <span style={{ fontSize: 14, opacity: 0.8 }}>Chặn 100% Quảng Cáo YouTube & Facebook</span>
          </div>
          <Link href="/" style={{ textDecoration: 'none', color: '#fff', fontWeight: 600, fontSize: 14 }}>← Trang Chủ</Link>
        </div>
      </header>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '6rem 1.5rem 2rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Đang tải...</p>
          </div>
        ) : !user ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Vui lòng <Link href="/auth/login">đăng nhập</Link></p>
          </div>
        ) : (
          <>
            {/* User Info */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 24, marginBottom: 24 }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: 8 }}>Xin chào, {user.name}! 👋</h2>
              <p style={{ color: '#475569', marginBottom: 4 }}>Email: {user.email}</p>
              <p style={{ color: '#475569' }}>Thành viên kể từ: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN')}</p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'Tổng Đơn Hàng', value: orders.length.toString(), icon: '📦' },
                { label: 'Licenses Hoạt Động', value: orders.filter(o => o.status === 'completed').length.toString(), icon: '✓' },
                { label: 'Hỗ Trợ', value: '24/7', icon: '🎧' }
              ].map((stat, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 16 }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
              <p style={{ color: '#64748b', fontSize: 13, marginBottom: 6 }}>{stat.label}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)' }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Orders */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: 20 }}>📜 Lịch Sử Mua Hàng</h3>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ textAlign: 'left', color: 'var(--foreground)', fontWeight: 700, padding: '12px 0', fontSize: 13 }}>Ngày</th>
                  <th style={{ textAlign: 'left', color: 'var(--foreground)', fontWeight: 700, padding: '12px 0', fontSize: 13 }}>Sản Phẩm</th>
                  <th style={{ textAlign: 'left', color: 'var(--foreground)', fontWeight: 700, padding: '12px 0', fontSize: 13 }}>Giá</th>
                  <th style={{ textAlign: 'left', color: 'var(--foreground)', fontWeight: 700, padding: '12px 0', fontSize: 13 }}>Trạng Thái</th>
                  <th style={{ textAlign: 'left', color: 'var(--foreground)', fontWeight: 700, padding: '12px 0', fontSize: 13 }}>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                      Chưa có đơn hàng nào. <Link href="/buy" style={{ color: 'var(--primary)', fontWeight: 600 }}>Mua ngay</Link>
                    </td>
                  </tr>
                ) : orders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ color: '#475569', padding: '12px 0', fontSize: 14 }}>
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td style={{ color: '#475569', padding: '12px 0', fontSize: 14 }}>
                      AdBlock Pro - {order.paymentMethod?.toUpperCase() || 'N/A'}
                    </td>
                    <td style={{ color: '#475569', padding: '12px 0', fontSize: 14, fontWeight: 600 }}>
                      {order.amount?.toLocaleString('vi-VN') || '0'} {order.currency || 'VND'}
                    </td>
                    <td style={{ padding: '12px 0' }}>
                      {order.status === 'completed' ? (
                        <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: 16, fontSize: 12, fontWeight: 600 }}>
                          ✓ Hoàn Thành
                        </span>
                      ) : order.status === 'pending' ? (
                        <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 12px', borderRadius: 16, fontSize: 12, fontWeight: 600 }}>
                          ⏳ Đang xử lý
                        </span>
                      ) : (
                        <span style={{ background: '#fee2e2', color: '#991b1b', padding: '4px 12px', borderRadius: 16, fontSize: 12, fontWeight: 600 }}>
                          ✗ Thất bại
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px 0' }}>
                      {order.status === 'completed' ? (
                        <details style={{ position: 'relative' }}>
                          <summary style={{ cursor: 'pointer', color: 'var(--primary)', fontSize: 14, fontWeight: 600 }}>
                            Xem License Key
                          </summary>
                          <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 8, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 12, width: 280, zIndex: 50, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                            <p style={{ color: '#64748b', fontSize: 12, marginBottom: 8 }}>License Key:</p>
                            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: 8, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <code style={{ color: 'var(--foreground)', fontSize: 12, fontFamily: 'monospace' }}>
                                {showKey ? order.licenseKey : '•••••••••••••••••'}
                              </code>
                              <button
                                onClick={() => setShowKey(!showKey)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 0, marginLeft: 8 }}
                              >
                              {showKey ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                            </button>
                          </div>
                            <button
                              onClick={() => copyToClipboard(order.licenseKey)}
                              style={{ width: '100%', background: 'var(--primary)', color: '#fff', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                            >
                              <Copy style={{ width: 14, height: 14 }} />
                              {copied ? 'Đã sao chép!' : 'Sao chép'}
                            </button>
                          </div>
                        </details>
                      ) : (
                        <span style={{ fontSize: 14, color: '#94a3b8' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

            {/* Help Section */}
            <div style={{ background: '#dbeafe', border: '1px solid #93c5fd', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: 12 }}>❓ Cần Hỗ Trợ?</h3>
              <p style={{ color: '#475569', marginBottom: 16 }}>
                Nếu gặp vấn đề kích hoạt license hoặc có câu hỏi, vui lòng liên hệ với chúng tôi
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a
                  href="mailto:support@adblocker.vn"
                  style={{ background: 'var(--primary)', color: '#fff', padding: '10px 16px', borderRadius: 6, fontWeight: 600, textDecoration: 'none', fontSize: 14 }}
                >
                  📧 Email Support
                </a>
                <a
                  href="#"
                  style={{ background: '#fff', color: 'var(--primary)', padding: '10px 16px', borderRadius: 6, fontWeight: 600, textDecoration: 'none', fontSize: 14, border: '1px solid var(--primary)' }}
                >
                  💬 Chat Support
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
