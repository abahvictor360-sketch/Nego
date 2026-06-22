'use client';

import { useState, useTransition } from 'react';
import { Send, CheckCircle2, Circle, Clock } from 'lucide-react';
import { replyToTicket, setTicketStatus } from './actions';

interface TicketMessage {
  id: string;
  authorRole: 'merchant' | 'admin';
  body: string;
  createdAt: string;
}
export interface AdminTicket {
  id: string;
  subject: string;
  status: 'open' | 'pending' | 'closed';
  priority: 'low' | 'normal' | 'high';
  createdAt: string;
  updatedAt: string;
  merchant: { name: string; email: string; plan: string };
  messages: TicketMessage[];
}

const STATUS_META: Record<string, { label: string; cls: string; Icon: typeof Circle }> = {
  open: { label: 'Open', cls: 'text-blue-400 bg-blue-500/10', Icon: Circle },
  pending: { label: 'Pending', cls: 'text-green-800 bg-green-900/10', Icon: Clock },
  closed: { label: 'Closed', cls: 'text-gray-500 bg-gray-700/40', Icon: CheckCircle2 },
};

export default function SupportClient({ initialTickets }: { initialTickets: AdminTicket[] }) {
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedId, setSelectedId] = useState<string | null>(initialTickets[0]?.id ?? null);
  const [reply, setReply] = useState('');
  const [pending, startTransition] = useTransition();

  const selected = tickets.find(t => t.id === selectedId) ?? null;

  function patchTicket(id: string, patch: Partial<AdminTicket>) {
    setTickets(prev => prev.map(t => (t.id === id ? { ...t, ...patch } : t)));
  }

  function sendReply() {
    if (!selected || !reply.trim()) return;
    const body = reply.trim();
    startTransition(async () => {
      const res = await replyToTicket(selected.id, body);
      if (!res.error && res.data) {
        patchTicket(selected.id, { messages: res.data.messages, status: res.data.status });
        setReply('');
      }
    });
  }

  function changeStatus(status: 'open' | 'pending' | 'closed') {
    if (!selected) return;
    startTransition(async () => {
      const res = await setTicketStatus(selected.id, status);
      if (!res.error) patchTicket(selected.id, { status });
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Support</h1>
        <p className="text-sm text-gray-500 mt-1">{tickets.filter(t => t.status !== 'closed').length} open tickets</p>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-4">
        {/* Ticket list */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden max-h-[70vh] overflow-y-auto">
          {tickets.length === 0 && <p className="p-6 text-sm text-gray-500">No tickets yet.</p>}
          {tickets.map(t => {
            const meta = STATUS_META[t.status];
            const active = t.id === selectedId;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedId(t.id)}
                className={`w-full text-left px-4 py-3 border-b border-gray-200 transition-colors ${
                  active ? 'bg-green-900/10' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900 truncate">{t.subject}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${meta.cls}`}>{meta.label}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{t.merchant.name} · {t.merchant.email}</p>
              </button>
            );
          })}
        </div>

        {/* Conversation */}
        <div className="bg-white rounded-2xl border border-gray-200 flex flex-col min-h-[70vh]">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">Select a ticket</div>
          ) : (
            <>
              <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-semibold text-gray-900 truncate">{selected.subject}</h2>
                  <p className="text-xs text-gray-500">
                    {selected.merchant.name} · {selected.merchant.email} ·{' '}
                    <span className="capitalize">{selected.merchant.plan}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {(['open', 'pending', 'closed'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => changeStatus(s)}
                      disabled={pending}
                      className={`text-xs px-2.5 py-1 rounded-md capitalize transition-colors disabled:opacity-50 ${
                        selected.status === s
                          ? STATUS_META[s].cls + ' font-semibold'
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {selected.messages.map(m => (
                  <div key={m.id} className={`flex ${m.authorRole === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                        m.authorRole === 'admin'
                          ? 'bg-green-900 text-white rounded-tr-sm'
                          : 'bg-gray-100 text-gray-900 rounded-tl-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.body}</p>
                      <p className={`text-[10px] mt-1 ${m.authorRole === 'admin' ? 'text-green-900/70' : 'text-gray-500'}`}>
                        {m.authorRole === 'admin' ? 'You' : selected.merchant.name} · {new Date(m.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200 flex items-end gap-2">
                <textarea
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) sendReply(); }}
                  rows={2}
                  placeholder="Type your reply… (Ctrl+Enter to send)"
                  className="flex-1 bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder-gray-500 outline-none focus:border-green-800 resize-none"
                />
                <button
                  onClick={sendReply}
                  disabled={pending || !reply.trim()}
                  className="bg-green-900 text-white font-semibold p-2.5 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
