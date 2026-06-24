import StaticPage, { Prose } from '@/components/StaticPage';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'About', description: 'Why we built Nego Bot — AI price negotiation that protects merchant margins.' };

export default function AboutPage() {
  return (
    <StaticPage title="About Nego Bot" subtitle="Turning price objections into closed deals — without giving away your margin.">
      <Prose>
        <p>
          Nego Bot was born from a simple observation: shoppers love to haggle, but most online stores
          give them no way to. The result is abandoned carts and lost sales. We set out to bring the
          time-tested art of negotiation to e-commerce — safely.
        </p>
        <h2>What we do</h2>
        <p>
          Our AI negotiator engages customers in real, human-like price conversations. It anchors high,
          concedes strategically, and closes deals — all while a server-side guardrail ensures it can
          never drop below a floor price that only the merchant can see.
        </p>
        <h2>Our principles</h2>
        <ul>
          <li><strong>Margin first.</strong> The floor price is never exposed to the AI or the browser.</li>
          <li><strong>Effortless setup.</strong> One script tag, live in minutes, on any platform.</li>
          <li><strong>Built for trust.</strong> Tamper-proof, signed checkouts and transparent analytics.</li>
        </ul>
        <p>
          We&apos;re a small, focused team building the negotiation layer for modern commerce.
          Have a question or idea? <a href="/contact">Get in touch</a>.
        </p>
      </Prose>
    </StaticPage>
  );
}
