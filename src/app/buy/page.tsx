'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';

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
        setLicenseKey(data.licenseKey);
        setStep('success');
      } else {
        alert('Lỗi: ' + (data.error || 'Vui lòng thử lại'));
      }
    } catch (error) {
      alert('Lỗi kết nối: ' + (error instanceof Error ? error.message : 'Vui lòng thử lại'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-gray-300 transition w-fit">
            <ArrowLeft className="w-5 h-5" />
            Quay Lại
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {step === 'info' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8">
            <h1 className="text-4xl font-bold text-white mb-2">Mua AdBlock Pro</h1>
            <p className="text-gray-300 mb-8">Điền thông tin để nhận License Key</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-white font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/50 transition"
                />
                <p className="text-sm text-gray-400 mt-1">Sẽ nhận License Key qua email này</p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-white font-semibold mb-2">Tên Đầy Đủ *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nguyễn Văn A"
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/50 transition"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-white font-semibold mb-2">Phương Thức Thanh Toán *</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/50 transition"
                >
                  <option value="momo" className="bg-purple-900">MoMo (Khuyến Nghị)</option>
                  <option value="bank" className="bg-purple-900">Chuyển Khoản Ngân Hàng</option>
                  <option value="paypal" className="bg-purple-900">PayPal</option>
                </select>
              </div>

              {/* Order Summary */}
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-6">
                <h3 className="text-white font-bold text-lg mb-4">Tóm Tắt Đơn Hàng</h3>
                <div className="flex justify-between text-white mb-2">
                  <span>AdBlock Pro (Trọn Đời)</span>
                  <span>49,000₫</span>
                </div>
                <div className="border-t border-white/20 pt-4 flex justify-between text-white text-lg font-bold">
                  <span>Tổng Cộng</span>
                  <span className="text-green-400">49,000₫</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 text-white font-bold py-4 rounded-lg transition text-lg"
              >
                {loading ? 'Đang xử lý...' : '💳 Tiếp Tục Thanh Toán'}
              </button>

              {/* Security Info */}
              <p className="text-center text-sm text-gray-400">
                ✓ Thanh toán an toàn với SSL encryption | ✓ Không lưu trữ thông tin thẻ
              </p>
            </form>
          </div>
        )}

        {step === 'success' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-green-500/50 p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-4xl font-bold text-white mb-2">Thanh Toán Thành Công!</h1>
            <p className="text-gray-300 mb-8">License Key của bạn sẽ được gửi qua email</p>

            {/* License Key Display */}
            <div className="bg-black/40 border border-white/20 rounded-lg p-6 mb-8">
              <p className="text-gray-400 text-sm mb-2">LICENSE KEY</p>
              <p className="text-white font-mono text-xl break-all select-all">{licenseKey}</p>
              <button
                onClick={() => navigator.clipboard.writeText(licenseKey)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                📋 Sao Chép
              </button>
            </div>

            {/* Next Steps */}
            <div className="space-y-4 mb-8">
              <h3 className="text-white font-bold text-lg">Bước Tiếp Theo:</h3>
              <ol className="text-left space-y-3">
                {[
                  '1. Cài đặt Extension từ Chrome Web Store',
                  '2. Mở Extension → Paste License Key',
                  '3. Nhấp "Kích Hoạt"',
                  '4. Tận hưởng YouTube không quảng cáo! 🎉'
                ].map((step, i) => (
                  <li key={i} className="text-gray-300 flex items-center gap-2">
                    <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">✓</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Download Button */}
            <a
              href="https://chrome.google.com/webstore"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-8 rounded-lg transition text-lg mb-6"
            >
              ⬇️ Tải Extension từ Chrome Web Store
            </a>

            {/* Support Info */}
            <p className="text-gray-400 text-sm">
              Cần hỗ trợ? <a href="mailto:support@adblocker.vn" className="text-blue-400 hover:text-blue-300">Liên hệ: support@adblocker.vn</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
