import type { Metadata } from 'next';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'Pricing - Start Free Forever | Tenderly',
  description: 'Create unlimited romantic journeys for free. Upgrade for premium features. No credit card required to start.',
  openGraph: {
    title: 'Tenderly Pricing',
    description: 'Create unlimited romantic journeys for free',
    url: 'https://tenderly.space/pricing',
    images: [{ url: 'https://tenderly.space/og-image.jpg' }],
  },
};

export default function PricingPage() {
  return (
    <main className="min-h-screen pt-32 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'Tenderly Journey Creator',
            description: 'Create personalized romantic journeys with photos, questions, and memories',
            brand: {
              '@type': 'Brand',
              name: 'Tenderly',
            },
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
              url: 'https://tenderly.space/pricing',
            },
          }),
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
          Everything you need to <span className="text-rose-500">wow</span> them.
        </h1>
        <p className="mt-5 text-xl text-neutral-500 max-w-2xl mx-auto">
          Start for free, upgrade when you're ready for more.
        </p>

        <div className="mt-20 max-w-lg mx-auto grid gap-8 lg:max-w-none lg:grid-cols-3">
          {/* Free Tier */}
          <div className="flex flex-col rounded-3xl shadow-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">Free</h3>
            <p className="mt-4 text-neutral-500 italic">Perfect for small moments</p>
            <p className="mt-8">
              <span className="text-4xl font-extrabold text-neutral-900 dark:text-white">$0</span>
              <span className="text-base font-medium text-neutral-500">/journey</span>
            </p>
            <ul className="mt-8 space-y-4 text-left">
              <li className="flex items-center text-neutral-600 dark:text-neutral-400">
                <span className="text-rose-500 mr-2">✓</span> Unlimited Journeys
              </li>
              <li className="flex items-center text-neutral-600 dark:text-neutral-400">
                <span className="text-rose-500 mr-2">✓</span> Up to 5 Photo Memories
              </li>
              <li className="flex items-center text-neutral-600 dark:text-neutral-400">
                <span className="text-rose-500 mr-2">✓</span> All Music Moods
              </li>
            </ul>
            <button className="mt-12 block w-full bg-rose-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-600 transition-colors">
              Get Started
            </button>
          </div>

          {/* Premium Tier */}
          <div className="flex flex-col rounded-3xl shadow-2xl overflow-hidden border-2 border-rose-500 bg-white dark:bg-neutral-900 p-8 transform scale-105 z-10">
            <div className="bg-rose-500 text-white text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-full self-start mb-4">
              Best Selection
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">Premium</h3>
            <p className="mt-4 text-neutral-500 italic">For those special milestones</p>
            <p className="mt-8">
              <span className="text-4xl font-extrabold text-neutral-900 dark:text-white">$9</span>
              <span className="text-base font-medium text-neutral-500">/journey</span>
            </p>
            <ul className="mt-8 space-y-4 text-left">
              <li className="flex items-center text-neutral-600 dark:text-neutral-400">
                <span className="text-rose-500 mr-2">✓</span> Up to 20 Photo Memories
              </li>
              <li className="flex items-center text-neutral-600 dark:text-neutral-400">
                <span className="text-rose-500 mr-2">✓</span> Custom Music Tracks
              </li>
              <li className="flex items-center text-neutral-600 dark:text-neutral-400">
                <span className="text-rose-500 mr-2">✓</span> Ad-Free Experience
              </li>
              <li className="flex items-center text-neutral-600 dark:text-neutral-400">
                <span className="text-rose-500 mr-2">✓</span> High-Res Photo Storage
              </li>
            </ul>
            <button className="mt-12 block w-full bg-rose-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-600 transition-colors">
              Go Premium
            </button>
          </div>

           {/* Enterprise/Bulk */}
           <div className="flex flex-col rounded-3xl shadow-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">Eternal</h3>
            <p className="mt-4 text-neutral-500 italic">For professional planners</p>
            <p className="mt-8">
              <span className="text-4xl font-extrabold text-neutral-900 dark:text-white">$29</span>
              <span className="text-base font-medium text-neutral-500">/year</span>
            </p>
            <ul className="mt-8 space-y-4 text-left">
              <li className="flex items-center text-neutral-600 dark:text-neutral-400">
                <span className="text-rose-500 mr-2">✓</span> Unlimited Premium Journeys
              </li>
              <li className="flex items-center text-neutral-600 dark:text-neutral-400">
                <span className="text-rose-500 mr-2">✓</span> Priority Support
              </li>
              <li className="flex items-center text-neutral-600 dark:text-neutral-400">
                <span className="text-rose-500 mr-2">✓</span> Exclusive Themes
              </li>
            </ul>
            <button className="mt-12 block w-full border-2 border-rose-500 text-rose-500 font-bold py-3 px-6 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
