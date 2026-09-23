import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  Clock,
  Download,
  MapPin,
} from 'lucide-react';

import PhotoGrid from '@/components/photo-grid';
import { googleCalendarUrl } from '@/lib/calendar';
import {
  filterPhotos,
  getAlbumsForEvent,
  getAllEvents,
  getEvent,
  isEventPast,
} from '@/lib/content';
import {
  eventEndDate,
  eventTypeLabel,
  formatLongDate,
  formatTime,
} from '@/lib/format';

export const revalidate = 3600;
export const dynamicParams = false;

export async function generateStaticParams() {
  const events = await getAllEvents();
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return {};
  const image = event.flyer ?? filterPhotos(event.photos)[0];
  return {
    title: event.title,
    description: event.description.slice(0, 160),
    openGraph: image ? { images: [image] } : undefined,
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const albums = await getAlbumsForEvent(slug);
  const past = isEventPast(event);
  const end = eventEndDate(event).toISOString();
  const photos = [
    ...filterPhotos(event.photos),
    ...albums.flatMap((album) => filterPhotos(album.photos)),
  ].map((src, index) => ({
    src,
    alt: `${event.title} photo ${index + 1}`,
  }));

  return (
    <>
      <section className="border-b border-brand-100 bg-surface">
        <div className="container-site py-12 sm:py-16">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition-colors hover:text-accent-700"
          >
            <ArrowLeft className="h-4 w-4" />
            All events
          </Link>
          <p className="kicker mt-8">
            {eventTypeLabel(event.type)}
            {past ? ' · Past event' : ''}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            {event.title}
          </h1>

          <dl className="mt-8 grid max-w-3xl gap-4 text-sm text-ink-soft sm:grid-cols-3">
            <div className="flex items-start gap-2.5">
              <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
              <div>
                <dt className="sr-only">Date</dt>
                <dd className="font-medium text-ink">
                  {formatLongDate(event.startDate)}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
              <div>
                <dt className="sr-only">Time</dt>
                <dd className="font-medium text-ink">
                  {formatTime(event.startDate)} to {formatTime(end)} ET
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
              <div>
                <dt className="sr-only">Location</dt>
                <dd className="font-medium text-ink">{event.location}</dd>
              </div>
            </div>
          </dl>

          {!past ? (
            <div className="mt-9 flex flex-wrap gap-3">
              {event.registrationUrl ? (
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-green"
                >
                  Register
                  <ArrowRight className="h-4 w-4" />
                </a>
              ) : null}
              <a
                href={googleCalendarUrl(event)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <CalendarPlus className="h-4 w-4" />
                Google Calendar
              </a>
              <a
                href={`/events/${event.slug}/event.ics`}
                download={`${event.slug}.ics`}
                className="btn-outline"
              >
                <Download className="h-4 w-4" />
                Apple or Outlook (.ics)
              </a>
            </div>
          ) : null}
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div
          className={`container-site grid gap-12 ${
            event.flyer ? 'lg:grid-cols-[1.3fr_1fr] lg:gap-16' : ''
          }`}
        >
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
              About this event
            </h2>
            <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-ink-soft">
              {event.description}
            </p>

            {event.recap ? (
              <>
                <h2 className="mt-12 font-display text-2xl font-bold tracking-tight text-ink">
                  Recap
                </h2>
                <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-ink-soft">
                  {event.recap}
                </p>
              </>
            ) : null}

            {event.highlights && event.highlights.length > 0 ? (
              <>
                <h2 className="mt-12 font-display text-2xl font-bold tracking-tight text-ink">
                  Highlights
                </h2>
                <ul className="mt-5 space-y-3">
                  {event.highlights.map((highlight, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-base leading-relaxed text-ink-soft"
                    >
                      <span className="mt-[9px] h-1.5 w-1.5 shrink-0 bg-accent-600" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>

          {event.flyer ? (
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-xl border border-brand-100 bg-surface lg:mx-0">
              <Image
                src={event.flyer}
                alt={`Flyer for ${event.title}`}
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-contain"
              />
            </div>
          ) : null}
        </div>
      </section>

      {photos.length > 0 ? (
        <section className="border-t border-brand-100 bg-surface py-14 sm:py-20">
          <div className="container-site">
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
              Photos
            </h2>
            <div className="mt-8">
              <PhotoGrid photos={photos} />
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
