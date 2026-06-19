import { getSession } from '@/lib/session';
import { api, type Product } from '@/lib/api';
import ProductsClient from './ProductsClient';
import PageHeader from '@/components/PageHeader';

export default async function ProductsPage() {
  const session = await getSession();
  const products = await api.products.list(session!.apiKey).catch(() => [] as Product[]);

  return (
    <div className="max-w-5xl">
      <PageHeader title="Products" subtitle="Set list and floor prices for items customers can negotiate" />
      <ProductsClient initialProducts={products} apiKey={session!.apiKey} />
    </div>
  );
}
