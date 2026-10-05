import type { ReactNode } from 'react';

import RouteTransition from '@/components/route-transition';
import ScrollReveal from '@/components/scroll-reveal';
import SmoothScrollProvider from '@/components/smooth-scroll';
import SiteFooter from '@/components/site-footer';
import SiteHeader, { type HeaderSocial } from '@/components/site-header';
import { getSiteSettings } from '@/lib/content';

export default async function SiteChrome({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();

  const socials = [
    settings?.discordUrl
      ? { label: 'Discord' as const, href: settings.discordUrl }
      : null,
    settings?.instagramUrl
      ? { label: 'Instagram' as const, href: settings.instagramUrl }
      : null,
    settings?.linkedinUrl
      ? { label: 'LinkedIn' as const, href: settings.linkedinUrl }
      : null,
    settings?.chapterEmail
      ? { label: 'Email' as const, href: `mailto:${settings.chapterEmail}` }
      : null,
  ].filter((social): social is HeaderSocial => social !== null);

  return (
    <SmoothScrollProvider>
      <SiteHeader socials={socials} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <ScrollReveal />
      <SiteFooter />
      <RouteTransition />
    </SmoothScrollProvider>
  );
}
