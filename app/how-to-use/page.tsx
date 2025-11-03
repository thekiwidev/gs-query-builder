import { HowToUsePage } from "@/components/help/HowToUsePage";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Use Scholarle - Complete Guide",
  description:
    "Comprehensive guide to building advanced Google Scholar search queries with Scholarle. Learn field selection, Boolean operators, and search techniques.",
  keywords: [
    "how to use",
    "guide",
    "tutorial",
    "search guide",
    "scholarle help",
    "scholarle tutorial",
    "query builder tutorial",
    "schrolarle",
    "google scholar guide",
  ],
  openGraph: {
    title: "How to Use Scholarle - Complete Guide",
    description:
      "Master advanced scholarly searches with our comprehensive guide.",
    url: "https://scholarle.com/how-to-use",
    type: "website",
    images: [
      {
        url: "https://scholarle.com/htu-og-image.png",
        width: 1200,
        height: 630,
        alt: "How to Use Scholarle - Complete Guide",
      },
    ],
  },
  alternates: {
    canonical: "https://scholarle.com/how-to-use",
  },
};

const HowToUse = () => {
  return <HowToUsePage />;
};

export default HowToUse;
