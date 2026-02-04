import Container from '@/components/ui/Container';
import LandingNav from '@/components/landing/LandingNav';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | Tenderly',
  description: 'Learn how Tenderly uses cookies to improve your experience.',
};

export default function CookiePolicyPage() {
  const lastUpdated = "February 4, 2026";

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <LandingNav />
      
      <main className="py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Container className="max-w-4xl">
          <div className="space-y-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 tracking-tight">
                Cookie Policy
              </h1>
              <p className="text-xl text-neutral-600 dark:text-neutral-400">
                Last updated: {lastUpdated}
              </p>
            </div>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                What are Cookies?
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and provide a better user experience.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                1. Essential Cookies
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                These cookies are strictly necessary for the Service to function correctly. They handle:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-neutral-700 dark:text-neutral-300">
                <li><strong>Authentication:</strong> Keeping you signed in as you navigate through the dashboard.</li>
                <li><strong>Security:</strong> Protecting your data and preventing unauthorized access.</li>
                <li><strong>Session Management:</strong> Remembering your journey building progress during a single session.</li>
              </ul>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                2. Analytical Cookies
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                These cookies help us understand how users interact with our platform. They track:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-neutral-700 dark:text-neutral-300">
                <li><strong>Usage Patterns:</strong> Which templates are most popular and where users spend the most time.</li>
                <li><strong>Journey Performance:</strong> Anonymous data on how many recipients view and complete a journey.</li>
              </ul>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                This data is aggregated and does not personally identify individuals.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                3. Managing Your Preferences
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                You can control and manage cookies in various ways. You can use our built-in consent banner to toggle non-essential cookies on or off. Additionally, most browsers allow you to block or delete cookies through their settings.
              </p>
            </section>

            <div className="pt-12 border-t border-neutral-200 dark:border-neutral-800">
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                For any questions regarding our use of cookies, please contact us at privacy@tenderly.space.
              </p>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
