import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nego-landing.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Nego Bot — AI Price Negotiation for E-Commerce',
    template: '%s — Nego Bot',
  },
  description:
    'Let customers haggle while you always win. Nego Bot is an AI-powered negotiation chatbot that closes deals above your floor price — automatically.',
  keywords: ['AI price negotiation', 'e-commerce chatbot', 'dynamic pricing', 'haggle', 'Nego Bot'],
  openGraph: {
    title: 'Nego Bot — AI Price Negotiation for E-Commerce',
    description: 'AI-powered price negotiation that protects your margins.',
    type: 'website',
    siteName: 'Nego Bot',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nego Bot — AI Price Negotiation for E-Commerce',
    description: 'AI-powered price negotiation that protects your margins.',
  },
};

export const viewport: Viewport = {
  themeColor: '#7c3aed',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} scroll-smooth`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
