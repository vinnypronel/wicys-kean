import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, HandHeart, Lightbulb, Sparkles, Users } from 'lucide-react';

import SectionHeading from '@/components/section-heading';
import { getGetInvolvedPage } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Get Involved',
  description:
    'Learn new skills, get support, and make an impact with WiCyS at Kean University. Volunteer, help run our CTF, or join the e-board.',
};

const DEFAULT_CARDS = [
  {
    title: 'Learn new skills',
    body: 'Grow your technical and professional skills at our workshops, speaker events, and Capture the Flag competitions. No experience necessary.',
    points: [],
    ctaLabel: 'See upcoming events',
    ctaUrl: '/events',
  },
  {
    title: 'Find your community',
    body: 'Meet students who share your interest in cybersecurity at our general body meetings, socials, and on Discord. Everyone is welcome, whatever your major.',
    points: [
      'Meet students from every major',
      'Network with guest speakers and recruiters',
      'Stay connected on our Discord',
    ],
    ctaLabel: 'Join WiCyS',
    ctaUrl: '/join',
  },
  {
    title: 'Have an impact',
    body: 'We always appreciate members who give their time. Every bit of help makes the chapter stronger. Volunteer opportunities include:',
    points: [
      'Running for the e-board',
      'Helping run our CTF competition',
      'Representing WiCyS at tabling and outreach events',
    ],
    ctaLabel: 'Volunteer with us',
    ctaUrl: '/contact?topic=Volunteering',
  },
];

const ICONS = [Lightbulb, Users, HandHeart];

export default async function GetInvolvedPage() {
  const page = await getGetInvolvedPage();
  const cards = page?.cards && page.cards.length > 0 ? page.cards : DEFAULT_CARDS;

  return (
    <>
      <section className="page-hero">
        <div className="container-site py-16 sm:py-24">
          <SectionHeading
            level="h1"
            tone="dark"
            kicker="Get involved"
            title="There is a place for you here"
            lede={
              page?.intro ||
              'Whether you want to build skills, find support, or give back, there are plenty of ways to be part of WiCyS Kean.'
            }
          />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-site">
          <ul className="grid gap-6 lg:grid-cols-3">
            {cards.map((card, index) => {
              const Icon = ICONS[index % ICONS.length];
              const featured = index % 3 === 1;
              const isExternal = /^https?:\/\//.test(card.ctaUrl);
              return (
                <li
                  key={card.title}
                  className={`flex flex-col rounded-xl border p-7 sm:p-8 ${
                    featured
                      ? 'border-plum bg-plum text-brand-100'
                      : 'border-brand-100 bg-white'
                  }`}
                >
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-lg ${
                      featured ? 'bg-white/10 text-accent-400' : 'bg-brand-50 text-brand-700'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <h2
                    className={`mt-5 font-display text-xl font-bold tracking-tight ${
                      featured ? 'text-white' : 'text-ink'
                    }`}
                  >
                    {card.title}
                  </h2>
                  <p
                    className={`mt-3 text-sm leading-relaxed ${
                      featured ? 'text-brand-200' : 'text-ink-soft'
                    }`}
                  >
                    {card.body}
                  </p>
                  {card.points.length > 0 ? (
                    <ul className="mt-5 space-y-2.5">
                      {card.points.map((point) => (
                        <li key={point} className="flex gap-2.5 text-sm">
                          <Check
                            className={`mt-0.5 h-4 w-4 shrink-0 ${
                              featured ? 'text-accent-400' : 'text-accent-600'
                            }`}
                          />
                          <span className={featured ? 'text-white' : 'text-ink'}>{point}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {card.ctaLabel && card.ctaUrl ? (
                    <div className="mt-auto pt-8">
                      {isExternal ? (
                        <a
                          href={card.ctaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={featured ? 'btn-green' : 'btn-outline'}
                        >
                          {card.ctaLabel}
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      ) : (
                        <Link href={card.ctaUrl} className={featured ? 'btn-green' : 'btn-outline'}>
                          {card.ctaLabel}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>

          <div className="mt-14 grid gap-8 rounded-2xl border border-accent-200 bg-accent-50 p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Want to support from afar?
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">
                Donations help members travel to conferences, enter
                competitions, and learn with real tools.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/donate" className="btn-green">
                <Sparkles className="h-4 w-4" />
                Donate
              </Link>
              <Link href="/join" className="btn-outline">
                Join WiCyS
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
