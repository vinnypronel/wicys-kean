import Image from 'next/image';
import { ArrowRight, Flag } from 'lucide-react';
import Link from 'next/link';

import { DiscordLogo, InstagramLogo } from '@/components/brand-icons';
import SectionHeading from '@/components/section-heading';
import {
  filterPhotos,
  getGalleryAlbums,
  getHomeAnnouncements,
  getCtfPage,
  getSiteSettings,
  getUpcomingEvents,
} from '@/lib/content';
import { formatShortDate } from '@/lib/format';

const WHAT_WE_DO = [
  { label: 'Hands-on technical workshops' },
  { label: 'Guest speakers from industry' },
  { label: 'Annual Capture the Flag event' },
  { label: 'Conference trips and scholarships' },
  { label: 'Resume and interview prep' },
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
  const latestAlbum =
    albums.find((album) => filterPhotos(album.photos).length > 0) ?? albums[0];
  const teaserPhotos = latestAlbum ? filterPhotos(latestAlbum.photos) : [];

  return (
    <>
      <section className="sticky top-0 z-0 flex h-screen items-center overflow-hidden bg-plum">
        <video
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover [filter:saturate(0.62)_brightness(0.82)_contrast(1.06)]"
          autoPlay
          loop
          muted
          playsInline
          poster="/images/kean-hero-muted.jpg"
        >
          <source src="/videos/kean-hero-directional-v3.mp4" type="video/mp4" />
        </video>
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
              <Link href="/join" className="btn-green hero-cta">
                Join the chapter
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/events" className="btn-outline-light hero-events-button hero-cta text-[13px]">
                Upcoming events
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 bg-surface">
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
                <>
                  <p className="mt-6 text-sm leading-relaxed text-ink-soft">
                    New events are announced at meetings and on our Discord and
                    Instagram. Check back soon.
                  </p>
                  <div className="mt-6 flex flex-col gap-3">
                    {settings?.instagramUrl ? (
                      <a
                        href={settings.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline w-full"
                      >
                        <span className="grid w-full grid-cols-[1.25rem_1fr] items-center gap-2 text-left">
                          <InstagramLogo className="h-5 w-5 shrink-0" />
                          Follow us on Instagram
                        </span>
                      </a>
                    ) : null}
                    {settings?.discordUrl ? (
                      <a
                        href={settings.discordUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-green w-full"
                      >
                        <span className="grid w-full grid-cols-[1.25rem_1fr] items-center gap-2 text-left">
                          <DiscordLogo className="h-5 w-5 shrink-0" />
                          Join our Discord
                        </span>
                      </a>
                    ) : null}
                  </div>
                </>
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
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-accent-400" />
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
                  'Support our students through funding, prizes, speakers, and more.'}
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
          <ol className="mt-8 grid gap-x-8 gap-y-4 self-center sm:grid-cols-2 lg:mt-14">
            {WHAT_WE_DO.map((item, index) => (
              <li
                key={item.label}
                className="flex items-start gap-3 rounded-xl border border-brand-100 bg-white p-4 text-sm font-semibold text-ink-soft shadow-sm shadow-brand-950/5 transition-colors hover:border-brand-300"
              >
                <span className="font-mono text-xs leading-6 text-accent-600">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{item.label}</span>
              </li>
            ))}
            <li className="flex justify-end pt-6 sm:col-span-2">
              <Link
                href="/eboard"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 underline underline-offset-6 transition-colors hover:text-accent-700"
              >
                <span>Meet the Kean WiCyS Eboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </li>
          </ol>
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
              <Link href="/ctf" className="btn-light">
                CTF details
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/join" className="btn-outline-light">
                Get involved
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="relative mx-auto hidden aspect-square w-full max-w-sm place-items-center rounded-full border border-brand-500/40 md:grid">
            <div aria-hidden className="absolute inset-6 rounded-full border border-brand-500/30" />
            <Flag className="h-16 w-16 text-accent-400" strokeWidth={1.5} />
            <p className="absolute bottom-12 font-mono text-[11px] uppercase tracking-[0.22em] text-brand-200">
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

      <section className="pb-28 pt-16 sm:pt-24">
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
