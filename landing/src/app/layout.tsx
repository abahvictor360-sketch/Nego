import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nego-landing.vercel.app';

const DEFAULT_TITLE = 'Nego Bot — AI Price Negotiation for E-Commerce';
const DEFAULT_DESCRIPTION =
  'Let customers haggle while you always win. Nego Bot is an AI-powered negotiation chatbot that closes deals above your floor price — automatically.';

interface SeoContent {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

// Pull admin-managed SEO from the backend CMS; fall back to sensible defaults.
async function getSeo(): Promise<SeoContent> {
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001';
  try {
    const res = await fetch(`${backend}/api/content`, { next: { revalidate: 60 } });
    if (!res.ok) return {};
    const data = await res.json();
    return (data?.seo as SeoContent) ?? {};
  } catch {
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo();
  const title = seo.title || DEFAULT_TITLE;
  const description = seo.description || DEFAULT_DESCRIPTION;
  const keywords = seo.keywords
    ? seo.keywords.split(',').map(k => k.trim()).filter(Boolean)
    : ['AI price negotiation', 'e-commerce chatbot', 'dynamic pricing', 'haggle', 'Nego Bot'];

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: '%s — Nego Bot' },
    description,
    keywords,
    alternates: seo.canonical ? { canonical: seo.canonical } : undefined,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'Nego Bot',
      url: seo.canonical || SITE_URL,
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#14532d',
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
