import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AntdRegistry from './AntdRegistry';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TimeTrack Pro Admin Dashboard',
  description: 'Admin dashboard for managing timesheets and users',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          {children}
        </AntdRegistry>
      </body>
    </html>
  );
}