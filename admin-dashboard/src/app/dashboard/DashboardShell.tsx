'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  BarChart3, Package, MessageSquare, LifeBuoy, MessageCircle, Settings, LogOut, Search, Mail,
  type LucideIcon,
} from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';
import ThemeToggle from '@/components/ThemeToggle';

type NavItem = { href: string; label: string; short: string; Icon: LucideIcon };

const MENU: NavItem[] = [
  { href: '/dashboard', label: 'Analytics', short: 'Stats', Icon: BarChart3 },
  { href: '/dashboard/products', label: 'Products', short: 'Products', Icon: Package },
  { href: '/dashboard/sessions', label: 'Sessions', short: 'Sessions', Icon: MessageSquare },
];
const GENERAL: NavItem[] = [
  { href: '/dashboard/support', label: 'Support', short: 'Support', Icon: LifeBuoy },
  { href: '/dashboard/settings', label: 'Settings', short: 'Settings', Icon: Settings },
];
const ALL = [...MENU, ...GENERAL];

function isActive(pathname: string, href: string): boolean {
  return href === '/dashboard' ? pathname === href : pathname.startsWith(href);
}

function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]!.toUpperCase()).join('') || 'M';
}

async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/login';
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isActive(pathname, item.href);
  const { Icon } = item;
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? 'bg-green-900 text-white shadow-sm'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
      }`}
    >
      <Icon className="w-[18px] h-[18px]" />
      {item.label}
    </Link>
  );
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
  const router = useRouter();
  const [query, setQuery] = useState('');

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/dashboard/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col p-4">
        <div className="flex items-center gap-2.5 px-2 py-3">
          <span className="w-9 h-9 rounded-xl bg-green-900 text-white flex items-center justify-center font-bold">
            <MessageCircle className="w-5 h-5" />
          </span>
          <span className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">Nego Bot</span>
        </div>

        <nav className="flex-1 mt-4 overflow-y-auto">
          <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Menu</p>
          <div className="space-y-1">
            {MENU.map(item => <NavLink key={item.href} item={item} pathname={pathname} />)}
          </div>
          <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 mt-6">General</p>
          <div className="space-y-1">
            {GENERAL.map(item => <NavLink key={item.href} item={item} pathname={pathname} />)}
          </div>
        </nav>

        {/* Profile card */}
        <div className="mt-4 rounded-2xl bg-green-900 text-white p-4 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-8 w-28 h-28 rounded-full bg-white/5" />
          <div className="absolute right-4 -top-6 w-20 h-20 rounded-full bg-white/5" />
          <p className="text-[11px] text-green-200 font-medium">Merchant</p>
          <p className="font-semibold text-sm mt-0.5 truncate">{name}</p>
          <p className="text-[11px] text-green-300/80 truncate">{email}</p>
          <Link
            href="/dashboard/settings"
            className="mt-3 block text-center text-xs font-semibold bg-white/15 hover:bg-white/25 rounded-lg py-2 transition-colors"
          >
            View Profile →
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-40 flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 h-14">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-green-900 text-white flex items-center justify-center">
              <MessageCircle className="w-3.5 h-3.5" />
            </span>
            <span className="font-bold text-gray-900 dark:text-white text-sm">Nego Bot</span>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <NotificationBell />
            <button onClick={logout} aria-label="Sign out" className="p-2 rounded-lg text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Desktop top bar */}
        <header className="hidden md:flex items-center gap-4 px-8 h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <form onSubmit={onSearch} className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search products & sessions…"
              className="w-full rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 pl-9 pr-4 py-2 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30 transition-all"
            />
          </form>
          <div className="ml-auto flex items-center gap-1.5">
            <button aria-label="Messages" className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:text-green-700 hover:border-green-300 transition-colors">
              <Mail className="w-4 h-4" />
            </button>
            <NotificationBell />
            <ThemeToggle />
            <div className="flex items-center gap-2.5 pl-3 ml-1 border-l border-gray-200 dark:border-gray-700">
              <span className="w-9 h-9 rounded-full bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300 text-xs font-bold flex items-center justify-center">
                {initials(name)}
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{name}</p>
                <p className="text-xs text-gray-400">{email}</p>
              </div>
              <button onClick={logout} aria-label="Sign out" className="ml-1 p-2 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-5 sm:p-8 pb-24 md:pb-8">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
        {ALL.map(({ href, short, Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
                active ? 'text-green-800 dark:text-green-400' : 'text-gray-500 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-green-800 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`} />
              {short}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
