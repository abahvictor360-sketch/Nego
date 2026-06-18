import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import LogoutButton from './LogoutButton';
import { BarChart3, Package, MessageSquare, SquarePen, MessageCircle, Settings, type LucideIcon } from 'lucide-react';

const navItems: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: '/dashboard', label: 'Analytics', Icon: BarChart3 },
  { href: '/dashboard/products', label: 'Products', Icon: Package },
  { href: '/dashboard/sessions', label: 'Sessions', Icon: MessageSquare },
  { href: '/dashboard/content', label: 'Landing Page', Icon: SquarePen },
  { href: '/dashboard/settings', label: 'Settings', Icon: Settings },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/login');

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-violet-600 text-white flex items-center justify-center"><MessageCircle className="w-4 h-4" /></span>
            <span className="font-bold text-gray-900 text-sm">Nego Bot</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{session.name}</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
