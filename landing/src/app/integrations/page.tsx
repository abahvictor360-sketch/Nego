import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ShoppingCart, ShoppingBag, CreditCard, Store, Code2, ArrowRight, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Integrations',
  description: 'Connect Nego Bot to WooCommerce, Shopify, Stripe, BigCommerce, or any custom stack with a single snippet.',
};

const integrations = [
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    Icon: ShoppingCart,
    blurb: 'Native cart + checkout integration for WordPress stores.',
    points: ['One script tag on any product page', 'HMAC-signed add-to-cart links', 'Honors your existing checkout flow'],
  },
  {
    id: 'shopify',
    name: 'Shopify',
    Icon: ShoppingBag,
    blurb: 'Drop the widget into your theme and start negotiating.',
    points: ['Theme app embed or script tag', 'Works with Shopify Checkout', 'No theme code changes required'],
  },
  {
    id: 'stripe',
    name: 'Stripe',
    Icon: CreditCard,
    blurb: 'Generate a Stripe Checkout session at the agreed price.',
    points: ['Server-side price validation', 'Single-use checkout links', 'Cards, wallets, and more'],
  },
  {
    id: 'bigcommerce',
    name: 'BigCommerce',
    Icon: Store,
    blurb: 'Embed on storefront pages with the universal snippet.',
    points: ['Storefront script embed', 'Cart hand-off support', 'Multi-storefront friendly'],
  },
  {
    id: 'custom-api',
    name: 'Custom API',
    Icon: Code2,
    blurb: 'Point the widget at your own checkout endpoint.',
    points: ['REST API for sessions & messages', 'Configurable checkout redirect', 'Use on any framework or CMS'],
  },
];

export default function IntegrationsPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="hero-gradient py-16 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-3">
              Works with your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-500">stack</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              One lightweight widget, every major platform. Connect in minutes — no migration required.
            </p>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {integrations.map(({ id, name, Icon, blurb, points }) => (
              <div key={id} id={id} className="scroll-mt-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-7 flex flex-col sm:flex-row gap-6">
                <div className="shrink-0">
                  <span className="inline-flex w-14 h-14 rounded-2xl bg-green-50 text-green-600 items-center justify-center">
                    <Icon className="w-7 h-7" />
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{name}</h2>
                  <p className="text-gray-500 mb-4">{blurb}</p>
                  <ul className="grid sm:grid-cols-3 gap-2">
                    {points.map(p => (
                      <li key={p} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 shrink-0" /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 px-6 bg-green-600 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Don&apos;t see your platform?</h2>
          <p className="text-green-100 mb-8">If it runs on the web, Nego Bot works on it. Get started free.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="https://nego-admin.vercel.app/signup" className="inline-flex items-center justify-center gap-2 bg-white text-green-600 font-semibold px-8 py-4 rounded-full hover:bg-green-50 transition-colors shadow-lg">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/how-it-works" className="inline-flex items-center justify-center gap-2 bg-green-500 text-white font-semibold px-8 py-4 rounded-full border border-white/20 hover:bg-green-400 transition-colors">
              See how it works
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
