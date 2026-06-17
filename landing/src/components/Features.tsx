const features = [
  {
    icon: '🤖',
    color: 'bg-violet-50 text-violet-600',
    title: 'AI Negotiation Engine',
    description:
      'Claude-powered negotiator engages customers in human-like price conversations — conceding strategically, anchoring high, and closing deals fast.',
    points: ['Value-based selling', 'Adaptive concession strategy', 'Scarcity & urgency signals'],
  },
  {
    icon: '🛡️',
    color: 'bg-green-50 text-green-600',
    title: 'Floor Price Guard',
    description:
      'Your minimum price is stored server-side only. The AI never sees it — making it completely immune to prompt injection and customer manipulation.',
    points: ['Server-side enforcement', 'HMAC-signed checkout URLs', 'Tamper-proof pricing'],
  },
  {
    icon: '📊',
    color: 'bg-blue-50 text-blue-600',
    title: 'Real-time Analytics',
    description:
      'Track deal rate, average discount, revenue protected, and session history. Know exactly which products negotiate best and where to tighten your floor.',
    points: ['Deal rate tracking', 'Avg discount analytics', 'Session replay logs'],
  },
  {
    icon: '⚡',
    color: 'bg-orange-50 text-orange-600',
    title: 'One-click Integration',
    description:
      'Drop a single script tag into any webpage, WooCommerce site, or Shopify theme. Works with Stripe Checkout and WooCommerce cart natively.',
    points: ['WooCommerce & Shopify', 'Stripe Checkout native', 'QR code & in-store mode'],
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="badge inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-violet-700 mb-4">
            ✦ FEATURES
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            All the tools you need to{' '}
            <span className="text-violet-600">close more deals</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Empower your store with intelligent negotiation that converts hesitant shoppers
            into paying customers — without sacrificing your margins.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="feature-card rounded-2xl border border-gray-100 bg-white p-8 hover:border-violet-100 group"
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

        {/* Big feature highlight */}
        <div className="mt-6 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 p-8 sm:p-12 text-white flex flex-col sm:flex-row gap-8 items-center">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-xs font-semibold mb-4">
              🌐 Multi-channel
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-3">
              Web, Mobile & In-Store QR
            </h3>
            <p className="text-violet-100 text-sm leading-relaxed max-w-lg">
              One negotiation bot, three channels. Embed on your website, power your mobile app,
              or print a QR code for brick-and-mortar stores. The same AI closes deals everywhere.
            </p>
          </div>
          <div className="flex gap-3 sm:gap-4">
            {[
              { label: 'Web', icon: '🌐' },
              { label: 'Mobile', icon: '📱' },
              { label: 'In-Store QR', icon: '📲' },
            ].map(ch => (
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
