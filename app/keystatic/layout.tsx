import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import KeystaticApp from './keystatic';

export default function Layout() {
  return (
    <>
      <div className="fixed right-4 top-3 z-[99999] flex items-center gap-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:bg-slate-50 hover:text-slate-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Website</span>
        </Link>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50/95 px-3 py-1.5 text-xs font-semibold text-purple-800 shadow-sm backdrop-blur transition hover:bg-purple-100"
        >
          <Shield className="h-3.5 w-3.5" />
          <span>Admin Dashboard</span>
        </Link>
      </div>
      <KeystaticApp />
    </>
  );
}
