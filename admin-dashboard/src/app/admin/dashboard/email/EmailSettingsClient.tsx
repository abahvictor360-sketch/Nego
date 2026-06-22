'use client';

import { useState, useTransition } from 'react';
import { Mail, Check, Send, ServerCog } from 'lucide-react';
import { saveEmailSettings, sendTestEmail } from './actions';

export interface EmailSettings {
  provider: 'log' | 'smtp' | 'resend';
  host: string;
  port: number;
  secure: boolean;
  user: string;
  from: string;
  passSet?: boolean;
  resendKeySet?: boolean;
}

const DEFAULTS: EmailSettings = {
  provider: 'log', host: '', port: 587, secure: false, user: '', from: 'Nego Bot <noreply@nego.bot>',
};

export default function EmailSettingsClient({ initial }: { initial: EmailSettings | null }) {
  const [s, setS] = useState<EmailSettings>({ ...DEFAULTS, ...(initial ?? {}) });
  const [pass, setPass] = useState('');
  const [resendApiKey, setResendApiKey] = useState('');
  const [testTo, setTestTo] = useState('');
  const [msg, setMsg] = useState<{ ok?: string; err?: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function field<K extends keyof EmailSettings>(key: K, value: EmailSettings[K]) {
    setS(prev => ({ ...prev, [key]: value }) as EmailSettings);
  }

  function save() {
    setMsg(null);
    startTransition(async () => {
      const payload: Record<string, unknown> = {
        provider: s.provider, host: s.host, port: Number(s.port), secure: s.secure, user: s.user, from: s.from,
      };
      if (pass) payload.pass = pass;
      if (resendApiKey) payload.resendApiKey = resendApiKey;
      const res = await saveEmailSettings(payload);
      if (res.error) { setMsg({ err: res.error }); return; }
      setPass(''); setResendApiKey('');
      setS(prev => ({ ...prev, ...res.data }));
      setMsg({ ok: 'Settings saved.' });
    });
  }

  function test() {
    setMsg(null);
    if (!testTo) { setMsg({ err: 'Enter a recipient for the test email.' }); return; }
    startTransition(async () => {
      const res = await sendTestEmail(testTo);
      if (res.error) { setMsg({ err: res.error }); return; }
      setMsg({ ok: res.data?.message ?? 'Test email sent.' });
    });
  }

  const inputCls = 'w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 outline-none focus:border-green-800';
  const labelCls = 'block text-xs font-medium text-gray-500 mb-1';

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Mail className="w-6 h-6 text-green-800" /> Email Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">Configure how the platform sends emails (password resets, etc.).</p>
      </div>

      {msg?.ok && (
        <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2.5">
          <Check className="w-4 h-4" /> {msg.ok}
        </div>
      )}
      {msg?.err && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5">{msg.err}</div>
      )}

      <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div>
          <label className={labelCls}>Provider</label>
          <select value={s.provider} onChange={e => field('provider', e.target.value as EmailSettings['provider'])} className={inputCls}>
            <option value="log">Log only (no real emails — for testing)</option>
            <option value="smtp">SMTP server</option>
            <option value="resend">Resend API</option>
          </select>
        </div>

        <div>
          <label className={labelCls}>From address</label>
          <input value={s.from} onChange={e => field('from', e.target.value)} placeholder="Nego Bot &lt;noreply@yourdomain.com&gt;" className={inputCls} />
        </div>

        {s.provider === 'smtp' && (
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2 text-green-800 text-sm font-medium"><ServerCog className="w-4 h-4" /> SMTP server</div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelCls}>Host</label>
                <input value={s.host} onChange={e => field('host', e.target.value)} placeholder="smtp.gmail.com" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Port</label>
                <input type="number" value={s.port} onChange={e => field('port', Number(e.target.value))} placeholder="587" className={inputCls} />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm text-gray-700 pb-2">
                  <input type="checkbox" checked={s.secure} onChange={e => field('secure', e.target.checked)} className="w-4 h-4 accent-green-800" />
                  Use SSL/TLS (port 465)
                </label>
              </div>
              <div>
                <label className={labelCls}>Username</label>
                <input value={s.user} onChange={e => field('user', e.target.value)} placeholder="you@yourdomain.com" className={inputCls} autoComplete="off" />
              </div>
              <div>
                <label className={labelCls}>Password {s.passSet && <span className="text-green-400">(set)</span>}</label>
                <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder={s.passSet ? '•••••••• (leave blank to keep)' : 'App password'} className={inputCls} autoComplete="new-password" />
              </div>
            </div>
          </div>
        )}

        {s.provider === 'resend' && (
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <label className={labelCls}>Resend API Key {s.resendKeySet && <span className="text-green-400">(set)</span>}</label>
            <input type="password" value={resendApiKey} onChange={e => setResendApiKey(e.target.value)} placeholder={s.resendKeySet ? 're_•••••• (leave blank to keep)' : 're_...'} className={inputCls} autoComplete="new-password" />
          </div>
        )}

        <button onClick={save} disabled={pending} className="bg-green-900 text-gray-950 text-sm font-semibold px-5 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
          {pending ? 'Saving…' : 'Save Settings'}
        </button>
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Send a test email</h2>
        <div className="flex gap-2">
          <input type="email" value={testTo} onChange={e => setTestTo(e.target.value)} placeholder="recipient@example.com" className={inputCls} />
          <button onClick={test} disabled={pending} className="shrink-0 inline-flex items-center gap-1.5 bg-gray-100 border border-gray-200 text-gray-900 text-sm font-medium px-4 py-2 rounded-lg hover:border-green-800 transition-colors disabled:opacity-50">
            <Send className="w-4 h-4" /> Send test
          </button>
        </div>
        <p className="text-xs text-gray-500">Save your settings first. With the &quot;Log only&quot; provider, the email is printed to the backend server logs.</p>
      </section>
    </div>
  );
}
