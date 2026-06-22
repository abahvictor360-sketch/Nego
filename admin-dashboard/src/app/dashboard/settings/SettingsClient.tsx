'use client';

import { useActionState, useState } from 'react';
import { changePasswordAction, updateBotSettingsAction } from './actions';
import { Copy, Check, KeyRound, Lock, Bot, Globe } from 'lucide-react';
import InstallApp from '@/components/InstallApp';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'pidgin', label: 'Nigerian Pidgin English' },
  { code: 'ha', label: 'Hausa' },
  { code: 'yo', label: 'Yoruba' },
  { code: 'ig', label: 'Igbo' },
  { code: 'es', label: 'Spanish (Español)' },
  { code: 'fr', label: 'French (Français)' },
  { code: 'pt', label: 'Portuguese (Português)' },
  { code: 'ar', label: 'Arabic (العربية)' },
  { code: 'zh', label: 'Mandarin Chinese (中文)' },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

interface Props {
  name: string;
  email: string;
  apiKey: string;
  botName: string;
  language: string;
  widgetBaseUrl: string;
}

export default function SettingsClient({ name, email, apiKey, botName, language, widgetBaseUrl }: Props) {
  const [pwState, pwAction, pwPending] = useActionState(changePasswordAction, null);
  const [botState, botAction, botPending] = useActionState(updateBotSettingsAction, null);

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>

      {/* Account info */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Account</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[{ label: 'Name', value: name }, { label: 'Email', value: email }].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bot Negotiator Settings */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-green-600" />
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Bot Negotiator</h2>
        </div>
        <p className="text-xs text-gray-400">Customise how your AI negotiator introduces itself and what language it speaks.</p>

        {botState?.success && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
            <Check className="w-4 h-4" /> Bot settings saved.
          </div>
        )}
        {botState?.error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
            {botState.error}
          </div>
        )}

        <form action={botAction} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Bot Name <span className="text-gray-400">(what customers see)</span>
            </label>
            <input
              type="text"
              name="botName"
              defaultValue={botName}
              maxLength={50}
              placeholder="Max"
              required
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Negotiation Language
            </label>
            <select
              name="language"
              defaultValue={language}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all bg-white"
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">Your bot will negotiate with customers in this language.</p>
          </div>

          <button
            type="submit"
            disabled={botPending}
            className="bg-green-600 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {botPending ? 'Saving…' : 'Save Bot Settings'}
          </button>
        </form>
      </section>

      {/* Install as PWA */}
      <InstallApp />

      {/* API Key */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-3">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-green-600" />
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">API Key</h2>
        </div>
        <p className="text-xs text-gray-400">Use this key in your widget embed code and API requests.</p>
        <div className="flex items-center gap-3 bg-gray-900 rounded-xl px-4 py-3">
          <code className="flex-1 text-green-400 font-mono text-sm break-all">{apiKey}</code>
          <CopyButton text={apiKey} />
        </div>
      </section>

      {/* Embed snippet */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Widget Embed Code</h2>
        <p className="text-xs text-gray-400">
          Add this to any product page. Replace <code className="bg-gray-100 px-1 rounded">PRODUCT_ID</code> with the product ID from your Products page.
        </p>
        {(['web', 'instore_qr'] as const).map(channel => {
          const snippet = [
            `<!-- Nego Bot Widget (${channel}) -->`,
            `<link rel="stylesheet" href="${widgetBaseUrl}/nego-widget.css" />`,
            `<div`,
            `  data-nego-product="PRODUCT_ID"`,
            `  data-nego-api-key="${apiKey}"`,
            `  data-nego-api-url="${widgetBaseUrl.replace('/nego-widget.css', '')}"`,
            channel === 'instore_qr' ? `  data-nego-channel="instore_qr"` : null,
            `></div>`,
            `<script src="${widgetBaseUrl}/nego-widget.umd.js"></script>`,
          ].filter(Boolean).join('\n');

          return (
            <div key={channel}>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-medium text-gray-600 capitalize">{channel.replace('_', ' ')} channel</p>
                <CopyButton text={snippet} />
              </div>
              <pre className="bg-gray-900 text-gray-300 text-xs rounded-xl p-4 overflow-x-auto leading-relaxed font-mono whitespace-pre-wrap">
                {snippet}
              </pre>
            </div>
          );
        })}
      </section>

      {/* Change password */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-green-600" />
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Change Password</h2>
        </div>

        {pwState?.success && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
            <Check className="w-4 h-4" /> Password updated successfully.
          </div>
        )}
        {pwState?.error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
            {pwState.error}
          </div>
        )}

        <form action={pwAction} className="space-y-3">
          {([
            { name: 'currentPassword', label: 'Current password' },
            { name: 'newPassword', label: 'New password' },
            { name: 'confirmPassword', label: 'Confirm new password' },
          ] as const).map(({ name, label }) => (
            <div key={name}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input
                type="password"
                name={name}
                required
                minLength={name !== 'currentPassword' ? 8 : undefined}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={pwPending}
            className="bg-green-600 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {pwPending ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </section>
    </div>
  );
}
