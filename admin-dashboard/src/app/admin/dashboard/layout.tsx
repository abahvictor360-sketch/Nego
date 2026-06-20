import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import AdminShell from './AdminShell';

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  if (session.role !== 'admin') redirect('/dashboard');

  return (
    <AdminShell name={session.name} email={session.email}>
      {children}
    </AdminShell>
  );
}
