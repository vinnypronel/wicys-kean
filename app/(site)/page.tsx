import Image from 'next/image';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Flag,
  Mail,
  UserPlus,
} from 'lucide-react';
import Link from 'next/link';

import SectionHeading from '@/components/section-heading';
import {
  filterPhotos,
  getGalleryAlbums,
  getHomeAnnouncements,
  getCtfPage,
  getSiteSettings,
  getUpcomingEvents,
} from '@/lib/content';
import { formatShortDate, meetingSummary } from '@/lib/format';

const QUICK_LINKS = [
  { href: '/join', label: 'Join WiCyS', blurb: 'Become a member in minutes', Icon: UserPlus },
  { href: '/events', label: 'Events', blurb: 'Meetings, workshops, and more', Icon: CalendarDays },
  { href: '/resources', label: 'Resources', blurb: 'Learn, practice, get hired', Icon: BookOpen },
  { href: '/contact', label: 'Contact', blurb: 'Reach the chapter anytime', Icon: Mail },
];

const WHAT_WE_DO = [
  { label: 'Hands-on technical workshops' },
  { label: 'Guest speakers from industry' },
  { label: 'Annual Capture the Flag event' },
  { label: 'Conference trips and scholarships' },
  { label: 'Mentorship pairings with professionals' },
  { label: 'Networking with recruiters and alumni' },
];

export const revalidate = 3600;

export default async function HomePage() {
  const [settings, announcements, upcoming, ctf, albums] = await Promise.all([
    getSiteSettings(),
    getHomeAnnouncements(),
    getUpcomingEvents(),
    getCtfPage(),
    getGalleryAlbums(),
  ]);

  const featuredEvents = upcoming.slice(0, 2);
  const meetings = meetingSummary(settings);
  const latestAlbum = albums[0];
  const teaserPhotos = latestAlbum ? filterPhotos(latestAlbum.photos) : [];

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-brand-100),transparent_55%)]"
        />
        <div className="container-site relative grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div>
            <p className="kicker">Kean University Student Chapter</p>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
              Where Kean students get involved with{' '}
              <span className="text-brand-700">cybersecurity</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              WiCyS Kean is a community for anyone curious about security.
              We run workshops, host industry speakers, compete in capture the
              flag events, and connect members to scholarships and jobs. Open
              to all majors, no experience required.
            </p>
            {meetings ? (
              <p className="mt-5 inline-block rounded-lg bg-surface px-4 py-2.5 font-mono text-xs leading-relaxed tracking-wide text-brand-800">
                General body meetings: {meetings}
              </p>
            ) : null}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link href="/join" className="btn-green">
                Join the chapter
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/events" className="btn-outline">
                See upcoming events
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div
              aria-hidden
              className="absolute -inset-6 rounded-[1.75rem] border border-brand-200/70 bg-surface"
            />
            <div className="relative overflow-hidden rounded-2xl border border-plum bg-plum shadow-xl shadow-brand-950/20">
              <div className="flex items-center gap-1.5 border-b border-white/10 px-5 py-3.5">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
                <span className="ml-3 font-mono text-[11px] uppercase tracking-[0.16em] text-brand-300">
                  wicys@kean
                </span>
              </div>
              <div className="space-y-3 px-6 py-7 font-mono text-sm leading-relaxed">
                <p className="text-white">
                  <span className="text-accent-400">$</span> whoami
                </p>
                <p className="text-brand-200">future-security-engineer</p>
                <p className="text-white">
                  <span className="text-accent-400">$</span> cat mission.txt
                </p>
                <p className="text-brand-200">community · workshops · opportunity</p>
                <p className="text-white">
                  <span className="text-accent-400">$</span> ./join_us.sh
                  --open-to-all
                </p>
                <p className="text-accent-300">welcome aboard [OK]</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-site pb-4 pt-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map(({ href, label, blurb, Icon }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-xl border border-brand-100 bg-white p-5 transition-colors hover:border-brand-400 hover:bg-brand-50/50"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-700">
                  <Icon className="h-5 w-5" />
                </span>
                <ArrowUpRight className="h-4 w-4 text-brand-300 transition-colors group-hover:text-accent-600" />
              </div>
              <p className="mt-4 font-display font-bold tracking-tight text-ink">
                {label}
              </p>
              <p className="mt-1 text-sm text-ink-soft">{blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-site">
          <SectionHeading
            kicker="This semester"
            title="What we are working on"
            lede="Announcements from the chapter, updated by the e-board throughout the semester."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <div className="rounded-xl border border-brand-100 bg-white p-7">
              <p className="kicker">Upcoming events</p>
              {featuredEvents.length > 0 ? (
                <>
                  <ul className="mt-6 space-y-6">
                    {featuredEvents.map((event) => (
                      <li key={event.slug}>
                        <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent-700">
                          {formatShortDate(event.startDate)}
                        </p>
                        <Link
                          href={`/events/${event.slug}`}
                          className="mt-1.5 block font-display font-semibold tracking-tight text-ink transition-colors hover:text-brand-700"
                        >
                          {event.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/events"
                    className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition-colors hover:text-accent-700"
                  >
                    View all events
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              ) : (
                <p className="mt-6 text-sm leading-relaxed text-ink-soft">
                  New events are announced at meetings and on our Discord and
                  Instagram. Check back soon.
                </p>
              )}
            </div>

            <div className="rounded-xl border border-accent-200 bg-accent-50 p-7">
              <p className="kicker !text-accent-700">Current initiative</p>
              <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-ink">
                {announcements?.initiativeTitle ?? 'Current initiative coming soon'}
              </h3>
              {announcements?.initiativeBody ? (
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {announcements.initiativeBody}
                </p>
              ) : null}
              {announcements?.initiativePoints &&
              announcements.initiativePoints.length > 0 ? (
                <ul className="mt-5 space-y-2.5">
                  {announcements.initiativePoints.map((point, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2.5 text-sm text-ink-soft"
                    >
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-accent-600" />
                      {point}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className="flex flex-col rounded-xl border border-plum bg-plum p-7 text-brand-100">
              <p className="kicker kicker-light">Sponsorships</p>
              <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-white">
                Partner with WiCyS Kean
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-200">
                {announcements?.sponsorshipBlurb ??
                  'Support our students through funding, prizes, mentorship, and more.'}
              </p>
              <Link href="/sponsors" className="btn-outline-light mt-7 self-start">
                Sponsorship opportunities
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <SectionHeading
            kicker="About the chapter"
            title="A supportive community built around security"
            lede="WiCyS Kean is a student chapter of Women in CyberSecurity, a national nonprofit dedicated to recruiting, retaining, and advancing women in the field. Everyone is welcome here. Our members come from every major and every skill level, united by curiosity about how the digital world works and how to protect it."
          />
          <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 self-center">
            {WHAT_WE_DO.map((item) => (
              <li key={item.label} className="flex items-start gap-2.5 text-sm text-ink-soft">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-accent-600" />
                {item.label}
              </li>
            ))}
            <li className="sm:col-span-2 pt-2">
              <Link
                href="/eboard"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition-colors hover:text-accent-700"
              >
                Meet the e-board behind it all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-plum py-20">
        <div className="container-site grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="kicker kicker-light">Capture the Flag</p>
            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Our annual CTF brings campus hackers together
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-200">
              {ctf?.plannedBlurb ??
                'The next WiCyS Kean CTF is currently being planned. Check back for dates and registration.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link href="/ctf" className="btn bg-white text-plum hover:bg-brand-100">
                CTF details
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/join" className="btn-outline-light">
                Get involved
              </Link>
            </div>
          </div>
          <div className="relative mx-auto hidden aspect-square w-full max-w-sm place-items-center rounded-full border border-brand-500/40 md:grid">
            <div aria-hidden className="absolute inset-6 rounded-full border border-brand-500/30" />
            <Flag className="h-16 w-16 text-accent-400" strokeWidth={1.5} />
            <p className="absolute bottom-12 font-mono text-[11px] uppercase tracking-[0.22em] text-brand-300">
              Status · In planning
            </p>
          </div>
        </div>
      </section>

      {teaserPhotos.length > 0 ? (
        <section className="py-20">
          <div className="container-site">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                kicker="From the gallery"
                title={latestAlbum ? `${latestAlbum.period}` : 'Chapter life'}
              />
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition-colors hover:text-accent-700"
              >
                View full gallery
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {teaserPhotos.slice(0, 4).map((photo, index) => (
                <div
                  key={`${photo}-${index}`}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl border border-brand-100 bg-surface"
                >
                  <Image
                    src={photo}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="pb-24">
        <div className="container-site">
          <div className="rounded-2xl border border-accent-200 bg-accent-50 px-7 py-12 text-center sm:px-12">
            <h2 className="mx-auto max-w-xl font-display text-3xl font-bold tracking-tight text-ink">
              Ready to find your people in cybersecurity?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-ink-soft">
              Membership is free and open to every Kean student. Come to a
              meeting, bring a friend, and see what we are about.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3.5">
              <Link href="/join" className="btn-green">
                Join WiCyS Kean
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="btn-outline">
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
