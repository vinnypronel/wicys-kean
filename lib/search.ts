import {
  getAlumni,
  getAllEvents,
  getEboardMembers,
  getGalleryAlbums,
  getResourceLinks,
  getScholars,
} from '@/lib/content';
import { eventTypeLabel, formatEventDate } from '@/lib/format';

export type SearchItem = {
  title: string;
  href: string;
  type: string;
  description?: string;
  // Extra words that should match but are not shown.
  keywords?: string;
};

const PAGES: SearchItem[] = [
  { title: 'Home', href: '/', type: 'Page', description: 'WiCyS at Kean University', keywords: 'wicys kean women in cybersecurity chapter about' },
  { title: 'Events', href: '/events', type: 'Page', description: 'Upcoming meetings, workshops, and past events', keywords: 'calendar meetings workshops schedule general body' },
  { title: 'E-Board', href: '/eboard', type: 'Page', description: 'Executive board, scholarship recipients, and alumni', keywords: 'officers leadership president board alumni scholars scholarship' },
  { title: 'Get Involved', href: '/get-involved', type: 'Page', description: 'Learn skills, find community, and volunteer', keywords: 'volunteer volunteering help impact community' },
  { title: 'Capture the Flag', href: '/ctf', type: 'Page', description: 'Our annual CTF competition', keywords: 'ctf competition challenges hacking' },
  { title: 'Sponsor Us', href: '/sponsors', type: 'Page', description: 'Partner with WiCyS Kean', keywords: 'sponsors sponsorship partners companies funding in-kind' },
  { title: 'Donate', href: '/donate', type: 'Page', description: 'Support our members with a donation', keywords: 'donation give giving money support venmo cash app zelle' },
  { title: 'Resources', href: '/resources', type: 'Page', description: 'Learning platforms, careers, scholarships, and certifications', keywords: 'learn practice internships jobs certifications' },
  { title: 'Gallery', href: '/gallery', type: 'Page', description: 'Photos from our events', keywords: 'photos pictures albums' },
  { title: 'Join WiCyS', href: '/join', type: 'Page', description: 'Free membership, open to all majors', keywords: 'join membership member sign up cougarlink' },
  { title: 'Contact', href: '/contact', type: 'Page', description: 'Email, Discord, Instagram, and a contact form', keywords: 'contact email message discord instagram linkedin' },
];

function isPlaceholder(value: string) {
  return /placeholder/i.test(value);
}

export async function buildSearchIndex(): Promise<SearchItem[]> {
  const [events, members, scholars, alumni, resources, albums] = await Promise.all([
    getAllEvents().catch(() => []),
    getEboardMembers().catch(() => []),
    getScholars(),
    getAlumni(),
    getResourceLinks().catch(() => []),
    getGalleryAlbums().catch(() => []),
  ]);

  const items: SearchItem[] = [...PAGES];

  for (const event of events) {
    items.push({
      title: event.title,
      href: `/events/${event.slug}`,
      type: 'Event',
      description: formatEventDate(event.startDate),
      keywords: `${eventTypeLabel(event.type)} ${event.location} ${event.description}`,
    });
  }

  for (const member of members) {
    items.push({
      title: member.name,
      href: '/eboard',
      type: 'E-Board',
      description: member.role,
      keywords: member.bio ?? '',
    });
  }

  for (const scholar of scholars) {
    if (isPlaceholder(scholar.name)) continue;
    items.push({
      title: scholar.name,
      href: '/eboard',
      type: 'Scholar',
      description: `${scholar.award}, ${scholar.year}`,
    });
  }

  for (const alum of alumni) {
    if (isPlaceholder(alum.name)) continue;
    items.push({
      title: alum.name,
      href: '/eboard',
      type: 'Alumni',
      description: [alum.currentTitle, alum.currentCompany].filter(Boolean).join(', ') || alum.pastRole,
      keywords: alum.pastRole,
    });
  }

  for (const resource of resources) {
    items.push({
      title: resource.title,
      href: '/resources',
      type: 'Resource',
      description: resource.blurb ?? undefined,
      keywords: resource.category,
    });
  }

  for (const album of albums) {
    items.push({
      title: album.title,
      href: '/gallery',
      type: 'Photos',
      description: album.period,
      keywords: album.category,
    });
  }

  return items;
}
