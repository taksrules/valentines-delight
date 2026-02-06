import type { Metadata } from 'next';
import HowItWorks from '@/components/landing/HowItWorks';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'How It Works - Create Your Romantic Journey | Tenderly',
  description: 'Learn how to create personalized romantic journeys in 3 simple steps. Build memories, add questions, and share your love story.',
  openGraph: {
    title: 'How Tenderly Works',
    description: 'Create personalized romantic journeys in 3 simple steps',
    url: 'https://tenderly.space/how-it-works',
    images: [{ url: 'https://tenderly.space/og-image.jpg' }],
  },
};

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen pt-20">
      <HowItWorks />
      <Footer />
    </main>
  );
}
