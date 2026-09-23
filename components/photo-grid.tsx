'use client';

import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

export type GridPhoto = { src: string; alt: string };

export default function PhotoGrid({
  photos,
  gridClassName = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
  aspectClassName = 'aspect-[4/3]',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
}: {
  photos: GridPhoto[];
  gridClassName?: string;
  aspectClassName?: string;
  sizes?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;
  const count = photos.length;

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpenIndex((index) =>
        index === null ? index : (index + delta + count) % count
      ),
    [count]
  );

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, close, step]);

  const current = openIndex !== null ? photos[openIndex] : null;

  return (
    <>
      <div className={gridClassName}>
        {photos.map((photo, index) => (
          <button
            key={`${photo.src}-${index}`}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`Open photo: ${photo.alt}`}
            className={`group relative block overflow-hidden rounded-xl border border-brand-100 bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${aspectClassName}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes={sizes}
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      {current ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          data-lenis-prevent
          className="photo-viewer fixed inset-0 z-[60] flex flex-col bg-plum-deep/95 backdrop-blur-sm"
          onClick={close}
        >
          <div className="flex items-center justify-between px-5 py-4 text-brand-200">
            <p className="font-mono text-xs uppercase tracking-[0.16em]">
              {(openIndex ?? 0) + 1} / {count}
            </p>
            <button
              type="button"
              onClick={close}
              aria-label="Close photo viewer"
              className="grid h-10 w-10 place-items-center rounded-lg text-white transition-colors hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative flex-1" onClick={(event) => event.stopPropagation()}>
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt}
              fill
              sizes="100vw"
              className="object-contain px-4 pb-6 sm:px-20"
            />
            {count > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                  className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-lg bg-black/30 text-white transition-colors hover:bg-black/50 sm:left-5"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next photo"
                  className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-lg bg-black/30 text-white transition-colors hover:bg-black/50 sm:right-5"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
