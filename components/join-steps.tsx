import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarCheck,
  Globe,
  MessagesSquare,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import SectionHeading from '@/components/section-heading';

// Goes straight to the national sign-up form.
export const NATIONAL_REGISTER_URL =
  'https://womenincybersecuritywicys.my.site.com/s/registration';

const TEXT_LINK =
  'font-semibold text-brand-700 underline underline-offset-4 transition-colors hover:text-accent-700';

type Step = {
  Icon: LucideIcon;
  title: string;
  description: ReactNode;
  link: { href: string; label: string; internal?: boolean } | null;
};

function StepGroup({
  title,
  steps,
}: {
  title: string;
  steps: Step[];
}) {
  return (
    <div>
      <SectionHeading title={title} />
      <ol className="mt-8 grid gap-6 md:grid-cols-3">
        {steps.map(({ Icon, title: stepTitle, description, link }, index) => (
          <li
            key={stepTitle}
            className="relative flex flex-col justify-between rounded-xl border border-brand-100 bg-white p-7"
          >
            <div>
              <span className="font-display text-sm font-bold text-brand-600">
                Step {index + 1}
              </span>
              <div className="mt-4 flex items-center gap-3.5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                  {stepTitle}
                </h3>
              </div>
              <p className="mt-3.5 text-sm leading-relaxed text-ink-soft">
                {description}
              </p>
            </div>
            {link ? (
              <div className="mt-6 pt-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {link.internal ? (
                  <Link
                    href={link.href}
                    className={`step-link inline-flex items-center gap-1.5 text-sm ${TEXT_LINK}`}
                  >
                    {link.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`step-link inline-flex items-center gap-1.5 text-sm ${TEXT_LINK}`}
                  >
                    {link.label}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

// The three steps for joining the Kean chapter. Carries id="join", which is
// where every "Join WiCyS" button on the site lands.
export function ChapterSteps({
  discordUrl,
  cougarlinkUrl,
}: {
  discordUrl?: string | null;
  cougarlinkUrl: string;
}) {
  const steps: Step[] = [
    {
      Icon: MessagesSquare,
      title: 'Join our Discord',
      description: (
        <>
          Discord is where we post event reminders, chapter news, and
          opportunities. It is the fastest way to stay in the loop.
        </>
      ),
      link: discordUrl ? { href: discordUrl, label: 'Join our Discord' } : null,
    },
    {
      Icon: Users,
      title: 'Come to an event',
      description: (
        <>
          We hold an event every Tuesday from 2:15–3:30 PM in GLAB 208 unless stated otherwise.
          Show up to any event. There is no application or cut-off date
          during the semester.
        </>
      ),
      link: { href: '/events', label: 'See upcoming events', internal: true },
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
            className={TEXT_LINK}
          >
            Kean CougarLink
          </a>{' '}
          so you get official announcements and event invites.
        </>
      ),
      link: { href: cougarlinkUrl, label: 'Kean CougarLink' },
    },
  ];

  return (
    <div id="join" style={{ scrollMarginTop: '6.5rem' }}>
      <StepGroup title="Join the Kean chapter!" steps={steps} />
      <p className="mt-5 text-sm leading-relaxed text-ink-soft">
        Chapter membership is free and open to every Kean student, whatever
        your major or experience level. Allies are always welcome.
      </p>
    </div>
  );
}

// Registering with the national organization, following what its
// registration page says.
export function NationalSteps() {
  const steps: Step[] = [
    {
      Icon: Globe,
      title: 'Open the registration page',
      description: (
        <>
          Go to the national WiCyS registration page and confirm that you are
          15 or older to continue.
        </>
      ),
      link: { href: NATIONAL_REGISTER_URL, label: 'WiCyS registration' },
    },
    {
      Icon: UserPlus,
      title: 'Enter your details',
      description: (
        <>
          Register with your first name, last name, and email. Every field on
          the form is required.
        </>
      ),
      link: null,
    },
    {
      Icon: BadgeCheck,
      title: 'Use the member portal',
      description: (
        <>
          Once your registration is approved, you can sign in to the
          member-only areas of the WiCyS member portal. Questions about
          registering go to{' '}
          <a href="mailto:info@wicys.org" className={TEXT_LINK}>
            info@wicys.org
          </a>
          .
        </>
      ),
      link: null,
    },
  ];

  // id="national" is where the "register" search result lands.
  return (
    <div id="national" style={{ scrollMarginTop: '6.5rem' }}>
      <StepGroup
        title="Register with national WiCyS!"
        steps={steps}
      />
      {/* The fee is the student rate WiCyS has published. Update it here if
          national changes it. */}
      <p className="mt-5 text-sm leading-relaxed text-ink-soft">
        <span className="font-semibold text-ink">
          National student membership costs $20 a year.
        </span>{' '}
        It is separate from the Kean chapter, which is free. You need a school
        email address to get the student rate.
      </p>
    </div>
  );
}
