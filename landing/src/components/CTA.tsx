export default function CTA() {
  return (
    <section className="py-24 px-6 cta-gradient relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-800 rounded-full blur-[120px] opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-700 rounded-full blur-[80px] opacity-20 pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative">
        {/* Floating cards preview */}
        <div className="flex justify-center gap-3 mb-10">
          {[
            { label: '2,847 Deals Closed', icon: '🤝', color: 'text-green-400' },
            { label: '$1.2M Revenue Protected', icon: '🛡️', color: 'text-violet-300' },
            { label: '94% Margin Preserved', icon: '📈', color: 'text-blue-400' },
          ].map(stat => (
            <div key={stat.label} className="glass-dark rounded-xl px-4 py-3 flex items-center gap-2 text-sm">
              <span>{stat.icon}</span>
              <span className={`font-semibold ${stat.color}`}>{stat.label}</span>
            </div>
          ))}
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-tight">
          Ready to let AI close{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-purple-300">
            deals for you?
          </span>
        </h2>
        <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join hundreds of merchants who are converting hesitant shoppers into paying customers
          — 24/7, automatically, without sacrificing a cent below their floor.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#signup"
            className="inline-flex items-center justify-center gap-2 bg-violet-500 text-white font-semibold px-8 py-4 rounded-full hover:bg-violet-400 transition-all shadow-lg shadow-violet-900/50 hover:-translate-y-0.5"
          >
            Start Free — No Card Required
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="#demo"
            className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-full border border-white/20 hover:bg-white/20 transition-all hover:-translate-y-0.5"
          >
            Try Live Demo
          </a>
        </div>
      </div>
    </section>
  );
}
