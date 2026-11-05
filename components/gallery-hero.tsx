import { ArrowDown } from 'lucide-react';
import Image from 'next/image';

import GallerySlideshow, { type Slide } from '@/components/gallery-slideshow';

// Kept with the component so the motion and the layout always arrive together.
const HERO_CSS = `
.gallery-hero-track { display: flex; gap: 14px; width: max-content; will-change: transform; animation: gallery-hero-slide 170s linear infinite; }
.gallery-hero-track[data-reverse='true'] { animation-direction: reverse; animation-duration: 200s; }
@keyframes gallery-hero-slide {
  from { transform: translateX(0); }
  to { transform: translateX(calc(-50% - 7px)); }
}
@media (prefers-reduced-motion: reduce) {
  .gallery-hero-track { animation: none; }
}
`;

const ROWS = 3;

export default function GalleryHero({
  photos,
  slides,
}: {
  photos: string[];
  slides: Slide[];
}) {
  // Deal the photos out across the rows, then repeat each row so it is long
  // enough to loop without a visible seam.
  const rows = Array.from({ length: ROWS }, (_, row) => {
    const own = photos.filter((_, index) => index % ROWS === row);
    if (own.length === 0) return [];
    const filled = Array.from(
      { length: Math.max(8, own.length) },
      (_, index) => own[index % own.length],
    );
    return [...filled, ...filled];
  });

  return (
    <section
      className="page-hero"
      // Pinned under the header and clipped here, inline, so the drifting
      // photos can never spill past the purple and the page below slides up
      // over it (the same effect as the home page).
      style={{
        position: 'sticky',
        top: 'var(--hero-pin-top, 0px)',
        zIndex: 0,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        minHeight: '100svh',
      }}
    >
      <style>{HERO_CSS}</style>

      {/* The photo wall drifting behind the title, kept very dim. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: '-12% -6%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '14px',
          opacity: 0.5,
          transform: 'rotate(-4deg)',
          pointerEvents: 'none',
        }}
      >
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="gallery-hero-track"
            data-reverse={rowIndex % 2 === 1}
          >
            {row.map((src, index) => (
              <div
                key={`${src}-${index}`}
                style={{
                  position: 'relative',
                  flex: 'none',
                  width: 'clamp(220px, 24vw, 420px)',
                  aspectRatio: '3 / 2',
                  overflow: 'hidden',
                  borderRadius: '10px',
                }}
              >
                <Image
                  src={src}
                  alt=""
                  loading="eager"
                  fill
                  sizes="(max-width: 900px) 220px, 24vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* Darkens the left side so the title always reads. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(129, 41, 144, 0.74) 0, rgba(129, 41, 144, 0.36) 44rem, rgba(129, 41, 144, 0) 84rem)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '120rem',
          marginInline: 'auto',
          paddingInline: 'clamp(1.25rem, 3.6vw, 4.5rem)',
          // Extra room on top for the see-through header floating over the hero.
          paddingBlock: '6.5rem 3.5rem',
          // Title on the left, the Play all button on the right.
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2.5rem 3rem',
        }}
      >
        <div>
          <h1
            className="font-display font-bold tracking-tight text-white"
            style={{
              fontSize: 'clamp(2.75rem, 7.5vw, 7rem)',
              lineHeight: 0.98,
            }}
          >
            {/* The same WiCyS and Kean wordmarks as the home page hero, sized to
              the heading. "Wi" is white here so it shows on the purple. */}
            <span
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '0.05em 0.08em',
                marginBottom: '0.14em',
              }}
            >
              <Image
                src="/images/wicys-wordmark-light.png"
                alt="WiCyS"
                width={826}
                height={296}
                preload
                // Pulled left by the empty margin inside the image file, so the "W"
                // lines up with the text below.
                style={{
                  height: '1.05em',
                  width: 'auto',
                  marginLeft: '-0.1em',
                }}
              />
              <Image
                // A vector, so it stays sharp at any size.
                src="/images/kean-wordmark-blue.svg"
                unoptimized
                alt="Kean"
                width={908}
                height={320}
                preload
                style={{ height: '1.2em', width: 'auto' }}
              />
              {/* Tucked against the "N" and dropped to the foot of the letters. */}
              <span
                style={{
                  alignSelf: 'flex-end',
                  marginLeft: '-0.2em',
                  marginBottom: '0.02em',
                  lineHeight: 1,
                  color: '#ffffff',
                }}
              >
                ,
              </span>
            </span>
            in <span className="text-accent-400">pictures</span>
          </h1>
          <div style={{ marginTop: '2.25rem' }}>
            <span className="relative inline-flex">
              <span aria-hidden className="btn-green hero-cta invisible">
                View all photos
              </span>
              <a href="#photos" className="btn-green hero-cta hero-cta-live">
                View all photos
                <ArrowDown className="h-4 w-4" />
              </a>
            </span>
          </div>
        </div>
        <GallerySlideshow slides={slides} />
      </div>
    </section>
  );
}
