import { getSession } from '@/lib/session';
import { api, type Session } from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import { Money } from '@/components/CurrencyContext';
import {
  MessageSquare, Handshake, TrendingUp, DollarSign, ArrowUpRight, type LucideIcon,
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
  label, value, pill, Icon, filled = false,
}: {
  label: string; value: React.ReactNode; pill?: string; Icon: LucideIcon; filled?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 ${
        filled
          ? 'bg-green-900 text-white'
          : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800'
      }`}
    >
      <div className="flex items-start justify-between">
        <p className={`text-sm ${filled ? 'text-green-200' : 'text-gray-500 dark:text-gray-400'}`}>{label}</p>
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            filled ? 'bg-white/15 text-white' : 'border border-gray-200 dark:border-gray-700 text-gray-400'
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
        </span>
      </div>
      <p className={`text-3xl font-bold mt-3 ${filled ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{value}</p>
      {pill && (
        <span
          className={`inline-flex items-center gap-1 mt-3 rounded-full px-2.5 py-1 text-xs font-medium ${
            filled ? 'bg-white/15 text-white' : 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-300'
          }`}
        >
          <Icon className="w-3.5 h-3.5" /> {pill}
        </span>
      )}
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
    <div className="max-w-6xl">
      <PageHeader title="Performance Summary" subtitle="View your key negotiation metrics at a glance." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Revenue"
          value={<Money amount={stats.revenue} base={stats.currency} />}
          pill="from closed deals"
          Icon={DollarSign}
          filled
        />
        <StatCard label="Total Sessions" value={stats.total.toString()} pill="all time" Icon={MessageSquare} />
        <StatCard label="Deals Closed" value={stats.agreed.toString()} pill={`${stats.dealRate.toFixed(0)}% deal rate`} Icon={Handshake} />
        <StatCard label="Avg Discount" value={`${stats.avgDiscount.toFixed(1)}%`} pill="on agreed deals" Icon={TrendingUp} />
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
                        ? <Money amount={parseFloat(s.finalAgreedPrice)} base={s.product.currency} />
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
