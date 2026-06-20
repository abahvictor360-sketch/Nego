'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3, Package, MessageSquare, LifeBuoy, MessageCircle, Settings, LogOut,
  type LucideIcon,
} from 'lucide-react';
import LogoutButton from './LogoutButton';
import NotificationBell from '@/components/NotificationBell';
import ThemeToggle from '@/components/ThemeToggle';

const navItems: { href: string; label: string; short: string; Icon: LucideIcon }[] = [
  { href: '/dashboard', label: 'Analytics', short: 'Stats', Icon: BarChart3 },
  { href: '/dashboard/products', label: 'Products', short: 'Products', Icon: Package },
  { href: '/dashboard/sessions', label: 'Sessions', short: 'Sessions', Icon: MessageSquare },
  { href: '/dashboard/support', label: 'Support', short: 'Support', Icon: LifeBuoy },
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
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col">
        <div className="px-5 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-violet-600 text-white flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </span>
            <span className="font-bold text-gray-900 dark:text-white text-sm">Nego Bot</span>
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
                    ? 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100 dark:border-gray-800 space-y-1">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <span className="w-8 h-8 shrink-0 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300 text-xs font-bold flex items-center justify-center">
              {initials(name)}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{name}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{email}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-40 flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 h-14">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-violet-600 text-white flex items-center justify-center">
              <MessageCircle className="w-3.5 h-3.5" />
            </span>
            <span className="font-bold text-gray-900 dark:text-white text-sm">Nego Bot</span>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <NotificationBell />
            <button
              onClick={logout}
              aria-label="Sign out"
              className="p-2 rounded-lg text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Desktop top bar */}
        <header className="hidden md:flex items-center justify-end gap-1 px-8 h-14 border-b border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40">
          <ThemeToggle />
          <NotificationBell />
        </header>

        {/* Extra bottom padding on mobile so content clears the bottom nav */}
        <main className="flex-1 overflow-auto p-5 sm:p-8 pb-24 md:pb-8">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
        {navItems.map(({ href, short, Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
                active ? 'text-violet-600 dark:text-violet-400' : 'text-gray-500 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-violet-600 dark:text-violet-400' : 'text-gray-400 dark:text-gray-500'}`} />
              {short}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
