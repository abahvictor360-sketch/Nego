'use client';

import { useState, useTransition } from 'react';
import { Crown, Ban, Check, Search, Package, MessageSquare } from 'lucide-react';
import { setUserPlan, setUserStatus } from './actions';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro';
  status: 'active' | 'suspended';
  botName: string;
  language: string;
  createdAt: string;
  _count?: { products: number; sessions: number };
}

export default function UsersClient({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState('');
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = users.filter(u =>
    `${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase()),
  );

  function update(id: string, patch: Partial<AdminUser>) {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...patch } : u)));
  }

  function togglePlan(u: AdminUser) {
    const next = u.plan === 'pro' ? 'free' : 'pro';
    setBusyId(u.id);
    startTransition(async () => {
      const res = await setUserPlan(u.id, next);
      if (!res.error) update(u.id, { plan: next });
      setBusyId(null);
    });
  }

  function toggleStatus(u: AdminUser) {
    const next = u.status === 'suspended' ? 'active' : 'suspended';
    setBusyId(u.id);
    startTransition(async () => {
      const res = await setUserStatus(u.id, next);
      if (!res.error) update(u.id, { status: next });
      setBusyId(null);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-sm text-gray-400 mt-1">{users.length} merchant accounts</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search users…"
            className="bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-amber-500 w-full sm:w-64"
          />
        </div>
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-800">
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Plan</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium hidden lg:table-cell">Usage</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map(u => {
                const busy = busyId === u.id && pending;
                return (
                  <tr key={u.id} className="hover:bg-gray-800/40">
                    <td className="px-5 py-3">
                      <p className="text-white font-medium">{u.name}</p>
                      <p className="text-gray-500 text-xs">{u.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      {u.plan === 'pro' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md">
                          <Crown className="w-3 h-3" /> Pro
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-gray-400 bg-gray-800 px-2 py-1 rounded-md">Free</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {u.status === 'suspended' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-400 bg-red-500/10 px-2 py-1 rounded-md">
                          <Ban className="w-3 h-3" /> Suspended
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-400 bg-green-500/10 px-2 py-1 rounded-md">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Package className="w-3 h-3" /> {u._count?.products ?? 0}</span>
                        <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {u._count?.sessions ?? 0}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => togglePlan(u)}
                          disabled={busy}
                          className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 hover:border-amber-500 hover:text-amber-400 transition-colors disabled:opacity-50"
                        >
                          {u.plan === 'pro' ? 'Make Free' : 'Make Pro'}
                        </button>
                        <button
                          onClick={() => toggleStatus(u)}
                          disabled={busy}
                          className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
                            u.status === 'suspended'
                              ? 'border-green-700 text-green-400 hover:bg-green-500/10'
                              : 'border-red-800 text-red-400 hover:bg-red-500/10'
                          }`}
                        >
                          {u.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
