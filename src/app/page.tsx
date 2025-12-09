'use client';

import Link from 'next/link';
import { Lock, Zap, CheckCircle, Shield, Headphones, Award } from 'lucide-react';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      {/* Hero Section */}
      <section style={{ padding: '5rem 1.5rem 4rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 20% 50%, rgba(120,119,198,0.3), transparent 50%), radial-gradient(circle at 80% 80%, rgba(99,102,241,0.3), transparent 50%)', pointerEvents: 'none' }}></div>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '3.25rem', fontWeight: 900, color: '#fff', marginBottom: 20, lineHeight: 1.15, textShadow: '0 2px 20px rgba(0,0,0,0.15)' }}>
            Xem Video <span style={{ background: 'linear-gradient(120deg, #fbbf24 0%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Sạch Sẽ</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.95)', marginBottom: 32, maxWidth: 640, margin: '0 auto 32px', lineHeight: 1.6 }}>
            Tiện ích chặn quảng cáo mạnh mẽ nhất cho YouTube, Facebook và web. Nhanh, an toàn, 100% riêng tư.
          </p>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 16, justifyContent: 'center', marginBottom: 40, flexWrap: 'wrap' }}>
            <Link href="/buy" style={{ textDecoration: 'none', fontSize: 17, padding: '1rem 2.5rem', fontWeight: 700, background: '#fff', color: '#667eea', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', transition: 'transform 0.2s, box-shadow 0.2s', display: 'inline-block' }}>
              🎁 Mua Ngay - 49,000₫
            </Link>
            <Link href="#features" style={{ textDecoration: 'none', fontSize: 17, padding: '1rem 2.5rem', fontWeight: 700, background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 12, border: '2px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)', display: 'inline-block' }}>
              ▶ Xem Demo
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginTop: 32 }}>
            <div style={{ padding: '1.75rem 1.25rem', background: 'rgba(255,255,255,0.95)', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)' }}>
              <Shield style={{ color: '#667eea', width: 32, height: 32, marginBottom: 12 }} />
              <div style={{ fontWeight: 700, fontSize: 17, color: '#1e293b', marginBottom: 4 }}>Bảo mật</div>
              <div style={{ color: '#64748b', fontSize: 14 }}>Không lưu dữ liệu</div>
            </div>
            <div style={{ padding: '1.75rem 1.25rem', background: 'rgba(255,255,255,0.95)', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)' }}>
              <Zap style={{ color: '#f59e0b', width: 32, height: 32, marginBottom: 12 }} />
              <div style={{ fontWeight: 700, fontSize: 17, color: '#1e293b', marginBottom: 4 }}>Tốc độ</div>
              <div style={{ color: '#64748b', fontSize: 14 }}>Không làm chậm</div>
            </div>
            <div style={{ padding: '1.75rem 1.25rem', background: 'rgba(255,255,255,0.95)', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)' }}>
              <CheckCircle style={{ color: '#10b981', width: 32, height: 32, marginBottom: 12 }} />
              <div style={{ fontWeight: 700, fontSize: 17, color: '#1e293b', marginBottom: 4 }}>Hiệu quả</div>
              <div style={{ color: '#64748b', fontSize: 14 }}>Chặn 99.9%</div>
            </div>
          </div>
        </div>
      </section>
      {/* ...các phần khác giữ nguyên... */}

      {/* Stats */}
      <section style={{ background: '#fff', color: 'var(--foreground)', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 24, textAlign: 'center' }}>
            <div style={{ padding: '2rem 1.5rem', borderRadius: 16, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', boxShadow: '0 8px 24px rgba(102,126,234,0.25)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 8, color: '#fff' }}>100K+</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>Người mua</div>
            </div>
            <div style={{ padding: '2rem 1.5rem', borderRadius: 16, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', boxShadow: '0 8px 24px rgba(240,147,251,0.25)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 8, color: '#fff' }}>99.9%</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>Chặn quảng cáo</div>
            </div>
            <div style={{ padding: '2rem 1.5rem', borderRadius: 16, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', boxShadow: '0 8px 24px rgba(79,172,254,0.25)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 8, color: '#fff' }}>60%</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>Tải nhanh hơn</div>
            </div>
            <div style={{ padding: '2rem 1.5rem', borderRadius: 16, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', boxShadow: '0 8px 24px rgba(250,112,154,0.25)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 8, color: '#fff' }}>5★</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>Đánh giá</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '4rem 1.5rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 900, textAlign: 'center', marginBottom: 48, color: '#1e293b' }}>Tính Năng Nổi Bật</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { icon: Zap, title: 'Siêu Nhanh', desc: 'Không làm chậm trình duyệt' },
              { icon: Lock, title: 'An Toàn', desc: 'Bảo vệ quyền riêng tư' },
              { icon: Headphones, title: 'Hỗ Trợ 24/7', desc: 'Tiếng Việt sẵn sàng' },
              { icon: Award, title: 'Trọn Đời', desc: 'Mua 1 lần dùng vĩnh viễn' },
            ].map((item, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: '1.25rem 1rem', borderRadius: 12 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, background: 'var(--primary)', borderRadius: '50%', marginBottom: 12 }}>
                  <item.icon style={{ width: 32, height: 32, color: '#fff' }} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 14, color: 'var(--foreground)', marginBottom: 6 }}>{item.title}</h3>
                <p style={{ color: '#64748b', fontSize: 12, lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section style={{ background: '#fff', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, textAlign: 'center', marginBottom: 24, color: 'var(--foreground)' }}>⚖️ So Sánh</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '2px solid #fecaca', boxShadow: '0 2px 8px rgba(30,41,59,0.04)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: 16 }}>❌ Không AdBlock</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {['Quảng cáo che màn hình', 'Chờ 5-15s', 'Âm thanh khó chịu', 'Trang tải chậm'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, color: '#475569', marginBottom: 10, fontSize: 13 }}>
                    <span style={{ color: 'var(--danger)', fontWeight: 700, flexShrink: 0 }}>✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '2px solid #bbf7d0', boxShadow: '0 2px 8px rgba(30,41,59,0.04)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: 16 }}>✅ Có AdBlock Pro</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {['Không quảng cáo', 'Xem ngay', 'Yên tĩnh', 'Tải nhanh 60%'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, color: '#475569', marginBottom: 10, fontSize: 13 }}>
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
      <section style={{ padding: '2rem 1.5rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, textAlign: 'center', marginBottom: 24, color: 'var(--foreground)' }}>💰 Giá Cả</h2>
          <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #1e40af 100%)', color: '#fff', borderRadius: 16, padding: 32, textAlign: 'center', boxShadow: '0 10px 30px rgba(37, 99, 235, 0.15)' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: 8 }}>49,000₫</div>
            <p style={{ fontSize: '0.95rem', opacity: 0.9, marginBottom: 20, lineHeight: 1.5 }}>Mua 1 lần, dùng vĩnh viễn</p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24, textAlign: 'left', maxWidth: 300, margin: '0 auto 20px' }}>
              {['✓ Chặn 99.9% quảng cáo', '✓ Cập nhật miễn phí', '✓ Hoàn tiền 7 ngày', '✓ Hỗ trợ 24/7 Tiếng Việt'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, fontSize: 14 }}>
                  <span style={{ color: 'var(--success)', fontWeight: 700 }}>◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontSize: 13, fontWeight: 600 }}>
              🔥 Hơn 100,000 người đã mua • 5★ Đánh giá
            </div>
            <Link href="/buy" className="btn-primary" style={{ textDecoration: 'none', background: '#fff', color: 'var(--primary)', fontSize: 16, padding: '0.7rem 2rem', display: 'inline-block', fontWeight: 700, boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}>
              💰 Mua Ngay - 49K₫
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
      <section style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #1e40af 100%)', color: '#fff', padding: '2.5rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', transform: 'translate(50%, -50%)' }}></div>
        <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🚀</div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 12 }}>Sẵn Sàng Chặn Quảng Cáo?</h2>
          <p style={{ fontSize: '0.95rem', opacity: 0.95, marginBottom: 20, lineHeight: 1.5, fontWeight: 500 }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: 4, display: 'inline-block', marginRight: 8 }}>⏰ Chỉ 49,000₫</span>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: 4, display: 'inline-block' }}>♾️ Dùng Vĩnh Viễn</span>
          </p>
          <Link href="/buy" className="btn-primary" style={{ textDecoration: 'none', background: '#fff', color: 'var(--primary)', fontSize: 16, padding: '0.7rem 2.5rem', display: 'inline-block', fontWeight: 700, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
            ⭐ Mua Ngay Với Hoàn Tiền 7 Ngày
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#f1f5f9', color: '#475569', padding: '2rem 1.5rem', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 20 }}>
            <div>
              <h4 style={{ color: 'var(--foreground)', fontWeight: 700, marginBottom: 12, fontSize: 15 }}>🛡️ AdBlock Pro</h4>
              <p style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.8 }}>Chặn quảng cáo chuyên nghiệp, uy tín và sạch sẽ.</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--foreground)', fontWeight: 700, marginBottom: 12, fontSize: 15 }}>Công Ty</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: 6 }}><a href="#" style={{ color: '#475569', textDecoration: 'none', fontSize: 13 }} onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--primary)'} onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.color = '#475569'}>Về chúng tôi</a></li>
                <li><a href="#" style={{ color: '#475569', textDecoration: 'none', fontSize: 13 }} onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--primary)'} onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.color = '#475569'}>Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'var(--foreground)', fontWeight: 700, marginBottom: 12, fontSize: 15 }}>Hỗ Trợ</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: 6 }}><Link href="/dashboard" style={{ color: '#475569', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--primary)'} onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.color = '#475569'}>Dashboard</Link></li>
                <li style={{ marginBottom: 6 }}><Link href="/auth/login" style={{ color: '#475569', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--primary)'} onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.color = '#475569'}>Đăng nhập</Link></li>
                <li><Link href="/auth/register" style={{ color: '#475569', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--primary)'} onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.color = '#475569'}>Đăng ký</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'var(--foreground)', fontWeight: 700, marginBottom: 12, fontSize: 15 }}>Pháp Lý</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: 6 }}><a href="#" style={{ color: '#475569', textDecoration: 'none', fontSize: 13 }} onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--primary)'} onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.color = '#475569'}>Điều khoản</a></li>
                <li><a href="#" style={{ color: '#475569', textDecoration: 'none', fontSize: 13 }} onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--primary)'} onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.color = '#475569'}>Quyền riêng tư</a></li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16, textAlign: 'center', fontSize: 12, opacity: 0.7 }}>
            <p>© 2025 AdBlock Pro. Uy tín • Sạch sẽ • Hiện đại</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
