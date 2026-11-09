import type { Metadata } from 'next';
import Image from 'next/image';
import {
  ArrowDown,
  FileDown,
  Gift,
  HandHeart,
  Laptop,
  Mail,
  PackageOpen,
  Shirt,
  Trophy,
  Utensils,
} from 'lucide-react';

import ContactForm from '@/components/contact-form';
import HeroPhoto from '@/components/hero-photo';
import SectionHeading from '@/components/section-heading';
import { getSiteSettings, getSponsorPage, getSponsors } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Sponsor Us',
  description:
    'Support WiCyS at Kean University. Sponsor our Capture the Flag competition, workshops, and programs to reach motivated cybersecurity students.',
};

const DEFAULT_BENEFITS = [
  {
    title: 'Make a visible impact',
    blurb:
      'Help remove everyday costs that can keep students from participating in valuable programs.',
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
  { Icon: Utensils, label: 'Food and refreshments', blurb: 'Sponsor pizza, snacks, drinks, or a meal for a chapter gathering.' },
  { Icon: Trophy, label: 'Prizes', blurb: 'Awards for CTF winners and raffle items for attendees.' },
  { Icon: PackageOpen, label: 'Event supplies', blurb: 'Printing, decorations, materials, or other practical event needs.' },
  { Icon: Shirt, label: 'Merchandise', blurb: 'Useful branded items for members and event participants.' },
  { Icon: Laptop, label: 'Learning resources', blurb: 'Software, training access, or educational materials.' },
  { Icon: Gift, label: 'Something else', blurb: 'Have another idea or resource to share? We would be happy to discuss it.' },
];

const FUNDS = [
  { Icon: Trophy, label: 'Capture the Flag', blurb: 'Prizes and running costs for the CTF competition we host.' },
  { Icon: Utensils, label: 'Food and event supplies', blurb: 'Food, materials, and supplies for our meetings and events.' },
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
      <section className="page-hero">
        <div className="hero-split hero-split-feature">
          <div>
            <SectionHeading
              level="h1"
              tone="dark"
              title="Invest in the next generation of cyber talent!"
              lede="Your support helps us create welcoming, affordable opportunities for students."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#sponsorship-details" className="btn-green">
                Read more
                <ArrowDown className="h-4 w-4" />
              </a>
              {page?.packet ? (
                <a href={page.packet} download className="btn-outline-light">
                  <FileDown className="h-4 w-4" />
                  Download the sponsorship packet
                </a>
              ) : null}
            </div>
          </div>
          <HeroPhoto
            large
            src="/images/uploads/conferences-2025-2026/photos/4.jpg"
            alt="WiCyS Kean members together at a conference"
          />
        </div>
      </section>

      <section id="sponsorship-details" className="scroll-mt-24 py-16 sm:py-20">
        <div className="container-site grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <p className="kicker">How we are funded</p>
            <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Partners make our programs possible
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-soft">
              Support from companies and community partners helps WiCyS Kean
              put on its events, from prizes for our Capture the Flag
              competition to food and supplies for our meetings.
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              We also gladly accept in-kind donations such as prizes, food,
              and event supplies.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {FUNDS.map(({ Icon, label, blurb }) => (
              <li key={label} className="rounded-xl border border-plum bg-plum p-6">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-white/10 text-accent-400">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold tracking-tight text-white">
                  {label}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-brand-100">{blurb}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-brand-100 bg-surface py-16 sm:py-20">
        <div className="container-site">
          <div className="max-w-3xl">
            <p className="kicker">Ways to partner</p>
            <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Let&rsquo;s find what works for you
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-soft">
              We are still putting together how sponsorships work for our
              chapter. Until then, reach out and we will talk through how your
              organization can help, whether that is supporting an event,
              providing prizes, or something else entirely.
            </p>
            <a href="#sponsor-contact" className="btn-green mt-7">
              Reach out to us
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-9 flex gap-4 rounded-2xl border border-plum bg-plum p-6 text-white sm:p-7">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white/10 text-accent-400">
              <HandHeart className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold tracking-tight">
                In-kind support is always welcome
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-brand-100">
                Food, beverages, gift cards, prizes, merchandise, software
                access, printing, and other useful resources can
                directly replace an event expense. We recognize in-kind
                partners according to the value and impact of their support.
              </p>
            </div>
          </div>

          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ink-soft">
            Sponsorship supports students; it does not purchase access to
            student information or guarantee recruiting opportunities. All
            recognition and chapter activities remain subject to university
            guidelines.
          </p>
        </div>
      </section>

      <section className="border-t border-brand-100 py-16 sm:py-20">
        <div className="container-site">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            Why sponsor WiCyS Kean
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => {
              const isPurple = index % 2 === 0;

              return (
              <div
                key={benefit.title}
                className={`rounded-xl border p-6 ${
                  isPurple
                    ? 'border-plum bg-plum'
                    : 'border-accent-400 bg-accent-400'
                }`}
              >
                <span
                  className={`font-mono text-xs font-semibold tracking-[0.18em] ${
                    isPurple ? 'text-accent-300' : 'text-brand-700'
                  }`}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3
                  className={`mt-4 font-display text-base font-bold tracking-tight ${
                    isPurple ? 'text-white' : 'text-plum'
                  }`}
                >
                  {benefit.title}
                </h3>
                <p
                  className={`mt-2.5 text-sm leading-relaxed ${
                    isPurple ? 'text-brand-100' : 'text-brand-950'
                  }`}
                >
                  {benefit.blurb}
                </p>
              </div>
              );
            })}
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
            Financial support is not the only way to help
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">
            Useful goods and services can make just as much of a difference as
            a monetary contribution.
          </p>
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

      <section id="sponsor-contact" className="scroll-mt-24 py-16 sm:py-20">
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          <div className="self-center rounded-2xl border border-plum bg-plum px-7 py-10 sm:px-10">
            <p className="kicker kicker-light">Get started</p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white">
              Ready to talk?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-200">
              <HandHeart className="mb-1 mr-2 inline h-5 w-5 align-text-bottom text-accent-400" />
              Tell us a little about your organization and how you would like
              to get involved. We will follow up to talk through how you can
              help.
            </p>
            <div className="mt-8 flex flex-wrap justify-end gap-3">
              {page?.packet ? (
                <a href={page.packet} download className="btn-green px-4 py-2.5">
                  <FileDown className="h-4 w-4" />
                  Sponsorship packet
                </a>
              ) : null}
              {settings?.chapterEmail ? (
                <a
                  href={`mailto:${settings.chapterEmail}?subject=Sponsorship inquiry`}
                  className="btn-outline-light px-4 py-2.5"
                >
                  <Mail className="h-4 w-4" />
                  Email instead
                </a>
              ) : null}
            </div>
          </div>
          <ContactForm
            variant="sponsor"
            title="Sponsorship inquiry"
            description="An officer will reply to your email, usually within a few days."
          />
        </div>
      </section>
    </>
  );
}


