import StaticPage, { Prose } from '@/components/StaticPage';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Security', description: 'How Nego Bot protects your data, margins, and checkouts.' };

export default function SecurityPage() {
  return (
    <StaticPage title="Security" subtitle="How we protect your data, your margins, and your customers.">
      <Prose>
        <h2>Floor price guard</h2>
        <p>
          Your floor price is stored server-side only. It is never placed in the AI prompt or sent to the
          browser, making it immune to prompt injection. Every agreed price is re-validated against the
          floor before any checkout link is created.
        </p>
        <h2>Tamper-proof checkout</h2>
        <p>
          Checkout URLs are HMAC-signed, so the agreed price cannot be modified in transit. Signatures are
          verified using constant-time comparison.
        </p>
        <h2>Authentication</h2>
        <ul>
          <li>Passwords are hashed with bcrypt; we never store them in plain text.</li>
          <li>Dashboard sessions use signed, httpOnly cookies with a strong server secret.</li>
          <li>Admin areas are role-gated on both the server and the API.</li>
        </ul>
        <h2>Infrastructure</h2>
        <ul>
          <li>All traffic is served over HTTPS.</li>
          <li>Database access is restricted; row-level security is enabled on stored tables.</li>
          <li>Rate limiting and input validation protect every API endpoint.</li>
          <li>Internal error details are never leaked to clients.</li>
        </ul>
        <h2>Reporting a vulnerability</h2>
        <p>
          Found something? We appreciate responsible disclosure. Email{' '}
          <a href="mailto:security@negotiobot.com">security@negotiobot.com</a> and we&apos;ll respond promptly.
        </p>
      </Prose>
    </StaticPage>
  );
}
