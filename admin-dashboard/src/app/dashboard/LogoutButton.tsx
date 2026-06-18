'use client';

import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
    >
      <LogOut className="w-4 h-4" />
      Sign out
    </button>
  );
}
