import { GeistSans } from 'geist/font/sans';
import { Suspense } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import MobileNav from '@/components/dashboard/MobileNav';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${GeistSans.className} min-h-screen bg-gradient-to-b from-rose-50/30 to-white dark:from-neutral-950 dark:to-neutral-950`}>
      {/* Sidebar - Desktop */}
      <Suspense fallback={<div className="hidden lg:block w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800" />}>
        <Sidebar />
      </Suspense>

      {/* Main Content */}
      <div className="lg:pl-64">
        <MobileNav />

        {/* Page Content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>

      {/* Theme Toggle - Desktop */}
      <div className="hidden lg:block fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
}
