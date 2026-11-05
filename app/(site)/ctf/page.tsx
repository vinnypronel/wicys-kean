import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';

import Mascot from '@/components/mascot';
import PhotoGrid from '@/components/photo-grid';
import SectionHeading from '@/components/section-heading';
import { filterPhotos, getCtfPage, getSiteSettings } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Capture the Flag',
  description:
    'WiCyS Kean’s Capture the Flag competition: beginner-friendly cybersecurity challenges, prizes, and a chance to test your skills.',
};

// A highlight that names one of these organizations shows its logo in place
// of the word given here.
const HIGHLIGHT_LOGOS = [
  {
    match: 'abitronix',
    word: 'Abitronix',
    src: '/images/logos/abitronix.png',
    alt: 'Abitronix',
    width: 614,
    height: 169,
  },
  {
    match: 'giants',
    word: 'NY',
    src: '/images/logos/ny-giants-mark.png',
    alt: 'NY',
    width: 288,
    height: 222,
  },
  {
    match: 'oracle',
    word: 'Oracle',
    src: '/images/logos/oracle.png',
    alt: 'Oracle',
    width: 434,
    height: 62,
    // A wide, thin wordmark, so it sits lower than the others.
    className: 'h-[0.72em] align-[0.02em]',
  },
];

export default async function CtfPage() {
  const [ctf, settings] = await Promise.all([getCtfPage(), getSiteSettings()]);

  const photos: string[] = filterPhotos(ctf?.photos);

  return (
    <>
      {/* Fills the screen below the header (64px, 73px on desktop with its
          border), so no white shows until the visitor scrolls. */}
      <section className="page-hero flex min-h-[calc(100svh-65px)] items-center lg:min-h-[calc(100svh-73px)]">
        <div className="container-site grid items-center gap-12 py-12 sm:py-16 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl">
              Capture the Flag
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-200">
              Our signature competition. Students team up to solve security
              challenges across categories like web exploitation, cryptography,
              and forensics. Beginner friendly, competitive at the top.
            </p>
            {/* Each button sits on a hidden copy of itself so it can grow to
                the right on hover without shifting anything. */}
            <div className="mt-9 flex flex-col items-start gap-3">
              <span
                aria-disabled="true"
                className="btn-green hero-cta pointer-events-none cursor-default select-none opacity-60"
              >
                Site coming soon
              </span>
              <span className="relative inline-flex">
                <span aria-hidden className="btn-outline-light hero-cta invisible">
                  View all events
                </span>
                <Link href="/events" className="btn-outline-light hero-cta hero-cta-live">
                  View all events
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </span>
            </div>
          </div>
          {/* Capped by screen height so the hero still fits short screens. */}
          <Mascot
            width="min(32rem, calc(100vw - 2.5rem), calc(100svh - 13.5rem))"
            className="mx-auto lg:mx-0 lg:justify-self-end"
            sizes="416px"
            backdrop
          />
        </div>
      </section>

      <section className="bg-surface pb-8 pt-12 sm:pb-10 sm:pt-14">
        <div className="container-site">
          {/* When it happens sits to the right of the heading. */}
          <div className="grid gap-8 lg:grid-cols-[1fr_28rem] lg:items-center lg:gap-16">
            <SectionHeading
              title="The next CTF is being planned!"
              lede={ctf?.plannedBlurb}
            />
            <div>
              <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                When?
              </h3>
              {/* The first sentence (the semester) is shown large, and the
                  rest as a note under it. */}
              <div className="mt-3 space-y-3">
                {(ctf?.timeline ?? []).map((item, index) => {
                  const cut = item.indexOf('. ');
                  const lead = cut < 0 ? item : item.slice(0, cut);
                  const rest = cut < 0 ? '' : item.slice(cut + 2);
                  return (
                    <div key={index}>
                      <p className="font-display text-3xl font-bold tracking-tight text-brand-700 sm:text-4xl">
                        {lead}
                      </p>
                      {rest ? (
                        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                          {rest}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Same columns as the heading row, so How to participate lines up under When. */}
          <div className="mt-9 grid gap-10 lg:grid-cols-[1fr_28rem] lg:gap-16">
            <div>
              <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                Goals
              </h3>
              <ul className="mt-5 space-y-3">
                {(ctf?.goals ?? []).map((goal, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft"
                  >
                    <span className="font-display font-bold text-accent-700">
                      {index + 1}.
                    </span>
                    {goal}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                How to participate
              </h3>
              <ul className="mt-5 space-y-3">
                {(ctf?.participateSteps ?? []).map((step, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft"
                  >
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-accent-400" />
                    {step}
                  </li>
                ))}
              </ul>
              {settings?.chapterEmail ? (
                <div className="mt-7 flex justify-end">
                  <a
                    href={`mailto:${settings.chapterEmail}?subject=CTF interest`}
                    className="btn-green"
                  >
                    <Mail className="h-4 w-4" />
                    Let us know you are interested
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-brand-100 py-12 sm:py-14">
        <div className="container-site grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div>
            <SectionHeading
              kicker="Previous CTF"
              // A month and its year stay together, so a title never breaks
              // between "March" and "2026".
              title={(ctf?.previousTitle ?? 'Our most recent CTF').replace(
                / (\d{4})\b/g,
                '\u00A0$1'
              )}
            />
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft">
              {ctf?.overview}
            </p>
            {ctf?.highlights && ctf.highlights.length > 0 ? (
              <ul className="mt-6 space-y-2.5">
                {ctf.highlights.map((highlight, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-soft"
                  >
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-accent-400" />
                    <span>
                      {(() => {
                        const logo = HIGHLIGHT_LOGOS.find((item) =>
                          highlight.includes(item.word)
                        );
                        if (!logo) return highlight;
                        const at = highlight.indexOf(logo.word);
                        return (
                          <>
                            {highlight.slice(0, at)}
                            <Image
                              src={logo.src}
                              alt={logo.alt}
                              width={logo.width}
                              height={logo.height}
                              className={`mx-0.5 inline-block w-auto ${
                                'className' in logo && logo.className
                                  ? logo.className
                                  : 'h-[1.15em] align-[-0.2em]'
                              }`}
                            />
                            {highlight.slice(at + logo.word.length)}
                          </>
                        );
                      })()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div>
            <figure style={{ width: 'min(21rem, calc(100vw - 2.5rem))', maxWidth: '100%' }}>
              <div className="overflow-hidden rounded-xl border border-brand-100 shadow-lg shadow-brand-950/10">
                <Image
                  src="/images/uploads/capture-the-flag-2026/flyer.jpg"
                  alt="Flyer for last year's Kean University Capture the Flag, held March 20, 2026"
                  width={754}
                  height={1000}
                  sizes="336px"
                  className="h-auto w-full"
                />
              </div>
              <figcaption
                className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft"
                style={{ whiteSpace: 'nowrap' }}
              >
                Last year&apos;s CTF flyer, March 2026
              </figcaption>
            </figure>
          </div>
        </div>

        {photos.length > 0 ? (
          <div className="container-site mt-4">
            <PhotoGrid
              aspectClassName="aspect-video"
              photos={photos.map((src, index) => ({
                src,
                alt: `Previous WiCyS Kean CTF photo ${index + 1}`,
              }))}
            />
          </div>
        ) : null}
      </section>
    </>
  );
}


