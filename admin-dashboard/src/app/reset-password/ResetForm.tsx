'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, CheckCircle2 } from 'lucide-react';
import { resetPasswordAction } from './actions';

export default function ResetForm({ token }: { token: string }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(resetPasswordAction, null);

  useEffect(() => {
    if (state?.success) {
      const t = setTimeout(() => router.push('/login'), 2500);
      return () => clearTimeout(t);
    }
  }, [state, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-600 text-white mb-4">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Set a new password</h1>
          <p className="text-sm text-gray-500 mt-1">Choose a strong password for your account.</p>
        </div>

        {state?.success ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 text-green-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="font-semibold text-gray-900">Password updated</h2>
            <p className="text-sm text-gray-500">Redirecting you to sign in…</p>
          </div>
        ) : !token ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center space-y-3">
            <p className="text-sm text-red-600">This reset link is missing its token. Request a new one.</p>
            <Link href="/forgot-password" className="inline-block text-sm font-semibold text-violet-600 hover:text-violet-700">
              Request a new link
            </Link>
          </div>
        ) : (
          <form action={action} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
            <input type="hidden" name="token" value={token} />
            {state?.error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                {state.error}
              </div>
            )}
            <div className="space-y-1">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New password</label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50 transition-colors"
            >
              {pending ? 'Updating…' : 'Reset password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
