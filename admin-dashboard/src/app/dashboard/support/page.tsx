import { getSession } from '@/lib/session';
import SupportClient, { type Ticket } from './SupportClient';

const BACKEND = process.env.BACKEND_API_URL ?? 'http://localhost:3001';

async function getTickets(apiKey: string): Promise<Ticket[]> {
  try {
    const res = await fetch(`${BACKEND}/api/tickets`, {
      headers: { 'x-api-key': apiKey },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function SupportPage() {
  const session = await getSession();
  const tickets = session ? await getTickets(session.apiKey) : [];
  return <SupportClient initialTickets={tickets} />;
}
