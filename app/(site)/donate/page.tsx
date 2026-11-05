import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CreditCard,
  Mail,
  Send,
  Smartphone,
  Trophy,
  Utensils,
} from 'lucide-react';

import HeroPhoto from '@/components/hero-photo';
import SectionHeading from '@/components/section-heading';
import { getDonatePage, getSiteSettings } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Donate',
  description:
    'Support WiCyS at Kean University. Donations help cover prizes for our Capture the Flag competition and food and supplies for our events.',
};

const IMPACT = [
  { Icon: Trophy, label: 'Capture the Flag', blurb: 'Prizes and running costs for the CTF competition we host.' },
  { Icon: Utensils, label: 'Food and event supplies', blurb: 'Food, materials, and supplies for our meetings and events.' },
];

export default async function DonatePage() {
  const [page, settings] = await Promise.all([getDonatePage(), getSiteSettings()]);

  const venmo = page?.venmoHandle?.replace(/^@/, '').trim();
  const cashApp = page?.cashAppTag?.replace(/^\$/, '').trim();
  const zelle = page?.zelleContact?.trim();

  const options = [
    page?.stripeUrl
      ? {
          Icon: CreditCard,
          label: 'Donate online',
          value: 'Give securely by card',
          href: page.stripeUrl,
        }
      : null,
    venmo
      ? { Icon: Smartphone, label: 'Venmo', value: `@${venmo}`, href: `https://venmo.com/u/${venmo}` }
      : null,
    cashApp
      ? { Icon: Smartphone, label: 'Cash App', value: `$${cashApp}`, href: `https://cash.app/$${cashApp}` }
      : null,
    zelle ? { Icon: Send, label: 'Zelle', value: zelle, href: null } : null,
  ].filter((option): option is NonNullable<typeof option> => option !== null);

  return (
    <>
      <section className="page-hero">
        <div className="hero-split hero-split-feature donate-hero">
          <div>
            <SectionHeading
              level="h1"
              tone="dark"
              title={<span className="lg:whitespace-nowrap">Support WiCyS at Kean</span>}
              lede={
                page?.intro ||
                'Every contribution, big or small, goes directly toward helping our members learn, compete, and grow into cybersecurity careers.'
              }
            />
            <a href="#ways-to-give" className="btn-green mt-8">
              Read more
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>
          <HeroPhoto
            large
            src="/images/uploads/conferences-2025-2026/photos/15.jpg"
            alt="WiCyS Kean members learning and working together around a conference table"
          />
        </div>
      </section>

      <section id="ways-to-give" className="scroll-mt-24 py-16 sm:py-20">
        <div className="container-site grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
              Ways to give
            </h2>
            {options.length > 0 ? (
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {options.map(({ Icon, label, value, href }) => {
                  const inner = (
                    <>
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-accent-700">
                          {label}
                        </span>
                        <span className="mt-0.5 block break-all text-sm font-medium text-ink">
                          {value}
                        </span>
                      </span>
                      {href ? (
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-brand-400 transition-colors group-hover:text-brand-700" />
                      ) : null}
                    </>
                  );
                  return (
                    <li key={label}>
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex h-full items-center gap-4 rounded-xl border border-brand-100 bg-white p-5 transition-colors hover:border-brand-400 hover:bg-brand-50/40"
                        >
                          {inner}
                        </a>
                      ) : (
                        <div className="flex h-full items-center gap-4 rounded-xl border border-brand-100 bg-white p-5">
                          {inner}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-8 max-w-xl rounded-xl border border-dashed border-brand-200 bg-white p-7 text-sm leading-relaxed text-ink-soft">
                Online giving is being set up. In the meantime, reach out and we
                will help you donate directly.
              </p>
            )}

            {page?.note ? (
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink-soft">{page.note}</p>
            ) : null}

            <div className="mt-10 flex flex-col items-start gap-5 rounded-xl border border-brand-100 bg-surface p-7 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                  Giving as a company?
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  Sponsorships, prizes, and in-kind donations are handled on our
                  sponsor page.
                </p>
              </div>
              <Link href="/sponsors" className="btn-outline shrink-0">
                Sponsor us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-xl border border-plum bg-plum p-7 text-brand-100">
              <h3 className="font-display text-lg font-bold tracking-tight text-white">
                Where your gift goes
              </h3>
              <ul className="mt-5 space-y-4">
                {IMPACT.map(({ Icon, label, blurb }) => (
                  <li key={label} className="flex gap-3.5">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-accent-400" />
                    <span>
                      <span className="block text-sm font-semibold text-white">{label}</span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-brand-200">
                        {blurb}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* A slim strip under both columns, lined up with their outer edges. */}
          {settings?.chapterEmail ? (
            <div
              className="rounded-xl border border-brand-100 bg-white"
              style={{
                gridColumn: '1 / -1',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem 1.5rem',
                padding: '1rem 1.5rem',
              }}
            >
              <p className="text-sm leading-relaxed text-ink-soft">
                <span className="font-display text-base font-bold tracking-tight text-ink">
                  Questions about donating?
                </span>{' '}
                We are happy to talk through other ways to give.
              </p>
              <Link href="/contact?topic=Donations" className="btn-outline px-4 py-2.5">
                <Mail className="h-4 w-4" />
                Contact us
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
