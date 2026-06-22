'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { adminLoginAction } from './actions';

export default function AdminLoginPage() {
  const router = useRouter();
  const [state, action, pending] = useActionState(adminLoginAction, null);

  useEffect(() => {
    if (state?.success) {
      router.push('/admin/dashboard');
    }
  }, [state, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-900 text-gray-900 mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Nego Platform Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Restricted access — platform administrators only</p>
        </div>

        <form action={action} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          {state?.error && (
            <div className="rounded-lg bg-red-900/40 border border-red-700 px-3 py-2 text-sm text-red-300">
              {state.error}
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-900 outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800 placeholder-gray-500"
              placeholder="admin@example.com"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-900 outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={pending || state?.success}
            className="w-full rounded-lg bg-green-900 px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-green-600 disabled:opacity-50 transition-colors"
          >
            {pending || state?.success ? 'Signing in…' : 'Sign in as Admin'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Not an admin?{' '}
            <Link href="/login" className="font-semibold text-green-800 hover:text-green-300">
              Merchant login →
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
