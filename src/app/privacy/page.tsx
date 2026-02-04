import Container from '@/components/ui/Container';
import LandingNav from '@/components/landing/LandingNav';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Tenderly',
  description: 'How we protect your emotional moments and personal data.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <LandingNav />
      
      <main className="py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Container className="max-w-4xl">
          <div className="space-y-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-xl text-neutral-600 dark:text-neutral-400">
                Last updated: February 4, 2026
              </p>
            </div>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                Our Commitment to Your Moments
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Tenderly is designed to help you create and share deeply personal experiences. We understand the sensitive nature of these "Emotional Moments" and are committed to protecting the privacy of both creators and recipients.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                1. Data Collection
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                To provide our service, we collect the following information:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-neutral-700 dark:text-neutral-300">
                <li><strong>Creator Information:</strong> Name and email address used for account creation and authentication.</li>
                <li><strong>Journey Content:</strong> Recipient names, custom questions, and text-based acknowledgments you craft.</li>
                <li><strong>Uploaded Photos:</strong> Images you choose to include in your journey.</li>
              </ul>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                2. Image Processing & Storage
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                When you upload photos to Tenderly, we generate optimized web versions and thumbnails to ensure a smooth experience for your recipient. 
                These images are stored in secure, private buckets via Supabase Storage and are only accessible via the unique, obfuscated URL generated for your journey.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                3. Analytics & Interaction Tracking
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                We track interactions within a journey to provide feedback to the creator. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-neutral-700 dark:text-neutral-300">
                <li><strong>Engagement:</strong> "YES/NO" clicks, question completion rates, and views.</li>
                <li><strong>Timing:</strong> General time spent on questions to help us improve the pacing of our templates.</li>
              </ul>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                This data is primarily used to populate the creator's dashboard and is not sold to third parties.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                4. Data Retention & Deletion
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Creators have full control over their content:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-neutral-700 dark:text-neutral-300">
                <li><strong>Soft Delete:</strong> You can "Soft Delete" a journey, which immediately makes it inaccessible to the recipient.</li>
                <li><strong>Permanent Deletion:</strong> Upon permanent deletion request, all associated photos and text content are removed from our active databases within 30 days.</li>
              </ul>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                5. Cookies
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                We use essential cookies for authentication (keeping you logged in) and analytical cookies to track journey performance for creators. 
                You can manage your cookie preferences through the banner on our landing page.
              </p>
            </section>

            <div className="pt-12 border-t border-neutral-200 dark:border-neutral-800">
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                If you have any questions about this Privacy Policy, please contact us at support@tenderly.space.
              </p>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
