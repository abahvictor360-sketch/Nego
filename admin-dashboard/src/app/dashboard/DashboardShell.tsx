'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3, Package, MessageSquare, SquarePen, MessageCircle, Settings, Menu, X,
  type LucideIcon,
} from 'lucide-react';
import LogoutButton from './LogoutButton';

const navItems: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: '/dashboard', label: 'Analytics', Icon: BarChart3 },
  { href: '/dashboard/products', label: 'Products', Icon: Package },
  { href: '/dashboard/sessions', label: 'Sessions', Icon: MessageSquare },
  { href: '/dashboard/content', label: 'Landing Page', Icon: SquarePen },
  { href: '/dashboard/settings', label: 'Settings', Icon: Settings },
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

function SidebarContent({ name, email, pathname }: { name: string; email: string; pathname: string }) {
  return (
    <>
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
    </>
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
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 bg-white border-r border-gray-200 flex-col">
        <SidebarContent name={name} email={email} pathname={pathname} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute top-4 right-3 text-gray-400 hover:text-gray-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent name={name} email={email} pathname={pathname} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-40 flex items-center gap-3 bg-white border-b border-gray-200 px-4 h-14">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="text-gray-600 hover:text-gray-900 p-1 -ml-1"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-violet-600 text-white flex items-center justify-center">
              <MessageCircle className="w-3.5 h-3.5" />
            </span>
            <span className="font-bold text-gray-900 text-sm">Nego Bot</span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
