import Container from '@/components/ui/Container';
import LandingNav from '@/components/landing/LandingNav';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Tenderly',
  description: 'The terms and conditions for using Tenderly to create emotional moments.',
};

export default function TermsPage() {
  const lastUpdated = "February 4, 2026";

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <LandingNav />
      
      <main className="py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Container className="max-w-4xl">
          <div className="space-y-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 tracking-tight">
                Terms of Service
              </h1>
              <p className="text-xl text-neutral-600 dark:text-neutral-400">
                Last updated: {lastUpdated}
              </p>
            </div>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                1. Acceptance of Terms
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                By accessing or using Tenderly ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                2. Use of the Service
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Tenderly is a platform for creating personalized, interactive "Emotional Moments." You are responsible for all content you upload and share. You agree not to use the Service for any unlawful purpose or to share content that is harmful, offensive, or violates the rights of others.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                3. User Accounts
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                To create and save journeys, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                4. Intellectual Property
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                You retain all rights to the photos and text you upload. By using the Service, you grant Tenderly a limited, non-exclusive license to host, store, and display your content solely for the purpose of providing the Service to you and your chosen recipients.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                5. Limitation of Liability
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Tenderly is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the Service or any content shared through it.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                6. Changes to Terms
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                We may update these terms from time to time. We will notify users of any significant changes by posting the new terms on this page.
              </p>
            </section>

            <div className="pt-12 border-t border-neutral-200 dark:border-neutral-800">
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                If you have any questions about these Terms of Service, please contact us at legal@tenderly.space.
              </p>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
