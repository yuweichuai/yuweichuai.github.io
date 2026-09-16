import type { Metadata } from "next";
import siteConfig from "../site.config.json";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yuwei Chuai",
  description:
    "Yuwei Chuai — Postdoctoral Researcher at the University of Luxembourg. Research on misinformation, platform governance, and human-AI collaboration.",
  alternates: {
    canonical: siteConfig.siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteConfig.siteUrl,
    siteName: "Yuwei Chuai",
    title,
    description,
    locale: "en_GB",
  },
  twitter: {
    card: "summary",
    title,
    description,
    creator: "@yuweichuai",
  },
  authors: [{ name: "Yuwei Chuai" }],
  keywords: [
    "Yuwei Chuai",
    "misinformation",
    "community fact-checking",
    "computational social science",
    "platform governance",
    "human-AI collaboration",
    "online trust and safety",
  ],
  icons: {
    icon: "./favicon.svg",
    shortcut: "./favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body id="top">{children}</body>
    </html>
  );
}
