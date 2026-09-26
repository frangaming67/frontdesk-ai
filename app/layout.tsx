import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { cookies } from "next/headers";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import { LANGUAGE_COOKIE, parseLocale } from "@/lib/i18n/types";
import { getSiteUrl, siteDescription, siteTitle } from "@/lib/site";
import { branding } from "@/lib/branding";
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
  applicationName: branding.name,
  openGraph: {
    type: "website",
    locale: branding.openGraphLocale,
    alternateLocale: "en_US",
    siteName: branding.name,
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [{ url: "/opengraph-image", alt: `${branding.name} — Demo para consultorios odontológicos.` }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = parseLocale((await cookies()).get(LANGUAGE_COOKIE)?.value);
  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body className={`${fraunces.variable} ${inter.variable} antialiased`}>
        <LanguageProvider initialLocale={locale}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
