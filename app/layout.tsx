import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Scholarle - Designed for Smarter Academic Research",
  description:
    "Build complex academic search queries with ease. Translate simple search criteria into advanced Google Scholar queries without learning syntax.",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  keywords: [
    "scholarle",
    "Scholarle",
    "schrolarle",
    "google scholar",
    "scholarle search",
    "academic research",
    "research query builder",
    "journal search",
    "google schoolar",
    "google scolar",
    "scholarle",
    "academic database",
    "research papers",
    "scholarle articles",
    "journal finder",
    "literature review",
    "citation search",
  ],
  authors: [{ name: "Scholarle Team" }],
  creator: "Scholarle",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://scholarle.com",
    siteName: "Scholarle",
    title: "Scholarle - Designed for Smarter Academic Research",
    description:
      "Build complex academic search queries with ease. No syntax knowledge required.",
    images: [
      {
        url: "https://scholarle.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Scholarle - Designed for Smarter Academic Research",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Scholarle - Designed for Smarter Academic Research",
    description: "Build complex academic search queries with ease.",
  },
  alternates: {
    canonical: "https://scholarle.com",
  },
  applicationName: "Scholarle",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Scholarle",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
        <Analytics />
        <GoogleAnalytics gaId="G-EHWHV6MB45" />
      </body>
    </html>
  );
}
