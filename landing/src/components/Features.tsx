'use client';

import { useInView } from '@/hooks/useInView';
import type { FeaturesContent } from '@/lib/content';

export default function Features({ content }: { content: FeaturesContent }) {
  const { ref: headerRef, inView: headerIn } = useInView();
  const { ref: gridRef, inView: gridIn } = useInView();

  return (
    <section id="features" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${headerIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <div className="badge inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-violet-700 mb-4">
            ✦ {content.badge}
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            {content.title.split('close more deals')[0]}
            <span className="text-violet-600">close more deals</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">{content.subtitle}</p>
        </div>

        <div ref={gridRef} className="grid sm:grid-cols-2 gap-6">
          {content.items.map((f, i) => (
            <div
              key={i}
              className={`feature-card rounded-2xl border border-gray-100 bg-white p-8 hover:border-violet-100 group transition-all duration-500 ${
                gridIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: gridIn ? `${i * 100}ms` : '0ms' }}
            >
              <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">{f.description}</p>
              <ul className="space-y-2">
                {f.points.map(p => (
                  <li key={p} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-violet-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={`mt-6 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 p-8 sm:p-12 text-white flex flex-col sm:flex-row gap-8 items-center transition-all duration-700 delay-200 ${gridIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-xs font-semibold mb-4">🌐 Multi-channel</div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-3">Web, Mobile & In-Store QR</h3>
            <p className="text-violet-100 text-sm leading-relaxed max-w-lg">One negotiation bot, three channels. Embed on your website, power your mobile app, or print a QR code for brick-and-mortar stores.</p>
          </div>
          <div className="flex gap-3 sm:gap-4">
            {[{ label: 'Web', icon: '🌐' }, { label: 'Mobile', icon: '📱' }, { label: 'In-Store QR', icon: '📲' }].map(ch => (
              <div key={ch.label} className="glass-dark rounded-2xl p-4 text-center min-w-[80px]">
                <div className="text-2xl mb-1">{ch.icon}</div>
                <p className="text-xs font-medium text-white/80">{ch.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
