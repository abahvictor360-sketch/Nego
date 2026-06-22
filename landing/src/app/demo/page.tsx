import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Demo from '@/components/Demo';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Bot } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Live Demo',
  description: 'Negotiate with Max, the Nego Bot AI, in a real live demo — and watch the floor-price guard in action.',
};

const points = [
  { Icon: Bot, title: 'Real AI negotiation', text: 'Max counters, defends value, and closes — powered by the same engine merchants use.' },
  { Icon: ShieldCheck, title: 'Floor price protected', text: 'Try to lowball him. The hidden floor price is enforced server-side and never given up.' },
  { Icon: Zap, title: 'Instant checkout', text: 'Reach a deal and the bot generates a signed checkout link on the spot.' },
];

export default function DemoPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        {/* Header */}
        <section className="hero-gradient py-16 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="badge inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-green-700 mb-4">
              <Sparkles className="w-3.5 h-3.5" /> LIVE DEMO
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-4">
              Haggle with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-500">
                Max, right now.
              </span>
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              This is the real Nego Bot engine. Make an offer, push for a discount, and see how it
              protects the merchant&apos;s margin while still closing the deal.
            </p>
          </div>
        </section>

        {/* Live widget */}
        <Demo />

        {/* Why it works */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-6">
            {points.map(({ Icon, title, text }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <span className="inline-flex w-11 h-11 rounded-xl bg-green-50 text-green-600 items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-gray-900 mb-1.5">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA strip */}
        <section className="py-16 px-6 bg-green-600 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Want this on your store?</h2>
          <p className="text-green-100 mb-8">Set up your own negotiating bot in minutes — free to start.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="https://nego-admin.vercel.app/signup"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-600 font-semibold px-8 py-4 rounded-full hover:bg-green-50 transition-colors shadow-lg"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center gap-2 bg-green-500 text-white font-semibold px-8 py-4 rounded-full border border-white/20 hover:bg-green-400 transition-colors"
            >
              See how it works
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
