import { getSession } from '@/lib/session';
import { api, type Product } from '@/lib/api';
import ProductsClient from './ProductsClient';

export default async function ProductsPage() {
  const session = await getSession();
  const products = await api.products.list(session!.apiKey).catch(() => [] as Product[]);

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
      </div>
      <ProductsClient initialProducts={products} apiKey={session!.apiKey} />
    </div>
  );
}
