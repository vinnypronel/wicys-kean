'use client';

import { ArrowRight, CalendarDays, Clock, MapPin, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';

import type { EventEntry } from '@/lib/content';
import {
  eventEndDate,
  eventTypeLabel,
  formatLongDate,
  formatTime,
} from '@/lib/format';

export default function PastEventCard({ event }: { event: EventEntry }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  const photos = (event.photos ?? []).filter(
    (photo): photo is string => typeof photo === 'string'
  );
  // A flyer is shown whole. A recap photo fills a wide frame instead.
  const flyer = event.flyer ?? null;
  const photo = flyer ?? photos[0] ?? null;
  const text = event.recap || event.description;
  const highlights = (event.highlights ?? []).filter(Boolean);
  const href = `/events/${event.slug}`;

  // While the pop-up is open: lock the page behind it and close on Escape.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    const onKeyDown = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      root.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-brand-100 bg-white transition-colors hover:border-brand-300">
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden
        className="group relative block overflow-hidden bg-brand-50"
        // Set inline so the frame keeps its shape even if styles load late.
        style={{ aspectRatio: flyer ? '3 / 4' : '16 / 10' }}
      >
        {photo ? (
          <Image
            src={photo}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="transition-transform duration-300 group-hover:scale-[1.02]"
            style={{ objectFit: flyer ? 'contain' : 'cover' }}
          />
        ) : (
          <div className="grid h-full place-items-center font-mono text-xs uppercase tracking-[0.16em] text-brand-400">
            Photo coming soon
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg font-bold tracking-tight text-ink">
          <Link href={href} className="tap-target transition-colors hover:text-brand-700">
            {event.title}
          </Link>
        </h3>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-700">
          Past event · {eventTypeLabel(event.type)}
        </p>
        <p className="mt-1.5 text-sm font-medium text-ink">
          {formatLongDate(event.startDate)}
        </p>
        <p
          className="mt-3 text-sm leading-relaxed text-ink-soft"
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            overflow: 'hidden',
          }}
        >
          {text}
        </p>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          className="mt-auto inline-flex items-center gap-1.5 self-start pt-4 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900"
        >
          <span className="hover-underline">Read more</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {open
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              data-lenis-prevent
              onClick={() => setOpen(false)}
              className="event-popup flex items-center justify-center bg-plum-deep/75 p-4 backdrop-blur-sm sm:p-8"
              // Inline so the pop-up always covers the screen, above everything.
              style={{ position: 'fixed', inset: 0, zIndex: 150 }}
            >
              <div
                onClick={(clickEvent) => clickEvent.stopPropagation()}
                className="event-popup-panel overflow-y-auto rounded-2xl bg-white shadow-2xl"
                // Sizing is inline so the pop-up holds its shape regardless of
                // when the stylesheet loads.
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '36rem',
                  maxHeight: 'calc(100svh - 2rem)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  autoFocus
                  className="grid place-items-center rounded-lg bg-white text-ink transition-colors hover:bg-brand-100 hover:text-brand-700"
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    width: '2.5rem',
                    height: '2.5rem',
                    zIndex: 1,
                  }}
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="p-6 sm:p-8">
                  <p
                    className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-700"
                    style={{ paddingRight: '3rem' }}
                  >
                    Past event · {eventTypeLabel(event.type)}
                  </p>
                  <h3
                    id={titleId}
                    className="mt-2 font-display text-2xl font-bold tracking-tight text-ink"
                    style={{ paddingRight: '3rem' }}
                  >
                    {event.title}
                  </h3>

                  <dl className="mt-5 space-y-2 text-sm text-ink">
                    <div className="flex items-center gap-2.5">
                      <CalendarDays className="h-4 w-4 shrink-0 text-accent-600" />
                      <dt className="sr-only">Date</dt>
                      <dd className="font-medium">{formatLongDate(event.startDate)}</dd>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="h-4 w-4 shrink-0 text-accent-600" />
                      <dt className="sr-only">Time</dt>
                      <dd className="font-medium">
                        {formatTime(event.startDate)} to{' '}
                        {formatTime(eventEndDate(event).toISOString())} ET
                      </dd>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MapPin className="h-4 w-4 shrink-0 text-accent-600" />
                      <dt className="sr-only">Location</dt>
                      <dd className="font-medium">{event.location}</dd>
                    </div>
                  </dl>

                  <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                    {text}
                  </p>
                  {event.recap && event.description ? (
                    <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                      {event.description}
                    </p>
                  ) : null}

                  {highlights.length > 0 ? (
                    <ul className="mt-5 space-y-1.5 border-t border-brand-100 pt-5">
                      {highlights.map((highlight, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2.5 text-sm text-ink-soft"
                        >
                          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-accent-400" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <Link
                    href={href}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900"
                  >
                    <span className="hover-underline">View event page</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </article>
  );
}
