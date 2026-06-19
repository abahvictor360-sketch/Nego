import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import PricingCards from '@/components/Pricing';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Sparkles, Check, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing — Nego Bot',
  description: 'Simple, transparent pricing. Start free. Scale as you grow.',
};

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        {/* Hero */}
        <section className="hero-gradient py-20 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="badge inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-violet-700 mb-4">
              <Sparkles className="w-3.5 h-3.5" /> PRICING
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-4">
              Simple,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500">
                transparent pricing
              </span>
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
              Start free. Scale as you grow. No surprises, no hidden fees.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              {['No credit card required', '100 free negotiations', 'Cancel anytime'].map(item => (
                <span key={item} className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-violet-500" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <PricingCards />

        {/* FAQ strip */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently asked questions</h2>
            <div className="space-y-6">
              {[
                { q: 'What counts as a negotiation?', a: 'Each chat session opened by a customer counts as one negotiation, regardless of outcome.' },
                { q: 'Can I change plans later?', a: 'Yes, you can upgrade or downgrade at any time. Changes take effect at the next billing cycle.' },
                { q: 'Is the floor price truly secure?', a: 'Yes. The floor price is stored server-side and never sent to the AI or the browser. It is enforced on every agreed price before a checkout URL is generated.' },
                { q: 'What payment methods do you accept?', a: 'We accept all major credit cards via Stripe. Enterprise customers can pay by invoice.' },
              ].map(({ q, a }) => (
                <div key={q} className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{q}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA strip */}
        <section className="py-16 px-6 bg-violet-600 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to start closing smarter deals?</h2>
          <p className="text-violet-100 mb-8">Join for free — no credit card required.</p>
          <Link
            href="https://nego-admin.vercel.app/signup"
            className="inline-flex items-center gap-2 bg-white text-violet-600 font-semibold px-8 py-4 rounded-full hover:bg-violet-50 transition-colors shadow-lg"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
