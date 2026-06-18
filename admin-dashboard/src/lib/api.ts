const BASE = process.env.BACKEND_API_URL ?? 'http://localhost:3001';

async function apiFetch<T>(path: string, apiKey: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `API error ${res.status}`);
  }
  return res.json();
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  listPrice: string;
  floorPrice: string;
  currency: string;
  isActive: boolean;
  createdAt: string;
}

export interface Session {
  id: string;
  productId: string;
  channel: string;
  status: 'active' | 'agreed' | 'rejected' | 'abandoned';
  startedAt: string;
  endedAt: string | null;
  finalAgreedPrice: string | null;
  discountPercent: string | null;
  checkoutUrl?: string | null;
  product: { name: string; listPrice: string; currency: string };
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

export interface SessionDetail extends Session {
  messages: Message[];
}

export const api = {
  products: {
    list: (apiKey: string) => apiFetch<Product[]>('/api/products', apiKey),
    create: (apiKey: string, data: Omit<Product, 'id' | 'createdAt' | 'isActive'>) =>
      apiFetch<Product>('/api/products', apiKey, { method: 'POST', body: JSON.stringify(data) }),
    update: (apiKey: string, id: string, data: Partial<Product>) =>
      apiFetch<Product>(`/api/products/${id}`, apiKey, {
        method: 'PATCH', body: JSON.stringify(data),
      }),
    delete: (apiKey: string, id: string) =>
      apiFetch<void>(`/api/products/${id}`, apiKey, { method: 'DELETE' }),
  },
  sessions: {
    list: (apiKey: string) => apiFetch<Session[]>('/api/sessions', apiKey),
    get: (apiKey: string, id: string) => apiFetch<SessionDetail>(`/api/sessions/${id}`, apiKey),
  },
};
