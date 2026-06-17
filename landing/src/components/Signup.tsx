'use client';

import { useState } from 'react';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return;
    setState('loading');
    setError('');
    try {
      const res = await fetch(`${BACKEND}/api/merchants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = typeof data.error === 'object'
          ? Object.values(data.error).flat().join(', ')
          : data.error ?? 'Registration failed.';
        setError(msg);
        setState('error');
        return;
      }
      setApiKey(data.apiKey);
      setState('success');
    } catch {
      setError('Could not connect to server. Please try again.');
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <section id="signup" className="py-24 px-6 bg-gray-50">
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-white rounded-2xl border border-green-100 p-10 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mx-auto mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Nego Bot!</h2>
            <p className="text-gray-500 text-sm mb-6">Your account is ready. Save your API key — it won't be shown again.</p>
            <div className="bg-gray-900 rounded-xl p-4 text-left mb-6">
              <p className="text-xs text-gray-400 mb-1 font-mono">YOUR API KEY</p>
              <p className="text-green-400 font-mono text-sm break-all">{apiKey}</p>
            </div>
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-violet-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-violet-700 transition-colors"
            >
              Open Dashboard →
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="signup" className="py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
        {/* Left: copy */}
        <div className="lg:w-1/2">
          <div className="badge inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-violet-700 mb-4">
            ✦ GET STARTED
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-5">
            Start closing smarter deals{' '}
            <span className="text-violet-600">today.</span>
          </h2>
          <p className="text-lg text-gray-500 mb-8 leading-relaxed">
            Create your merchant account in seconds. No credit card required for your first
            100 negotiations.
          </p>
          <div className="space-y-4">
            {[
              { icon: '✅', text: 'Free for first 100 negotiations' },
              { icon: '🔐', text: 'API key generated instantly' },
              { icon: '🚀', text: 'Widget live in under 5 minutes' },
              { icon: '📊', text: 'Full analytics dashboard included' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-gray-700 font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <div className="lg:w-1/2 w-full max-w-md mx-auto lg:mx-0">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-5"
          >
            <h3 className="text-xl font-bold text-gray-900">Create your free account</h3>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Store / Business Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                  placeholder="Acme Electronics"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                  placeholder="you@store.com"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  minLength={8}
                  placeholder="Min 8 characters"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={state === 'loading'}
              className="w-full bg-violet-600 text-white font-semibold py-3 rounded-xl hover:bg-violet-700 transition-colors shadow-md shadow-violet-100 disabled:opacity-50 text-sm"
            >
              {state === 'loading' ? 'Creating account…' : 'Create Free Account'}
            </button>

            <p className="text-xs text-gray-400 text-center">
              By signing up you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
