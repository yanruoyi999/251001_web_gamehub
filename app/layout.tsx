import type { Metadata } from 'next';
import './globals.css';
import { defaultLocale } from '@/i18n/config';

export const metadata: Metadata = {
  title: '游戏聚合站',
  description: 'A comprehensive game aggregation platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultLocale}>
      <body className="font-sans antialiased bg-white text-gray-900">{children}</body>
    </html>
  );
}
