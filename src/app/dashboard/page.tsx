'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, Download, Eye, EyeOff } from 'lucide-react';

export default function DashboardPage() {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mock data - trong thực tế sẽ lấy từ API
  const orders = [
    {
      id: '1',
      date: '2025-01-09',
      product: 'AdBlock Pro - Lifetime',
      amount: '49,000₫',
      status: 'completed',
      licenseKey: 'ADBLOCK-PRO-ABC123DEF456'
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      {/* Header */}
      <nav className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">📊 Dashboard</h1>
          <Link href="/" className="text-gray-300 hover:text-white transition">
            Trang Chủ
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* User Info */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Xin chào, Nguyễn Văn A! 👋</h2>
          <p className="text-gray-300">Email: user@example.com</p>
          <p className="text-gray-300">Thành viên kể từ: 2025-01-09</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Tổng Chi Tiêu', value: '49,000₫', icon: '💰' },
            { label: 'Licenses Hoạt Động', value: '1', icon: '✓' },
            { label: 'Hỗ Trợ', value: '24/7', icon: '🎧' }
          ].map((stat, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-gray-300 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Orders */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8">
          <h3 className="text-2xl font-bold text-white mb-6">📜 Lịch Sử Mua Hàng</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left text-white py-3 px-4">Ngày</th>
                  <th className="text-left text-white py-3 px-4">Sản Phẩm</th>
                  <th className="text-left text-white py-3 px-4">Giá</th>
                  <th className="text-left text-white py-3 px-4">Trạng Thái</th>
                  <th className="text-left text-white py-3 px-4">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-white/10 hover:bg-white/5 transition">
                    <td className="text-gray-300 py-4 px-4">{order.date}</td>
                    <td className="text-gray-300 py-4 px-4">{order.product}</td>
                    <td className="text-gray-300 py-4 px-4 font-semibold">{order.amount}</td>
                    <td className="py-4 px-4">
                      <span className="bg-green-500/30 text-green-300 px-3 py-1 rounded-full text-sm font-semibold">
                        ✓ Hoàn Thành
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <details className="relative">
                        <summary className="cursor-pointer text-blue-400 hover:text-blue-300">
                          Xem License Key
                        </summary>
                        <div className="absolute top-full left-0 mt-2 bg-black/50 backdrop-blur-md border border-white/20 rounded-lg p-4 w-80 z-50">
                          <p className="text-sm text-gray-400 mb-2">License Key:</p>
                          <div className="bg-white/10 border border-white/20 rounded p-3 mb-3 flex items-center justify-between">
                            <code className="text-white text-sm font-mono">
                              {showKey ? order.licenseKey : '••••••••••••••••'}
                            </code>
                            <button
                              onClick={() => setShowKey(!showKey)}
                              className="text-gray-400 hover:text-white ml-2"
                            >
                              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          <button
                            onClick={() => copyToClipboard(order.licenseKey)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition flex items-center justify-center gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            {copied ? 'Đã sao chép!' : 'Sao chép'}
                          </button>
                        </div>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-500/20 border border-blue-500/50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">❓ Cần Hỗ Trợ?</h3>
          <p className="text-gray-300 mb-4">
            Nếu gặp vấn đề kích hoạt license hoặc có câu hỏi, vui lòng liên hệ với chúng tôi
          </p>
          <div className="flex gap-4">
            <a
              href="mailto:support@adblocker.vn"
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              📧 Email Support
            </a>
            <a
              href="#"
              className="bg-white/20 text-white px-6 py-2 rounded-lg font-semibold border border-white/50 hover:bg-white/30 transition"
            >
              💬 Chat Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
