const cols = [
  {
    title: 'Product',
    links: ['Features', 'How It Works', 'Pricing', 'Changelog', 'Roadmap'],
  },
  {
    title: 'Integrations',
    links: ['WooCommerce', 'Shopify', 'Stripe', 'BigCommerce', 'Custom API'],
  },
  {
    title: 'Company',
    links: ['About', 'Blog', 'Careers', 'Press Kit', 'Contact'],
  },
  {
    title: 'Legal',
    links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'],
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 px-6 pt-16 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white text-sm">💬</span>
              <span className="font-bold text-white text-lg">Nego<span className="text-violet-400">Bot</span></span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500 mb-4">
              AI-powered price negotiation for modern e-commerce merchants.
            </p>
            <div className="flex gap-3">
              {['𝕏', 'in', '⌬'].map(icon => (
                <a
                  key={icon}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-violet-600 transition-colors text-sm font-bold"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map(col => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-500 hover:text-violet-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Nego Bot. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Built with Claude Opus 4 · Powered by Anthropic
          </p>
        </div>
      </div>
    </footer>
  );
}
