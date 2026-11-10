import type { Metadata } from 'next';

import GalleryBrowser from '@/components/gallery-browser';
import GalleryHero from '@/components/gallery-hero';
import { filterPhotos, getAllEvents, getGalleryAlbums } from '@/lib/content';
import { ALBUM_CATEGORY_LABELS } from '@/lib/format';

export const metadata: Metadata = {
  alternates: { canonical: '/gallery' },
  title: 'Gallery',
  description:
    'Photos from WiCyS Kean events: meetings, workshops, Capture the Flag competitions, and conferences, organized by event, semester, and academic year.',
};

// Wider than the rest of the site so the photo wall runs nearly edge to edge.
const WIDE_GUTTERS = {
  width: '100%',
  maxWidth: '120rem',
  marginInline: 'auto',
  paddingInline: 'clamp(1.25rem, 3.6vw, 4.5rem)',
};

export default async function GalleryPage() {
  const [albums, events] = await Promise.all([
    getGalleryAlbums(),
    getAllEvents(),
  ]);
  const eventTitles = new Map(events.map((event) => [event.slug, event.title]));

  const allPhotos = albums.flatMap((album) => filterPhotos(album.photos));
  // An even spread across every album for the drifting backdrop.
  const step = Math.max(1, Math.floor(allPhotos.length / 24));
  const heroPhotos = allPhotos
    .filter((_, index) => index % step === 0)
    .slice(0, 24);

  return (
    <>
      <GalleryHero
        photos={heroPhotos}
        // Every photo in page order, for the Play all slideshow.
        slides={albums.flatMap((album) =>
          filterPhotos(album.photos).map((src) => ({
            src,
            album: album.title,
            credit: !album.externalPhotos,
          }))
        )}
      />

      {/* Wider than the rest of the site so the photo wall runs nearly edge to
          edge on big screens. */}
      <section
        id="photos"
        className="scroll-mt-20 py-12 sm:py-14"
        // Sits above the pinned hero and covers it as the page scrolls.
        style={{ position: 'relative', zIndex: 1, background: '#ffffff' }}
      >
        <div style={WIDE_GUTTERS}>
          <GalleryBrowser
            albums={albums.map((album) => ({
              slug: album.slug,
              title: album.title,
              period: album.period,
              academicYear: album.academicYear,
              category: album.category,
              categoryLabel: ALBUM_CATEGORY_LABELS[album.category] ?? 'Other',
              eventSlug: album.event,
              eventTitle: album.event
                ? (eventTitles.get(album.event) ?? null)
                : null,
              photos: filterPhotos(album.photos),
              externalPhotos: album.externalPhotos ?? false,
            }))}
          />
        </div>
      </section>
    </>
  );
}
