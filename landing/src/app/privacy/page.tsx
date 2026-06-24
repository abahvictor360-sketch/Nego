import StaticPage, { Prose } from '@/components/StaticPage';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy', description: 'How Nego Bot collects, uses, and protects data.' };

export default function PrivacyPage() {
  return (
    <StaticPage title="Privacy Policy" subtitle="Last updated: June 2026">
      <Prose>
        <p>
          This Privacy Policy explains how Nego Bot (&quot;we&quot;, &quot;us&quot;) collects, uses, and
          safeguards information when you use our website, dashboard, and embeddable widget (the
          &quot;Services&quot;).
        </p>
        <h2>Information we collect</h2>
        <ul>
          <li><strong>Account data:</strong> merchant name, email, and a hashed password.</li>
          <li><strong>Product data:</strong> the product details and prices you configure.</li>
          <li><strong>Negotiation data:</strong> chat messages and outcomes from negotiation sessions.</li>
          <li><strong>Usage data:</strong> basic logs and analytics needed to operate the Services.</li>
        </ul>
        <h2>How we use information</h2>
        <p>
          We use data to provide and improve the Services, power the AI negotiator, generate analytics,
          and communicate with you. We do not sell your personal information.
        </p>
        <h2>Data sharing</h2>
        <p>
          We share data only with infrastructure providers that help us run the Services (e.g. hosting,
          database, and the AI model provider) under appropriate confidentiality terms.
        </p>
        <h2>Security</h2>
        <p>
          Passwords are hashed, secrets are stored server-side, and floor prices are never exposed to the
          AI or the browser. See our <a href="/security">Security</a> page for details.
        </p>
        <h2>Your rights</h2>
        <p>
          You may request access to, correction of, or deletion of your data by emailing{' '}
          <a href="mailto:privacy@negotiobot.com">privacy@negotiobot.com</a>.
        </p>
        <h2>Contact</h2>
        <p>Questions? Email <a href="mailto:privacy@negotiobot.com">privacy@negotiobot.com</a>.</p>
      </Prose>
    </StaticPage>
  );
}
