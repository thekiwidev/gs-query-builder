import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Scholarle - Smarter Academic Research",
  description:
    "Learn about Scholarle's mission to democratize access to academic knowledge. Discover how we're making scholarly research easier for everyone.",
  keywords: [
    "about scholarle",
    "scholarle platform",
    "academic research platform",
    "scholarly search tool",
    "research democratization",
    "journal discovery",
    "schrolarle",
    "google scholar alternative",
  ],
  openGraph: {
    title: "About Scholarle - Smarter Academic Research",
    description:
      "Democratizing access to academic knowledge through innovative research tools.",
    url: "https://scholarle.com/about",
    type: "website",
    images: [
      {
        url: "https://scholarle.com/about-og-image.png",
        width: 1200,
        height: 630,
        alt: "About Scholarle - Smarter Academic Research",
      },
    ],
  },
  alternates: {
    canonical: "https://scholarle.com/about",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
