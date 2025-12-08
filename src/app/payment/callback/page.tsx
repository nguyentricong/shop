
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('');
  const gateway = searchParams.get('gateway');

  useEffect(() => {
    const checkPayment = async () => {
      // Check payment status based on gateway params
      const resultCode = searchParams.get('resultCode'); // MoMo
      const responseCode = searchParams.get('vnp_ResponseCode'); // VNPay

      if (gateway === 'momo') {
        if (resultCode === '0') {
          setStatus('success');
          setMessage('Thanh toán MoMo thành công! License Key đã được gửi về email của bạn.');
        } else {
          setStatus('failed');
          setMessage('Thanh toán MoMo thất bại. Vui lòng thử lại.');
        }
      } else if (gateway === 'vnpay') {
        if (responseCode === '00') {
          setStatus('success');
          setMessage('Thanh toán VNPay thành công! License Key đã được gửi về email của bạn.');
        } else {
          setStatus('failed');
          setMessage('Thanh toán VNPay thất bại. Vui lòng thử lại.');
        }
      }
    };

    checkPayment();
  }, [searchParams, gateway]);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: 500, width: '100%', background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 40, textAlign: 'center' }}>
        {status === 'loading' && (
          <>
            <div style={{ width: 64, height: 64, border: '4px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 20px', animation: 'spin 1s linear infinite' }}></div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Đang xử lý thanh toán...</h1>
            <p style={{ color: '#64748b' }}>Vui lòng đợi trong giây lát</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ width: 80, height: 80, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <span style={{ fontSize: 40 }}>✓</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)', marginBottom: 12 }}>Thanh Toán Thành Công!</h1>
            <p style={{ color: '#475569', marginBottom: 30 }}>{message}</p>
            
            <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 8, padding: 16, marginBottom: 24 }}>
              <p style={{ fontSize: 14, color: '#92400e', margin: 0 }}>
                📧 Kiểm tra email của bạn để xem License Key và hướng dẫn kích hoạt.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Link href="/dashboard" style={{ flex: 1, background: 'var(--primary)', color: '#fff', padding: '12px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, display: 'block' }}>
                Xem Đơn Hàng
              </Link>
              <Link href="/" style={{ flex: 1, background: '#f1f5f9', color: 'var(--foreground)', padding: '12px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, display: 'block' }}>
                Về Trang Chủ
              </Link>
            </div>
          </>
        )}

        {status === 'failed' && (
          <>
            <div style={{ width: 80, height: 80, background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <span style={{ fontSize: 40, color: '#dc2626' }}>✗</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#dc2626', marginBottom: 12 }}>Thanh Toán Thất Bại</h1>
            <p style={{ color: '#475569', marginBottom: 30 }}>{message}</p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Link href="/buy" style={{ flex: 1, background: 'var(--primary)', color: '#fff', padding: '12px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, display: 'block' }}>
                Thử Lại
              </Link>
              <Link href="/" style={{ flex: 1, background: '#f1f5f9', color: 'var(--foreground)', padding: '12px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, display: 'block' }}>
                Về Trang Chủ
              </Link>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <p>Đang tải trạng thái thanh toán...</p>
      </div>
    }>
      <PaymentCallbackContent />
    </Suspense>
  );
}
