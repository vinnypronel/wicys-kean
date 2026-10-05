'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import PhotoGrid from '@/components/photo-grid';

export type BrowserAlbum = {
  slug: string;
  title: string;
  period: string;
  academicYear: string;
  category: string;
  categoryLabel: string;
  eventSlug: string | null;
  eventTitle: string | null;
  photos: string[];
};

const ALL = 'all';

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-5">
      <p className="w-32 shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
        {label}
      </p>
      <div role="group" aria-label={label} className="flex flex-wrap gap-x-5 gap-y-2">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={active}
              className={`relative py-1 text-sm font-medium transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:origin-right hover:after:origin-left after:bg-accent-400 after:transition-transform after:duration-300 ${
                active
                  ? 'text-brand-700 after:scale-x-100'
                  : 'text-ink-soft after:scale-x-0 hover:text-brand-700'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function GalleryBrowser({ albums }: { albums: BrowserAlbum[] }) {
  const [year, setYear] = useState(ALL);
  const [category, setCategory] = useState(ALL);

  const years = useMemo(
    () => [...new Set(albums.map((album) => album.academicYear))],
    [albums]
  );
  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    albums.forEach((album) => seen.set(album.category, album.categoryLabel));
    return [...seen.entries()].map(([value, label]) => ({ value, label }));
  }, [albums]);

  const visible = albums.filter(
    (album) =>
      (year === ALL || album.academicYear === year) &&
      (category === ALL || album.category === category)
  );

  return (
    <>
      {years.length > 1 || categories.length > 1 ? (
        <div className="mb-14 space-y-4 border-b border-brand-100 pb-8">
          {years.length > 1 ? (
            <FilterRow
              label="Academic year"
              value={year}
              onChange={setYear}
              options={[
                { value: ALL, label: 'All years' },
                ...years.map((value) => ({ value, label: value })),
              ]}
            />
          ) : null}
          {categories.length > 1 ? (
            <FilterRow
              label="Type"
              value={category}
              onChange={setCategory}
              options={[{ value: ALL, label: 'Everything' }, ...categories]}
            />
          ) : null}
        </div>
      ) : null}

      <div data-reveal-group className="space-y-20">
        {visible.map((album) => (
          <div key={album.slug} id={album.slug} className="scroll-mt-24">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-700">
              {album.period} · {album.categoryLabel}
            </p>
            <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h2 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
                {album.title}
              </h2>
              {album.eventSlug && album.eventTitle ? (
                <Link
                  href={`/events/${album.eventSlug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-accent-700"
                >
                  {album.eventTitle}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
            {album.photos.length > 0 ? (
              <div className="mt-7">
                <PhotoGrid
                  photos={album.photos.map((src, index) => ({
                    src,
                    alt: `${album.title} photo ${index + 1}`,
                  }))}
                />
              </div>
            ) : (
              <p className="mt-6 max-w-xl rounded-xl border border-dashed border-brand-200 bg-white p-7 text-sm leading-relaxed text-ink-soft">
                Photos coming soon.
              </p>
            )}
          </div>
        ))}

        {visible.length === 0 ? (
          <p className="max-w-xl rounded-xl border border-dashed border-brand-200 bg-white p-7 text-sm leading-relaxed text-ink-soft">
            {albums.length === 0
              ? 'The gallery will be filled in as photos come in this semester.'
              : 'No albums match these filters yet.'}
          </p>
        ) : null}
      </div>
    </>
  );
}
