'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';

export default function BuyPage() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    paymentMethod: 'momo'
  });
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [licenseKey, setLicenseKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Save user info to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('userEmail', formData.email);
          localStorage.setItem('userName', formData.name);
          if (data.orderId) {
            localStorage.setItem('currentOrderId', data.orderId);
          }
        }

        // Nếu cần redirect đến payment gateway
        if (data.paymentRequired && data.paymentUrl) {
          window.location.href = data.paymentUrl;
          return;
        }

        // Nếu là bank transfer, hiện thông tin
        if (data.paymentMethod === 'bank') {
          alert(
            `Chuyển khoản đến:\n\n` +
            `Ngân hàng: ${data.bankInfo.bankName}\n` +
            `Số TK: ${data.bankInfo.accountNumber}\n` +
            `Chủ TK: ${data.bankInfo.accountName}\n` +
            `Số tiền: ${data.bankInfo.amount.toLocaleString()}đ\n` +
            `Nội dung: ${data.bankInfo.content}\n\n` +
            `License Key sẽ được gửi qua email sau khi xác nhận thanh toán.`
          );
          setStep('success');
          return;
        }

        // Direct success (test mode)
        if (data.licenseKey) {
          setLicenseKey(data.licenseKey);
          setStep('success');
        }
      } else {
        // Xử lý errors với details
        if (data.details) {
          const errorMsg = data.details.map((d: any) => `${d.field}: ${d.message}`).join('\n');
          alert(`Lỗi:\n${errorMsg}`);
        } else {
          alert('Lỗi: ' + (data.error || 'Vui lòng thử lại'));
        }
      }
    } catch (error) {
      alert('Lỗi kết nối: ' + (error instanceof Error ? error.message : 'Vui lòng thử lại'));
    } finally {
      setLoading(false);
    }
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
          <Link href="/" style={{ textDecoration: 'none', color: '#fff', fontWeight: 600, fontSize: 14 }}>← Quay Lại</Link>
        </div>
      </header>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '6rem 1.5rem 2rem' }}>
        {step === 'info' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 24 }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: 8 }}>Mua AdBlock Pro</h1>
            <p style={{ color: '#475569', marginBottom: 24 }}>Điền thông tin để nhận License Key</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Email */}
              <div>
                <label style={{ display: 'block', color: 'var(--foreground)', fontWeight: 600, marginBottom: 8 }}>Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  style={{ width: '100%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 12px', fontSize: 14, color: 'var(--foreground)' }}
                />
                <p style={{ color: '#64748b', fontSize: 12, marginTop: 6 }}>Sẽ nhận License Key qua email này</p>
              </div>

              {/* Name */}
              <div>
                <label style={{ display: 'block', color: 'var(--foreground)', fontWeight: 600, marginBottom: 8 }}>Tên Đầy Đủ *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nguyễn Văn A"
                  style={{ width: '100%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 12px', fontSize: 14, color: 'var(--foreground)' }}
                />
              </div>

              {/* Payment Method */}
              <div>
                <label style={{ display: 'block', color: 'var(--foreground)', fontWeight: 600, marginBottom: 8 }}>Phương Thức Thanh Toán *</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  style={{ width: '100%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 12px', fontSize: 14, color: 'var(--foreground)' }}
                >
                  <option value="momo">🎯 MoMo - Quét QR (Nhanh nhất)</option>
                  <option value="vnpay">💳 VNPay - Thẻ ATM/Visa</option>
                  <option value="bank">🏦 Chuyển Khoản Ngân Hàng</option>
                  <option value="stripe">💵 Stripe - Visa/Mastercard (Quốc tế)</option>
                </select>
                <p style={{ color: '#64748b', fontSize: 12, marginTop: 6 }}>
                  {formData.paymentMethod === 'momo' && '⚡ Thanh toán ngay qua QR Code, nhận key trong 1 phút'}
                  {formData.paymentMethod === 'vnpay' && '🔒 Thanh toán an toàn qua VNPay'}
                  {formData.paymentMethod === 'bank' && '⏱️ Xác nhận trong 5-10 phút sau khi chuyển khoản'}
                  {formData.paymentMethod === 'stripe' && '🌍 Hỗ trợ thanh toán quốc tế, nhận key ngay'}
                </p>
              </div>

              {/* Order Summary */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: 16 }}>
                <h3 style={{ color: 'var(--foreground)', fontWeight: 700, marginBottom: 12 }}>Tóm Tắt Đơn Hàng</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--foreground)', marginBottom: 8, fontSize: 14 }}>
                  <span>AdBlock Pro (Trọn Đời)</span>
                  <span>49,000₫</span>
                </div>
                <div style={{ borderTop: '1px solid #bbf7d0', paddingTop: 12, display: 'flex', justifyContent: 'space-between', color: 'var(--foreground)', fontWeight: 700 }}>
                  <span>Tổng Cộng</span>
                  <span style={{ color: 'var(--success)' }}>49,000₫</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', background: 'var(--primary)', color: '#fff', fontWeight: 700, padding: '12px 16px', borderRadius: 8, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, fontSize: 15 }}
              >
                {loading ? 'Đang xử lý...' : '💳 Tiếp Tục Thanh Toán'}
              </button>

              {/* Security Info */}
              <p style={{ textAlign: 'center', fontSize: 12, color: '#64748b' }}>
                ✓ Thanh toán an toàn với SSL encryption | ✓ Không lưu trữ thông tin thẻ
              </p>
            </form>
          </div>
        )}

        {step === 'success' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '2px solid var(--success)', padding: 24, textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, background: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Check style={{ width: 32, height: 32, color: '#fff' }} />
            </div>

            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: 8 }}>Thanh Toán Thành Công!</h1>
            <p style={{ color: '#475569', marginBottom: 20 }}>License Key của bạn sẽ được gửi qua email</p>

            {/* License Key Display */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, marginBottom: 20 }}>
              <p style={{ color: '#64748b', fontSize: 12, marginBottom: 8 }}>LICENSE KEY</p>
              <p style={{ color: 'var(--foreground)', fontFamily: 'monospace', fontSize: 16, marginBottom: 12, wordBreak: 'break-all' }}>{licenseKey}</p>
              <button
                onClick={() => navigator.clipboard.writeText(licenseKey)}
                style={{ background: 'var(--primary)', color: '#fff', padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
              >
                📋 Sao Chép
              </button>
            </div>

            {/* Next Steps */}
            <div style={{ textAlign: 'left', marginBottom: 20 }}>
              <h3 style={{ color: 'var(--foreground)', fontWeight: 700, marginBottom: 12 }}>Bước Tiếp Theo:</h3>
              <ol style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  '1. Cài đặt Extension từ Chrome Web Store',
                  '2. Mở Extension → Paste License Key',
                  '3. Nhấp "Kích Hoạt"',
                  '4. Tận hưởng YouTube không quảng cáo! 🎉'
                ].map((step, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#475569', fontSize: 14 }}>
                    <span style={{ width: 24, height: 24, background: 'var(--success)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Download Button */}
            <a
              href="https://chrome.google.com/webstore"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', background: 'var(--primary)', color: '#fff', fontWeight: 700, padding: '12px 24px', borderRadius: 8, textDecoration: 'none', fontSize: 15, marginBottom: 16 }}
            >
              ⬇️ Tải Extension từ Chrome Web Store
            </a>

            {/* Support Info */}
            <p style={{ color: '#64748b', fontSize: 13 }}>
              Cần hỗ trợ? <a href="mailto:support@adblocker.vn" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Liên hệ: support@adblocker.vn</a>
            </p>
          </div>
        )}
      </div>
    </>
  );
}
