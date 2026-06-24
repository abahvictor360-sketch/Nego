import StaticPage, { Prose } from '@/components/StaticPage';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Press Kit', description: 'Brand assets, boilerplate, and media contact for Nego Bot.' };

export default function PressPage() {
  return (
    <StaticPage title="Press Kit" subtitle="Brand assets and company facts for media and partners.">
      <Prose>
        <h2>Boilerplate</h2>
        <p>
          Nego Bot is an AI-powered price-negotiation platform for e-commerce. It lets shoppers haggle
          in real time while a server-side floor-price guard protects merchant margins. Nego Bot works
          across web, mobile, and in-store QR with a single embeddable widget.
        </p>
        <h2>Brand</h2>
        <ul>
          <li>Name: <strong>Nego Bot</strong> (one word logo: NegoBot)</li>
          <li>Primary color: forest green <code>#14532d</code> / <code>#16a34a</code></li>
          <li>Logo: available on request</li>
        </ul>
        <h2>Media contact</h2>
        <p>
          For interviews, assets, or fact-checks, email{' '}
          <a href="mailto:press@negotiobot.com">press@negotiobot.com</a> or use our{' '}
          <a href="/contact">contact page</a>.
        </p>
      </Prose>
    </StaticPage>
  );
}
