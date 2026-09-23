import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import type { EventEntry } from '@/lib/content';
import {
  eventTypeLabel,
  formatEventDate,
  formatLongDate,
  formatMonth,
} from '@/lib/format';

export default function EventCard({ event }: { event: EventEntry }) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-brand-100 bg-white p-6 transition-colors hover:border-brand-300 sm:flex-row sm:gap-7">
      <div className="flex shrink-0 flex-row items-baseline gap-3 border-b border-dashed border-brand-200 pb-4 sm:w-32 sm:flex-col sm:gap-1 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-7">
        <span className="font-display text-2xl font-bold tracking-tight text-brand-700">
          {formatMonth(event.startDate)}
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">
          {formatLongDate(event.startDate)}
        </span>
      </div>

      <div className="min-w-0">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-700">
          {eventTypeLabel(event.type)}
        </p>
        <h3 className="mt-1.5 font-display text-lg font-bold tracking-tight text-ink">
          <Link
            href={`/events/${event.slug}`}
            className="transition-colors hover:text-brand-700"
          >
            {event.title}
          </Link>
        </h3>
        <div className="mt-2.5 space-y-1.5 text-sm text-ink-soft">
          <p>
            <span className="font-medium text-ink">When:</span>{' '}
            {formatEventDate(event.startDate)} ET
          </p>
          <p>
            <span className="font-medium text-ink">Where:</span> {event.location}
          </p>
        </div>
        <p className="mt-3.5 line-clamp-3 text-sm leading-relaxed text-ink-soft">
          {event.description}
        </p>
        <Link
          href={`/events/${event.slug}`}
          className="mt-3.5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-accent-700"
        >
          Event details
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="shrink-0 self-start sm:self-center">
        {event.registrationUrl ? (
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-700"
          >
            Register
            <ArrowRight className="h-4 w-4" />
          </a>
        ) : (
          <p className="max-w-[10rem] font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-ink-soft">
            Registration opens soon
          </p>
        )}
      </div>
    </article>
  );
}
