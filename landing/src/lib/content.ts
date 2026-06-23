export interface HeroContent {
  badge: string;
  headline: string;
  subheadline: string;
  cta_primary: string;
  cta_secondary: string;
}

export interface FeatureItem {
  icon: string;
  color: string;
  title: string;
  description: string;
  points: string[];
}

export interface FeaturesContent {
  badge: string;
  title: string;
  subtitle: string;
  items: FeatureItem[];
}

export interface Step {
  icon: string;
  n: string;
  title: string;
  description: string;
}

export interface HowItWorksContent {
  badge: string;
  title: string;
  subtitle: string;
  steps: Step[];
}

export interface Stat {
  label: string;
  icon: string;
  color: string;
}

export interface CtaContent {
  title: string;
  subtitle: string;
  cta_primary: string;
  cta_secondary: string;
  stats: Stat[];
}

export interface Perk {
  icon: string;
  text: string;
}

export interface SignupContent {
  badge: string;
  title: string;
  subtitle: string;
  perks: Perk[];
}

export interface SiteContent {
  hero: HeroContent;
  features: FeaturesContent;
  how_it_works: HowItWorksContent;
  cta: CtaContent;
  signup: SignupContent;
}

const DEFAULTS: SiteContent = {
  hero: {
    badge: 'Now in Beta — 25% off for early merchants',
    headline: 'Let Customers Haggle. You Always Win.',
    subheadline:
      'Nego Bot is an AI negotiation engine that engages shoppers in real-time price conversations — and never drops below your floor price. More deals, better margins, zero manual effort.',
    cta_primary: 'Start Negotiating Free',
    cta_secondary: 'Try Live Demo',
  },
  features: {
    badge: 'FEATURES',
    title: 'All the tools you need to close more deals',
    subtitle:
      'Empower your store with intelligent negotiation that converts hesitant shoppers into paying customers — without sacrificing your margins.',
    items: [
      { icon: 'bot', color: 'bg-green-50 text-green-600', title: 'AI Negotiation Engine', description: 'Claude-powered negotiator engages customers in human-like price conversations — conceding strategically, anchoring high, and closing deals fast.', points: ['Value-based selling', 'Adaptive concession strategy', 'Scarcity & urgency signals'] },
      { icon: 'shield', color: 'bg-green-50 text-green-600', title: 'Floor Price Guard', description: 'Your minimum price is stored server-side only. The AI never sees it — making it completely immune to prompt injection and customer manipulation.', points: ['Server-side enforcement', 'HMAC-signed checkout URLs', 'Tamper-proof pricing'] },
      { icon: 'chart', color: 'bg-blue-50 text-blue-600', title: 'Real-time Analytics', description: 'Track deal rate, average discount, revenue protected, and session history. Know exactly which products negotiate best and where to tighten your floor.', points: ['Deal rate tracking', 'Avg discount analytics', 'Session replay logs'] },
      { icon: 'zap', color: 'bg-orange-50 text-orange-600', title: 'One-click Integration', description: 'Drop a single script tag into any webpage, WooCommerce site, or Shopify theme. Works with Stripe Checkout and WooCommerce cart natively.', points: ['WooCommerce & Shopify', 'Stripe Checkout native', 'QR code & in-store mode'] },
    ],
  },
  how_it_works: {
    badge: 'HOW IT WORKS',
    title: 'Up and running in under 10 minutes',
    subtitle: 'No AI expertise required. Set your prices, embed the widget, and watch deals flow in.',
    steps: [
      { icon: 'package', n: '01', title: 'Add Your Products', description: 'Set a public list price and a private floor price. The floor is stored server-side — the AI never sees it.' },
      { icon: 'plug', n: '02', title: 'Embed the Widget', description: "Drop one script tag onto your store page. Nego Bot's chat bubble appears instantly, ready to negotiate." },
      { icon: 'handshake', n: '03', title: 'Deals Close Automatically', description: 'The AI haggles with your customers, protects your margin, then redirects them to a signed checkout URL.' },
    ],
  },
  cta: {
    title: 'Ready to let AI close deals for you?',
    subtitle: 'Join hundreds of merchants who are converting hesitant shoppers into paying customers — 24/7, automatically, without sacrificing a cent below their floor.',
    cta_primary: 'Start Free — No Card Required',
    cta_secondary: 'Try Live Demo',
    stats: [
      { label: '2,847 Deals Closed', icon: 'handshake', color: 'text-green-400' },
      { label: '$1.2M Revenue Protected', icon: 'shield', color: 'text-white' },
      { label: '94% Margin Preserved', icon: 'trending-up', color: 'text-blue-400' },
    ],
  },
  signup: {
    badge: 'GET STARTED',
    title: 'Start closing smarter deals today.',
    subtitle: 'Create your merchant account in seconds. No credit card required for your first 100 negotiations.',
    perks: [
      { icon: 'check-circle', text: 'Free for first 100 negotiations' },
      { icon: 'lock', text: 'API key generated instantly' },
      { icon: 'rocket', text: 'Widget live in under 5 minutes' },
      { icon: 'chart', text: 'Full analytics dashboard included' },
    ],
  },
};

export async function getSiteContent(): Promise<SiteContent> {
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001';
  try {
    const res = await fetch(`${backend}/api/content`, { next: { revalidate: 60 } });
    if (!res.ok) return DEFAULTS;
    const data = await res.json();
    if (!data || typeof data !== 'object' || !data.hero) return DEFAULTS;
    return { ...DEFAULTS, ...data };
  } catch {
    return DEFAULTS;
  }
}
