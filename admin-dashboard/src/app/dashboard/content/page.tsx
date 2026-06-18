'use client';

import { useState, useEffect } from 'react';
import { saveContentAction } from './actions';

type Tab = 'hero' | 'features' | 'how_it_works' | 'cta' | 'signup';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'hero', label: 'Hero', icon: '🚀' },
  { id: 'features', label: 'Features', icon: '⚙️' },
  { id: 'how_it_works', label: 'How It Works', icon: '📋' },
  { id: 'cta', label: 'CTA Section', icon: '📣' },
  { id: 'signup', label: 'Signup', icon: '✍️' },
];

function Field({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
        />
      )}
    </div>
  );
}

export default function ContentPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('hero');
  const [content, setContent] = useState<Record<string, any> | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${BACKEND}/api/content`)
      .then(r => r.json())
      .then(d => setContent(d))
      .catch(() => setError('Could not load content. Is the backend running?'));
  }, []);

  async function save() {
    if (!content) return;
    setSaving(true);
    setError('');
    const result = await saveContentAction(content);
    setSaving(false);
    if (result.error) { setError(result.error); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function set(section: string, key: string, value: string) {
    setContent(prev => prev ? { ...prev, [section]: { ...prev[section], [key]: value } } : prev);
  }

  function setNested(section: string, arrayKey: string, index: number, field: string, value: string) {
    setContent(prev => {
      if (!prev) return prev;
      const arr = [...(prev[section][arrayKey] ?? [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [section]: { ...prev[section], [arrayKey]: arr } };
    });
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center h-64">
        {error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
            Loading content…
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Landing Page Content</h1>
          <p className="text-sm text-gray-500 mt-0.5">Edit text shown on your public landing page</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-green-600 font-medium">✓ Saved</span>}
          {error && <span className="text-sm text-red-500">{error}</span>}
          <button
            onClick={save}
            disabled={saving}
            className="bg-violet-600 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              tab === t.id ? 'bg-white text-violet-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">

        {tab === 'hero' && (
          <>
            <Field label="Badge text" value={content.hero?.badge ?? ''} onChange={v => set('hero', 'badge', v)} />
            <Field label="Headline" value={content.hero?.headline ?? ''} onChange={v => set('hero', 'headline', v)} />
            <Field label="Subheadline" value={content.hero?.subheadline ?? ''} onChange={v => set('hero', 'subheadline', v)} multiline />
            <Field label="Primary CTA button" value={content.hero?.cta_primary ?? ''} onChange={v => set('hero', 'cta_primary', v)} />
            <Field label="Secondary CTA button" value={content.hero?.cta_secondary ?? ''} onChange={v => set('hero', 'cta_secondary', v)} />
          </>
        )}

        {tab === 'features' && (
          <>
            <Field label="Section badge" value={content.features?.badge ?? ''} onChange={v => set('features', 'badge', v)} />
            <Field label="Section title" value={content.features?.title ?? ''} onChange={v => set('features', 'title', v)} />
            <Field label="Section subtitle" value={content.features?.subtitle ?? ''} onChange={v => set('features', 'subtitle', v)} multiline />
            <hr className="border-gray-100" />
            {(content.features?.items ?? []).map((item: any, i: number) => (
              <div key={i} className="space-y-3 p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-bold text-violet-600 uppercase tracking-wide">Feature {i + 1}</p>
                <Field label="Icon (emoji)" value={item.icon ?? ''} onChange={v => setNested('features', 'items', i, 'icon', v)} />
                <Field label="Title" value={item.title ?? ''} onChange={v => setNested('features', 'items', i, 'title', v)} />
                <Field label="Description" value={item.description ?? ''} onChange={v => setNested('features', 'items', i, 'description', v)} multiline />
              </div>
            ))}
          </>
        )}

        {tab === 'how_it_works' && (
          <>
            <Field label="Section badge" value={content.how_it_works?.badge ?? ''} onChange={v => set('how_it_works', 'badge', v)} />
            <Field label="Section title" value={content.how_it_works?.title ?? ''} onChange={v => set('how_it_works', 'title', v)} />
            <Field label="Section subtitle" value={content.how_it_works?.subtitle ?? ''} onChange={v => set('how_it_works', 'subtitle', v)} multiline />
            <hr className="border-gray-100" />
            {(content.how_it_works?.steps ?? []).map((step: any, i: number) => (
              <div key={i} className="space-y-3 p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-bold text-violet-600 uppercase tracking-wide">Step {i + 1}</p>
                <Field label="Icon (emoji)" value={step.icon ?? ''} onChange={v => setNested('how_it_works', 'steps', i, 'icon', v)} />
                <Field label="Title" value={step.title ?? ''} onChange={v => setNested('how_it_works', 'steps', i, 'title', v)} />
                <Field label="Description" value={step.description ?? ''} onChange={v => setNested('how_it_works', 'steps', i, 'description', v)} multiline />
              </div>
            ))}
          </>
        )}

        {tab === 'cta' && (
          <>
            <Field label="Main headline" value={content.cta?.title ?? ''} onChange={v => set('cta', 'title', v)} />
            <Field label="Subtitle" value={content.cta?.subtitle ?? ''} onChange={v => set('cta', 'subtitle', v)} multiline />
            <Field label="Primary CTA button" value={content.cta?.cta_primary ?? ''} onChange={v => set('cta', 'cta_primary', v)} />
            <Field label="Secondary CTA button" value={content.cta?.cta_secondary ?? ''} onChange={v => set('cta', 'cta_secondary', v)} />
            <hr className="border-gray-100" />
            {(content.cta?.stats ?? []).map((stat: any, i: number) => (
              <div key={i} className="space-y-3 p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-bold text-violet-600 uppercase tracking-wide">Stat {i + 1}</p>
                <Field label="Icon (emoji)" value={stat.icon ?? ''} onChange={v => setNested('cta', 'stats', i, 'icon', v)} />
                <Field label="Label" value={stat.label ?? ''} onChange={v => setNested('cta', 'stats', i, 'label', v)} />
              </div>
            ))}
          </>
        )}

        {tab === 'signup' && (
          <>
            <Field label="Section badge" value={content.signup?.badge ?? ''} onChange={v => set('signup', 'badge', v)} />
            <Field label="Headline" value={content.signup?.title ?? ''} onChange={v => set('signup', 'title', v)} />
            <Field label="Subtitle" value={content.signup?.subtitle ?? ''} onChange={v => set('signup', 'subtitle', v)} multiline />
            <hr className="border-gray-100" />
            {(content.signup?.perks ?? []).map((perk: any, i: number) => (
              <div key={i} className="flex gap-3 items-center">
                <input
                  type="text"
                  value={perk.icon ?? ''}
                  onChange={e => setNested('signup', 'perks', i, 'icon', e.target.value)}
                  className="w-14 rounded-lg border border-gray-200 px-2 py-2 text-sm text-center outline-none focus:border-violet-500"
                  placeholder="emoji"
                />
                <input
                  type="text"
                  value={perk.text ?? ''}
                  onChange={e => setNested('signup', 'perks', i, 'text', e.target.value)}
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
                />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
