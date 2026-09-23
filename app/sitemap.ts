import type { MetadataRoute } from 'next';

import { getAllEvents } from '@/lib/content';
import { SITE_URL } from '@/lib/site';

const PAGES = [
  '',
  '/events',
  '/eboard',
  '/ctf',
  '/sponsors',
  '/resources',
  '/gallery',
  '/join',
  '/contact',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await getAllEvents();
  return [
    ...PAGES.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...events.map((event) => ({ url: `${SITE_URL}/events/${event.slug}` })),
  ];
}
