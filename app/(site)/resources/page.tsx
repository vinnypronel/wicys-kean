import type { Metadata } from 'next';
import {
  ArrowDown,
  ArrowUpRight,
  Award,
  BookOpen,
  Briefcase,
  CalendarHeart,
  GraduationCap,
  HandCoins,
} from 'lucide-react';
import Link from 'next/link';

import { DiscordLogo } from '@/components/brand-icons';
import HeroPhoto from '@/components/hero-photo';
import SectionHeading from '@/components/section-heading';
import { getResourceLinks } from '@/lib/content';

export const metadata: Metadata = {
  alternates: { canonical: '/resources' },
  title: 'Resources',
  description:
    'Cybersecurity learning platforms, internship and career tools, scholarships, certifications, and conferences curated by WiCyS at Kean University.',
};

const CATEGORIES = [
  { key: 'learning', label: 'Learning platforms', Icon: BookOpen },
  { key: 'careers', label: 'Internships and careers', Icon: Briefcase },
  { key: 'scholarships', label: 'Scholarships and fellowships', Icon: HandCoins },
  { key: 'certifications', label: 'Certifications', Icon: Award },
  { key: 'conferences', label: 'Conferences', Icon: CalendarHeart },
  { key: 'development', label: 'Professional development', Icon: GraduationCap },
] as const;

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export default async function ResourcesPage() {
  const links = await getResourceLinks();

  const grouped = CATEGORIES.map(({ key, label, Icon }) => ({
    key,
    label,
    Icon,
    items: links.filter((link) => link.category === key),
  })).filter((group) => group.items.length > 0);

  return (
    <>
      <section className="page-hero">
        <div className="hero-split">
          <div className="resources-hero-copy">
            <SectionHeading
              level="h1"
              tone="dark"
              // Non-breaking spaces keep "and get hired" together, so the
              // title breaks before "and".
              title={'Tools to learn, practice, and\u00A0get\u00A0hired'}
              lede="A curated starting point for members, from first tutorials to certifications and conferences. Have a suggestion? Send it to the board."
            />
            {/* The page index: one row per category, stacked, each
                with its icon and how many resources it holds. */}
            <nav aria-label="Resource categories" className="mt-10">
              <p className="font-mono text-sm uppercase tracking-[0.18em] text-accent-400">
                Jump to
              </p>
              <ul
                className="mt-3.5 border-t border-white/20"
                style={{ maxWidth: '28rem' }}
              >
                {grouped.map(({ key, label, Icon, items }) => (
                  <li key={key} className="border-b border-white/20">
                    <a
                      href={`#${key}`}
                      // On hover the row slides right and its label underlines.
                      className="group text-base font-medium text-white transition-[color,padding] duration-300 ease-out hover:pl-2 hover:text-accent-400 focus-visible:pl-2"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.875rem',
                        paddingBlock: '0.875rem',
                      }}
                    >
                      <Icon aria-hidden className="h-5 w-5 shrink-0 text-accent-400" />
                      <span style={{ flex: 1 }}>
                        <span className="hover-underline">{label}</span>
                      </span>
                      <span className="font-mono text-sm text-brand-200">
                        {items.length}
                      </span>
                      <ArrowDown
                        aria-hidden
                        className="h-5 w-5 shrink-0 text-brand-200 transition-[translate,color] duration-200 group-hover:translate-y-0.5 group-hover:text-accent-400"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          {/* Left off on phones, so the page index fits on the first
              screen without scrolling. */}
          <div className="hidden sm:flex sm:justify-center lg:justify-end">
            <HeroPhoto
              src="/images/uploads/conferences-2025-2026/photos/15.jpg"
              alt="Students working on laptops together at a conference table"
            />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-site space-y-16">
          {grouped.map(({ key, label, Icon, items }) => (
            <div key={key} id={key} className="scroll-mt-24">
              <div className="flex items-center gap-3.5">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-brand-50 text-brand-700">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
                  {label}
                </h2>
              </div>
              <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <a
                    key={item.slug}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col rounded-xl border border-brand-100 bg-white p-6 transition-colors hover:border-brand-400 hover:bg-brand-50/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="flex items-center gap-2.5 font-display font-bold tracking-tight text-ink">
                        {item.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.logo}
                            alt=""
                            loading="lazy"
                            style={{
                              width: '1.75rem',
                              height: '1.75rem',
                              flex: 'none',
                              objectFit: 'contain',
                            }}
                          />
                        ) : /discord\.(gg|com)$/.test(hostname(item.url)) ? (
                          <DiscordLogo className="h-7 w-7 shrink-0" />
                        ) : null}
                        {item.title}
                      </h3>
                    </div>
                    {item.blurb ? (
                      <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
                        {item.blurb}
                      </p>
                    ) : null}
                    {/* The site address with its arrow, set a little in from
                        the right edge. The underline slides in from the left
                        when the card is hovered, and the arrow turns to
                        point straight right. */}
                    <p
                      className="mt-auto pt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-brand-600"
                      style={{ textAlign: 'right', paddingRight: '0.75rem' }}
                    >
                      <span
                        className="step-link"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                        }}
                      >
                        <span className="hover-underline">
                          {hostname(item.url)}
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 transition-[rotate] duration-300 ease-out group-hover:rotate-45" />
                      </span>
                    </p>
                  </a>
                ))}
              </div>
            </div>
          ))}

          {links.length === 0 ? (
            <p className="max-w-xl rounded-xl border border-dashed border-brand-200 bg-white p-7 text-sm leading-relaxed text-ink-soft">
              Resources are being added for this semester. Check back soon.
            </p>
          ) : null}

          <p className="border-t border-brand-100 pt-8 text-sm leading-relaxed text-ink-soft">
            Looking for something specific like study groups or mock
            interviews?{' '}
            <Link
              href="/contact"
              className="font-semibold text-brand-700 underline-offset-4 hover:text-accent-700 hover:underline"
            >
              Reach out to us
            </Link>{' '}
            and we will point you in the right direction.
          </p>
        </div>
      </section>
    </>
  );
}

