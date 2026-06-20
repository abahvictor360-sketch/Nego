import Link from 'next/link';
import { Users, CreditCard, LifeBuoy, Crown, Ban } from 'lucide-react';
import { adminFetch } from '@/lib/admin-api';

interface BillingData {
  mrr: number;
  proPrice: number;
  counts: { total: number; pro: number; free: number; suspended: number };
}
interface Ticket { id: string; status: string }

export default async function AdminOverviewPage() {
  const [billing, tickets] = await Promise.all([
    adminFetch<BillingData>('/api/admin/billing'),
    adminFetch<Ticket[]>('/api/admin/tickets'),
  ]);

  const openTickets = Array.isArray(tickets) ? tickets.filter(t => t.status !== 'closed').length : 0;
  const c = billing?.counts ?? { total: 0, pro: 0, free: 0, suspended: 0 };

  const stats = [
    { label: 'Total Users', value: c.total, icon: Users, href: '/admin/dashboard/users', color: 'text-violet-400' },
    { label: 'Pro Users', value: c.pro, icon: Crown, href: '/admin/dashboard/users', color: 'text-amber-400' },
    { label: 'Suspended', value: c.suspended, icon: Ban, href: '/admin/dashboard/users', color: 'text-red-400' },
    { label: 'Open Tickets', value: openTickets, icon: LifeBuoy, href: '/admin/dashboard/support', color: 'text-blue-400' },
    { label: 'MRR', value: `$${(billing?.mrr ?? 0).toLocaleString()}`, icon: CreditCard, href: '/admin/dashboard/billing', color: 'text-green-400' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-sm text-gray-400 mt-1">Platform health at a glance.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="bg-gray-900 rounded-2xl border border-gray-800 p-5 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
              <Icon className={`w-4 h-4 ${color}`} /> {label}
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
          </Link>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/admin/dashboard/users" className="bg-gray-900 rounded-2xl border border-gray-800 p-6 hover:border-amber-500/50 transition-colors">
          <Users className="w-6 h-6 text-amber-400 mb-3" />
          <h3 className="font-semibold text-white mb-1">Manage Users</h3>
          <p className="text-sm text-gray-400">Suspend accounts, toggle Pro/Free, and review activity.</p>
        </Link>
        <Link href="/admin/dashboard/content" className="bg-gray-900 rounded-2xl border border-gray-800 p-6 hover:border-amber-500/50 transition-colors">
          <CreditCard className="w-6 h-6 text-violet-400 mb-3" />
          <h3 className="font-semibold text-white mb-1">Edit Website & SEO</h3>
          <p className="text-sm text-gray-400">Change any text on the landing page and manage SEO metadata.</p>
        </Link>
      </div>
    </div>
  );
}
