import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

import {
  DiscordLogo,
  InstagramLogo,
  LinkedinGlyph,
  OutlookLogo,
} from '@/components/brand-icons';

import { getSiteSettings } from '@/lib/content';

const EXPLORE_LINKS = [
  { href: '/events', label: 'Events' },
  { href: '/ctf', label: 'Capture the Flag' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/resources', label: 'Resources' },
];

const INVOLVEMENT_LINKS = [
  { href: '/join', label: 'Join WiCyS' },
  { href: '/get-involved', label: 'Get Involved' },
  { href: '/eboard', label: 'E-Board' },
  { href: '/sponsors', label: 'Sponsor Us' },
  { href: '/donate', label: 'Donate' },
  { href: '/contact', label: 'Contact' },
];

export default async function SiteFooter() {
  const settings = await getSiteSettings();

  const socials = [
    settings?.discordUrl
      ? { href: settings.discordUrl, label: 'Join our Discord', Icon: DiscordLogo }
      : null,
    settings?.instagramUrl
      ? { href: settings.instagramUrl, label: 'Instagram', Icon: InstagramLogo }
      : null,
    settings?.linkedinUrl
      ? { href: settings.linkedinUrl, label: 'LinkedIn', Icon: LinkedinGlyph }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <footer className="bg-plum text-brand-100">
      <div className="mx-auto w-full max-w-[92rem] px-6 py-16 sm:px-10 lg:px-16 xl:px-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="max-w-sm shrink-0">
            <Link
              href="/"
              className="inline-flex items-center rounded-xl bg-white px-4 py-3"
              aria-label="WiCyS Kean home"
            >
              <Image
                src="/images/wicys-logo.png"
                alt="WiCyS - Women in CyberSecurity"
                width={583}
                height={244}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-brand-200">
              A student chapter of Women in CyberSecurity, building community and
              opening doors into cybersecurity careers for Kean students.
            </p>
            <p className="mt-6 flex items-start gap-2 text-sm text-brand-200">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
              Union, New Jersey
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3 sm:gap-12 lg:mr-10 lg:gap-14 xl:mr-14 xl:gap-20">
            <nav aria-label="Explore">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-400">
                Explore
              </p>
              <ul className="mt-5 space-y-3">
                {EXPLORE_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="footer-link inline-flex text-sm text-brand-100 hover:text-white"
                    >
                      <span className="hover-underline">{link.label}</span>
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
                      className="footer-link inline-flex text-sm text-brand-100 hover:text-white"
                    >
                      <span className="hover-underline">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-400">
                Connect
              </p>
              <ul className="mt-5 space-y-2.5">
                {settings?.chapterEmail ? (
                  <li>
                    <a
                      href={`mailto:${settings.chapterEmail}`}
                      className="footer-link inline-flex items-center gap-3 text-sm text-brand-100 hover:text-white"
                    >
                      <span className="grid h-6 w-6 shrink-0 place-items-center">
                        <OutlookLogo className="h-5 w-5" />
                      </span>
                      <span className="hover-underline">{settings.chapterEmail}</span>
                    </a>
                  </li>
                ) : null}
                {socials.map(({ href, label, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-link inline-flex items-center gap-3 text-sm text-brand-100 hover:text-white"
                    >
                      <span className="grid h-6 w-6 shrink-0 place-items-center text-brand-100">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="hover-underline">{label}</span>
                    </a>
                  </li>
                ))}
                {settings?.cougarlinkUrl ? (
                  <li>
                    <a
                      href={settings.cougarlinkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-link inline-flex items-center gap-3 text-sm text-brand-100 hover:text-white"
                    >
                      <span className="grid h-6 w-6 shrink-0 place-items-center">
                        <Image
                          src="/images/kean-k.png"
                          alt=""
                          width={20}
                          height={20}
                          className="h-5 w-auto"
                        />
                      </span>
                      <span className="hover-underline">WiCyS on Cougar Link</span>
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[92rem] flex-col gap-2 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16 xl:px-20">
          <p className="text-xs text-brand-200">
            &copy; {new Date().getFullYear()} WiCyS at Kean University
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-brand-200">
            Student chapter of Women in CyberSecurity
          </p>
        </div>
      </div>
    </footer>
  );
}

