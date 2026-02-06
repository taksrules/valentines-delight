import type { Metadata } from 'next';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import Features from '@/components/landing/Features';
import TrustBuilders from '@/components/landing/TrustBuilders';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'Tenderly - Turn Your Love Story Into An Unforgettable Journey',
  description: 'Create personalized, interactive romantic experiences for proposals, Valentine\'s Day, and anniversaries. Build your moment in 5 minutes - no credit card required.',
  keywords: ['romantic journey', 'digital proposal', 'valentine gift', 'anniversary surprise', 'interactive love story'],
  openGraph: {
    title: 'Tenderly - Create Unforgettable Romantic Moments',
    description: 'Interactive journeys for proposals, Valentine\'s Day, and special moments. Share your love story in a beautiful way.',
    url: 'https://tenderly.space',
    siteName: 'Tenderly',
    images: [
      {
        url: 'https://tenderly.space/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tenderly - Create Romantic Journeys',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tenderly - Create Unforgettable Romantic Moments',
    description: 'Interactive journeys for proposals, Valentine\'s Day, and special moments.',
    images: ['https://tenderly.space/twitter-card.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />
      <Features />
      <TrustBuilders />
      <FinalCTA />
      <Footer />
    </main>
  );
}
