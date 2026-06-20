import { adminFetch } from '@/lib/admin-api';
import UsersClient, { type AdminUser } from './UsersClient';

export default async function AdminUsersPage() {
  const users = (await adminFetch<AdminUser[]>('/api/admin/users')) ?? [];
  return <UsersClient initialUsers={users} />;
}
