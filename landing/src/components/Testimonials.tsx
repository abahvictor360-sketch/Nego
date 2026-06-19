'use client';

import { useInView } from '@/hooks/useInView';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote:
      "Nego Bot recovered carts we used to lose to hesitation. Customers feel like they won a deal, and we never dip below our margin. Revenue per visitor is up 18%.",
    name: 'Sarah Chen',
    role: 'Founder, AudioLab',
    initials: 'SC',
    color: 'bg-violet-100 text-violet-700',
  },
  {
    quote:
      "Setup took one script tag. Within a day the bot was negotiating around the clock. The floor-price guard means I never worry about it giving away the store.",
    name: 'Marcus Reed',
    role: 'Ops Lead, GearHive',
    initials: 'MR',
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    quote:
      "Our in-store QR negotiations are a hit. Shoppers scan, haggle with Max, and check out on their phone. It feels premium and totally on-brand.",
    name: 'Priya Nair',
    role: 'Retail Director, Lumen Home',
    initials: 'PN',
    color: 'bg-blue-100 text-blue-700',
  },
];

export default function Testimonials() {
  const { ref, inView } = useInView();

  return (
    <section className="py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="badge inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-violet-700 mb-4">
            <Star className="w-3.5 h-3.5" /> LOVED BY MERCHANTS
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Built to close more deals
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Merchants use Nego Bot to turn price objections into checkouts — without sacrificing margin.
          </p>
        </div>

        <div ref={ref} className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className={`relative bg-white rounded-2xl border border-gray-100 p-7 shadow-sm transition-all duration-500 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: inView ? `${i * 120}ms` : '0ms' }}
            >
              <Quote className="w-8 h-8 text-violet-200 mb-4" />
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 text-amber-400" fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed text-sm mb-6">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <span className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${t.color}`}>
                  {t.initials}
                </span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
