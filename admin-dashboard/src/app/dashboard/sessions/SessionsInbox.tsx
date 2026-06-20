'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search, ArrowLeft, ExternalLink, Info, X, MessageSquare, User,
  Tag, Clock, Hash, Radio, ShoppingBag,
} from 'lucide-react';
import type { Session, SessionDetail, Message } from '@/lib/api';

// ─── helpers ──────────────────────────────────────────────────────────────

const STATUS_META: Record<string, { label: string; dot: string; pill: string }> = {
  active:    { label: 'Active',    dot: 'bg-blue-500',  pill: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300' },
  agreed:    { label: 'Agreed',    dot: 'bg-green-500', pill: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300' },
  rejected:  { label: 'Rejected',  dot: 'bg-red-500',   pill: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300' },
  abandoned: { label: 'Abandoned', dot: 'bg-gray-400',  pill: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' },
};

const AVATAR_COLORS = [
  'bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500',
  'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-pink-500',
];

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function customerLabel(s: Session): string {
  if (s.customerIdentifier) {
    if (s.customerIdentifier.includes('@')) return s.customerIdentifier;
    return `Guest ${s.customerIdentifier.slice(0, 6)}`;
  }
  return `Guest ${s.id.slice(-5)}`;
}

function avatarInitials(label: string): string {
  const parts = label.replace(/[^a-zA-Z0-9 ]/g, '').trim().split(/\s+/);
  return (parts[0]?.[0] ?? 'G').toUpperCase() + (parts[1]?.[0] ?? '').toUpperCase();
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function parseAssistant(raw: string): string {
  try {
    const obj = JSON.parse(raw) as { message?: string };
    return obj.message ?? raw;
  } catch {
    return raw;
  }
}

const FILTERS = ['all', 'active', 'agreed', 'rejected', 'abandoned'] as const;
type Filter = (typeof FILTERS)[number];

// ─── component ──────────────────────────────────────────────────────────────

export default function SessionsInbox({ initialSessions }: { initialSessions: Session[] }) {
  const [sessions] = useState(initialSessions);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<SessionDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const filtered = useMemo(() => {
    return sessions.filter(s => {
      if (filter !== 'all' && s.status !== filter) return false;
      if (query) {
        const hay = `${s.product.name} ${customerLabel(s)} ${s.channel}`.toLowerCase();
        if (!hay.includes(query.toLowerCase())) return false;
      }
      return true;
    });
  }, [sessions, filter, query]);

  const selected = sessions.find(s => s.id === selectedId) ?? null;

  const loadDetail = useCallback(async (id: string) => {
    setLoadingDetail(true);
    setDetail(null);
    try {
      const res = await fetch(`/api/sessions/${id}`, { cache: 'no-store' });
      if (res.ok) setDetail(await res.json());
    } catch { /* ignore */ }
    setLoadingDetail(false);
  }, []);

  useEffect(() => {
    if (selectedId) loadDetail(selectedId);
  }, [selectedId, loadDetail]);

  return (
    <div className="flex flex-col h-[calc(100dvh-10.5rem)] md:h-[calc(100dvh-8rem)] min-h-[460px]">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Conversations</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{sessions.length} negotiation sessions</p>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* ── List panel ── */}
        <aside className={`${selectedId ? 'hidden' : 'flex'} lg:flex w-full lg:w-[300px] shrink-0 flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden`}>
          <div className="p-3 border-b border-gray-100 dark:border-gray-800 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search conversations…"
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white pl-9 pr-3 py-2 text-sm outline-none focus:border-violet-500"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto">
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                    filter === f
                      ? 'bg-violet-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6 text-gray-400">
                <MessageSquare className="w-8 h-8 mb-2" />
                <p className="text-sm">No conversations found</p>
              </div>
            ) : (
              filtered.map(s => {
                const label = customerLabel(s);
                const meta = STATUS_META[s.status] ?? STATUS_META.abandoned;
                const active = s.id === selectedId;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedId(s.id)}
                    className={`w-full text-left px-3 py-3 flex gap-3 border-b border-gray-50 dark:border-gray-800/60 transition-colors ${
                      active ? 'bg-violet-50 dark:bg-violet-500/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <span className={`w-10 h-10 shrink-0 rounded-full ${AVATAR_COLORS[hash(s.id) % AVATAR_COLORS.length]} text-white text-sm font-semibold flex items-center justify-center`}>
                      {avatarInitials(label)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">{label}</span>
                        <span className="text-[11px] text-gray-400 shrink-0">{relativeTime(s.startedAt)}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{s.product.name}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                        <span className="text-[11px] text-gray-400 capitalize">{meta.label} · {s.channel}</span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* ── Thread panel ── */}
        <section className={`${selectedId ? 'flex' : 'hidden'} lg:flex flex-1 flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden min-w-0`}>
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 px-6 text-center">
              <MessageSquare className="w-10 h-10 mb-3" />
              <p className="text-sm">Select a conversation to view the negotiation.</p>
            </div>
          ) : (
            <ThreadView
              session={selected}
              detail={detail}
              loading={loadingDetail}
              onBack={() => { setSelectedId(null); setShowInfo(false); }}
              onToggleInfo={() => setShowInfo(v => !v)}
            />
          )}
        </section>

        {/* ── Info panel (persistent on xl) ── */}
        {selected && (
          <aside className="hidden xl:flex w-[300px] shrink-0 flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-y-auto">
            <InfoPanel session={selected} detail={detail} />
          </aside>
        )}
      </div>

      {/* ── Info drawer (below xl) ── */}
      {selected && showInfo && (
        <div className="xl:hidden fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowInfo(false)} />
          <div className="relative w-80 max-w-[85vw] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Details</span>
              <button onClick={() => setShowInfo(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <InfoPanel session={selected} detail={detail} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Thread ──────────────────────────────────────────────────────────────

function ThreadView({
  session, detail, loading, onBack, onToggleInfo,
}: {
  session: Session;
  detail: SessionDetail | null;
  loading: boolean;
  onBack: () => void;
  onToggleInfo: () => void;
}) {
  const label = customerLabel(session);
  const meta = STATUS_META[session.status] ?? STATUS_META.abandoned;
  const messages = (detail?.messages ?? []).filter(m => m.role !== 'system');

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <button onClick={onBack} className="lg:hidden text-gray-400 hover:text-gray-700 dark:hover:text-white p-1 -ml-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className={`w-9 h-9 shrink-0 rounded-full ${AVATAR_COLORS[hash(session.id) % AVATAR_COLORS.length]} text-white text-sm font-semibold flex items-center justify-center`}>
          {avatarInitials(label)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{label}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session.product.name}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-md ${meta.pill}`}>{meta.label}</span>
        {session.status === 'agreed' && session.checkoutUrl && (
          <a
            href={session.checkoutUrl}
            target="_blank"
            rel="noreferrer"
            title="Open checkout URL"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
          >
            Checkout <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
        <button onClick={onToggleInfo} className="xl:hidden text-gray-400 hover:text-gray-700 dark:hover:text-white p-1" title="Details">
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/60 dark:bg-gray-950/40">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm gap-2">
            <span className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
            Loading…
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-10">No messages in this conversation.</p>
        ) : (
          messages.map(m => <Bubble key={m.id} msg={m} channel={session.channel} avatarSeed={session.id} customer={label} />)
        )}
      </div>

      <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 text-center shrink-0">
        <p className="text-xs text-gray-400">This is a read-only transcript handled automatically by your negotiation bot.</p>
      </div>
    </>
  );
}

function Bubble({ msg, channel, avatarSeed, customer }: { msg: Message; channel: string; avatarSeed: string; customer: string }) {
  const isBot = msg.role === 'assistant';
  const text = isBot ? parseAssistant(msg.content) : msg.content;
  const time = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isBot) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[78%]">
          <div className="bg-violet-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-relaxed">{text}</div>
          <p className="text-[11px] text-gray-400 mt-1 text-right">{time} · via {channel}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start gap-2">
      <span className={`w-7 h-7 shrink-0 rounded-full ${AVATAR_COLORS[hash(avatarSeed) % AVATAR_COLORS.length]} text-white text-[11px] font-semibold flex items-center justify-center mt-0.5`}>
        {avatarInitials(customer)}
      </span>
      <div className="max-w-[78%]">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed">{text}</div>
        <p className="text-[11px] text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
}

// ─── Info panel ──────────────────────────────────────────────────────────

function InfoRow({ Icon, label, value }: { Icon: typeof Tag; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[11px] text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm text-gray-800 dark:text-gray-200 break-words">{value}</p>
      </div>
    </div>
  );
}

function InfoPanel({ session, detail }: { session: Session; detail: SessionDetail | null }) {
  const label = customerLabel(session);
  const meta = STATUS_META[session.status] ?? STATUS_META.abandoned;
  const cur = session.product.currency;
  const listPrice = parseFloat(session.product.listPrice);
  const finalPrice = session.finalAgreedPrice ? parseFloat(session.finalAgreedPrice) : null;
  const discount = session.discountPercent ? parseFloat(session.discountPercent) : null;
  const msgCount = (detail?.messages ?? []).filter(m => m.role !== 'system').length;

  const durationMs = session.endedAt ? new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime() : null;
  const duration = durationMs == null ? 'ongoing'
    : durationMs < 60000 ? `${Math.round(durationMs / 1000)}s`
    : `${Math.round(durationMs / 60000)}m`;

  return (
    <div className="p-5 space-y-6">
      {/* Customer */}
      <div className="flex flex-col items-center text-center">
        <span className={`w-16 h-16 rounded-full ${AVATAR_COLORS[hash(session.id) % AVATAR_COLORS.length]} text-white text-xl font-bold flex items-center justify-center mb-2`}>
          {avatarInitials(label)}
        </span>
        <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
        <span className={`mt-1 text-xs font-medium px-2 py-0.5 rounded-md ${meta.pill}`}>{meta.label}</span>
      </div>

      {/* General info */}
      <section>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">General info</h3>
        <div className="space-y-3">
          <InfoRow Icon={ShoppingBag} label="Product" value={session.product.name} />
          <InfoRow Icon={Tag} label="List price" value={`${cur} ${listPrice.toFixed(2)}`} />
          <InfoRow Icon={Radio} label="Channel" value={session.channel} />
          <InfoRow Icon={Clock} label="Started" value={new Date(session.startedAt).toLocaleString()} />
          {session.customerIdentifier && <InfoRow Icon={User} label="Customer ID" value={session.customerIdentifier} />}
        </div>
      </section>

      {/* Deal outcome */}
      <section className="border-t border-gray-100 dark:border-gray-800 pt-5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Deal outcome</h3>
        <div className="space-y-3">
          <InfoRow Icon={Tag} label="Final price" value={finalPrice != null ? `${cur} ${finalPrice.toFixed(2)}` : '—'} />
          <InfoRow Icon={Tag} label="Discount" value={discount != null ? `${discount.toFixed(1)}%` : '—'} />
          {session.status === 'agreed' && session.checkoutUrl && (
            <a
              href={session.checkoutUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:underline"
            >
              Open checkout <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </section>

      {/* Additional */}
      <section className="border-t border-gray-100 dark:border-gray-800 pt-5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Additional info</h3>
        <div className="space-y-3">
          <InfoRow Icon={MessageSquare} label="Messages" value={String(msgCount)} />
          <InfoRow Icon={Clock} label="Duration" value={duration} />
          <InfoRow Icon={Hash} label="Session ID" value={session.id} />
        </div>
      </section>
    </div>
  );
}
