import StaticPage, { Prose } from '@/components/StaticPage';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Cookie Policy', description: 'How Nego Bot uses cookies and local storage.' };

export default function CookiesPage() {
  return (
    <StaticPage title="Cookie Policy" subtitle="Last updated: June 2026">
      <Prose>
        <p>
          This Cookie Policy explains how Nego Bot uses cookies and similar technologies (like browser
          local storage) across our Services.
        </p>
        <h2>What we use</h2>
        <ul>
          <li><strong>Essential:</strong> a secure, httpOnly session cookie to keep you signed in to the dashboard.</li>
          <li><strong>Preferences:</strong> local storage for your theme and display-currency choices.</li>
          <li><strong>Analytics:</strong> minimal, privacy-respecting usage metrics to improve the product.</li>
        </ul>
        <h2>The widget</h2>
        <p>
          The embeddable negotiation widget runs on merchant sites and uses only what is needed to power a
          negotiation session. It does not set advertising or cross-site tracking cookies.
        </p>
        <h2>Managing cookies</h2>
        <p>
          You can clear or block cookies in your browser settings. Disabling essential cookies will
          prevent you from staying signed in to the dashboard.
        </p>
        <h2>Contact</h2>
        <p>Questions? Email <a href="mailto:privacy@negotiobot.com">privacy@negotiobot.com</a>.</p>
      </Prose>
    </StaticPage>
  );
}
