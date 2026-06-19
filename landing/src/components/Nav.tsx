'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, X, Menu } from 'lucide-react';

const links = [
  { label: 'Features', href: '/#features' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Live Demo', href: '/demo' },
  { label: 'Pricing', href: '/pricing' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-gray-900">
          <span className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white">
            <MessageCircle className="w-4 h-4" />
          </span>
          <span className="text-lg tracking-tight">Nego<span className="text-violet-600">Bot</span></span>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <li key={l.label}>
              <Link
                href={l.href}
                className="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="https://nego-admin.vercel.app/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Login
          </Link>
          <Link
            href="https://nego-admin.vercel.app/signup"
            className="text-sm font-semibold bg-violet-600 text-white px-4 py-2 rounded-full hover:bg-violet-700 transition-colors shadow-sm shadow-violet-200"
          >
            Get Started Free
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(o => !o)}
          className="md:hidden text-gray-700 p-1"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3">
          {links.map(l => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-medium text-gray-700 py-2"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="https://nego-admin.vercel.app/signup"
            onClick={() => setMenuOpen(false)}
            className="block text-center text-sm font-semibold bg-violet-600 text-white px-4 py-2.5 rounded-full mt-2"
          >
            Get Started Free
          </Link>
        </div>
      )}
    </header>
  );
}
