import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });

export const metadata: Metadata = {
  title: 'Nego Bot — AI Price Negotiation for E-Commerce',
  description:
    'Let customers haggle while you always win. Nego Bot is an AI-powered negotiation chatbot that closes deals above your floor price — automatically.',
  openGraph: {
    title: 'Nego Bot — AI Price Negotiation for E-Commerce',
    description: 'AI-powered price negotiation that protects your margins.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} scroll-smooth`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
