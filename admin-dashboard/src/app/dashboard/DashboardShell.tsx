'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3, Package, MessageSquare, SquarePen, MessageCircle, Settings, LogOut,
  type LucideIcon,
} from 'lucide-react';
import LogoutButton from './LogoutButton';

const navItems: { href: string; label: string; short: string; Icon: LucideIcon }[] = [
  { href: '/dashboard', label: 'Analytics', short: 'Stats', Icon: BarChart3 },
  { href: '/dashboard/products', label: 'Products', short: 'Products', Icon: Package },
  { href: '/dashboard/sessions', label: 'Sessions', short: 'Sessions', Icon: MessageSquare },
  { href: '/dashboard/content', label: 'Landing Page', short: 'Landing', Icon: SquarePen },
  { href: '/dashboard/settings', label: 'Settings', short: 'Settings', Icon: Settings },
];

function isActive(pathname: string, href: string): boolean {
  return href === '/dashboard' ? pathname === href : pathname.startsWith(href);
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]!.toUpperCase())
    .join('') || 'M';
}

async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/login';
}

export default function DashboardShell({
  name,
  email,
  children,
}: {
  name: string;
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 bg-white border-r border-gray-200 flex-col">
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-violet-600 text-white flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </span>
            <span className="font-bold text-gray-900 text-sm">Nego Bot</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, label, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-violet-50 text-violet-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100 space-y-1">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <span className="w-8 h-8 shrink-0 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center">
              {initials(name)}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
              <p className="text-xs text-gray-400 truncate">{email}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-40 flex items-center justify-between bg-white border-b border-gray-200 px-4 h-14">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-violet-600 text-white flex items-center justify-center">
              <MessageCircle className="w-3.5 h-3.5" />
            </span>
            <span className="font-bold text-gray-900 text-sm">Nego Bot</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 text-[11px] font-bold flex items-center justify-center" title={name}>
              {initials(name)}
            </span>
            <button
              onClick={logout}
              aria-label="Sign out"
              className="text-gray-400 hover:text-red-600 transition-colors p-1"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Extra bottom padding on mobile so content clears the bottom nav */}
        <main className="flex-1 overflow-auto p-5 sm:p-8 pb-24 md:pb-8">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
        {navItems.map(({ href, short, Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
                active ? 'text-violet-600' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-violet-600' : 'text-gray-400'}`} />
              {short}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
