import { getSession } from '@/lib/session';
import SettingsClient from './SettingsClient';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001';

export default async function SettingsPage() {
  const session = await getSession();
  return (
    <SettingsClient
      name={session!.name}
      email={session!.email}
      apiKey={session!.apiKey}
      botName={session!.botName ?? 'Abah'}
      language={session!.language ?? 'en'}
      widgetBaseUrl={BACKEND_URL}
    />
  );
}
