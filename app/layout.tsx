import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { getSiteUrl, siteDescription, siteTitle } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: siteTitle,
  description: siteDescription,
  applicationName: "FrontDesk AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "FrontDesk AI",
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [{ url: "/opengraph-image", alt: "FrontDesk AI — A new patient inquiry becomes a consultation request." }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${fraunces.variable} ${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
