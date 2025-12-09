import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../../styles/globals.css';
import HeaderNav from '@/components/HeaderNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AdBlock Pro - Chặn 100% Quảng Cáo YouTube & Facebook',
  description: 'Extension mạnh mẽ nhất 2025 - Xóa tất cả quảng cáo, không làm chậm tốc độ, hoàn toàn an toàn',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className} style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <HeaderNav />
          <main style={{ flex: 1 }}>{children}</main>
        </div>
      </body>
    </html>
  );
}
