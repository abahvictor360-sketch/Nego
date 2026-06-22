'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, CreditCard, LifeBuoy, FileText, ShieldCheck, LogOut, Mail, Search,
  type LucideIcon,
} from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';

type NavItem = { href: string; label: string; short: string; Icon: LucideIcon };

const MENU: NavItem[] = [
  { href: '/admin/dashboard', label: 'Overview', short: 'Home', Icon: LayoutDashboard },
  { href: '/admin/dashboard/users', label: 'Users', short: 'Users', Icon: Users },
  { href: '/admin/dashboard/billing', label: 'Billing', short: 'Billing', Icon: CreditCard },
];
const GENERAL: NavItem[] = [
  { href: '/admin/dashboard/support', label: 'Support', short: 'Support', Icon: LifeBuoy },
  { href: '/admin/dashboard/content', label: 'Content & SEO', short: 'Content', Icon: FileText },
  { href: '/admin/dashboard/email', label: 'Email Settings', short: 'Email', Icon: Mail },
];
const ALL = [...MENU, ...GENERAL];

function isActive(pathname: string, href: string): boolean {
  return href === '/admin/dashboard' ? pathname === href : pathname.startsWith(href);
}

function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]!.toUpperCase()).join('') || 'A';
}

async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/admin/login';
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isActive(pathname, item.href);
  const { Icon } = item;
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
        active ? 'bg-green-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon className="w-[18px] h-[18px]" />
      {item.label}
    </Link>
  );
}

export default function AdminShell({
  name, email, children,
}: { name: string; email: string; children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 bg-white border-r border-gray-200 flex-col p-4">
        <div className="flex items-center gap-2.5 px-2 py-3">
          <span className="w-9 h-9 rounded-xl bg-green-900 text-white flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <span className="font-bold text-gray-900 text-lg tracking-tight">Platform Admin</span>
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

        <Link href="/dashboard" className="block text-xs text-gray-500 hover:text-green-700 px-3 py-2">
          Switch to Merchant view →
        </Link>

        {/* Profile card */}
        <div className="mt-1 rounded-2xl bg-green-900 text-white p-4 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-8 w-28 h-28 rounded-full bg-white/5" />
          <p className="text-[11px] text-green-200 font-medium">Administrator</p>
          <p className="font-semibold text-sm mt-0.5 truncate">{name}</p>
          <p className="text-[11px] text-green-300/80 truncate">{email}</p>
          <button
            onClick={logout}
            className="mt-3 w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 rounded-lg py-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-40 flex items-center justify-between bg-white border-b border-gray-200 px-4 h-14">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-green-900 text-white flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
            <span className="font-bold text-gray-900 text-sm">Admin</span>
          </div>
          <div className="flex items-center gap-1">
            <NotificationBell tone="light" />
            <button onClick={logout} aria-label="Sign out" className="p-2 rounded-lg text-gray-500 hover:text-red-600 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Desktop top bar */}
        <header className="hidden md:flex items-center gap-4 px-8 h-16 border-b border-gray-200 bg-white">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search…"
              className="w-full rounded-xl bg-gray-50 border border-gray-200 pl-9 pr-4 py-2 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30 transition-all"
            />
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <NotificationBell tone="light" />
            <div className="flex items-center gap-2.5 pl-3 ml-1 border-l border-gray-200">
              <span className="w-9 h-9 rounded-full bg-green-100 text-green-800 text-xs font-bold flex items-center justify-center">
                {initials(name)}
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-gray-900">{name}</p>
                <p className="text-xs text-gray-400">{email}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-5 sm:p-8 pb-24 md:pb-8">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 grid grid-cols-6 pb-[env(safe-area-inset-bottom)]">
        {ALL.map(({ href, short, Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
                active ? 'text-green-800' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-green-800' : 'text-gray-400'}`} />
              {short}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
