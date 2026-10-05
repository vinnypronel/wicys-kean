import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import SiteChrome from '@/components/site-chrome';

export const metadata: Metadata = {
  title: 'Page not found',
};

const SUGGESTIONS = [
  { href: '/events', label: 'Events' },
  { href: '/eboard', label: 'E-Board' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

export default function NotFound() {
  return (
    <SiteChrome>
      <section className="container-site grid min-h-[60vh] content-center py-20">
        <div className="max-w-xl">
          <p className="kicker">Error 404</p>
          <p className="mt-6 font-mono text-sm text-brand-700">
            <span className="text-accent-600">$</span> cd /this-page
            <br />
            <span className="text-ink-soft">no such file or directory</span>
          </p>
          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            This page does not exist
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            The link may be old or mistyped. Try one of these instead.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/" className="btn-green">
              Back to home
              <ArrowRight className="h-4 w-4" />
            </Link>
            {SUGGESTIONS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-brand-700 transition-colors hover:text-accent-700"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
