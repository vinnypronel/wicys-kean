import type { Metadata } from 'next';

import GalleryBrowser from '@/components/gallery-browser';
import SectionHeading from '@/components/section-heading';
import { filterPhotos, getAllEvents, getGalleryAlbums } from '@/lib/content';
import { ALBUM_CATEGORY_LABELS } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Photos from WiCyS Kean events: meetings, workshops, Capture the Flag competitions, and conferences, organized by event, semester, and academic year.',
};

export default async function GalleryPage() {
  const [albums, events] = await Promise.all([
    getGalleryAlbums(),
    getAllEvents(),
  ]);
  const eventTitles = new Map(events.map((event) => [event.slug, event.title]));

  return (
    <>
      <section className="border-b border-brand-100 bg-surface">
        <div className="container-site py-16 sm:py-20">
          <SectionHeading
            level="h1"
            kicker="Gallery"
            title="Chapter life in pictures"
            lede="Moments from our meetings, workshops, competitions, and conferences. Filter by academic year or type of event, and tap any photo to view it full size."
          />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-site">
          <GalleryBrowser
            albums={albums.map((album) => ({
              slug: album.slug,
              title: album.title,
              period: album.period,
              academicYear: album.academicYear,
              category: album.category,
              categoryLabel: ALBUM_CATEGORY_LABELS[album.category] ?? 'Other',
              eventSlug: album.event,
              eventTitle: album.event ? eventTitles.get(album.event) ?? null : null,
              photos: filterPhotos(album.photos),
            }))}
          />
        </div>
      </section>
    </>
  );
}
