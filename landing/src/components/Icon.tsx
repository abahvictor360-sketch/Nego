import {
  Bot,
  Shield,
  BarChart3,
  Zap,
  Package,
  Plug,
  Handshake,
  TrendingUp,
  CheckCircle2,
  Lock,
  Rocket,
  Globe,
  Smartphone,
  QrCode,
  Sparkles,
  MessageCircle,
  Check,
  Star,
  type LucideIcon,
} from 'lucide-react';

// Maps the icon "name" stored in site content to a real lucide icon component.
// Keep these keys in sync with admin-dashboard/src/components/Icon.tsx.
const MAP: Record<string, LucideIcon> = {
  bot: Bot,
  shield: Shield,
  chart: BarChart3,
  zap: Zap,
  package: Package,
  plug: Plug,
  handshake: Handshake,
  'trending-up': TrendingUp,
  'check-circle': CheckCircle2,
  lock: Lock,
  rocket: Rocket,
  globe: Globe,
  smartphone: Smartphone,
  'qr-code': QrCode,
  sparkles: Sparkles,
  'message-circle': MessageCircle,
  check: Check,
  star: Star,
};

export const ICON_NAMES = Object.keys(MAP);

export default function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = MAP[name] ?? Sparkles;
  return <Cmp className={className} strokeWidth={2} />;
}
