import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin, MessagesSquare } from 'lucide-react';

import { InstagramGlyph, LinkedinGlyph } from '@/components/brand-icons';

import { getSiteSettings } from '@/lib/content';

const EXPLORE_LINKS = [
  { href: '/events', label: 'Events' },
  { href: '/ctf', label: 'Capture the Flag' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/resources', label: 'Resources' },
];

const INVOLVEMENT_LINKS = [
  { href: '/join', label: 'Join WiCyS' },
  { href: '/eboard', label: 'E-Board' },
  { href: '/sponsors', label: 'Sponsor Us' },
  { href: '/contact', label: 'Contact' },
];

export default async function SiteFooter() {
  const settings = await getSiteSettings();

  const socials = [
    settings?.discordUrl
      ? { href: settings.discordUrl, label: 'Join our Discord', Icon: MessagesSquare }
      : null,
    settings?.instagramUrl
      ? { href: settings.instagramUrl, label: 'Instagram', Icon: InstagramGlyph }
      : null,
    settings?.linkedinUrl
      ? { href: settings.linkedinUrl, label: 'LinkedIn', Icon: LinkedinGlyph }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <footer className="bg-plum text-brand-100">
      <div className="container-site grid gap-12 py-16 md:grid-cols-[1.3fr_1fr_1fr_1.2fr] md:gap-8">
<div>
          <Link href="/" className="flex items-center gap-3" aria-label="WiCyS Kean home">
            <Image
              src="/images/wicys-logo.png"
              alt="WiCyS - Women in CyberSecurity"
              width={583}
              height={244}
              className="h-10 w-auto"
            />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-brand-200">
            A student chapter of Women in CyberSecurity, building community and
            opening doors into cybersecurity careers for Kean students.
          </p>
          <p className="mt-6 flex items-start gap-2 text-sm text-brand-200">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
            Union, New Jersey
          </p>
        </div>

        <nav aria-label="Explore">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-400">
            Explore
          </p>
          <ul className="mt-5 space-y-3">
            {EXPLORE_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-brand-100 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Get involved">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-400">
            Get involved
          </p>
          <ul className="mt-5 space-y-3">
            {INVOLVEMENT_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-brand-100 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-400">
            Connect
          </p>
          <ul className="mt-5 space-y-3">
            {settings?.chapterEmail ? (
              <li>
                <a
                  href={`mailto:${settings.chapterEmail}`}
                  className="inline-flex items-center gap-2 text-sm text-brand-100 transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4 text-accent-400" />
                  {settings.chapterEmail}
                </a>
              </li>
            ) : null}
            {socials.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-brand-100 transition-colors hover:text-white"
                >
                  <Icon className="h-4 w-4 text-accent-400" />
                  {label}
                </a>
              </li>
            ))}
            {settings?.cougarlinkUrl ? (
              <li>
                <a
                  href={settings.cougarlinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-brand-100 transition-colors hover:text-white"
                >
                  <Image
                    src="/images/kean-k.png"
                    alt=""
                    width={18}
                    height={18}
                    className="h-[18px] w-auto"
                  />
                  WiCyS on Cougar Link
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-brand-300">
            &copy; {new Date().getFullYear()} WiCyS at Kean University
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-brand-400">
            Student chapter of Women in CyberSecurity
          </p>
        </div>
      </div>
    </footer>
  );
}

