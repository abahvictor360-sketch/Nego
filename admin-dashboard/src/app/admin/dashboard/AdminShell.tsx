'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, CreditCard, LifeBuoy, FileText, ShieldCheck, LogOut, Mail,
  type LucideIcon,
} from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';

const navItems: { href: string; label: string; short: string; Icon: LucideIcon }[] = [
  { href: '/admin/dashboard', label: 'Overview', short: 'Home', Icon: LayoutDashboard },
  { href: '/admin/dashboard/users', label: 'Users', short: 'Users', Icon: Users },
  { href: '/admin/dashboard/billing', label: 'Billing', short: 'Billing', Icon: CreditCard },
  { href: '/admin/dashboard/support', label: 'Support', short: 'Support', Icon: LifeBuoy },
  { href: '/admin/dashboard/content', label: 'Content & SEO', short: 'Content', Icon: FileText },
  { href: '/admin/dashboard/email', label: 'Email Settings', short: 'Email', Icon: Mail },
];

function isActive(pathname: string, href: string): boolean {
  return href === '/admin/dashboard' ? pathname === href : pathname.startsWith(href);
}

async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/admin/login';
}

export default function AdminShell({
  name, email, children,
}: { name: string; email: string; children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 bg-gray-900 border-r border-gray-800 flex-col">
        <div className="px-5 py-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="font-bold text-sm">Platform Admin</span>
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
                  active ? 'bg-amber-500/15 text-amber-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-800 space-y-1">
          <Link href="/dashboard" className="block text-xs text-gray-500 hover:text-amber-400 px-3 py-1.5">
            Switch to Merchant view →
          </Link>
          <div className="flex items-center gap-2.5 px-3 py-2">
            <span className="w-8 h-8 shrink-0 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center">
              {name.slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{name}</p>
              <p className="text-xs text-gray-500 truncate">{email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-40 flex items-center justify-between bg-gray-900 border-b border-gray-800 px-4 h-14">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-amber-500 text-white flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
            <span className="font-bold text-sm">Admin</span>
          </div>
          <div className="flex items-center gap-1">
            <NotificationBell tone="dark" />
            <button onClick={logout} aria-label="Sign out" className="text-gray-400 hover:text-red-400 p-1">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Desktop top bar */}
        <header className="hidden md:flex items-center justify-end gap-2 px-8 h-14 border-b border-gray-800 bg-gray-900/40">
          <NotificationBell tone="dark" />
        </header>

        <main className="flex-1 overflow-auto p-5 sm:p-8 pb-24 md:pb-8">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-gray-900 border-t border-gray-800 grid grid-cols-6 pb-[env(safe-area-inset-bottom)]">
        {navItems.map(({ href, short, Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
                active ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-amber-400' : 'text-gray-500'}`} />
              {short}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
