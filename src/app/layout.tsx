import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AdBlock Pro - Chặn 100% Quảng Cáo YouTube & Facebook',
  description: 'Extension mạnh mẽ nhất 2025 - Xóa tất cả quảng cáo, không làm chậm tốc độ, hoàn toàn an toàn',
};

function AuthNav() {
  'use client';
  return null; // Will be replaced with client component
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className} style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {/* Top bar branding */}
          <header style={{ width: '100%', background: 'var(--primary)', color: '#fff', boxShadow: '0 2px 8px rgba(30,41,59,0.08)', padding: '0.75rem 0' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: 1 }}>AdBlock Pro</span>
                <span style={{ fontSize: 14, opacity: 0.8 }}>Chặn 100% Quảng Cáo YouTube & Facebook</span>
              </div>
              <a href="/buy" className="btn-primary" style={{ textDecoration: 'none' }}>Mua Ngay</a>
            </div>
          </header>
          <main style={{ flex: 1 }}>{children}</main>
        </div>
      </body>
    </html>
  );
}
