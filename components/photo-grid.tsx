'use client';

import { ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { useCallback, useEffect, useState, type CSSProperties } from 'react';

export type GridPhoto = { src: string; alt: string };

const WATERMARK_STYLE: CSSProperties = {
  position: 'absolute',
  left: '3%',
  bottom: '3%',
  maxWidth: '94%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  color: 'rgba(255, 255, 255, 0.85)',
  fontWeight: 700,
  lineHeight: 1,
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.55)',
  pointerEvents: 'none',
};

const SIDE_LOGOS = [
  { side: 'left', src: '/images/wicys-wordmark.png' },
  { side: 'right', src: '/images/kean-wordmark-blue.png' },
] as const;

// Empty space left above and below the open photo. None, so the photo
// runs the full height of the screen.
const VIEWER_GAP = '0px';

// Viewer controls sit on a dark chip so they read over any photo.
const CONTROL_STYLE: CSSProperties = {
  position: 'absolute',
  zIndex: 1,
  margin: 0,
  borderRadius: '0.5rem',
  background: 'rgba(0, 0, 0, 0.45)',
};

const BUTTON_STYLE: CSSProperties = {
  display: 'grid',
  placeItems: 'center',
  width: '2.75rem',
  height: '2.75rem',
};

export default function PhotoGrid({
  photos,
  gridClassName = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
  aspectClassName = 'aspect-[4/3]',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  layout = 'grid',
  watermark,
  title,
  rowHeight = 'clamp(130px, 15vw, 290px)',
  viewAllHref,
}: {
  photos: GridPhoto[];
  gridClassName?: string;
  aspectClassName?: string;
  sizes?: string;
  // 'justified' packs photos into full-width rows of equal height, each photo
  // keeping its own shape, like a conference photo wall.
  layout?: 'grid' | 'justified';
  // Credit line shown over the corner of each photo. It is an overlay on the
  // page, not part of the image file.
  watermark?: string;
  // Shown in the top left of the full-screen viewer, above the photo count.
  title?: string;
  // Target height of a justified row, as any CSS length.
  rowHeight?: string;
  // When set, the viewer shows a button in the bottom right that goes to
  // this page, such as the full gallery.
  viewAllHref?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  // Width divided by height for each photo, learned as the images load.
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const isOpen = openIndex !== null;
  const count = photos.length;

  // Which way the last move went, so the new photo swipes in from that side.
  const [swipe, setSwipe] = useState<'next' | 'prev' | null>(null);
  const close = useCallback(() => {
    setOpenIndex(null);
    setSwipe(null);
  }, []);
  const step = useCallback(
    (delta: number) => {
      setSwipe(delta > 0 ? 'next' : 'prev');
      setOpenIndex((index) =>
        index === null ? index : (index + delta + count) % count,
      );
    },
    [count],
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
      {layout === 'justified' ? (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            // Target row height: shorter on phones, capped on wide screens.
            ['--row' as string]: rowHeight,
          }}
        >
          {photos.map((photo, index) => {
            const ratio = ratios[photo.src] ?? 1.5;
            return (
              <button
                key={`${photo.src}-${index}`}
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-label={`Open photo: ${photo.alt}`}
                className="group overflow-hidden rounded-md bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                style={{
                  position: 'relative',
                  display: 'block',
                  flexGrow: ratio,
                  flexBasis: `calc(var(--row) * ${ratio})`,
                  aspectRatio: String(ratio),
                }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 60vw, 33vw"
                  className="transition-transform duration-300 group-hover:scale-[1.03]"
                  style={{ objectFit: 'cover' }}
                  onLoad={(event) => {
                    const { naturalWidth, naturalHeight } = event.currentTarget;
                    if (!naturalWidth || !naturalHeight) return;
                    const next =
                      Math.round((naturalWidth / naturalHeight) * 100) / 100;
                    setRatios((current) =>
                      current[photo.src] === next
                        ? current
                        : { ...current, [photo.src]: next },
                    );
                  }}
                />
                {watermark ? (
                  <span
                    aria-hidden
                    style={{
                      ...WATERMARK_STYLE,
                      fontSize: 'clamp(9px, 0.95vw, 13px)',
                    }}
                  >
                    {watermark}
                  </span>
                ) : null}
              </button>
            );
          })}
          {/* Soaks up the leftover space so the last row is not stretched. */}
          <span aria-hidden style={{ flexGrow: 1000, flexBasis: 0 }} />
        </div>
      ) : (
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
      )}

      {/* Rendered on <body> so it covers the header and everything else. */}
      {current
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Photo viewer"
              data-lenis-prevent
              className="photo-viewer bg-plum-deep"
              onClick={close}
              // The photo takes the whole screen. Controls float over it.
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 160,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                onClick={(event) => event.stopPropagation()}
                style={{
                  position: 'relative',
                  // As large as the screen allows while keeping the photo's shape.
                  width: `min(100vw - 2rem, calc((100svh - ${VIEWER_GAP}) * ${ratios[current.src] ?? 1.5}))`,
                  aspectRatio: String(ratios[current.src] ?? 1.5),
                  maxHeight: `calc(100svh - ${VIEWER_GAP})`,
                }}
              >
                <Image
                  key={current.src}
                  src={current.src}
                  alt={current.alt}
                  fill
                  sizes="100vw"
                  className={swipe ? `swipe-${swipe}` : undefined}
                  style={{ objectFit: 'contain' }}
                  onLoad={(event) => {
                    const { naturalWidth, naturalHeight } = event.currentTarget;
                    if (!naturalWidth || !naturalHeight) return;
                    const next =
                      Math.round((naturalWidth / naturalHeight) * 100) / 100;
                    setRatios((known) =>
                      known[current.src] === next
                        ? known
                        : { ...known, [current.src]: next },
                    );
                  }}
                />
                {watermark ? (
                  <span
                    aria-hidden
                    style={{
                      ...WATERMARK_STYLE,
                      fontSize: 'clamp(13px, 1.6vw, 24px)',
                    }}
                  >
                    {watermark}
                  </span>
                ) : null}
              </div>

              {/* A logo in the empty space on each side of the photo. They
                  shrink with that space and vanish when the photo is too wide
                  to leave room. */}
              {SIDE_LOGOS.map((logo) => (
                <div
                  key={logo.side}
                  aria-hidden
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    [logo.side]: '4.5rem',
                    width: `calc((100vw - min(100vw - 2rem, (100svh - ${VIEWER_GAP}) * ${ratios[current.src] ?? 1.5})) / 2 - 6rem)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    pointerEvents: 'none',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt=""
                    style={{
                      width: 'min(220px, max(0px, (100% - 90px) * 999))',
                      maxWidth: '100%',
                      height: 'auto',
                    }}
                  />
                </div>
              ))}

              {/* The album title with the photo count under it, straight on
                  the dark background. */}
              <div
                className="text-white"
                style={{ position: 'absolute', zIndex: 1, top: '1.25rem', left: '1.25rem' }}
              >
                {title ? (
                  <p className="font-display text-lg font-bold tracking-tight">{title}</p>
                ) : null}
                <p
                  className={`font-mono text-xs uppercase tracking-[0.16em] text-brand-200 ${
                    title ? 'mt-1' : ''
                  }`}
                >
                  {(openIndex ?? 0) + 1} / {count}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close photo viewer"
                className="text-white transition-colors hover:bg-black/70"
                style={{
                  ...CONTROL_STYLE,
                  ...BUTTON_STYLE,
                  top: '1rem',
                  right: '1rem',
                }}
              >
                <X className="h-5 w-5" />
              </button>
              {count > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      step(-1);
                    }}
                    aria-label="Previous photo"
                    className="text-white transition-colors hover:bg-black/70"
                    style={{
                      ...CONTROL_STYLE,
                      ...BUTTON_STYLE,
                      top: 'calc(50% - 1.375rem)',
                      left: '1rem',
                    }}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      step(1);
                    }}
                    aria-label="Next photo"
                    className="text-white transition-colors hover:bg-black/70"
                    style={{
                      ...CONTROL_STYLE,
                      ...BUTTON_STYLE,
                      top: 'calc(50% - 1.375rem)',
                      right: '1rem',
                    }}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              ) : null}
              {viewAllHref ? (
                <Link
                  href={viewAllHref}
                  onClick={(event) => {
                    event.stopPropagation();
                    close();
                  }}
                  className="btn-green px-4 py-2.5"
                  style={{ position: 'absolute', zIndex: 1, right: '1rem', bottom: '1rem' }}
                >
                  View full gallery
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
