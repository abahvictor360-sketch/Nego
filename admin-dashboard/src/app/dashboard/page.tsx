import { getSession } from '@/lib/session';
import { api, type Session } from '@/lib/api';

function computeAnalytics(sessions: Session[]) {
  const total = sessions.length;
  const agreed = sessions.filter(s => s.status === 'agreed');
  const dealRate = total > 0 ? (agreed.length / total) * 100 : 0;
  const avgDiscount =
    agreed.length > 0
      ? agreed.reduce((sum, s) => sum + parseFloat(s.discountPercent ?? '0'), 0) / agreed.length
      : 0;
  const revenueFromDeals = agreed.reduce((sum, s) => sum + parseFloat(s.finalAgreedPrice ?? '0'), 0);
  return { total, agreed: agreed.length, dealRate, avgDiscount, revenueFromDeals };
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  agreed: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  active: 'bg-blue-100 text-blue-700',
  abandoned: 'bg-gray-100 text-gray-600',
};

export default async function DashboardPage() {
  const session = await getSession();
  const sessions = await api.sessions.list(session!.apiKey).catch(() => [] as Session[]);
  const stats = computeAnalytics(sessions);
  const recent = sessions.slice(0, 10);

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Sessions" value={stats.total.toString()} />
        <StatCard label="Deals Closed" value={stats.agreed.toString()} />
        <StatCard
          label="Deal Rate"
          value={`${stats.dealRate.toFixed(1)}%`}
          sub="agreed / total"
        />
        <StatCard
          label="Avg Discount"
          value={`${stats.avgDiscount.toFixed(1)}%`}
          sub="on agreed deals"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Sessions</h2>
        </div>
        {recent.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-12">No sessions yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                {['Product', 'Channel', 'Status', 'Started', 'Price'].map(h => (
                  <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recent.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-800 truncate max-w-[180px]">
                    {s.product.name}
                  </td>
                  <td className="px-6 py-3 text-gray-500 capitalize">{s.channel}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[s.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-500">
                    {new Date(s.startedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 text-gray-800">
                    {s.finalAgreedPrice
                      ? `${s.product.currency} ${parseFloat(s.finalAgreedPrice).toFixed(2)}`
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
