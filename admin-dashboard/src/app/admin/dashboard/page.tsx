import Link from 'next/link';
import { Users, CreditCard, LifeBuoy, Crown, Ban, ArrowUpRight, FileText, type LucideIcon } from 'lucide-react';
import { adminFetch } from '@/lib/admin-api';

interface BillingData {
  mrr: number;
  proPrice: number;
  counts: { total: number; pro: number; free: number; suspended: number };
}
interface Ticket { id: string; status: string }

function StatCard({
  label, value, Icon, href, filled = false,
}: {
  label: string; value: string | number; Icon: LucideIcon; href: string; filled?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-2xl p-5 transition-shadow hover:shadow-sm ${
        filled ? 'bg-green-900 text-white' : 'bg-white border border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <p className={`text-sm ${filled ? 'text-green-200' : 'text-gray-500'}`}>{label}</p>
        <span className={`w-8 h-8 rounded-full flex items-center justify-center ${filled ? 'bg-white/15 text-white' : 'border border-gray-200 text-gray-400'}`}>
          <Icon className="w-4 h-4" />
        </span>
      </div>
      <p className={`text-3xl font-bold mt-3 ${filled ? 'text-white' : 'text-gray-900'}`}>{value}</p>
    </Link>
  );
}

export default async function AdminOverviewPage() {
  const [billing, tickets] = await Promise.all([
    adminFetch<BillingData>('/api/admin/billing'),
    adminFetch<Ticket[]>('/api/admin/tickets'),
  ]);

  const openTickets = Array.isArray(tickets) ? tickets.filter(t => t.status !== 'closed').length : 0;
  const c = billing?.counts ?? { total: 0, pro: 0, free: 0, suspended: 0 };

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Platform health at a glance.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="MRR" value={`$${(billing?.mrr ?? 0).toLocaleString()}`} Icon={CreditCard} href="/admin/dashboard/billing" filled />
        <StatCard label="Total Users" value={c.total} Icon={Users} href="/admin/dashboard/users" />
        <StatCard label="Pro Users" value={c.pro} Icon={Crown} href="/admin/dashboard/users" />
        <StatCard label="Suspended" value={c.suspended} Icon={Ban} href="/admin/dashboard/users" />
        <StatCard label="Open Tickets" value={openTickets} Icon={LifeBuoy} href="/admin/dashboard/support" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/admin/dashboard/users" className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-green-300 transition-colors group">
          <span className="inline-flex w-11 h-11 rounded-xl bg-green-50 text-green-700 items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </span>
          <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-1">
            Manage Users <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-green-600 transition-colors" />
          </h3>
          <p className="text-sm text-gray-500">Suspend accounts, toggle Pro/Free, and review activity.</p>
        </Link>
        <Link href="/admin/dashboard/content" className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-green-300 transition-colors group">
          <span className="inline-flex w-11 h-11 rounded-xl bg-green-50 text-green-700 items-center justify-center mb-3">
            <FileText className="w-5 h-5" />
          </span>
          <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-1">
            Edit Website &amp; SEO <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-green-600 transition-colors" />
          </h3>
          <p className="text-sm text-gray-500">Change any text on the landing page and manage SEO metadata.</p>
        </Link>
      </div>
    </div>
  );
}
