import type { Metadata } from 'next';
import { IBM_Plex_Mono, Inter, Space_Grotesk } from 'next/font/google';
import Script from 'next/script';

import { SITE_NAME, SITE_URL } from '@/lib/site';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
  },
  title: {
    default: 'WiCyS Kean University Student Chapter',
    template: '%s | WiCyS Kean',
  },
  description:
    'The Kean University student chapter of Women in CyberSecurity. Community, workshops, competitions, and career opportunities in cybersecurity for all Kean students.',
};

// Development only. A service worker left behind by another project on the
// same localhost port once kept serving this site old scripts and styles. This
// removes any service worker and cache on this address, then reloads once.
const DEV_FRESH_SCRIPT = `
(async () => {
  try {
    if (!('serviceWorker' in navigator)) return;
    const regs = await navigator.serviceWorker.getRegistrations();
    if (regs.length === 0) return;
    await Promise.all(regs.map((r) => r.unregister()));
    if (window.caches) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
    if (!sessionStorage.getItem('wicys-dev-fresh')) {
      sessionStorage.setItem('wicys-dev-fresh', '1');
      location.reload();
    }
  } catch {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {process.env.NODE_ENV === 'development' ? (
          <Script id="dev-fresh" strategy="beforeInteractive">
            {DEV_FRESH_SCRIPT}
          </Script>
        ) : null}
        {children}
      </body>
    </html>
  );
}
