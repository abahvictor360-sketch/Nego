import { adminFetch } from '@/lib/admin-api';
import EmailSettingsClient, { type EmailSettings } from './EmailSettingsClient';

export default async function AdminEmailPage() {
  const settings = await adminFetch<EmailSettings>('/api/admin/email-settings');
  return <EmailSettingsClient initial={settings} />;
}
