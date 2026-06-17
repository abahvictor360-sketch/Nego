const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: '/ month',
    desc: 'Perfect for small merchants testing the waters.',
    cta: 'Get Started Free',
    ctaHref: '#signup',
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
    price: '$49',
    period: '/ month',
    desc: 'For growing stores that want maximum deal velocity.',
    cta: 'Start 14-day Trial',
    ctaHref: '#signup',
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
    price: 'Custom',
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
  return (
    <section id="pricing" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="badge inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-violet-700 mb-4">
            ✦ PRICING
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Start free. Scale as you grow. No surprises.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {plans.map(plan => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 flex flex-col ${
                plan.highlight
                  ? 'bg-violet-600 text-white shadow-2xl shadow-violet-200 scale-[1.02]'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold px-4 py-1 rounded-full">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <p className={`text-sm font-semibold mb-1 ${plan.highlight ? 'text-violet-200' : 'text-gray-500'}`}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1 mb-2">
                  <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm pb-1 ${plan.highlight ? 'text-violet-200' : 'text-gray-400'}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`text-sm ${plan.highlight ? 'text-violet-100' : 'text-gray-500'}`}>
                  {plan.desc}
                </p>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map(f => (
                  <li key={f} className={`flex items-center gap-2.5 text-sm ${plan.highlight ? 'text-violet-100' : 'text-gray-600'}`}>
                    <svg className={`w-4 h-4 shrink-0 ${plan.highlight ? 'text-violet-200' : 'text-violet-500'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={plan.ctaHref}
                className={`block text-center font-semibold py-3 rounded-xl transition-all text-sm ${
                  plan.highlight
                    ? 'bg-white text-violet-600 hover:bg-violet-50'
                    : 'bg-violet-600 text-white hover:bg-violet-700'
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
