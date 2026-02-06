import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'See a Demo - Experience a Tenderly Journey',
  description: 'See how Tenderly works with our interactive demo. Experience the recipient\'s journey in 3 minutes.',
  openGraph: {
    title: 'Tenderly Demo',
    description: 'Experience an interactive romantic journey',
    url: 'https://tenderly.space/demo',
    images: [{ url: 'https://tenderly.space/og-image.jpg' }],
  },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
