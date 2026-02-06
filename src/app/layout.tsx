import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/components/Providers";
import NextTopLoader from 'nextjs-toploader';
import CookieConsent from '@/components/ui/CookieConsent';
import { Toaster } from 'sonner';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Tenderly 💕",
  description: "Capture and share your most beautiful memories in an interactive journey.",
  icons: {
    icon: [
      { url: "/images/favicon.png", sizes: "any" },
      { url: "/images/favicon.png", sizes: "512x512", type: "image/png" },
      { url: "/images/favicon.png", sizes: "192x192", type: "image/png" },
      { url: "/images/favicon.png", sizes: "96x96", type: "image/png" },
      { url: "/images/favicon.png", sizes: "64x64", type: "image/png" },
      { url: "/images/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/images/favicon.png",
    apple: [
      { url: "/images/favicon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-cream-50 text-neutral-700 dark:bg-neutral-950 dark:text-neutral-200 transition-colors duration-300`}
      >
        <NextTopLoader 
          color="#f43f5e"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #f43f5e,0 0 5px #f43f5e"
        />
        <Providers>{children}</Providers>
        <CookieConsent />
        <Toaster 
          position="top-center"
          theme="dark"
          richColors
          closeButton
          expand={false}
          toastOptions={{
            style: {
              background: '#1a1a1a',
              border: '1px solid #2d2d2d',
              borderRadius: '12px',
              color: 'white',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            }
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Tenderly',
              url: 'https://tenderly.space',
              logo: 'https://tenderly.space/logo.png',
              description: 'Platform for creating interactive romantic experiences',
              sameAs: [
                'https://twitter.com/tenderly',
                'https://instagram.com/tenderly',
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
