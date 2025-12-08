'use client';

import Link from 'next/link';
import { ShoppingCart, Lock, Zap, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      {/* Navigation */}
      <nav className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">🚀 AdBlock Pro</h1>
          <Link href="/buy" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-lg font-semibold transition">
            Mua Ngay
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-5xl sm:text-7xl font-bold text-white mb-6">
          Chặn 100% Quảng Cáo YouTube & Facebook
        </h2>
        <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
          Extension mạnh mẽ nhất 2025 - Xóa tất cả quảng cáo, không làm chậm tốc độ, hoàn toàn an toàn
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/buy" className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105">
            🛒 Mua Ngay - 49,000đ
          </Link>
          <button className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-lg font-bold text-lg transition border border-white/50">
            📺 Xem Demo
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="bg-black/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-white text-center mb-12">Tính Năng Nổi Bật</h3>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: 'Siêu Nhanh', desc: 'Hoạt động liền mạch, không lag' },
              { icon: Lock, title: 'An Toàn 100%', desc: 'Không thu thập dữ liệu cá nhân' },
              { icon: Users, title: 'Hỗ Trợ 24/7', desc: 'Chat support tiếng Việt' },
              { icon: ShoppingCart, title: 'Trọn Đời', desc: 'Mua 1 lần, dùng vĩnh viễn' },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-white/50 transition">
                <item.icon className="w-12 h-12 text-green-400 mb-4" />
                <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                <p className="text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before & After */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-4xl font-bold text-white text-center mb-12">Kết Quả Thực Tế</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-red-500/20 border-l-4 border-red-500 rounded-lg p-8">
            <h4 className="text-2xl font-bold text-white mb-4">❌ Trước (Có Quảng Cáo)</h4>
            <ul className="text-gray-200 space-y-2">
              <li>✗ Quảng cáo che 30% màn hình</li>
              <li>✗ Phải chờ 5s để bỏ qua</li>
              <li>✗ Âm thanh quảng cáo khó chịu</li>
              <li>✗ Trang tải chậm hơn 40%</li>
            </ul>
          </div>
          <div className="bg-green-500/20 border-l-4 border-green-500 rounded-lg p-8">
            <h4 className="text-2xl font-bold text-white mb-4">✅ Sau (Với AdBlock Pro)</h4>
            <ul className="text-gray-200 space-y-2">
              <li>✓ Không một quảng cáo nào</li>
              <li>✓ Xem video ngay lập tức</li>
              <li>✓ Yên tĩnh hoàn toàn</li>
              <li>✓ YouTube tải nhanh hơn 60%</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-black/50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-white text-center mb-12">Giá Cả</h3>
          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-12 text-center">
            <h4 className="text-5xl font-bold text-white mb-2">49,000₫</h4>
            <p className="text-green-100 mb-8">Mua 1 lần, dùng trọn đời trên tất cả thiết bị</p>
            <Link href="/buy" className="bg-white hover:bg-gray-100 text-green-600 px-10 py-4 rounded-lg font-bold text-xl transition inline-block">
              Thanh Toán Ngay →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-4xl font-bold text-white text-center mb-12">Câu Hỏi Thường Gặp</h3>
        <div className="space-y-6">
          {[
            { q: 'Có hỗ trợ sau khi mua không?', a: 'Có, chúng tôi hỗ trợ 24/7 qua chat và email' },
            { q: 'Có hoạt động trên Firefox không?', a: 'Hiện tại chỉ hỗ trợ Chrome, Firefox sẽ ra năm 2025' },
            { q: 'Có thể hoàn tiền không?', a: 'Có hoàn tiền 100% trong 7 ngày nếu không hài lòng' },
            { q: 'Cần cập nhật extension không?', a: 'Không, mua 1 lần được tất cả cập nhật tương lai' },
          ].map((item, i) => (
            <details key={i} className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-6 cursor-pointer hover:border-white/50 transition group">
              <summary className="font-bold text-white text-lg flex justify-between items-center">
                {item.q}
                <span className="group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="text-gray-300 mt-4">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/80 border-t border-white/10 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>© 2025 AdBlock Pro. Tất cả quyền được bảo lưu.</p>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <a href="#" className="hover:text-white">Điều Khoản</a>
            <a href="#" className="hover:text-white">Quyền Riêng Tư</a>
            <a href="#" className="hover:text-white">Liên Hệ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
