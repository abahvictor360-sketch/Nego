import StaticPage, { Prose } from '@/components/StaticPage';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Careers', description: 'Join the team building the negotiation layer for modern commerce.' };

export default function CareersPage() {
  return (
    <StaticPage title="Careers" subtitle="Help us bring negotiation to every storefront.">
      <Prose>
        <p>
          We&apos;re an early, product-obsessed team. We don&apos;t have formal openings posted right
          now, but we&apos;re always glad to meet exceptional engineers, designers, and growth people
          who care about commerce and AI.
        </p>
        <h2>How to reach us</h2>
        <p>
          Send a short note about what you&apos;re great at and what you&apos;d want to build to{' '}
          <a href="mailto:careers@negotiobot.com">careers@negotiobot.com</a>, or use our{' '}
          <a href="/contact">contact page</a>.
        </p>
      </Prose>
    </StaticPage>
  );
}
