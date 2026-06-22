'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { MessageCircle, MailCheck } from 'lucide-react';
import { forgotPasswordAction } from './actions';

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(forgotPasswordAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-600 text-white mb-4">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Forgot your password?</h1>
          <p className="text-sm text-gray-500 mt-1">We&apos;ll email you a link to reset it.</p>
        </div>

        {state?.success ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 text-green-600">
              <MailCheck className="w-6 h-6" />
            </div>
            <h2 className="font-semibold text-gray-900">Check your inbox</h2>
            <p className="text-sm text-gray-500">
              If an account exists for that email, a reset link is on its way. The link expires in 1 hour.
            </p>
            <Link href="/login" className="inline-block text-sm font-semibold text-green-600 hover:text-green-700">
              Back to sign in
            </Link>
          </div>
        ) : (
          <form action={action} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
            {state?.error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {pending ? 'Sending…' : 'Send reset link'}
            </button>
            <p className="text-center text-sm text-gray-500">
              Remembered it?{' '}
              <Link href="/login" className="font-semibold text-green-600 hover:text-green-700">
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
