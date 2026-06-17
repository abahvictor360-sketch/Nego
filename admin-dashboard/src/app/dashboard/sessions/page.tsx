import { getSession } from '@/lib/session';
import { api, type Session } from '@/lib/api';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  agreed: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  active: 'bg-blue-100 text-blue-700',
  abandoned: 'bg-gray-100 text-gray-600',
};

const STATUSES = ['all', 'active', 'agreed', 'rejected', 'abandoned'] as const;

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function SessionsPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const session = await getSession();
  const all = await api.sessions.list(session!.apiKey).catch(() => [] as Session[]);

  const filtered = status && status !== 'all'
    ? all.filter(s => s.status === status)
    : all;

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sessions</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUSES.map(s => {
          const active = (status ?? 'all') === s;
          return (
            <Link
              key={s}
              href={`/dashboard/sessions?status=${s}`}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                active
                  ? 'bg-violet-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-violet-300'
              }`}
            >
              {s} {s === 'all' ? `(${all.length})` : `(${all.filter(x => x.status === s).length})`}
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-12">No sessions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  {['Session ID', 'Product', 'Channel', 'Status', 'Started', 'Duration', 'Final Price', 'Discount'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(s => {
                  const durationMs = s.endedAt
                    ? new Date(s.endedAt).getTime() - new Date(s.startedAt).getTime()
                    : null;
                  const duration = durationMs != null
                    ? durationMs < 60000
                      ? `${Math.round(durationMs / 1000)}s`
                      : `${Math.round(durationMs / 60000)}m`
                    : '—';

                  return (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-gray-400 text-xs">
                        {s.id.slice(-8)}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800 max-w-[160px] truncate">
                        {s.product.name}
                      </td>
                      <td className="px-4 py-3 text-gray-500 capitalize">{s.channel}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[s.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {new Date(s.startedAt).toLocaleDateString()} {new Date(s.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{duration}</td>
                      <td className="px-4 py-3 text-gray-800">
                        {s.finalAgreedPrice
                          ? `${s.product.currency} ${parseFloat(s.finalAgreedPrice).toFixed(2)}`
                          : '—'}
                      </td>
                      <td className="px-4 py-3">
                        {s.discountPercent
                          ? <span className="text-orange-600 font-medium">{parseFloat(s.discountPercent).toFixed(1)}%</span>
                          : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
