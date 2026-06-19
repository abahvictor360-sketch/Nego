'use client';

import { useInView } from '@/hooks/useInView';
import type { CtaContent } from '@/lib/content';
import Icon from './Icon';
import { ArrowRight } from 'lucide-react';

export default function CTA({ content }: { content: CtaContent }) {
  const { ref, inView } = useInView();

  return (
    <section className="py-24 px-6 cta-gradient relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-800 rounded-full blur-[120px] opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-700 rounded-full blur-[80px] opacity-20 pointer-events-none" />

      <div
        ref={ref}
        className={`max-w-4xl mx-auto text-center relative transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {content.stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`glass-dark rounded-xl px-4 py-3 flex items-center gap-2 text-sm transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: inView ? `${i * 100}ms` : '0ms' }}
            >
              <Icon name={stat.icon} className={`w-4 h-4 ${stat.color}`} />
              <span className={`font-semibold ${stat.color}`}>{stat.label}</span>
            </div>
          ))}
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-tight">
          {content.title.split('deals for you')[0]}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-purple-300">deals for you?</span>
        </h2>
        <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">{content.subtitle}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://nego-admin.vercel.app/signup" className="inline-flex items-center justify-center gap-2 bg-violet-500 text-white font-semibold px-8 py-4 rounded-full hover:bg-violet-400 transition-all shadow-lg shadow-violet-900/50 hover:-translate-y-0.5">
            {content.cta_primary}
            <ArrowRight className="w-4 h-4" />
          </a>
          <a href="/demo" className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-full border border-white/20 hover:bg-white/20 transition-all hover:-translate-y-0.5">
            {content.cta_secondary}
          </a>
        </div>
      </div>
    </section>
  );
}
