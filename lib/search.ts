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
  // The site page this result lives on, shown as the green label.
  page: string;
  description?: string;
  // Extra words that should match but are not shown.
  keywords?: string;
};

// Pages and the main sections inside them. Search does not read page text, so
// the keywords list the words a visitor might type for what is on each one.
// When a page gains a new section or topic, add its words here.
const PAGES: SearchItem[] = [
  {
    title: 'Home',
    href: '/',
    type: 'Page',
    page: 'Home',
    description: 'WiCyS at Kean University',
    keywords:
      'wicys kean women in cybersecurity cyber security student chapter about us who we are mission what we do university club organization homepage main start',
  },
  {
    title: 'Events',
    href: '/events',
    type: 'Page',
    page: 'Events',
    description: 'Upcoming meetings, workshops, and past events',
    keywords:
      'event calendar meetings meeting workshops workshop schedule general body gbm upcoming past previous when where time date tuesday tuesdays 2:15 3:30 glab 208 room location speakers talks socials flyer flyers rsvp add to calendar',
  },
  {
    title: 'E-Board',
    href: '/eboard',
    type: 'Page',
    page: 'E-Board',
    description: 'Executive board, scholarship recipients, and alumni',
    keywords:
      'eboard e-board executive officers officer leadership leaders team staff president vice president vp secretary treasurer public relations event coordinator outreach web developer alumni support board members who runs',
  },
  {
    title: 'Alumni',
    href: '/eboard#alumni',
    type: 'Page',
    page: 'E-Board',
    description: 'Where past WiCyS Kean members are now',
    keywords:
      'alumni alum alumna graduates graduated former past members where are they now careers grad school linkedin',
  },
  {
    title: 'E-Board interest form',
    href: '/eboard#interest-form',
    type: 'Page',
    page: 'E-Board',
    description: 'Tell us you want to run for the 2027-2028 board',
    keywords:
      'interest form apply application run for office election elections candidate nominate position become an officer join the board 2027 2028 resume statement',
  },
  {
    title: 'Get Involved',
    href: '/get-involved',
    type: 'Page',
    page: 'Get Involved',
    description: 'Learn skills, find community, and volunteer',
    keywords:
      'involved involvement volunteer volunteering help impact community participate skills learn networking tabling outreach video videos watch youtube ways to help opportunities',
  },
  {
    title: 'Join WiCyS Kean',
    href: '/get-involved#join',
    type: 'Page',
    page: 'Get Involved',
    description: 'Three steps to join the chapter. Free and open to all majors',
    keywords:
      'join joining membership member members sign up signup become how to join steps free cost dues fee price open all majors allies discord cougarlink cougar link meeting tuesday glab 208 new member get started enroll',
  },
  {
    title: 'Register with national WiCyS',
    href: '/get-involved#national',
    type: 'Page',
    page: 'Get Involved',
    description: 'Three steps to register nationally. Student membership is $20 a year',
    keywords:
      'register registration registering national nationally wicys.org member portal account create sign up signup enroll membership women in cybersecurity organization info@wicys.org age 15 cost fee price dues 20 dollars how much paid',
  },
  {
    title: 'Capture the Flag',
    href: '/ctf',
    type: 'Page',
    page: 'CTF',
    description: 'Our CTF competition, the Kean CTF website, and last year\'s event',
    keywords:
      'ctf capture the flag competition compete challenges hacking hack hackathon web exploitation cryptography crypto forensics teams team prizes beginner cougar mascot keanctf website abitronix oracle giants sponsor guest speakers march 2026 previous next timeline goals participate',
  },
  {
    title: 'Resources',
    href: '/resources',
    type: 'Page',
    page: 'Resources',
    description: 'Learning platforms, careers, scholarships, and certifications',
    keywords:
      'resources resource learn learning practice training study tools links platforms courses tutorials internships internship jobs job careers career certifications certification certs scholarships scholarship conferences conference coding programming networking',
  },
  {
    title: 'Gallery',
    href: '/gallery',
    type: 'Page',
    page: 'Gallery',
    description: 'Photos from our events, conferences, and research',
    keywords:
      'gallery photos photo pictures picture images pics albums album conferences gmis great minds in stem research posters poster events 2025 2026 memories',
  },
  {
    title: 'Contact',
    href: '/contact',
    type: 'Page',
    page: 'Contact',
    description: 'Email, Discord, Instagram, and a contact form',
    keywords:
      'contact us email e-mail message reach get in touch questions question ask help form discord instagram linkedin social media socials cougarlink meetings tuesday 2:15 3:30 glab 208 where when location room address national wicys',
  },
  {
    title: 'Sponsor Us',
    href: '/sponsors',
    type: 'Page',
    page: 'Sponsors',
    description: 'Partner with WiCyS Kean',
    keywords:
      'sponsors sponsor sponsorship sponsoring partners partner partnership companies company corporate employers recruiters recruiting funding fund support in-kind prizes inquiry tiers packages',
  },
  {
    title: 'Donate',
    href: '/donate',
    type: 'Page',
    page: 'Donate',
    description: 'Support our members with a donation',
    keywords:
      'donate donation donations donating give giving gift gifts money support fund funding contribute contribution ctf prizes food event supplies venmo cash app zelle',
  },
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
      page: 'Events',
      description: formatEventDate(event.startDate),
      keywords: `${eventTypeLabel(event.type)} ${event.location} ${event.description}`,
    });
  }

  for (const member of members) {
    items.push({
      title: member.name,
      href: '/eboard',
      type: 'E-Board',
      page: 'E-Board',
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
      page: 'E-Board',
      description: `${scholar.award}, ${scholar.year}`,
    });
  }

  for (const alum of alumni) {
    if (isPlaceholder(alum.name)) continue;
    items.push({
      title: alum.name,
      href: '/eboard',
      type: 'Alumni',
      page: 'E-Board',
      description: [alum.currentTitle, alum.currentCompany].filter(Boolean).join(', ') || alum.pastRole,
      keywords: alum.pastRole,
    });
  }

  for (const resource of resources) {
    items.push({
      title: resource.title,
      href: '/resources',
      type: 'Resource',
      page: 'Resources',
      description: resource.blurb ?? undefined,
      keywords: resource.category,
    });
  }

  for (const album of albums) {
    items.push({
      title: album.title,
      href: '/gallery',
      type: 'Photos',
      page: 'Gallery',
      description: album.period,
      keywords: album.category,
    });
  }

  return items;
}
