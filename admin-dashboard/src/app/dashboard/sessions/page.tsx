import { getSession } from '@/lib/session';
import { api, type Session } from '@/lib/api';
import SessionsInbox from './SessionsInbox';

export default async function SessionsPage() {
  const auth = await getSession();
  const sessions = await api.sessions.list(auth!.apiKey).catch(() => [] as Session[]);
  return <SessionsInbox initialSessions={sessions} />;
}
