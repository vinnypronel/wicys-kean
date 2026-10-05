import Image from 'next/image';
import Link from 'next/link';

import type { EventEntry } from '@/lib/content';
import { filterPhotos } from '@/lib/content';
import { formatShortDate, eventTypeLabel } from '@/lib/format';

export default function PastEventCard({ event }: { event: EventEntry }) {
  const photos = filterPhotos(event.photos);
  // No recap photos yet: show the flyer, anchored to its top where the title is.
  const isFlyer = photos.length === 0 && Boolean(event.flyer);
  const photo = photos.length > 0 ? photos[0] : (event.flyer ?? null);

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-brand-100 bg-white transition-colors hover:border-brand-300"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        {photo ? (
          <Image
            src={photo}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className={`object-cover transition-transform duration-300 group-hover:scale-[1.03] ${isFlyer ? 'object-top' : ''}`}
          />
        ) : (
          <div className="grid h-full place-items-center font-mono text-xs uppercase tracking-[0.16em] text-brand-400">
            Photo coming soon
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-700">
          {eventTypeLabel(event.type)} · {formatShortDate(event.startDate)}
        </p>
        <h3 className="mt-2 font-display text-lg font-bold tracking-tight text-ink transition-colors group-hover:text-brand-700">
          {event.title}
        </h3>
        <p className="mt-2.5 line-clamp-4 text-sm leading-relaxed text-ink-soft">
          {event.recap || event.description}
        </p>
        {event.highlights && event.highlights.length > 0 ? (
          <ul className="mt-4 space-y-1.5 border-t border-brand-100 pt-4">
            {event.highlights.slice(0, 2).map((highlight, index) => (
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
      </div>
    </Link>
  );
}
