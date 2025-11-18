import { QueryBuilder } from "../components/QueryBuilder";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scholarle: Designed for Smarter Academic Research",
  description:
    "Discover relevant studies faster through structured field-specific queries. Build Google Scholar searches without syntax knowledge.",
  keywords: [
    "scholarle",
    "google scholar search",
    "academic research",
    "journal search",
    "scholarle articles",
    "scholarly articles",
    "research query builder",
    "schrolarle",
    "google scholar",
    "scholarly search",
    "scholarle search",
  ],
  openGraph: {
    title: "Scholarle - Designed for Smarter Academic Research",
    description:
      "Search Google Scholar with advanced filters without complex syntax.",
    url: "https://scholarle.com",
    type: "website",
    images: [
      {
        url: "https://scholarle.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Scholarle - Designed for Smarter Academic Research",
      },
    ],
  },
  alternates: {
    canonical: "https://scholarle.com",
  },
};

export default function Home() {
  return <QueryBuilder />;
}
