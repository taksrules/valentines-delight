import Sidebar from '@/components/dashboard/Sidebar';
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
        {/* Top Bar - Mobile */}
        <div className="lg:hidden sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="text-2xl">💕</div>
            <span className="font-bold text-lg text-neutral-900 dark:text-neutral-100">
              Emotional Moments
            </span>
          </div>
          <ThemeToggle />
        </div>

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
