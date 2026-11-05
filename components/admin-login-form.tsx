'use client';

import { useActionState } from 'react';
import { ArrowRight, KeyRound, Loader2 } from 'lucide-react';

import { loginAdminAction, type LoginState } from '@/app/admin/actions';

const initialState: LoginState = {};

export default function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAdminAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {state.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-800">
          {state.error}
        </div>
      ) : null}

      <div>
        <label
          htmlFor="admin-password"
          className="block text-xs font-semibold uppercase tracking-[0.14em] text-ink"
        >
          Admin Password
        </label>
        <div className="relative mt-2">
          <input
            id="admin-password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="Enter admin password..."
            className="block w-full rounded-lg border border-brand-200 bg-surface px-4 py-3 pl-10 text-sm text-ink placeholder:text-ink-soft/60 transition-colors focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          <KeyRound className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-brand-400" />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="btn-green w-full"
      >
        {pending ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in...
          </span>
        ) : (
          <>
            Sign in to Dashboard
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
