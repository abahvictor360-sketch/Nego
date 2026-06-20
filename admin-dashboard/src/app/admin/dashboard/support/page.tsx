import { adminFetch } from '@/lib/admin-api';
import SupportClient, { type AdminTicket } from './SupportClient';

export default async function AdminSupportPage() {
  const tickets = (await adminFetch<AdminTicket[]>('/api/admin/tickets')) ?? [];
  return <SupportClient initialTickets={tickets} />;
}
