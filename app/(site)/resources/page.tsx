import type { Metadata } from 'next';
import {
  ArrowUpRight,
  Award,
  BookOpen,
  Briefcase,
  CalendarHeart,
  GraduationCap,
  HandCoins,
} from 'lucide-react';
import Link from 'next/link';

import SectionHeading from '@/components/section-heading';
import { getResourceLinks } from '@/lib/content';

export const metadata: Metadata = {
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
        <div className="container-site py-16 sm:py-24">
          <SectionHeading
            level="h1"
            tone="dark"
            kicker="Resources"
            title="Tools to learn, practice, and get hired"
            lede="A curated starting point for members, from first tutorials to certifications and conferences. Have a suggestion? Send it to the board."
          />
          <nav aria-label="Resource categories" className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5">
            {grouped.map((group) => (
              <a
                key={group.key}
                href={`#${group.key}`}
                className="text-sm font-medium text-brand-200 underline-offset-4 transition-colors hover:text-accent-400 hover:underline"
              >
                {group.label}
              </a>
            ))}
          </nav>
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
                      <h3 className="font-display font-bold tracking-tight text-ink">
                        {item.title}
                      </h3>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-brand-300 transition-colors group-hover:text-accent-600" />
                    </div>
                    {item.blurb ? (
                      <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
                        {item.blurb}
                      </p>
                    ) : null}
                    <p className="mt-auto pt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-brand-400">
                      {hostname(item.url)}
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

