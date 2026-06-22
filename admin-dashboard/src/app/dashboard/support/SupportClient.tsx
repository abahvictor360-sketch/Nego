'use client';

import { useState, useTransition } from 'react';
import { Plus, Send, LifeBuoy, ArrowLeft, Circle, Clock, CheckCircle2 } from 'lucide-react';
import { createTicketAction, replyTicketAction } from './actions';

interface TicketMessage {
  id: string;
  authorRole: 'merchant' | 'admin';
  body: string;
  createdAt: string;
}
export interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'pending' | 'closed';
  priority: 'low' | 'normal' | 'high';
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

const STATUS_META: Record<string, { label: string; cls: string; Icon: typeof Circle }> = {
  open: { label: 'Open', cls: 'text-blue-600 bg-blue-50', Icon: Circle },
  pending: { label: 'Awaiting you', cls: 'text-amber-600 bg-amber-50', Icon: Clock },
  closed: { label: 'Closed', cls: 'text-gray-500 bg-gray-100', Icon: CheckCircle2 },
};

export default function SupportClient({ initialTickets }: { initialTickets: Ticket[] }) {
  const [tickets, setTickets] = useState(initialTickets);
  const [view, setView] = useState<'list' | 'new' | string>('list');
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState('');

  // New ticket form
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high'>('normal');

  // Reply
  const [reply, setReply] = useState('');

  const selected = typeof view === 'string' && view !== 'list' && view !== 'new'
    ? tickets.find(t => t.id === view) ?? null
    : null;

  function submitNew() {
    setError('');
    startTransition(async () => {
      const res = await createTicketAction(subject, message, priority);
      if (res.error) { setError(res.error); return; }
      setTickets(prev => [res.data, ...prev]);
      setSubject(''); setMessage(''); setPriority('normal');
      setView(res.data.id);
    });
  }

  function submitReply() {
    if (!selected || !reply.trim()) return;
    const body = reply.trim();
    startTransition(async () => {
      const res = await replyTicketAction(selected.id, body);
      if (res.error) { setError(res.error); return; }
      setTickets(prev => prev.map(t => (t.id === selected.id ? res.data : t)));
      setReply('');
    });
  }

  // ── New ticket view ──
  if (view === 'new') {
    return (
      <div className="max-w-xl">
        <button onClick={() => setView('list')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">New support ticket</h1>
        <p className="text-sm text-gray-500 mb-6">Our team typically replies within one business day.</p>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
          {error && <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Brief summary of your issue"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
            <select value={priority} onChange={e => setPriority(e.target.value as 'low' | 'normal' | 'high')}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500 bg-white">
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Message</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} placeholder="Describe your issue in detail…"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 resize-none" />
          </div>
          <button onClick={submitNew} disabled={pending}
            className="bg-green-600 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
            {pending ? 'Submitting…' : 'Submit ticket'}
          </button>
        </div>
      </div>
    );
  }

  // ── Single ticket view ──
  if (selected) {
    const meta = STATUS_META[selected.status];
    return (
      <div className="max-w-2xl">
        <button onClick={() => setView('list')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4">
          <ArrowLeft className="w-4 h-4" /> All tickets
        </button>
        <div className="flex items-center justify-between gap-3 mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{selected.subject}</h1>
          <span className={`text-xs font-semibold px-2 py-1 rounded-md ${meta.cls}`}>{meta.label}</span>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-3 mb-4">
          {selected.messages.map(m => (
            <div key={m.id} className={`flex ${m.authorRole === 'merchant' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                m.authorRole === 'merchant' ? 'bg-green-600 text-white rounded-tr-sm' : 'bg-gray-100 text-gray-800 rounded-tl-sm'
              }`}>
                <p className="whitespace-pre-wrap">{m.body}</p>
                <p className={`text-[10px] mt-1 ${m.authorRole === 'merchant' ? 'text-green-200' : 'text-gray-400'}`}>
                  {m.authorRole === 'merchant' ? 'You' : 'Support'} · {new Date(m.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {selected.status !== 'closed' ? (
          <div className="flex items-end gap-2">
            <textarea value={reply} onChange={e => setReply(e.target.value)} rows={2} placeholder="Type your reply…"
              className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 resize-none" />
            <button onClick={submitReply} disabled={pending || !reply.trim()}
              className="bg-green-600 text-white p-2.5 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50">
              <Send className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-2">This ticket is closed.</p>
        )}
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </div>
    );
  }

  // ── List view ──
  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Support</h1>
          <p className="text-sm text-gray-500 mt-0.5">Get help from the Nego Bot team.</p>
        </div>
        <button onClick={() => setView('new')}
          className="inline-flex items-center gap-1.5 bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
          <Plus className="w-4 h-4" /> New ticket
        </button>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-10 text-center">
          <LifeBuoy className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No tickets yet. Need a hand? Open your first one.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 overflow-hidden">
          {tickets.map(t => {
            const meta = STATUS_META[t.status];
            const last = t.messages[t.messages.length - 1];
            return (
              <button key={t.id} onClick={() => setView(t.id)} className="w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="font-medium text-gray-900 dark:text-white truncate">{t.subject}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-md shrink-0 ${meta.cls}`}>{meta.label}</span>
                </div>
                {last && <p className="text-sm text-gray-500 truncate">{last.authorRole === 'admin' ? 'Support: ' : ''}{last.body}</p>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
