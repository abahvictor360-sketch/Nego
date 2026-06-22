'use client';

import { Sparkles, Check } from 'lucide-react';
import { useEffect, useState } from 'react';

// Exchange rates relative to USD (approximate, static — swap for a live API if needed)
const RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  NGN: 1620,
  GHS: 15.8,
  KES: 129,
  ZAR: 18.6,
  MXN: 17.2,
  BRL: 5.1,
  CAD: 1.36,
  AUD: 1.53,
  INR: 83.5,
  JPY: 157,
  CNY: 7.24,
  AED: 3.67,
  SAR: 3.75,
};

const SYMBOLS: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', NGN: '₦', GHS: 'GH₵',
  KES: 'KSh', ZAR: 'R', MXN: 'MX$', BRL: 'R$', CAD: 'CA$',
  AUD: 'A$', INR: '₹', JPY: '¥', CNY: '¥', AED: 'AED', SAR: 'SAR',
};

// Map locale region to currency
const LOCALE_CURRENCY: Record<string, string> = {
  NG: 'NGN', GH: 'GHS', KE: 'KES', ZA: 'ZAR',
  MX: 'MXN', BR: 'BRL', CA: 'CAD', AU: 'AUD',
  IN: 'INR', JP: 'JPY', CN: 'CNY', AE: 'AED', SA: 'SAR',
  GB: 'GBP', DE: 'EUR', FR: 'EUR', ES: 'EUR', IT: 'EUR',
  NL: 'EUR', BE: 'EUR', PT: 'EUR', AT: 'EUR',
  US: 'USD',
};

function detectCurrency(): string {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale; // e.g. "en-NG", "es-MX"
    const region = locale.split('-')[1]?.toUpperCase();
    if (region && LOCALE_CURRENCY[region]) return LOCALE_CURRENCY[region];
  } catch { /* ignore */ }
  return 'USD';
}

function formatPrice(usd: number, currency: string): string {
  const rate = RATES[currency] ?? 1;
  const converted = usd * rate;
  const symbol = SYMBOLS[currency] ?? currency + ' ';
  const rounded = currency === 'JPY' ? Math.round(converted) : Math.round(converted * 10) / 10;
  return `${symbol}${rounded.toLocaleString()}`;
}

const BASE_PLANS = [
  {
    name: 'Starter',
    usdPrice: 0,
    priceLabel: null, // free — no conversion
    period: '/ month',
    desc: 'Perfect for small merchants testing the waters.',
    cta: 'Get Started Free',
    ctaHref: 'https://nego-admin.vercel.app/signup',
    highlight: false,
    features: [
      '100 negotiations / month',
      '2 active products',
      'WooCommerce integration',
      'Basic analytics',
      'Email support',
    ],
  },
  {
    name: 'Growth',
    usdPrice: 49,
    priceLabel: null,
    period: '/ month',
    desc: 'For growing stores that want maximum deal velocity.',
    cta: 'Start 14-day Trial',
    ctaHref: 'https://nego-admin.vercel.app/signup',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Unlimited negotiations',
      'Unlimited products',
      'Stripe + WooCommerce',
      'Advanced analytics & exports',
      'Multi-channel (Web + QR)',
      'Priority support',
      'Custom accent color',
    ],
  },
  {
    name: 'Enterprise',
    usdPrice: null,
    priceLabel: 'Custom',
    period: '',
    desc: 'White-label solution for agencies and large retailers.',
    cta: 'Contact Sales',
    ctaHref: 'mailto:hello@negotiobot.com',
    highlight: false,
    features: [
      'Everything in Growth',
      'White-label widget',
      'SSO & team management',
      'SLA guarantees',
      'Dedicated Slack channel',
      'Custom AI persona',
    ],
  },
];

export default function Pricing() {
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    setCurrency(detectCurrency());
  }, []);

  const plans = BASE_PLANS.map(p => ({
    ...p,
    price: p.usdPrice === 0
      ? 'Free'
      : p.usdPrice === null
        ? (p.priceLabel ?? 'Custom')
        : formatPrice(p.usdPrice, currency),
  }));

  return (
    <section id="pricing" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="badge inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-green-700 mb-4">
            <Sparkles className="w-3.5 h-3.5" /> PRICING
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Start free. Scale as you grow. No surprises.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Prices shown in {currency} based on your location.{' '}
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="underline cursor-pointer bg-transparent text-green-600 text-xs font-medium outline-none"
            >
              {Object.keys(RATES).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {plans.map(plan => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 flex flex-col ${
                plan.highlight
                  ? 'bg-green-600 text-white shadow-2xl shadow-green-200 scale-[1.02]'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold px-4 py-1 rounded-full">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <p className={`text-sm font-semibold mb-1 ${plan.highlight ? 'text-green-200' : 'text-gray-500'}`}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1 mb-2">
                  <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm pb-1 ${plan.highlight ? 'text-green-200' : 'text-gray-400'}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`text-sm ${plan.highlight ? 'text-green-100' : 'text-gray-500'}`}>
                  {plan.desc}
                </p>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map(f => (
                  <li key={f} className={`flex items-center gap-2.5 text-sm ${plan.highlight ? 'text-green-100' : 'text-gray-600'}`}>
                    <Check className={`w-4 h-4 shrink-0 ${plan.highlight ? 'text-green-200' : 'text-green-500'}`} />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={plan.ctaHref}
                className={`block text-center font-semibold py-3 rounded-xl transition-all text-sm ${
                  plan.highlight
                    ? 'bg-white text-green-600 hover:bg-green-50'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
