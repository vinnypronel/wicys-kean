import type { Metadata } from 'next';
import Image from 'next/image';
import {
  ArrowUpRight,
  Mail,
  MapPin,
  MessagesSquare,
} from 'lucide-react';

import { InstagramGlyph, LinkedinGlyph } from '@/components/brand-icons';

import SectionHeading from '@/components/section-heading';
import { getSiteSettings } from '@/lib/content';
import { meetingSummary } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with WiCyS at Kean University. Find our email, Discord, Instagram, LinkedIn, and CougarLink pages.',
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const meetings = meetingSummary(settings);

  const channels = [
    settings?.chapterEmail
      ? {
          Icon: Mail,
          label: 'Email',
          value: settings.chapterEmail,
          href: `mailto:${settings.chapterEmail}`,
        }
      : null,
    settings?.discordUrl
      ? { Icon: MessagesSquare, label: 'Discord', value: 'Join our Discord', href: settings.discordUrl }
      : null,
    settings?.instagramUrl
      ? { Icon: InstagramGlyph, label: 'Instagram', value: settings.instagramHandle || 'Follow us on Instagram', href: settings.instagramUrl }
      : null,
    settings?.linkedinUrl
      ? { Icon: LinkedinGlyph, label: 'LinkedIn', value: 'WiCyS Kean on LinkedIn', href: settings.linkedinUrl }
      : null,
    settings?.cougarlinkUrl
      ? { Icon: MapPin, label: 'Kean CougarLink', value: 'WiCyS on Cougar Link', href: settings.cougarlinkUrl, imgSrc: '/images/kean-k.png' }
      : null,
    settings?.nationalUrl
      ? { Icon: ArrowUpRight, label: 'National WiCyS', value: 'wicys.org', href: settings.nationalUrl }
      : null,
  ].filter((channel): channel is NonNullable<typeof channel> => channel !== null);

  return (
    <>
      <section className="border-b border-brand-100 bg-surface">
        <div className="container-site py-16 sm:py-20">
          <SectionHeading
            level="h1"
            kicker="Contact"
            title="Say hello"
            lede="Questions about joining, events, or sponsorships? The fastest way to reach us is email or Discord."
          />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-site grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
          <div>
            {channels.length > 0 ? (
              <ul className="grid gap-4 sm:grid-cols-2">
                {channels.map(({ Icon, label, value, href, imgSrc }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith('mailto:') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      className="group flex h-full items-center gap-4 rounded-xl border border-brand-100 bg-white p-5 transition-colors hover:border-brand-400 hover:bg-brand-50/40"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
                        {imgSrc ? (
                          <Image
                            src={imgSrc}
                            alt=""
                            width={22}
                            height={22}
                            className="h-[22px] w-auto"
                          />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </span>
                      <span>
                        <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-accent-700">
                          {label}
                        </span>
                        <span className="mt-0.5 block break-all text-sm font-medium text-ink">
                          {value}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="max-w-xl rounded-xl border border-dashed border-brand-200 bg-white p-7 text-sm leading-relaxed text-ink-soft">
                Contact channels are being set up for this semester and will be
                posted here.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-5">
            {settings?.chapterEmail ? (
              <div className="rounded-xl border border-plum bg-plum p-7 text-brand-100">
                <h3 className="font-display text-lg font-bold tracking-tight text-white">
                  Companies and sponsors
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-brand-200">
                  Interested in partnering with the chapter? Visit our
                  sponsorship page for ways to contribute, then reach out by
                  email.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={`mailto:${settings.chapterEmail}?subject=Sponsorship inquiry`}
                    className="inline-flex items-center justify-center rounded-lg bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-500"
                  >
                    Email us
                  </a>
                  <a href="/sponsors" className="btn-outline-light px-4 py-2.5">
                    Sponsorship info
                  </a>
                </div>
              </div>
            ) : null}

            {meetings ? (
              <div className="rounded-xl border border-brand-100 bg-white p-7">
                <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                  General body meetings
                </h3>
                <p className="mt-2.5 font-mono text-xs leading-relaxed tracking-wide text-brand-800">
                  {meetings}
                </p>
                {settings?.meetingNote ? (
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {settings.meetingNote}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}


