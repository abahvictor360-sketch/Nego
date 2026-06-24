import StaticPage, { Prose } from '@/components/StaticPage';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Blog', description: 'Insights on AI negotiation, pricing strategy, and conversion for e-commerce.' };

export default function BlogPage() {
  return (
    <StaticPage title="Blog" subtitle="Notes on AI negotiation, pricing, and conversion.">
      <Prose>
        <p>
          We&apos;re busy building — our first articles on negotiation strategy, floor-price economics,
          and conversion optimization are on the way.
        </p>
        <p>
          Want to be notified when we publish? <a href="/contact">Drop us a line</a> and we&apos;ll add
          you to the list.
        </p>
      </Prose>
    </StaticPage>
  );
}
