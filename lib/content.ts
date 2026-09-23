import { createReader } from '@keystatic/core/reader';

import keystaticConfig from '@/keystatic.config';
import { eventEndDate, parseEventDate } from '@/lib/format';

export const reader = createReader(process.cwd(), keystaticConfig);

export async function getSiteSettings() {
  try {
    return await reader.singletons.siteSettings.read();
  } catch {
    return null;
  }
}

export async function getHomeAnnouncements() {
  try {
    return await reader.singletons.homeAnnouncements.read();
  } catch {
    return null;
  }
}

export async function getCtfPage() {
  try {
    return await reader.singletons.ctfPage.read();
  } catch {
    return null;
  }
}

export async function getSponsorPage() {
  try {
    return await reader.singletons.sponsorPage.read();
  } catch {
    return null;
  }
}

export type EventEntry = Awaited<ReturnType<typeof getAllEvents>>[number];

export async function getAllEvents() {
  const events = await reader.collections.events.all();
  return events.map((event) => ({
    slug: event.slug,
    ...event.entry,
  }));
}

export function isEventPast(event: EventEntry, now = new Date()): boolean {
  return eventEndDate(event).getTime() < now.getTime();
}

export async function getEvent(slug: string) {
  const entry = await reader.collections.events.read(slug);
  return entry ? { slug, ...entry } : null;
}

export async function getUpcomingEvents() {
  const all = await getAllEvents();
  return all
    .filter((event) => !isEventPast(event))
    .sort(
      (a, b) =>
        parseEventDate(a.startDate).getTime() -
        parseEventDate(b.startDate).getTime()
    );
}

export async function getPastEvents() {
  const all = await getAllEvents();
  return all
    .filter((event) => isEventPast(event))
    .sort(
      (a, b) =>
        parseEventDate(b.startDate).getTime() -
        parseEventDate(a.startDate).getTime()
    );
}

export function filterPhotos(
  photos: ReadonlyArray<string | null> | null | undefined
): string[] {
  if (!photos) return [];
  return photos.filter((photo): photo is string => typeof photo === 'string');
}

export async function getEboardMembers() {
  const members = await reader.collections.eboardMembers.all();
  return members
    .map((member) => ({
      slug: member.slug,
      ...member.entry,
    }))
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export type GalleryAlbum = Awaited<ReturnType<typeof getGalleryAlbums>>[number];

// Newest academic year first, then fall before spring within a year.
function semesterRank(period: string): number {
  const lower = period.toLowerCase();
  if (lower.includes('fall')) return 3;
  if (lower.includes('summer')) return 2;
  if (lower.includes('spring')) return 1;
  return 0;
}

export async function getGalleryAlbums() {
  const albums = await reader.collections.galleryAlbums.all();
  return albums
    .map((album) => ({
      slug: album.slug,
      ...album.entry,
    }))
    .sort(
      (a, b) =>
        b.academicYear.localeCompare(a.academicYear) ||
        semesterRank(b.period) - semesterRank(a.period) ||
        a.title.localeCompare(b.title)
    );
}

export async function getAlbumsForEvent(eventSlug: string) {
  const albums = await getGalleryAlbums();
  return albums.filter((album) => album.event === eventSlug);
}

export async function getSponsors() {
  const sponsors = await reader.collections.sponsors.all();
  return sponsors
    .map((sponsor) => ({
      slug: sponsor.slug,
      ...sponsor.entry,
    }))
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export async function getResourceLinks() {
  const resources = await reader.collections.resourceLinks.all();
  return resources.map((resource) => ({
    slug: resource.slug,
    ...resource.entry,
  }));
}
