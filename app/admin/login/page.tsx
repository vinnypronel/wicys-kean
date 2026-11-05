import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, Lock } from 'lucide-react';

import { verifyAdminSession } from '@/lib/admin-auth';
import AdminLoginForm from '@/components/admin-login-form';

export const metadata: Metadata = {
  title: 'Admin Login | WiCyS Kean',
  description: 'Log in to the WiCyS Kean administrator dashboard.',
  // Kept out of search results.
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const isAuth = await verifyAdminSession();
  if (isAuth) {
    redirect('/admin');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <Image
              src="/images/wicys-logo.png"
              alt="WiCyS Kean University Logo"
              width={260}
              height={70}
              className="mx-auto h-14 w-auto object-contain"
              priority
            />
          </Link>
          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-plum/10 px-3 py-1 text-xs font-semibold text-plum">
              <Lock className="h-3 w-3" />
              Chapter Admin Portal
            </span>
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            Sign in to view 2027–2028 E-Board applications, contact messages, and chapter inquiries.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-brand-100 bg-white p-7 shadow-sm sm:p-8">
          <AdminLoginForm />
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 transition-colors hover:text-brand-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Return to main website
          </Link>
        </div>
      </div>
    </div>
  );
}
