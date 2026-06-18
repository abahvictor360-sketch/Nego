'use client';

import { useInView } from '@/hooks/useInView';
import type { HowItWorksContent } from '@/lib/content';

export default function HowItWorks({ content }: { content: HowItWorksContent }) {
  const { ref: headerRef, inView: headerIn } = useInView();
  const { ref: stepsRef, inView: stepsIn } = useInView();

  return (
    <section id="how-it-works" className="py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${headerIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <div className="badge inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-violet-700 mb-4">
            ✦ {content.badge}
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            {content.title.split('under 10 minutes')[0]}
            <span className="text-violet-600">under 10 minutes</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">{content.subtitle}</p>
        </div>

        <div ref={stepsRef} className="flex flex-col md:flex-row gap-0 md:gap-4 items-stretch">
          {content.steps.map((step, i) => (
            <div
              key={i}
              className={`flex flex-col md:flex-row items-center flex-1 transition-all duration-500 ${stepsIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: stepsIn ? `${i * 150}ms` : '0ms' }}
            >
              <div className="bg-white rounded-2xl border border-gray-100 p-8 w-full shadow-sm feature-card">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-2xl">{step.icon}</div>
                  <div>
                    <span className="text-xs font-bold text-violet-400 tracking-widest uppercase">Step {step.n}</span>
                    <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
              {i < content.steps.length - 1 && (
                <div className="hidden md:flex items-center px-2">
                  <svg className="w-6 h-6 text-violet-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={`mt-12 bg-gray-900 rounded-2xl p-6 overflow-x-auto transition-all duration-700 delay-300 ${stepsIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-yellow-500" /><div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-xs text-gray-500 font-mono">embed.html</span>
          </div>
          <pre className="text-sm text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">{`<div
  data-nego-product="<your-product-id>"
  data-nego-api-key="<your-api-key>"
  data-nego-api-url="https://nego-5ykj.onrender.com"
></div>
<script src="https://cdn.negotiobot.com/nego-widget.umd.js"></script>`}</pre>
          <p className="text-xs text-gray-500 mt-3">That's it. The widget mounts itself and starts negotiating.</p>
        </div>
      </div>
    </section>
  );
}
