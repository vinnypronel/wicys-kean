import type { Metadata } from 'next';
import Image from 'next/image';
import {
  ArrowRight,
  DollarSign,
  FileDown,
  HandHeart,
  Mail,
  Mic,
  Server,
  Shirt,
  Trophy,
  Users,
} from 'lucide-react';

import SectionHeading from '@/components/section-heading';
import { getSiteSettings, getSponsorPage, getSponsors } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Sponsor Us',
  description:
    'Support WiCyS at Kean University. Sponsor our Capture the Flag competition, workshops, and programs to reach motivated cybersecurity students.',
};

const DEFAULT_BENEFITS = [
  {
    title: 'Access to emerging talent',
    blurb:
      'Meet students who are actively building skills and looking for internships and first roles in security.',
  },
  {
    title: 'Visibility on campus',
    blurb:
      'Your name on event materials, challenge categories, and prizes seen by the whole Kean community.',
  },
  {
    title: 'Support diversity in cyber',
    blurb:
      'Back a chapter whose mission is recruiting, retaining, and advancing women in cybersecurity.',
  },
  {
    title: 'Community goodwill',
    blurb:
      'Show students early what your organization stands for before they enter the job market.',
  },
];

const CHANNELS = [
  { Icon: DollarSign, label: 'Funding', blurb: 'Direct support for events, platforms, and infrastructure.' },
  { Icon: Trophy, label: 'Prizes', blurb: 'Awards for CTF winners and raffle items for attendees.' },
  { Icon: Shirt, label: 'Swag', blurb: 'Branded gear for members and competition participants.' },
  { Icon: Users, label: 'Mentorship', blurb: 'Pair employees with members for career guidance.' },
  { Icon: Mic, label: 'Speakers and judges', blurb: 'Send practitioners to present or judge the CTF.' },
  { Icon: Server, label: 'Technical support', blurb: 'Infrastructure, tooling, or expertise for competitions.' },
];

export default async function SponsorsPage() {
  const [settings, page, sponsors] = await Promise.all([
    getSiteSettings(),
    getSponsorPage(),
    getSponsors(),
  ]);
  const benefits =
    page?.benefits && page.benefits.length > 0 ? page.benefits : DEFAULT_BENEFITS;

  return (
    <>
      <section className="border-b border-brand-100 bg-surface">
        <div className="container-site py-16 sm:py-20">
          <SectionHeading
            level="h1"
            kicker="Partner with us"
            title="Invest in the next generation of cybersecurity talent"
            lede={
              page?.intro ||
              'WiCyS Kean gives companies direct access to motivated, skilled students at Kean University. Whether you can contribute funding, prizes, or people, there is a way for your organization to make an impact.'
            }
          />
          {page?.packet ? (
            <a href={page.packet} download className="btn-green mt-8">
              <FileDown className="h-4 w-4" />
              Download the sponsorship packet
            </a>
          ) : null}
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-site">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            Why sponsor WiCyS Kean
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-xl border border-brand-100 bg-white p-6"
              >
                <h3 className="font-display text-base font-bold tracking-tight text-ink">
                  {benefit.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
                  {benefit.blurb}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {sponsors.length > 0 ? (
        <section className="border-t border-brand-100 py-16 sm:py-20">
          <div className="container-site">
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
              Thank you to our sponsors and partners
            </h2>
            <ul className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {sponsors.map((sponsor) => {
                const inner = (
                  <>
                    <div className="relative h-16 w-full">
                      {sponsor.logo ? (
                        <Image
                          src={sponsor.logo}
                          alt={`${sponsor.name} logo`}
                          fill
                          sizes="220px"
                          className="object-contain"
                        />
                      ) : (
                        <span className="grid h-full place-items-center text-center font-display font-bold tracking-tight text-ink">
                          {sponsor.name}
                        </span>
                      )}
                    </div>
                    {sponsor.level ? (
                      <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-accent-700">
                        {sponsor.level}
                      </p>
                    ) : null}
                  </>
                );
                return (
                  <li key={sponsor.slug}>
                    {sponsor.websiteUrl ? (
                      <a
                        href={sponsor.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={sponsor.name}
                        className="flex h-full flex-col justify-center rounded-xl border border-brand-100 bg-white p-6 transition-colors hover:border-brand-300"
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className="flex h-full flex-col justify-center rounded-xl border border-brand-100 bg-white p-6">
                        {inner}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="bg-surface py-16 sm:py-20">
        <div className="container-site">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            Ways your company can contribute
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CHANNELS.map(({ Icon, label, blurb }) => (
              <div
                key={label}
                className="flex gap-4 rounded-xl border border-brand-100 bg-white p-6"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold tracking-tight text-ink">
                    {label}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                    {blurb}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-site">
          <div className="rounded-2xl border border-plum bg-plum px-7 py-12 sm:px-12">
            <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-xl">
                <p className="kicker kicker-light">Get started</p>
                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white">
                  Ready to talk?
                </h2>
                <p className="mt-4 text-base leading-relaxed text-brand-200">
                  <HandHeart className="mb-1 mr-2 inline h-5 w-5 align-text-bottom text-accent-400" />
                  Email us and we will send over our sponsorship overview with
                  current opportunities for this semester.
                </p>
              </div>
              {settings?.chapterEmail ? (
                <a
                  href={`mailto:${settings.chapterEmail}?subject=Sponsorship inquiry`}
                  className="btn shrink-0 bg-accent-600 text-white hover:bg-accent-500"
                >
                  <Mail className="h-4 w-4" />
                  Contact about sponsoring
                  <ArrowRight className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


