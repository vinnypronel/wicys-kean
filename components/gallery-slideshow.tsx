'use client';

import { ChevronLeft, ChevronRight, Pause, Play, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';

export type Slide = { src: string; album: string; credit: boolean };

// How long each photo stays on screen while playing.
const SLIDE_MS = 4500;

const CHIP: CSSProperties = {
  display: 'grid',
  placeItems: 'center',
  width: '2.75rem',
  height: '2.75rem',
  borderRadius: '0.5rem',
  background: 'rgba(0, 0, 0, 0.45)',
  color: '#ffffff',
};

// "Play all": a large play button that opens every gallery photo full screen
// and steps through them on its own. Arrow keys move, space pauses, Escape
// closes.
export default function GallerySlideshow({ slides }: { slides: Slide[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const count = slides.length;

  // Which way the last move went, so the new photo swipes in from that side.
  const [swipe, setSwipe] = useState<'next' | 'prev' | null>(null);
  const step = useCallback(
    (delta: number) => {
      setSwipe(delta > 0 ? 'next' : 'prev');
      setIndex((i) => (i + delta + count) % count);
    },
    [count],
  );
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open || !playing || count < 2) return;
    const timer = window.setTimeout(() => step(1), SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [open, playing, index, count, step]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      else if (event.key === 'ArrowRight') step(1);
      else if (event.key === 'ArrowLeft') step(-1);
      else if (event.key === ' ') {
        event.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close, step]);

  if (count === 0) return null;
  const current = slides[index];
  const next = slides[(index + 1) % count];

  return (
    <>
      {/* A round play button. On hover it stretches to the left to show
          its label; on touch screens, which cannot hover, the label always
          shows. The holder keeps the circle's place, and the button grows
          leftward from it without moving the circle. */}
      <div
        className="play-all-holder"
        style={{ position: 'relative', width: '5.5rem', height: '5.5rem' }}
      >
        <button
          type="button"
          onClick={() => {
            setIndex(0);
            setSwipe(null);
            setPlaying(true);
            setOpen(true);
          }}
          aria-label={`Play all ${count} photos`}
          className="play-all group bg-accent-400 text-black shadow-xl shadow-black/30 transition-[transform,box-shadow] duration-300 hover:shadow-2xl"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: '5.5rem',
            borderRadius: '9999px',
            position: 'absolute',
            right: 0,
            // Icon on the right, label on its left, so the button grows leftward.
            flexDirection: 'row-reverse',
            top: 0,
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              display: 'grid',
              placeItems: 'center',
              width: '5.5rem',
              height: '5.5rem',
              flex: 'none',
            }}
          >
            <Play
              className="h-8 w-8"
              style={{ marginLeft: '4px' }}
              fill="currentColor"
            />
          </span>
          <span className="play-all-label font-display text-lg font-bold tracking-tight">
            Play all {count} photos
          </span>
        </button>
      </div>

      {open
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Photo slideshow"
              data-lenis-prevent
              className="photo-viewer bg-plum-deep"
              style={{ position: 'fixed', inset: 0, zIndex: 160 }}
            >
              {/* The photo, as large as the screen allows with even space above
                  and below. Each new photo fades in. */}
              <div
                style={{
                  position: 'absolute',
                  inset: '2.5rem 1rem',
                }}
              >
                <Image
                  key={current.src}
                  src={current.src}
                  alt={`${current.album} photo`}
                  fill
                  sizes="100vw"
                  className={swipe ? `swipe-${swipe}` : 'event-popup'}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              {/* Loads the next photo in the background so it is ready. */}
              <Image
                src={next.src}
                alt=""
                aria-hidden
                width={16}
                height={16}
                sizes="100vw"
                style={{
                  position: 'absolute',
                  width: 1,
                  height: 1,
                  opacity: 0,
                }}
              />

              <p
                className="font-mono text-xs uppercase tracking-[0.16em] text-white"
                style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  margin: 0,
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  background: 'rgba(0, 0, 0, 0.45)',
                }}
              >
                {index + 1} / {count} · {current.album}
              </p>
              {current.credit ? (
                <p
                  aria-hidden
                  className="font-bold text-white/85"
                  style={{
                    position: 'absolute',
                    left: '1.25rem',
                    bottom: '1.25rem',
                    margin: 0,
                    fontSize: 'clamp(13px, 1.4vw, 20px)',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.55)',
                  }}
                >
                  ©2026 WiCyS Kean
                </p>
              ) : null}

              <div
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  display: 'flex',
                  gap: '0.5rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
                  className="transition-colors hover:bg-black/70"
                  style={CHIP}
                >
                  {playing ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close slideshow"
                  className="transition-colors hover:bg-black/70"
                  style={CHIP}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous photo"
                className="transition-colors hover:bg-black/70"
                style={{
                  ...CHIP,
                  position: 'absolute',
                  left: '1rem',
                  top: 'calc(50% - 1.375rem)',
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next photo"
                className="transition-colors hover:bg-black/70"
                style={{
                  ...CHIP,
                  position: 'absolute',
                  right: '1rem',
                  top: 'calc(50% - 1.375rem)',
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Progress through the whole set. */}
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 3,
                  background: 'rgba(255,255,255,0.15)',
                }}
              >
                <div
                  className="bg-accent-400"
                  style={{
                    height: '100%',
                    width: `${((index + 1) / count) * 100}%`,
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
