import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { api, type Message } from '@/lib/api';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  agreed:    'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300',
  rejected:  'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  active:    'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  abandoned: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
};

/** Parse assistant message content — may be JSON or plain text. */
function parseAssistantContent(raw: string): string {
  try {
    const obj = JSON.parse(raw) as { message?: string; status?: string };
    return obj.message ?? raw;
  } catch {
    return raw;
  }
}

function ChatBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  const text = isUser ? msg.content : parseAssistantContent(msg.content);
  const time = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[72%] space-y-1">
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? 'bg-green-600 text-white rounded-br-sm'
              : 'bg-white border border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 rounded-bl-sm'
          }`}
        >
          {text}
        </div>
        <p className={`text-xs text-gray-400 dark:text-gray-500 ${isUser ? 'text-right' : 'text-left'}`}>{time}</p>
      </div>
    </div>
  );
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SessionDetailPage({ params }: Props) {
  const { id } = await params;
  const auth = await getSession();
  const session = await api.sessions.get(auth!.apiKey, id).catch(() => null);

  if (!session) notFound();

  const { product } = session;
  const listPrice = parseFloat(product.listPrice);
  const finalPrice = session.finalAgreedPrice ? parseFloat(session.finalAgreedPrice) : null;
  const discount = session.discountPercent ? parseFloat(session.discountPercent) : null;

  const durationMs = session.endedAt
    ? new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()
    : null;
  const duration = durationMs == null ? 'ongoing'
    : durationMs < 60_000 ? `${Math.round(durationMs / 1000)}s`
    : `${Math.round(durationMs / 60_000)}m`;

  const visibleMessages = session.messages.filter(m => m.role !== 'system');

  return (
    <div className="max-w-3xl">
      {/* Back */}
      <Link
        href="/dashboard/sessions"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to sessions
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[session.status] ?? 'bg-gray-100 text-gray-600'}`}>
              {session.status}
            </span>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500 font-mono">{session.id}</p>
        </div>
        {session.status === 'agreed' && session.checkoutUrl && (
          <a
            href={session.checkoutUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 dark:text-green-300 dark:bg-green-500/15 dark:hover:bg-green-500/25 px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            Checkout URL <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'List Price',    value: `${product.currency} ${listPrice.toFixed(2)}` },
          { label: 'Final Price',   value: finalPrice ? `${product.currency} ${finalPrice.toFixed(2)}` : '—' },
          { label: 'Discount',      value: discount ? `${discount.toFixed(1)}%` : '—' },
          { label: 'Duration',      value: duration },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium">{label}</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{value}</p>
          </div>
        ))}
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <span>Channel: <span className="text-gray-700 dark:text-gray-200 capitalize font-medium">{session.channel}</span></span>
        <span>Started: <span className="text-gray-700 dark:text-gray-200 font-medium">{new Date(session.startedAt).toLocaleString()}</span></span>
        {session.endedAt && (
          <span>Ended: <span className="text-gray-700 dark:text-gray-200 font-medium">{new Date(session.endedAt).toLocaleString()}</span></span>
        )}
        <span>Messages: <span className="text-gray-700 dark:text-gray-200 font-medium">{visibleMessages.length}</span></span>
      </div>

      {/* Chat transcript */}
      <div className="bg-gray-50 rounded-2xl border border-gray-200 dark:bg-gray-950/40 dark:border-gray-800 p-4 space-y-3 min-h-[200px]">
        {visibleMessages.length === 0 ? (
          <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-8">No messages yet.</p>
        ) : (
          visibleMessages.map(msg => <ChatBubble key={msg.id} msg={msg} />)
        )}
      </div>
    </div>
  );
}
