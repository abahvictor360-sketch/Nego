import { adminFetch } from '@/lib/admin-api';
import { CreditCard, Crown, Users, TrendingUp } from 'lucide-react';

interface BillingData {
  mrr: number;
  proPrice: number;
  counts: { total: number; pro: number; free: number; suspended: number };
  proUsers: { id: string; name: string; email: string; status: string; createdAt: string }[];
}

export default async function AdminBillingPage() {
  const billing = await adminFetch<BillingData>('/api/admin/billing');
  const c = billing?.counts ?? { total: 0, pro: 0, free: 0, suspended: 0 };
  const mrr = billing?.mrr ?? 0;
  const proPrice = billing?.proPrice ?? 49;
  const conversion = c.total > 0 ? ((c.pro / c.total) * 100).toFixed(1) : '0';

  const cards = [
    { label: 'Monthly Recurring Revenue', value: `$${mrr.toLocaleString()}`, sub: `${c.pro} × $${proPrice}/mo`, icon: CreditCard, color: 'text-green-400' },
    { label: 'Annual Run Rate', value: `$${(mrr * 12).toLocaleString()}`, sub: 'MRR × 12', icon: TrendingUp, color: 'text-violet-400' },
    { label: 'Pro Subscribers', value: c.pro, sub: `of ${c.total} users`, icon: Crown, color: 'text-amber-400' },
    { label: 'Conversion Rate', value: `${conversion}%`, sub: 'free → pro', icon: Users, color: 'text-blue-400' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing</h1>
        <p className="text-sm text-gray-400 mt-1">Revenue from Pro subscriptions.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
              <Icon className={`w-4 h-4 ${color}`} /> {label}
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      <section className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide px-5 py-4 border-b border-gray-800">
          Paying Customers
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-800">
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Since</th>
                <th className="px-5 py-3 font-medium text-right">Monthly</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {(billing?.proUsers ?? []).map(u => (
                <tr key={u.id}>
                  <td className="px-5 py-3">
                    <p className="text-white font-medium">{u.name}</p>
                    <p className="text-gray-500 text-xs">{u.email}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium ${u.status === 'suspended' ? 'text-red-400' : 'text-green-400'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-right text-green-400 font-semibold">${proPrice}</td>
                </tr>
              ))}
              {(billing?.proUsers ?? []).length === 0 && (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-gray-500">No Pro subscribers yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className="text-xs text-gray-600">
        Set the Pro price with the <code className="bg-gray-800 px-1 rounded">PRO_PLAN_PRICE</code> backend env var.
        Plan changes are applied instantly from the Users page (no payment processor wired yet).
      </p>
    </div>
  );
}
