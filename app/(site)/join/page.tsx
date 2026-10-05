import type { Metadata } from 'next';
import { ArrowRight, ArrowUpRight, CalendarCheck, Globe, Users } from 'lucide-react';
import Link from 'next/link';

import SectionHeading from '@/components/section-heading';
import { getSiteSettings } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Join',
  description:
    'Join WiCyS at Kean University. Free membership, open to all majors and skill levels.',
};

export default async function JoinPage() {
  const settings = await getSiteSettings();
  const cougarlinkUrl =
    settings?.cougarlinkUrl ||
    'https://kean.campuslabs.com/engage/organization/wicyskean';
  const nationalUrl = settings?.nationalUrl || 'https://www.wicys.org/';
  const discordUrl = settings?.discordUrl;

  const steps = [
    {
      Icon: Users,
      title: 'Come to a meeting',
      description: (
        <>
          We announce meeting dates, times, and locations on Discord. Join us
          there, then show up to any general body meeting—there is no application
          or cut-off date during the semester.
        </>
      ),
      link: discordUrl
        ? {
            href: discordUrl,
            label: 'Join our Discord',
          }
        : null,
    },
    {
      Icon: CalendarCheck,
      title: 'Sign up on CougarLink',
      description: (
        <>
          Register as a member on{' '}
          <a
            href={cougarlinkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-700 underline underline-offset-4 transition-colors hover:text-accent-700"
          >
            Kean CougarLink
          </a>{' '}
          so you get official announcements and event invites.
        </>
      ),
      link: {
        href: cougarlinkUrl,
        label: 'Kean CougarLink',
      },
    },
    {
      Icon: Globe,
      title: 'Become a national member',
      description: (
        <>
          Join{' '}
          <a
            href={nationalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-700 underline underline-offset-4 transition-colors hover:text-accent-700"
          >
            Women in CyberSecurity
          </a>{' '}
          nationally for scholarships, conference access, and a worldwide
          professional network.
        </>
      ),
      link: {
        href: nationalUrl,
        label: 'WiCyS national site',
      },
    },
  ];

  return (
    <>
      <section className="page-hero">
        <div className="container-site py-16 sm:py-24">
          <SectionHeading
            level="h1"
            tone="dark"
            kicker="Join WiCyS"
            title="Find your people in cybersecurity"
            lede="Membership is free and open to every Kean student, whatever your major or experience level. Allies are always welcome."
          />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-site">
          <ol className="grid gap-6 md:grid-cols-3">
            {steps.map(({ Icon, title, description, link }, index) => (
              <li
                key={title}
                className="relative flex flex-col justify-between rounded-xl border border-brand-100 bg-white p-7"
              >
                <div>
                  <span className="font-display text-sm font-bold text-brand-300">
                    Step {index + 1}
                  </span>
                  <div className="mt-4 flex items-center gap-3.5">
                    <span className="grid h-11 w-11 place-items-center rounded-lg bg-brand-50 text-brand-700">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h2 className="font-display text-lg font-bold tracking-tight text-ink">
                      {title}
                    </h2>
                  </div>
                  <p className="mt-3.5 text-sm leading-relaxed text-ink-soft">
                    {description}
                  </p>
                </div>
                {link ? (
                  <div className="mt-6 pt-2">
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 underline underline-offset-4 transition-colors hover:text-accent-700"
                    >
                      {link.label}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                ) : null}
              </li>
            ))}
          </ol>

          <div className="mt-14 grid gap-10 rounded-2xl border border-accent-200 bg-accent-50 p-8 sm:p-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Ready when you are
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">
                Join the national organization online in minutes, then stop by
                our next meeting so we can meet you. Questions first? Email us
                anytime.
              </p>
              {settings?.chapterEmail ? (
                <Link
                  href="/contact"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition-colors hover:text-accent-700"
                >
                  Contact the chapter
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
            <div className="flex flex-col gap-3.5">
              {settings?.nationalUrl ? (
                <a
                  href={settings.nationalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-green w-full"
                >
                  Join WiCyS nationally
                  <ArrowRight className="h-4 w-4" />
                </a>
              ) : null}
              {settings?.cougarlinkUrl ? (
                <a
                  href={settings.cougarlinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline w-full"
                >
                  Sign up on CougarLink
                  <ArrowRight className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

