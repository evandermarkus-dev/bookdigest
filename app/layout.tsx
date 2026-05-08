import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import PlausibleProvider from "next-plausible";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const SITE_URL = 'https://bookdigest.se'
const SITE_NAME = 'BookDigest'
const SITE_DESCRIPTION =
  'AI-powered book summarization — upload any PDF book or research paper and get an executive summary, study guide, or action plan in minutes. Powered by Claude AI. Free to start.'

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/opengraph-image` },
  description: 'AI-powered book and PDF summarization tool. Upload any PDF and get a personalized summary in minutes, powered by Claude AI.',
}

const webAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': `${SITE_URL}/#webapp`,
  name: SITE_NAME,
  url: SITE_URL,
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web',
  description: SITE_DESCRIPTION,
  offers: [
    { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'SEK', description: '3 AI summaries per month' },
    { '@type': 'Offer', name: 'Reader', price: '79', priceCurrency: 'SEK', description: '20 AI summaries per month, all styles' },
    { '@type': 'Offer', name: 'Pro', price: '149', priceCurrency: 'SEK', description: 'Unlimited AI summaries, all features' },
  ],
  featureList: [
    'AI book summarization', 'PDF summarization', 'Personalized summaries',
    'Executive summary', 'Study guide', 'Action plan', 'Knowledge base',
    'Research paper analysis', 'Page citations', 'Markdown export', 'PDF export', 'Chat with summary',
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — AI Book Summarization`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'AI book summary', 'PDF summarization', 'book summary app', 'AI reading assistant',
    'book digest', 'summarize PDF with AI', 'executive book summary', 'study guide generator',
    'research paper summary', 'non-fiction summary', 'personalized book summary', 'Claude AI',
    'boksammanfattning AI', 'sammanfatta PDF', 'AI läsassistent',
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <PlausibleProvider domain="bookdigest.se" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
