import type { Metadata } from 'next';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import Features from '@/components/landing/Features';
import Testimonials from '@/components/landing/Testimonials';
import FinalCTA from '@/components/landing/FinalCTA';

export const metadata: Metadata = {
  title: 'Emotional Moments - Turn Your Love Story Into An Unforgettable Journey',
  description: 'Create a personalized, interactive experience that guides them through your memories before asking the big question. Perfect for Valentine\'s Day, proposals, and special moments.',
  keywords: ['valentine', 'proposal', 'romantic', 'love story', 'digital experience', 'personalized journey'],
  openGraph: {
    title: 'Emotional Moments - Turn Your Love Story Into An Unforgettable Journey',
    description: 'Create a personalized, interactive experience that guides them through your memories before asking the big question.',
    type: 'website',
    url: 'https://emotionalmoments.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emotional Moments - Turn Your Love Story Into An Unforgettable Journey',
    description: 'Create a personalized, interactive experience for your special someone.',
  }
};

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />
      <Features />
      <Testimonials />
      <FinalCTA />
    </main>
  );
}
