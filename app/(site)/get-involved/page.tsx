import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, DollarSign, Handshake } from 'lucide-react';

import {
  ChapterSteps,
  NATIONAL_REGISTER_URL,
  NationalSteps,
} from '@/components/join-steps';
import SectionHeading from '@/components/section-heading';
import YouTubeVideo from '@/components/youtube-video';
import { getGetInvolvedPage, getSiteSettings } from '@/lib/content';

export const metadata: Metadata = {
  alternates: { canonical: '/get-involved' },
  title: 'Get Involved',
  description:
    'Join WiCyS at Kean University. Free membership, open to all majors and skill levels. Learn new skills, find your community, and make an impact.',
};

const HERO_VIDEO = [
  { id: 'WtJnCxebs6M', title: 'Women in CyberSecurity (WiCyS)' },
];
const JOIN_VIDEO = [{ id: 'mLeFnyGO1Ro', title: 'Join WiCyS!' }];

export default async function GetInvolvedPage() {
  const [page, settings] = await Promise.all([
    getGetInvolvedPage(),
    getSiteSettings(),
  ]);
  const cougarlinkUrl =
    settings?.cougarlinkUrl ||
    'https://kean.campuslabs.com/engage/organization/wicyskean';

  return (
    <>
      {/* Fills the screen below the header and stays pinned while the rest
          of the page slides up over it. */}
      <section
        className="page-hero flex items-center"
        style={{
          position: 'sticky',
          top: 'var(--hero-pin-top, 73px)',
          zIndex: 0,
          minHeight: 'calc(100svh - 73px)',
        }}
      >
        {/* On wide screens the video runs out into the right margin (up to
            9rem) so it can be larger without squeezing the title. */}
        <div
          className="container-site grid items-center gap-10 py-12 lg:grid-cols-[fit-content(31rem)_minmax(0,1fr)] lg:gap-12"
          style={{
            paddingRight:
              'max(1.25rem, calc(2.5rem - clamp(0px, (100vw - 72rem) / 2 - 1rem, 9rem)))',
            // The text also shifts left into the margin by the same amount,
            // which gives the title room to stay on one line.
            paddingLeft:
              'max(1.25rem, calc(2.5rem - clamp(0px, (100vw - 72rem) / 2 - 1rem, 9rem)))',
            maxWidth:
              'calc(72rem + 2 * clamp(0px, (100vw - 72rem) / 2 - 1rem, 9rem))',
          }}
        >
          <div>
            <SectionHeading
              level="h1"
              tone="dark"
              title="There is a place for you here!"
              lede={
                page?.intro ||
                'Whether you want to build skills, find support, or give back, there are plenty of ways to be part of WiCyS Kean.'
              }
            />

            {/* Jump straight to the two sign-up sections further down. */}
            <div
              className="mt-8"
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}
            >
              <a href="#join" className="btn-green">
                Join the Kean chapter
                <ArrowDown className="h-4 w-4" />
              </a>
              <a href="#national" className="btn-outline-light">
                Register nationally
                <ArrowDown className="h-4 w-4" />
              </a>
            </div>

            {/* The national logo, on a white tile so its purple shows. */}
            <div
              className="mt-10 border-t border-white/20 pt-7"
              style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}
            >
              <span className="rounded-xl bg-white px-4 py-3" style={{ flex: 'none' }}>
                <Image
                  src="/images/wicys-logo.png"
                  alt="Women in CyberSecurity"
                  width={583}
                  height={244}
                  style={{ height: '3rem', width: 'auto' }}
                />
              </span>
              <p className="text-sm leading-relaxed text-brand-200">
                An official student chapter of
                <br />
                <span className="font-semibold text-white">
                  Women in CyberSecurity (WiCyS)
                </span>
              </p>
            </div>
          </div>
          <YouTubeVideo videos={HERO_VIDEO} />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-site">
          <div>
            <ChapterSteps discordUrl={settings?.discordUrl} cougarlinkUrl={cougarlinkUrl} />
          </div>

          {/* The national "Join WiCyS!" video, leading into national sign-up. */}
          <div className="mt-16 grid items-center gap-8 lg:grid-cols-[1fr_1.25fr] lg:gap-14">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                See what you would be joining!
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">
                WiCyS Kean is a student chapter of Women in CyberSecurity. This
                short video from the national organization shows the community
                behind it.
              </p>
            </div>
            <YouTubeVideo videos={JOIN_VIDEO} playGrows="right" />
          </div>

          <div className="mt-16">
            <NationalSteps />
          </div>

          {/* One closing box: joining on the left half of the buttons,
              supporting the chapter on the right half. */}
          <div className="mt-14 grid gap-10 rounded-2xl border border-brand-100 bg-surface p-8 sm:p-12 lg:grid-cols-[1fr_1.15fr] lg:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Ready when you are
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">
                Joining the Kean chapter is free. National WiCyS membership
                is optional and costs students $20 a year. Register online,
                then stop by our next event so we can meet you.
              </p>
              <p className="mt-3 max-w-md text-base leading-relaxed text-ink-soft">
                Want to support from afar? Donations and sponsorships help
                cover prizes for our Capture the Flag competition and food and
                supplies for our events.
              </p>
              {settings?.chapterEmail ? (
                <Link
                  href="/contact"
                  className="step-link group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-700"
                >
                  <span className="hover-underline">Contact the chapter</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              ) : null}
            </div>
            <div className="grid gap-3.5 sm:grid-cols-2">
              <a
                href={NATIONAL_REGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-green w-full sm:col-span-2"
              >
                Register for WiCyS nationally
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={cougarlinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full sm:col-span-2"
              >
                Sign up on CougarLink
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/eboard#interest-form"
                className="btn-outline w-full sm:col-span-2"
              >
                Apply for the 2027–2028 E-Board
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/donate" className="btn-outline w-full">
                <DollarSign className="h-4 w-4" />
                Donate
              </Link>
              <Link href="/sponsors" className="btn-outline w-full">
                <Handshake className="h-4 w-4" />
                Sponsor us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
