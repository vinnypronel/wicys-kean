import type { Metadata } from 'next';
import Image from 'next/image';
import {
  ArrowRight,
  FileText,
  Flag,
  Handshake,
  Mic,
  Plane,
  Wrench,
} from 'lucide-react';
import Link from 'next/link';

import { DiscordLogo, InstagramLogo } from '@/components/brand-icons';
import HeroVideo from '@/components/hero-video';
import MeetingCard from '@/components/meeting-card';
import PhotoGrid from '@/components/photo-grid';
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

const WHAT_WE_DO = [
  { label: 'Hands-on technical workshops', Icon: Wrench },
  { label: 'Guest speakers from industry', Icon: Mic },
  { label: 'Annual Capture the Flag event', Icon: Flag },
  { label: 'Conference trips and scholarships', Icon: Plane },
  { label: 'Resume and interview prep', Icon: FileText },
  { label: 'Networking with recruiters and alumni', Icon: Handshake },
];

// The six boxes alternate between the two brand colors, like the officer
// cards on the E-Board page.
const WHAT_WE_DO_TONES = [
  {
    card: 'border-brand-200 bg-brand-100 hover:border-brand-600 hover:ring-1 hover:ring-brand-600',
    chip: 'bg-brand-600 text-white',
    ghost: 'text-brand-600',
  },
  {
    card: 'border-accent-300 bg-accent-100 hover:border-accent-500 hover:ring-1 hover:ring-accent-500',
    chip: 'bg-accent-400 text-black',
    ghost: 'text-accent-600',
  },
];

export const revalidate = 3600;

// The home page's own description for search results and link previews.
export const metadata: Metadata = {
  description:
    'WiCyS Kean is the Kean University student chapter of Women in CyberSecurity. Free to join for every major and skill level, with workshops, guest speakers, a Capture the Flag competition, and conference trips.',
};

export default async function HomePage() {
  const [settings, announcements, upcoming, ctf, albums] = await Promise.all([
    getSiteSettings(),
    getHomeAnnouncements(),
    getUpcomingEvents(),
    getCtfPage(),
    getGalleryAlbums(),
  ]);

  const featuredEvents = upcoming.slice(0, 2);
  const latestAlbum =
    albums.find((album) => filterPhotos(album.photos).length > 0) ?? albums[0];
  const teaserPhotos = latestAlbum ? filterPhotos(latestAlbum.photos) : [];

  return (
    <>
      <section className="sticky top-0 z-0 flex h-screen items-center overflow-hidden bg-plum">
        {/* Phones play a small copy of the video. Anyone who has asked for
            less motion keeps the still poster. */}
        <HeroVideo
          src="/videos/kean-hero-directional-v3.mp4"
          mobileSrc="/videos/kean-hero-directional-v3-mobile.mp4"
          poster="/images/kean-hero-muted.jpg"
          className="absolute inset-0 h-full w-full object-cover [filter:saturate(0.62)_brightness(0.82)_contrast(1.06)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-black/75 via-brand-950/45 to-black/20"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20"
        />
        <div className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="ml-auto flex max-w-4xl origin-right translate-y-6 flex-col items-end text-right md:scale-[1.12] xl:scale-[1.18]">
            <h1 className="w-full font-display text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-[5.5rem] xl:text-[6rem]">
              <span className="block">
                <Image
                  src="/images/wicys-wordmark.png"
                  alt="WiCyS"
                  width={826}
                  height={296}
                  preload
                  className="ml-auto h-[1.05em] w-auto"
                />
              </span>
              <span className="mt-[0.06em] block">
                <span className="ml-auto flex w-fit flex-col items-center">
                  <Image
                    src="/images/kean-wordmark-blue.png"
                    alt="Kean"
                    width={908}
                    height={320}
                    preload
                    className="h-[0.88em] w-auto shrink-0"
                  />
                  <span className="mt-1 font-mono text-[0.2em] font-semibold uppercase leading-none tracking-[0.3em] text-[#4AA3DF]">
                    University
                  </span>
                </span>
              </span>
            </h1>
            <div className="mt-8 grid w-fit gap-3">
              <span className="relative inline-flex">
                <span aria-hidden className="btn-green hero-cta invisible">
                  Join the chapter
                </span>
                <Link href="/get-involved#join" className="btn-green hero-cta hero-cta-live">
                  Join the chapter
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </span>
              <span className="relative inline-flex">
                <span
                  aria-hidden
                  className="btn-outline-light hero-cta invisible text-[13px]"
                >
                  Upcoming events
                </span>
                <Link
                  href="/events"
                  className="btn-outline-light hero-events-button hero-cta hero-cta-live text-[13px]"
                >
                  Upcoming events
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="page-rise relative z-10 bg-surface">
      <section className="bg-surface py-20">
        <div className="container-site">
          <SectionHeading kicker="This semester" title="What we are working on" />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <div className="flex flex-col rounded-xl border border-brand-100 bg-white p-7">
              <p className="kicker">Upcoming events</p>
              {featuredEvents.length > 0 ? (
                <>
                  <ul className="mt-6 flex-1 space-y-6">
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
                    className="group mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold text-brand-700 transition-colors hover:text-accent-700"
                  >
                    <span>View all events</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </>
              ) : (
                <>
                  {/* With nothing else scheduled, the weekly meeting still
                      shows. */}
                  {meetingSummary(settings) ? (
                    <div className="mt-6">
                      <MeetingCard settings={settings} compact />
                    </div>
                  ) : null}
                  <p className="mt-5 flex-1 text-sm leading-relaxed text-ink-soft">
                    Other events are announced at meetings and on our Discord
                    and Instagram.
                  </p>
                  <div className="mt-auto flex flex-col gap-3 pt-6">
                    {settings?.instagramUrl ? (
                      <a
                        href={settings.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline w-full"
                      >
                        <span className="flex items-center gap-2">
                          <InstagramLogo className="h-5 w-5 shrink-0" />
                          <span>Follow us on Instagram</span>
                        </span>
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    ) : null}
                    {settings?.discordUrl ? (
                      <a
                        href={settings.discordUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-green w-full"
                      >
                        <span className="flex items-center gap-2">
                          <DiscordLogo className="h-5 w-5 shrink-0" />
                          <span>Join our Discord</span>
                        </span>
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col rounded-xl border border-accent-200 bg-accent-50 p-7">
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
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-accent-400" />
                      {point}
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-auto flex justify-end pt-7">
                <Link href="/ctf" className="btn-outline whitespace-nowrap">
                  See the CTF page
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="flex flex-col rounded-xl border border-plum bg-plum p-7 text-brand-100">
              <p className="kicker kicker-light">Sponsorships</p>
              <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-white">
                Partner with WiCyS Kean
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-200">
                {announcements?.sponsorshipBlurb ??
                  'Support our students through funding, prizes, speakers, and more.'}
              </p>
              <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
                <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-white p-1.5">
                  <Image
                    src="/images/kean-seal.png"
                    alt="Kean University Seal"
                    width={128}
                    height={128}
                    className="h-full w-full object-contain"
                  />
                </span>
                <Link href="/sponsors" className="btn-outline-light ml-auto whitespace-nowrap">
                  Become a sponsor
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 pt-12 lg:pt-10">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div className="lg:mt-12">
            <SectionHeading
              kicker="About the chapter"
              title="A supportive community built around security"
              lede="WiCyS Kean is a student chapter of Women in CyberSecurity, a national nonprofit dedicated to recruiting, retaining, and advancing women in the field. Everyone is welcome here. Our members come from every major and every skill level, united by curiosity about how the digital world works and how to protect it."
            />
          </div>
          <ul className="mt-8 grid gap-4 self-center sm:grid-cols-2 lg:mt-14">
            {WHAT_WE_DO.map(({ label, Icon }, index) => {
              // Checkerboard: purple and green swap places on each row.
              const tone = WHAT_WE_DO_TONES[(index + Math.floor(index / 2)) % 2];
              return (
                // The list item stays put and the tile inside lifts, so the
                // hover never flickers at the tile's edge.
                <li key={label} className="group flex">
                  <div
                    className={`relative flex w-full items-center gap-4 overflow-hidden rounded-xl border p-5 transition-[translate,transform,border-color,box-shadow] duration-500 ease-out group-hover:-translate-y-1 ${tone.card}`}
                  >
                  <Icon
                    aria-hidden
                    strokeWidth={1.5}
                    className={`pointer-events-none absolute -bottom-3 -right-2 h-20 w-20 opacity-[0.1] ${tone.ghost}`}
                  />
                  <span
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${tone.chip}`}
                  >
                    <Icon aria-hidden className="h-5 w-5" />
                  </span>
                  <span className="relative font-display text-base font-bold leading-snug tracking-tight text-ink">
                    {label}
                  </span>
                  </div>
                </li>
              );
            })}
            <li className="flex justify-end pt-6 sm:col-span-2">
              <Link
                href="/eboard"
                className="tap-target group inline-flex items-center gap-2 text-sm font-semibold text-brand-700 underline underline-offset-6 transition-colors hover:text-accent-700"
              >
                <span>Meet the Kean WiCyS Eboard</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
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
              Our annual CTF brings hackers together from all campuses
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-200">
              {ctf?.plannedBlurb ??
                'The next WiCyS Kean CTF is currently being planned. Check back for dates and registration.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link href="/ctf" className="btn-light">
                CTF details
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/get-involved#join" className="btn-outline-light">
                Get involved
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <figure className="mx-auto hidden w-full max-w-sm md:block">
            <div className="overflow-hidden rounded-xl border border-brand-500/40 shadow-lg shadow-brand-950/30">
              <Image
                src="/images/uploads/capture-the-flag-2026/flyer.jpg"
                alt="Flyer for last year's Kean University Capture the Flag, held March 20, 2026"
                width={754}
                height={1000}
                className="h-auto w-full"
              />
            </div>
            <figcaption className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-brand-200">
              Flyer from last year&apos;s CTF, March 2026
            </figcaption>
          </figure>
        </div>
      </section>

      {teaserPhotos.length > 0 ? (
        <section className="pb-8 pt-20">
          {/* Wider than the text column so the photos get more room, with a
              side margin that grows with the screen. The heading and link
              line up with the photos' outer edges. */}
          <div
            className="mx-auto w-full max-w-[112rem]"
            style={{ paddingInline: 'clamp(1.25rem, 6vw, 7.5rem)' }}
          >
            <div>
              <SectionHeading
                kicker="From the gallery"
                title={latestAlbum ? latestAlbum.title : 'Chapter life'}
              />
            </div>
            {/* Tapping a photo opens the same viewer as the gallery, limited
                to these four. */}
            <div className="mt-10">
              <PhotoGrid
                gridClassName="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                title={latestAlbum?.title}
                viewAllHref="/gallery"
                watermark={
                  latestAlbum?.externalPhotos ? undefined : '©2026 WiCyS Kean'
                }
                photos={teaserPhotos.slice(0, 4).map((src, index) => ({
                  src,
                  alt: `${latestAlbum?.title ?? 'Chapter'} photo ${index + 1}`,
                }))}
              />
            </div>
            <div className="mt-8 flex justify-end">
              <Link
                href="/gallery"
                className="tap-target group inline-flex items-center gap-2 text-base font-semibold text-brand-700 underline decoration-accent-400 decoration-2 underline-offset-[6px] transition-colors hover:text-brand-900"
              >
                <span>View full gallery</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="pb-20 pt-8 sm:pt-10">
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
              <Link href="/get-involved#join" className="btn-green">
                Join WiCyS Kean
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="btn-outline">
                Contact us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
