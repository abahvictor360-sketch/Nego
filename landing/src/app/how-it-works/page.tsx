import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Icon from '@/components/Icon';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/content';
import {
  Sparkles, ArrowRight, ShieldCheck, Lock, KeyRound, Globe, Smartphone, QrCode, ChevronDown,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'How It Works',
  description:
    'See exactly how Nego Bot negotiates with your customers, protects your floor price, and closes deals — plus answers to the most common questions.',
};

const guarantees = [
  { Icon: Lock, title: 'Never exposed', text: 'Your floor price lives only in our database. It is never sent to the AI prompt or the browser, so it cannot leak.' },
  { Icon: ShieldCheck, title: 'Server-side enforced', text: 'Every "deal agreed" response is re-validated against the floor before a checkout link is created. Below-floor prices are auto-corrected.' },
  { Icon: KeyRound, title: 'Tamper-proof checkout', text: 'Checkout URLs are HMAC-signed, so the agreed price cannot be edited in transit.' },
];

const channels = [
  { Icon: Globe, title: 'Web', text: 'Drop the script tag on any product page — WooCommerce, Shopify, or custom.' },
  { Icon: Smartphone, title: 'Mobile', text: 'The same widget powers your mobile site or in-app web views.' },
  { Icon: QrCode, title: 'In-store QR', text: 'Print a QR code so shoppers can negotiate on their phone, right in your store.' },
];

const faqs = [
  {
    q: 'What exactly is Nego Bot?',
    a: 'Nego Bot is an AI sales agent that negotiates prices with your customers in real time. It anchors high, concedes strategically, and closes deals — all while staying above a floor price only you can see.',
  },
  {
    q: 'How does the AI know when to stop discounting?',
    a: 'You set a public list price and a private floor price per product. The AI never sees the floor. The backend independently checks every agreed price against it, so the bot can be persuasive without ever going too low.',
  },
  {
    q: 'Is my floor price really safe from prompt injection?',
    a: 'Yes. Because the floor is never placed in the prompt, there is nothing for a malicious customer to extract or override. Even if someone tricks the model into "agreeing" to a low price, the server rejects and corrects it before any checkout link is issued.',
  },
  {
    q: 'Do I need any coding skills to install it?',
    a: 'No. You copy one stylesheet link, one div with your product ID and API key, and one script tag onto your page. The widget mounts itself and starts negotiating — no build step required.',
  },
  {
    q: 'Which platforms and payment methods are supported?',
    a: 'The widget works on any website. Checkout integrates natively with WooCommerce and Stripe, and you can point it at a custom checkout endpoint for other stacks.',
  },
  {
    q: 'What happens when a customer and the bot agree on a price?',
    a: 'The backend generates a signed, single-use checkout URL at the agreed price and the widget redirects the shopper to complete the purchase.',
  },
  {
    q: 'Can I customize how the bot looks and behaves?',
    a: 'Yes — set a custom accent color via a data attribute, and on higher plans you can tune the negotiation persona. The chat UI matches your brand out of the box.',
  },
  {
    q: 'How much does it cost?',
    a: 'There is a free tier to get started, with paid plans that unlock unlimited negotiations, multi-channel, and advanced analytics. See the pricing page for full details.',
  },
];

export default async function HowItWorksPage() {
  const { how_it_works } = await getSiteContent();

  return (
    <>
      <Nav />
      <main className="pt-16">
        {/* Header */}
        <section className="hero-gradient py-16 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="badge inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-green-700 mb-4">
              <Sparkles className="w-3.5 h-3.5" /> HOW IT WORKS
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-4">
              From price objection to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-500">
                closed deal.
              </span>
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Nego Bot turns hesitant browsers into buyers by letting them haggle — while quietly
              protecting every cent of your margin. Here is exactly how.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="space-y-6">
              {how_it_works.steps.map((step, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-5 bg-white rounded-2xl border border-gray-100 p-7 shadow-sm">
                  <div className="shrink-0 flex sm:flex-col items-center sm:items-start gap-3">
                    <span className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                      <Icon name={step.icon} className="w-6 h-6" />
                    </span>
                    <span className="text-3xl font-bold text-gray-200">{step.n}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Floor price guard */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-3">
                The Floor Price Guard
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                The core of Nego Bot is a security layer. The AI is persuasive, but it can never give
                away your margin — here is why.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {guarantees.map(({ Icon: G, title, text }) => (
                <div key={title} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <span className="inline-flex w-11 h-11 rounded-xl bg-green-50 text-green-600 items-center justify-center mb-4">
                    <G className="w-5 h-5" />
                  </span>
                  <h3 className="font-bold text-gray-900 mb-1.5">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Channels */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-3">
                One bot, every channel
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Negotiate wherever your customers are — online, on mobile, or in your physical store.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {channels.map(({ Icon: C, title, text }) => (
                <div key={title} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm text-center">
                  <span className="inline-flex w-12 h-12 rounded-xl bg-green-50 text-green-600 items-center justify-center mb-4">
                    <C className="w-6 h-6" />
                  </span>
                  <h3 className="font-bold text-gray-900 mb-1.5">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Embed snippet */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-3">
                Install in under a minute
              </h2>
              <p className="text-gray-500">
                Add your product, then paste this onto any page. Replace the placeholders with the
                values from your dashboard.
              </p>
            </div>
            <div className="bg-gray-900 rounded-2xl p-6 overflow-x-auto">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-yellow-500" /><div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-xs text-gray-500 font-mono">embed.html</span>
              </div>
              <pre className="text-sm text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">{`<link rel="stylesheet" href="https://nego-5ykj.onrender.com/nego-widget.css" />
<div
  data-nego-product="<your-product-id>"
  data-nego-api-key="<your-api-key>"
  data-nego-api-url="https://nego-5ykj.onrender.com"
></div>
<script src="https://nego-5ykj.onrender.com/nego-widget.umd.js"></script>`}</pre>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 text-center mb-12">
              Frequently asked questions
            </h2>
            <div className="space-y-3">
              {faqs.map(({ q, a }) => (
                <details key={q} className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-4 font-semibold text-gray-900">
                    {q}
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="px-6 pb-5 -mt-1 text-sm text-gray-500 leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA strip */}
        <section className="py-16 px-6 bg-green-600 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to let AI close deals for you?</h2>
          <p className="text-green-100 mb-8">Start free — no credit card required.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="https://nego-admin.vercel.app/signup"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-600 font-semibold px-8 py-4 rounded-full hover:bg-green-50 transition-colors shadow-lg"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 bg-green-500 text-white font-semibold px-8 py-4 rounded-full border border-white/20 hover:bg-green-400 transition-colors"
            >
              Try the live demo
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
