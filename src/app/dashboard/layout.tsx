import Sidebar from '@/components/dashboard/Sidebar';
import MobileNav from '@/components/dashboard/MobileNav';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/30 to-white dark:from-neutral-950 dark:to-neutral-950">
      {/* Sidebar - Desktop */}
      <Sidebar />

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
