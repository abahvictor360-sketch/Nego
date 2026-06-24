import StaticPage, { Prose } from '@/components/StaticPage';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Contact', description: 'Get in touch with the Nego Bot team — sales, support, and general enquiries.' };

export default function ContactPage() {
  return (
    <StaticPage title="Contact us" subtitle="We'd love to hear from you.">
      <Prose>
        <h2>General &amp; sales</h2>
        <p>
          Questions about Nego Bot, pricing, or a demo? Email{' '}
          <a href="mailto:hello@negotiobot.com">hello@negotiobot.com</a>.
        </p>
        <h2>Support</h2>
        <p>
          Already a merchant? The fastest way to reach us is the{' '}
          <a href="https://nego-admin.vercel.app/dashboard/support">Support</a> section inside your
          dashboard, or email <a href="mailto:support@negotiobot.com">support@negotiobot.com</a>.
        </p>
        <h2>Enterprise</h2>
        <p>
          Need white-label, SSO, or an SLA? Reach out to{' '}
          <a href="mailto:hello@negotiobot.com">hello@negotiobot.com</a> and we&apos;ll set up a call.
        </p>
      </Prose>
    </StaticPage>
  );
}
