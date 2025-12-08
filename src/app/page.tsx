'use client';

import Link from 'next/link';
import { Lock, Zap, CheckCircle, Shield, Headphones, Award } from 'lucide-react';

export default function Home() {
  return (
    <div style={{ minHeight: '80vh', background: 'var(--background)' }}>
      {/* Hero Section */}
      <section style={{ padding: '5rem 0 3rem', background: 'linear-gradient(120deg, #e0e7ff 0%, #f8fafc 100%)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: 24, lineHeight: 1.1 }}>
            Xem Video <span className="accent">Sạch Sẽ</span>
          </h1>
          <p style={{ fontSize: '1.3rem', color: '#475569', marginBottom: 32, maxWidth: 600, margin: '0 auto' }}>
            Tiện ích chặn quảng cáo mạnh mẽ nhất cho YouTube, Facebook và web. Nhanh, an toàn, 100% riêng tư.
          </p>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 16, justifyContent: 'center', marginBottom: 32 }}>
            <Link href="/buy" className="btn-primary" style={{ textDecoration: 'none', fontSize: 20 }}>
              Mua Ngay - 49,000₫
            </Link>
            <button className="btn-primary" style={{ background: 'var(--accent)', fontSize: 20 }}>
              Xem Demo
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center', marginTop: 32 }}>
            <div className="card" style={{ minWidth: 220 }}>
              <Shield style={{ color: 'var(--primary)', width: 32, height: 32, marginBottom: 8 }} />
              <div style={{ fontWeight: 700, fontSize: 18 }}>Bảo mật tuyệt đối</div>
              <div style={{ color: '#64748b', fontSize: 15 }}>Không lưu dữ liệu cá nhân, bảo vệ quyền riêng tư.</div>
            </div>
            <div className="card" style={{ minWidth: 220 }}>
              <Zap style={{ color: 'var(--accent)', width: 32, height: 32, marginBottom: 8 }} />
              <div style={{ fontWeight: 700, fontSize: 18 }}>Tốc độ vượt trội</div>
              <div style={{ color: '#64748b', fontSize: 15 }}>Không làm chậm máy, tối ưu cho mọi trình duyệt.</div>
            </div>
            <div className="card" style={{ minWidth: 220 }}>
              <CheckCircle style={{ color: 'var(--success)', width: 32, height: 32, marginBottom: 8 }} />
              <div style={{ fontWeight: 700, fontSize: 18 }}>Hiệu quả 100%</div>
              <div style={{ color: '#64748b', fontSize: 15 }}>Chặn sạch quảng cáo, trải nghiệm liền mạch.</div>
            </div>
          </div>
        </div>
      </section>
      {/* ...các phần khác giữ nguyên... */}

      {/* Stats */}
      <section style={{ background: '#f8fafc', color: 'var(--foreground)', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 8, color: 'var(--primary)' }}>100K+</div>
              <div style={{ fontSize: 14, opacity: 0.7 }}>Người dùng tin tưởng</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 8, color: 'var(--primary)' }}>99.9%</div>
              <div style={{ fontSize: 14, opacity: 0.7 }}>Quảng cáo bị chặn</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 8, color: 'var(--primary)' }}>60%</div>
              <div style={{ fontSize: 14, opacity: 0.7 }}>Trang tải nhanh hơn</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 8, color: 'var(--primary)' }}>5★</div>
              <div style={{ fontSize: 14, opacity: 0.7 }}>Đánh giá trung bình</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '4rem 2rem', background: 'var(--background)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, textAlign: 'center', marginBottom: 48, color: 'var(--foreground)' }}>✨ Tính Năng Chính</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 32 }}>
            {[
              { icon: Zap, title: 'Siêu Nhanh', desc: 'Không làm chậm trình duyệt của bạn' },
              { icon: Lock, title: 'An Toàn', desc: 'Bảo vệ quyền riêng tư 100%' },
              { icon: Headphones, title: 'Hỗ Trợ 24/7', desc: 'Tiếng Việt sẵn sàng giúp bạn' },
              { icon: Award, title: 'Trọn Đời', desc: 'Mua 1 lần dùng vĩnh viễn' },
            ].map((item, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: '2rem', borderRadius: 16 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 80, height: 80, background: 'var(--primary)', borderRadius: '50%', marginBottom: 24 }}>
                  <item.icon style={{ width: 40, height: 40, color: '#fff' }} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 18, color: 'var(--foreground)', marginBottom: 12 }}>{item.title}</h3>
                <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section style={{ background: '#fff', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, textAlign: 'center', marginBottom: 48, color: 'var(--foreground)' }}>⚖️ So Sánh</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
            <div style={{ background: '#fff', borderRadius: 20, padding: 32, border: '2px solid #fecaca', boxShadow: '0 4px 24px rgba(30,41,59,0.08)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: 24 }}>❌ Không Có AdBlock</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {['Quảng cáo che màn hình', 'Phải chờ 5-15 giây', 'Âm thanh khó chịu', 'Trang tải chậm'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, color: '#475569', marginBottom: 16, fontSize: 15 }}>
                    <span style={{ color: 'var(--danger)', fontWeight: 700, flexShrink: 0 }}>✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ background: '#fff', borderRadius: 20, padding: 32, border: '2px solid #bbf7d0', boxShadow: '0 4px 24px rgba(30,41,59,0.08)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: 24 }}>✅ Có AdBlock Pro</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {['Không quảng cáo', 'Xem ngay lập tức', 'Yên tĩnh', 'Trang tải nhanh 60%'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, color: '#475569', marginBottom: 16, fontSize: 15 }}>
                    <span style={{ color: 'var(--success)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '4rem 2rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, textAlign: 'center', marginBottom: 48, color: 'var(--foreground)' }}>💰 Giá Cả</h2>
          <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #1e40af 100%)', color: '#fff', borderRadius: 24, padding: 48, textAlign: 'center', boxShadow: '0 20px 40px rgba(37, 99, 235, 0.2)' }}>
            <div style={{ fontSize: '4rem', fontWeight: 800, marginBottom: 12 }}>49,000₫</div>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: 32, lineHeight: 1.6 }}>Mua 1 lần, dùng vĩnh viễn trên tất cả thiết bị</p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: 32, textAlign: 'left', maxWidth: 400, margin: '0 auto 2rem' }}>
              {['Chặn 99.9% quảng cáo', 'Cập nhật miễn phí vĩnh viễn', 'Hoàn tiền 7 ngày', 'Hỗ trợ 24/7'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, fontSize: 16 }}>
                  <CheckCircle style={{ width: 24, height: 24, flexShrink: 0 }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/buy" className="btn-primary" style={{ textDecoration: 'none', background: '#fff', color: 'var(--primary)', fontSize: 18, padding: '0.75rem 2rem', display: 'inline-block', fontWeight: 700 }}>
              Thanh Toán Ngay →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#fff', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, textAlign: 'center', marginBottom: 48, color: 'var(--foreground)' }}>❓ Câu Hỏi Thường Gặp</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { q: 'Hoàn tiền như thế nào?', a: 'Liên hệ support, chúng tôi hoàn tiền 100% trong 7 ngày không cần lý do.' },
              { q: 'Hỗ trợ trình duyệt nào?', a: 'Chrome, Edge, Opera, Brave. Firefox sắp được hỗ trợ trong tháng tới.' },
              { q: 'Dữ liệu có an toàn?', a: 'Tuyệt đối an toàn. Chúng tôi không bao giờ thu thập hoặc bán dữ liệu người dùng.' },
              { q: 'Cần cập nhật không?', a: 'Không, tất cả cập nhật được tự động cài đặt miễn phí vĩnh viễn.' },
            ].map((item, i) => (
              <details key={i} style={{ background: '#f8fafc', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', cursor: 'pointer', transition: '0.2s' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 24px rgba(30,41,59,0.08)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                <summary style={{ fontWeight: 700, fontSize: 16, color: 'var(--foreground)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', outline: 'none' }}>
                  {item.q}
                  <span style={{ color: '#94a3b8' }}>▼</span>
                </summary>
                <p style={{ color: '#64748b', marginTop: 16, fontSize: 15, lineHeight: 1.6 }}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #1e40af 100%)', color: '#fff', padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 24 }}>Sẵn Sàng Chặn Quảng Cáo?</h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: 32, lineHeight: 1.6 }}>Hơn 100,000 người dùng đang xem video mà không quảng cáo. Hãy tham gia cộng đồng ngay hôm nay!</p>
          <Link href="/buy" className="btn-primary" style={{ textDecoration: 'none', background: '#fff', color: 'var(--primary)', fontSize: 18, padding: '1rem 2.5rem', display: 'inline-block' }}>
            Mua Ngay - 49,000₫ →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1e293b', color: '#cbd5e1', padding: '3rem 2rem 2rem', borderTop: '1px solid #334155' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 32, marginBottom: 32 }}>
            <div>
              <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 16, fontSize: 18 }}>🛡️ AdBlock Pro</h4>
              <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.8 }}>Giải pháp chặn quảng cáo chuyên nghiệp, uy tín và sạch sẽ cho người dùng Việt Nam.</p>
            </div>
            <div>
              <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 16, fontSize: 18 }}>Công Ty</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: 8 }}><a href="#" style={{ color: '#cbd5e1', textDecoration: 'none', transition: '0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}>Về chúng tôi</a></li>
                <li style={{ marginBottom: 8 }}><a href="#" style={{ color: '#cbd5e1', textDecoration: 'none', transition: '0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}>Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 16, fontSize: 18 }}>Hỗ Trợ</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: 8 }}><a href="#" style={{ color: '#cbd5e1', textDecoration: 'none', transition: '0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}>Liên hệ</a></li>
                <li style={{ marginBottom: 8 }}><a href="#" style={{ color: '#cbd5e1', textDecoration: 'none', transition: '0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}>FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 16, fontSize: 18 }}>Pháp Lý</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: 8 }}><a href="#" style={{ color: '#cbd5e1', textDecoration: 'none', transition: '0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}>Điều khoản</a></li>
                <li style={{ marginBottom: 8 }}><a href="#" style={{ color: '#cbd5e1', textDecoration: 'none', transition: '0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}>Quyền riêng tư</a></li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #334155', paddingTop: 24, textAlign: 'center', fontSize: 13, opacity: 0.7 }}>
            <p>© 2025 AdBlock Pro. Uy tín • Sạch sẽ • Hiện đại. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
