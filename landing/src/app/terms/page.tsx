import StaticPage, { Prose } from '@/components/StaticPage';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms of Service', description: 'The terms governing use of Nego Bot.' };

export default function TermsPage() {
  return (
    <StaticPage title="Terms of Service" subtitle="Last updated: June 2026">
      <Prose>
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of Nego Bot (the
          &quot;Services&quot;). By using the Services, you agree to these Terms.
        </p>
        <h2>Accounts</h2>
        <p>
          You are responsible for safeguarding your account credentials and API keys, and for all
          activity under your account. Notify us immediately of any unauthorized use.
        </p>
        <h2>Acceptable use</h2>
        <ul>
          <li>Do not misuse the Services or attempt to disrupt or reverse-engineer them.</li>
          <li>Do not use the Services for unlawful, deceptive, or infringing purposes.</li>
          <li>You are responsible for the products, prices, and content you configure.</li>
        </ul>
        <h2>Pricing &amp; negotiation</h2>
        <p>
          You set list and floor prices. While we enforce the floor server-side, you are responsible for
          configuring prices correctly and for honoring agreed deals at checkout.
        </p>
        <h2>Plans &amp; billing</h2>
        <p>
          Paid plans renew until cancelled. Fees are non-refundable except where required by law. See the{' '}
          <a href="/pricing">pricing page</a> for current plans.
        </p>
        <h2>Disclaimer &amp; liability</h2>
        <p>
          The Services are provided &quot;as is&quot; without warranties. To the maximum extent permitted
          by law, our liability is limited to the amount you paid in the preceding three months.
        </p>
        <h2>Changes</h2>
        <p>We may update these Terms; continued use after changes constitutes acceptance.</p>
        <h2>Contact</h2>
        <p>Questions? Email <a href="mailto:legal@negotiobot.com">legal@negotiobot.com</a>.</p>
      </Prose>
    </StaticPage>
  );
}
