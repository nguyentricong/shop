'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Copy } from 'lucide-react';
import Image from 'next/image';

export default function BuyPage() {
  const [formData, setFormData] = useState({
    email: '',
    name: ''
  });
  const [step, setStep] = useState<'info' | 'qr' | 'success'>('info');
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email && formData.name) {
      setStep('qr');
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(formData.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentConfirm = () => {
    setStep('success');
  };

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
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '6rem 1.5rem 2rem' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {step === 'info' && (
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: 16, border: '1px solid rgba(255, 255, 255, 0.3)', padding: 32, boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 8, background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Mua AdBlock Pro</h1>
            <p style={{ color: '#64748b', marginBottom: 28, fontSize: '0.95rem' }}>Điền thông tin để nhận License Key</p>

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
                  style={{ width: '100%', background: '#fff', border: '2px solid #e2e8f0', borderRadius: 10, padding: '12px 14px', fontSize: '1rem', color: 'var(--foreground)', transition: 'all 0.2s', outline: 'none' }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
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
                  style={{ width: '100%', background: '#fff', border: '2px solid #e2e8f0', borderRadius: 10, padding: '12px 14px', fontSize: '1rem', color: 'var(--foreground)', transition: 'all 0.2s', outline: 'none' }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              {/* Order Summary */}
              <div style={{ background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))', border: '2px solid rgba(102, 126, 234, 0.3)', borderRadius: 12, padding: 20, boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)' }}>
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
                style={{ width: '100%', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', fontWeight: 700, padding: '14px 16px', borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, fontSize: '1rem', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)', transition: 'all 0.3s' }}
              >
                {loading ? 'Đang xử lý...' : '💳 Tiếp Tục Thanh Toán'}
              </button>

              {/* Security Info */}
              {/* Pricing */}
              <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 12, padding: 20, marginTop: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
                  <span style={{ fontSize: 18, fontWeight: 700 }}>Giá</span>
                  <span style={{ fontSize: 28, fontWeight: 900 }}>49.000₫</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{ width: '100%', background: 'var(--primary)', color: '#fff', fontWeight: 700, padding: '14px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 16, marginTop: 8 }}
              >
                Tiếp Tục Thanh Toán →
              </button>

              <p style={{ textAlign: 'center', fontSize: 12, color: '#64748b' }}>
                ✓ Bảo mật 100% | ✓ Hỗ trợ 24/7
              </p>
            </form>
          </div>
        )}

        {step === 'qr' && (
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: 16, border: '1px solid rgba(255, 255, 255, 0.3)', padding: 32, boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: 8, background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Quét Mã QR MoMo</h1>
            <p style={{ color: '#64748b', marginBottom: 24, fontSize: '0.95rem' }}>Thanh toán 49.000₫ qua MoMo</p>

            {/* QR Code */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Image
                src="/momo.jpg"
                alt="MoMo QR Code"
                width={300}
                height={300}
                style={{ borderRadius: 12, border: '2px solid #e2e8f0', maxWidth: '100%', height: 'auto' }}
              />
            </div>

            {/* Instructions */}
            <div style={{ background: '#fff3cd', border: '2px solid #ffc107', borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <h3 style={{ color: '#856404', fontWeight: 700, marginBottom: 12, fontSize: 16 }}>⚠️ QUAN TRỌNG - Đọc Kỹ:</h3>
              <ol style={{ color: '#856404', fontSize: 14, lineHeight: 1.7, paddingLeft: 20, margin: 0 }}>
                <li style={{ marginBottom: 8 }}>Mở app <strong>MoMo</strong> → Quét mã QR phía trên</li>
                <li style={{ marginBottom: 8 }}>Nhập số tiền: <strong>49.000₫</strong></li>
                <li style={{ marginBottom: 8 }}><strong>BẮT BUỘC:</strong> Ghi email của bạn vào phần <strong>Lời nhắn</strong>:</li>
              </ol>
              
              <div style={{ background: '#fff', border: '2px dashed #667eea', borderRadius: 8, padding: 12, marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>EMAIL CỦA BẠN:</p>
                  <p style={{ color: '#667eea', fontWeight: 700, fontSize: 16, fontFamily: 'monospace', wordBreak: 'break-all' }}>{formData.email}</p>
                </div>
                <button
                  onClick={copyEmail}
                  style={{ background: copied ? '#10b981' : '#667eea', color: '#fff', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}
                >
                  {copied ? '✓ Đã Copy' : <><Copy size={14} style={{ marginRight: 4, display: 'inline' }} />Copy</>}
                </button>
              </div>

              <p style={{ color: '#856404', fontSize: 13, marginTop: 12, fontWeight: 600 }}>💡 Không có email trong lời nhắn = KHÔNG nhận được license key!</p>
            </div>

            {/* After Payment */}
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <h3 style={{ color: 'var(--foreground)', fontWeight: 700, marginBottom: 12, fontSize: 15 }}>✅ Sau Khi Chuyển Khoản:</h3>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7 }}>Admin sẽ kiểm tra và gửi <strong>License Key + Extension</strong> qua email <strong>{formData.email}</strong> trong vòng <strong>1-2 giờ</strong> (giờ hành chính).</p>
            </div>

            <button
              onClick={handlePaymentConfirm}
              style={{ width: '100%', background: '#10b981', color: '#fff', fontWeight: 700, padding: '14px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 16 }}
            >
              ✓ Tôi Đã Chuyển Khoản
            </button>

            <button
              onClick={() => setStep('info')}
              style={{ width: '100%', background: 'transparent', color: '#667eea', fontWeight: 600, padding: '12px', border: 'none', cursor: 'pointer', fontSize: 14, marginTop: 10 }}
            >
              ← Quay Lại
            </button>
          </div>
        )}

        {step === 'success' && (
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: 16, border: '2px solid #10b981', padding: 32, textAlign: 'center', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}>
            <div style={{ width: 56, height: 56, background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Check style={{ width: 32, height: 32, color: '#fff' }} />
            </div>

            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: 8 }}>Đã Ghi Nhận!</h1>
            <p style={{ color: '#475569', marginBottom: 20, lineHeight: 1.7 }}>Cảm ơn bạn đã thanh toán. Admin sẽ xác nhận và gửi <strong>License Key + Extension</strong> qua email:</p>

            {/* Email Display */}
            <div style={{ background: '#f0fdf4', border: '2px solid #10b981', borderRadius: 12, padding: 16, marginBottom: 24 }}>
              <p style={{ color: '#059669', fontWeight: 700, fontSize: 18, fontFamily: 'monospace', wordBreak: 'break-all' }}>{formData.email}</p>
            </div>

            {/* Timeline */}
            <div style={{ textAlign: 'left', marginBottom: 24 }}>
              <h3 style={{ color: 'var(--foreground)', fontWeight: 700, marginBottom: 12, fontSize: 16 }}>⏱️ Thời Gian Xử Lý:</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ width: 32, height: 32, background: '#667eea', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>1</div>
                  <div>
                    <p style={{ color: 'var(--foreground)', fontWeight: 600, marginBottom: 2 }}>Admin kiểm tra thanh toán</p>
                    <p style={{ color: '#64748b', fontSize: 13 }}>Trong vòng 1-2 giờ (giờ hành chính)</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ width: 32, height: 32, background: '#667eea', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>2</div>
                  <div>
                    <p style={{ color: 'var(--foreground)', fontWeight: 600, marginBottom: 2 }}>Tạo License Key</p>
                    <p style={{ color: '#64748b', fontSize: 13 }}>Key chỉ dành riêng cho bạn</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ width: 32, height: 32, background: '#10b981', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>3</div>
                  <div>
                    <p style={{ color: 'var(--foreground)', fontWeight: 600, marginBottom: 2 }}>Gửi Email với Key + Extension</p>
                    <p style={{ color: '#64748b', fontSize: 13 }}>Kiểm tra cả Spam/Junk nếu không thấy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, textAlign: 'left' }}>
              <h3 style={{ color: 'var(--foreground)', fontWeight: 700, marginBottom: 8, fontSize: 15 }}>💬 Cần Hỗ Trợ?</h3>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7 }}>Nếu sau <strong>2 giờ</strong> chưa nhận được email, vui lòng liên hệ: <a href="mailto:support@adblockpro.vn" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 600 }}>support@adblockpro.vn</a></p>
            </div>

            <Link href="/" style={{ display: 'inline-block', background: '#667eea', color: '#fff', fontWeight: 700, padding: '12px 32px', borderRadius: 10, textDecoration: 'none', fontSize: 15, marginTop: 20 }}>
              ← Về Trang Chủ
            </Link>
          </div>
        )}
        </div>
      </div>
    </>
  );
}
