import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Share Feedback - Scholarle",
  description:
    "We value your feedback. Share your thoughts, report bugs, or suggest features to help us improve Scholarle - your academic research query builder.",
  keywords: [
    "feedback",
    "bug report",
    "feature request",
    "scholarle support",
    "scholarle feedback",
    "contact us",
    "schrolarle",
  ],
  openGraph: {
    title: "Share Feedback - Scholarle",
    description:
      "Help us improve Scholarle by sharing your feedback and suggestions.",
    url: "https://scholarle.com/feedback",
    type: "website",
    images: [
      {
        url: "https://scholarle.com/feedback-og-image.png",
        width: 1200,
        height: 630,
        alt: "Share Feedback - Scholarle",
      },
    ],
  },
  alternates: {
    canonical: "https://scholarle.com/feedback",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
