'use client';

import { useState } from 'react';
import { Copy, Check, Package } from 'lucide-react';
import type { Product } from '@/lib/api';
import EmptyState from '@/components/EmptyState';

function CopyId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    await navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  return (
    <button
      onClick={handleCopy}
      title="Copy product ID for embed snippet"
      className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-violet-600 transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
      <span className="font-mono">{id.slice(-8)}</span>
    </button>
  );
}

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001';

async function apiFetch(path: string, apiKey: string, init?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Error ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

interface Props {
  initialProducts: Product[];
  apiKey: string;
}

type FormData = {
  name: string;
  description: string;
  listPrice: string;
  floorPrice: string;
  currency: string;
};

const empty: FormData = { name: '', description: '', listPrice: '', floorPrice: '', currency: 'USD' };

export default function ProductsClient({ initialProducts, apiKey }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormData>(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function openNew() {
    setEditing(null);
    setForm(empty);
    setError('');
    setModalOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description ?? '',
      listPrice: p.listPrice,
      floorPrice: p.floorPrice,
      currency: p.currency,
    });
    setError('');
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.name || !form.listPrice || !form.floorPrice) {
      setError('Name, list price, and floor price are required.');
      return;
    }
    const lp = parseFloat(form.listPrice);
    const fp = parseFloat(form.floorPrice);
    if (isNaN(lp) || isNaN(fp) || fp > lp) {
      setError('Floor price must be a valid number ≤ list price.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      if (editing) {
        const updated = await apiFetch(`/api/products/${editing.id}`, apiKey, {
          method: 'PATCH',
          body: JSON.stringify({ name: form.name, description: form.description || null, listPrice: lp, floorPrice: fp, currency: form.currency }),
        }) as Product;
        setProducts(ps => ps.map(p => p.id === editing.id ? updated : p));
      } else {
        const created = await apiFetch('/api/products', apiKey, {
          method: 'POST',
          body: JSON.stringify({ name: form.name, description: form.description || null, listPrice: lp, floorPrice: fp, currency: form.currency }),
        }) as Product;
        setProducts(ps => [created, ...ps]);
      }
      setModalOpen(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await apiFetch(`/api/products/${id}`, apiKey, { method: 'DELETE' });
      setProducts(ps => ps.filter(p => p.id !== id));
    } catch (e: any) {
      alert(e.message);
    } finally {
      setDeletingId(null);
    }
  }

  function field(label: string, key: keyof FormData, type = 'text', placeholder = '') {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
        <input
          type={type}
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={openNew}
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
        >
          + Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {products.length === 0 ? (
          <EmptyState
            Icon={Package}
            title="No products yet"
            description="Add your first product with a list price and a hidden floor price to start negotiating."
            action={
              <button
                onClick={openNew}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
              >
                + Add Product
              </button>
            }
          />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                {['Name', 'List Price', 'Floor Price', 'Currency', 'Active', 'Product ID', ''].map(h => (
                  <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-800">{p.name}</td>
                  <td className="px-6 py-3 text-gray-700">{parseFloat(p.listPrice).toFixed(2)}</td>
                  <td className="px-6 py-3 text-gray-700">{parseFloat(p.floorPrice).toFixed(2)}</td>
                  <td className="px-6 py-3 text-gray-500">{p.currency}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <CopyId id={p.id} />
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEdit(p)} className="text-xs text-violet-600 hover:underline">Edit</button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id}
                        className="text-xs text-red-500 hover:underline disabled:opacity-40"
                      >
                        {deletingId === p.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">{editing ? 'Edit Product' : 'New Product'}</h2>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {field('Name *', 'name', 'text', 'e.g. Sony WH-1000XM5')}
            {field('Description', 'description', 'text', 'Optional')}

            <div className="grid grid-cols-2 gap-3">
              {field('List Price *', 'listPrice', 'number', '299.00')}
              {field('Floor Price *', 'floorPrice', 'number', '240.00')}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Currency</label>
              <select
                value={form.currency}
                onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-violet-500"
              >
                {['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'NGN'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <p className="text-xs text-gray-400">
              Floor price is never shared with the AI or customers — it is a server-side guardrail only.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
              >
                {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
