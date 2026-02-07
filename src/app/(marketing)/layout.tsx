import type { Metadata } from "next";
import LandingNav from "@/components/landing/LandingNav";

export const metadata: Metadata = {
  title: "Emotional Moments Platform - Turn Your Love Story Into An Unforgettable Journey",
  description: "Create personalized, interactive experiences that guide them through your memories before asking the big question. Perfect for Valentine's Day, proposals, and special moments.",
};

import { GeistSans } from 'geist/font/sans';

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={GeistSans.className}>
      <LandingNav />
      {children}
    </div>
  );
}
