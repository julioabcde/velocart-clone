'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/sidebar/Sidebar';
import Header from '@/components/header/HeaderIndex';
import Footer from '@/components/footer/Footer';
import GlobalWrapper from '@/components/global-wrapper/GlobalWrapper';

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password'];

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // Layout untuk halaman public (login, register, dll)
  if (isPublicRoute) {
    return (
      <GlobalWrapper>
        <main className="min-h-screen">{children}</main>
      </GlobalWrapper>
    );
  }

  // Layout untuk halaman authenticated (dengan sidebar, header, footer)
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-x-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto relative">
          <GlobalWrapper>{children}</GlobalWrapper>
        </main>
        <Footer />
      </div>
    </div>
  );
}