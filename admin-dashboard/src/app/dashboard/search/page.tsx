import Link from 'next/link';
import { getSession } from '@/lib/session';
import { api, type Product, type Session } from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import { Search, Package, MessageSquare } from 'lucide-react';

interface Props {
  searchParams: Promise<{ q?: string }>;
}

const STATUS_COLORS: Record<string, string> = {
  agreed: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  active: 'bg-blue-100 text-blue-700',
  abandoned: 'bg-gray-100 text-gray-600',
};

export default async function SearchPage({ searchParams }: Props) {
  const { q = '' } = await searchParams;
  const query = q.trim().toLowerCase();
  const session = await getSession();

  const [products, sessions] = query
    ? await Promise.all([
        api.products.list(session!.apiKey).catch(() => [] as Product[]),
        api.sessions.list(session!.apiKey).catch(() => [] as Session[]),
      ])
    : [[] as Product[], [] as Session[]];

  const productHits = products.filter(
    p => p.name.toLowerCase().includes(query) || (p.description ?? '').toLowerCase().includes(query),
  );
  const sessionHits = sessions.filter(
    s => s.product.name.toLowerCase().includes(query) || s.id.toLowerCase().includes(query) || s.status.toLowerCase().includes(query),
  );

  const total = productHits.length + sessionHits.length;

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="Search"
        subtitle={query ? `${total} result${total === 1 ? '' : 's'} for “${q}”` : 'Type a query in the search bar above.'}
      />

      {!query ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <EmptyState Icon={Search} title="Search your store" description="Find products by name or description, and sessions by product, status, or ID." />
        </div>
      ) : total === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <EmptyState Icon={Search} title="No matches" description={`Nothing matched “${q}”. Try a different term.`} />
        </div>
      ) : (
        <div className="space-y-8">
          {productHits.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                <Package className="w-4 h-4" /> Products ({productHits.length})
              </h2>
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                {productHits.map(p => (
                  <Link
                    key={p.id}
                    href="/dashboard/products"
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{p.name}</p>
                      {p.description && <p className="text-xs text-gray-400 truncate">{p.description}</p>}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap ml-4">
                      {p.currency} {parseFloat(p.listPrice).toFixed(2)}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {sessionHits.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                <MessageSquare className="w-4 h-4" /> Sessions ({sessionHits.length})
              </h2>
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                {sessionHits.slice(0, 25).map(s => (
                  <Link
                    key={s.id}
                    href={`/dashboard/sessions/${s.id}`}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{s.product.name}</p>
                      <p className="text-xs text-gray-400">
                        {s.channel} · {new Date(s.startedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ml-4 ${STATUS_COLORS[s.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {s.status}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
