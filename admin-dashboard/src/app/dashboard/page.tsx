import { getSession } from '@/lib/session';
import { api, type Session } from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import {
  MessageSquare, Handshake, TrendingUp, Tag, DollarSign, type LucideIcon,
} from 'lucide-react';

function computeAnalytics(sessions: Session[]) {
  const total = sessions.length;
  const agreed = sessions.filter(s => s.status === 'agreed');
  const dealRate = total > 0 ? (agreed.length / total) * 100 : 0;
  const avgDiscount =
    agreed.length > 0
      ? agreed.reduce((sum, s) => sum + parseFloat(s.discountPercent ?? '0'), 0) / agreed.length
      : 0;
  const revenue = agreed.reduce((sum, s) => sum + parseFloat(s.finalAgreedPrice ?? '0'), 0);
  const currency = agreed[0]?.product.currency ?? 'USD';
  return { total, agreed: agreed.length, dealRate, avgDiscount, revenue, currency };
}

function StatCard({
  label, value, sub, Icon, color,
}: {
  label: string; value: string; sub?: string; Icon: LucideIcon; color: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 transition-shadow hover:shadow-sm">
      <span className={`inline-flex w-9 h-9 rounded-lg items-center justify-center mb-3 ${color}`}>
        <Icon className="w-5 h-5" />
      </span>
      <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
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
      <PageHeader title="Analytics" subtitle="Your negotiation performance at a glance" />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Sessions" value={stats.total.toString()} Icon={MessageSquare} color="bg-violet-50 text-violet-600" />
        <StatCard label="Deals Closed" value={stats.agreed.toString()} Icon={Handshake} color="bg-green-50 text-green-600" />
        <StatCard label="Deal Rate" value={`${stats.dealRate.toFixed(1)}%`} sub="agreed / total" Icon={TrendingUp} color="bg-blue-50 text-blue-600" />
        <StatCard label="Avg Discount" value={`${stats.avgDiscount.toFixed(1)}%`} sub="on agreed deals" Icon={Tag} color="bg-orange-50 text-orange-600" />
        <StatCard label="Revenue" value={`${stats.currency} ${stats.revenue.toFixed(2)}`} sub="from closed deals" Icon={DollarSign} color="bg-emerald-50 text-emerald-600" />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white">Recent Sessions</h2>
        </div>
        {recent.length === 0 ? (
          <EmptyState
            Icon={MessageSquare}
            title="No sessions yet"
            description="Once customers start negotiating through your widget, their sessions will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">
                <tr>
                  {['Product', 'Channel', 'Status', 'Started', 'Price'].map(h => (
                    <th key={h} className="px-6 py-3 text-left font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {recent.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                    <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200 truncate max-w-[180px]">
                      {s.product.name}
                    </td>
                    <td className="px-6 py-3 text-gray-500 dark:text-gray-400 capitalize">{s.channel}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[s.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {new Date(s.startedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-gray-800 dark:text-gray-200 whitespace-nowrap">
                      {s.finalAgreedPrice
                        ? `${s.product.currency} ${parseFloat(s.finalAgreedPrice).toFixed(2)}`
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
