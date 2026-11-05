import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { verifyAdminSession } from '@/lib/admin-auth';
import { listContactMessages, listEboardSubmissions } from '@/lib/submissions';
import AdminDashboardView, {
  type ContactSubmission,
  type EboardSubmission,
} from '@/components/admin-dashboard-view';

export const metadata: Metadata = {
  title: 'Admin Dashboard | WiCyS Kean',
  description: 'Manage 2027–2028 E-Board applications and contact inquiries.',
  // Kept out of search results.
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    redirect('/admin/login');
  }

  const [eboardApplications, contactMessages] = await Promise.all([
    listEboardSubmissions().catch((): EboardSubmission[] => []),
    listContactMessages().catch((): ContactSubmission[] => []),
  ]);

  return (
    <AdminDashboardView
      eboardApplications={eboardApplications}
      contactMessages={contactMessages}
    />
  );
}
