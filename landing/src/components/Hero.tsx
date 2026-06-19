import { Check, Shield, ArrowRight, Play } from 'lucide-react';
import type { HeroContent } from '@/lib/content';

export default function Hero({ content }: { content: HeroContent }) {
  // Split headline into main + highlighted last sentence for gradient styling
  const parts = content.headline.split(/(?<=\.)\s+/);
  const main = parts.length > 1 ? parts.slice(0, -1).join(' ') : content.headline;
  const highlight = parts.length > 1 ? parts[parts.length - 1] : '';

  return (
    <section className="hero-gradient pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Radial glow blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-violet-100 rounded-full blur-[120px] opacity-40 pointer-events-none" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-violet-200 rounded-full blur-[80px] opacity-20 pointer-events-none" />
      <div className="absolute top-10 right-10 w-80 h-80 bg-purple-100 rounded-full blur-[100px] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">

          {/* Announcement badge */}
          <div className="badge inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-violet-700 mb-6">
            <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            {content.badge}
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.08] mb-6">
            {main}{' '}
            {highlight && (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500">
                {highlight}
              </span>
            )}
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl leading-relaxed mb-10">
            {content.subheadline}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-16">
            <a
              href="https://nego-admin.vercel.app/signup"
              className="inline-flex items-center justify-center gap-2 bg-violet-600 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:-translate-y-0.5"
            >
              {content.cta_primary}
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#demo"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold px-7 py-3.5 rounded-full border border-gray-200 hover:border-violet-300 hover:text-violet-600 transition-all hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4" fill="currentColor" />
              {content.cta_secondary}
            </a>
          </div>

          {/* Floating chat UI cards */}
          <div className="relative w-full max-w-3xl h-64 sm:h-72">

            {/* Center: main deal card */}
            <div className="glass rounded-2xl p-4 shadow-xl shadow-violet-100 absolute left-1/2 -translate-x-1/2 top-4 w-64 animate-float">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">M</div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">Max · Nego Bot</p>
                  <p className="text-[10px] text-green-500 font-medium">● Online</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="bg-violet-50 rounded-xl rounded-tl-sm px-3 py-2">
                  <p className="text-xs text-gray-700">Great choice! The Sony XM5 is listed at <strong>$349</strong>. Make me an offer!</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl rounded-tr-sm px-3 py-2 ml-6 shadow-sm">
                  <p className="text-xs text-gray-600">How about $290?</p>
                </div>
                <div className="bg-violet-50 rounded-xl rounded-tl-sm px-3 py-2">
                  <p className="text-xs text-gray-700">I can do <strong>$318</strong> — that's 9% off!</p>
                </div>
                {/* Typing indicator */}
                <div className="flex gap-1 px-3 py-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 dot1" />
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 dot2" />
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 dot3" />
                </div>
              </div>
            </div>

            {/* Left: Deal agreed card */}
            <div className="glass rounded-2xl p-4 shadow-lg absolute left-0 sm:left-4 top-8 w-52 animate-float2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Check className="w-3.5 h-3.5" /></div>
                <p className="text-xs font-semibold text-gray-800">Deal Closed!</p>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">List price</span>
                  <span className="line-through text-gray-400">$349</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Agreed price</span>
                  <span className="font-bold text-violet-600">$318</span>
                </div>
                <div className="h-px bg-gray-100 my-1" />
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Discount</span>
                  <span className="text-green-600 font-medium">8.9%</span>
                </div>
              </div>
              <div className="mt-3 bg-violet-600 text-white text-xs font-semibold flex items-center justify-center gap-1 py-1.5 rounded-lg">
                Checkout <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Right: Floor price guard card */}
            <div className="glass rounded-2xl p-4 shadow-lg absolute right-0 sm:right-4 top-12 w-52 animate-float3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-violet-600"><Shield className="w-3.5 h-3.5" /></div>
                <p className="text-xs font-semibold text-gray-800">Floor Guard Active</p>
              </div>
              <p className="text-[11px] text-gray-500 mb-2">Customer offered $200 — floor is $280. Protected.</p>
              <div className="flex items-center gap-1">
                <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                  <div className="bg-violet-500 h-1.5 rounded-full" style={{ width: '80%' }} />
                </div>
                <span className="text-[10px] text-gray-400">80% margin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted by bar */}
        <div className="mt-20 text-center">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-6">
            Trusted by merchants on
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-50">
            {['Shopify', 'WooCommerce', 'BigCommerce', 'Magento', 'Stripe'].map(brand => (
              <span key={brand} className="text-gray-500 font-bold text-sm sm:text-base tracking-tight">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
