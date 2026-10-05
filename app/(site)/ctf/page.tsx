import type { Metadata } from 'next';
import { Check, Mail } from 'lucide-react';

import PhotoGrid from '@/components/photo-grid';
import SectionHeading from '@/components/section-heading';
import { filterPhotos, getCtfPage, getSiteSettings } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Capture the Flag',
  description:
    'WiCyS Kean’s Capture the Flag competition: beginner-friendly cybersecurity challenges, prizes, and a chance to test your skills.',
};

export default async function CtfPage() {
  const [ctf, settings] = await Promise.all([getCtfPage(), getSiteSettings()]);

  const photos: string[] = filterPhotos(ctf?.photos);

  return (
    <>
      <section className="page-hero">
        <div className="container-site py-16 sm:py-24">
          <p className="kicker kicker-light">WiCyS Kean CTF</p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl">
            Capture the Flag
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-200">
            Our signature competition. Students team up to solve security
            challenges across categories like web exploitation, cryptography,
            and forensics. Beginner friendly, competitive at the top.
          </p>
          <p className="mt-7 inline-flex items-center gap-2.5 rounded-lg border border-brand-500/40 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.16em] text-accent-300">
            Next event · In planning
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-site grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              kicker="Previous event"
              title={ctf?.previousTitle ?? 'Our most recent CTF'}
            />
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft">
              {ctf?.overview}
            </p>
            {ctf?.participantsNote ? (
              <p className="mt-6 inline-block rounded-lg bg-surface px-4 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-brand-800">
                {ctf.participantsNote}
              </p>
            ) : null}
            {ctf?.highlights && ctf.highlights.length > 0 ? (
              <ul className="mt-8 space-y-2.5">
                {ctf.highlights.map((highlight, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-soft"
                  >
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-accent-400" />
                    {highlight}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-brand-700">
              Challenge topics covered
            </h3>
            {ctf?.topics && ctf.topics.length > 0 ? (
              <ul className="mt-5 space-y-3">
                {ctf.topics.map((topic, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 rounded-lg border border-brand-100 bg-white px-4 py-3 text-sm font-medium text-ink"
                  >
                    <Check className="h-4 w-4 shrink-0 text-accent-600" />
                    {topic}
                  </li>
                ))}
              </ul>
            ) : null}
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

      <section className="border-t border-brand-100 bg-surface py-16 sm:py-20">
        <div className="container-site">
          <SectionHeading
            kicker="Next event"
            title="The next CTF is being planned"
            lede={ctf?.plannedBlurb}
          />
          <div className="mt-14 grid gap-10 lg:grid-cols-3">
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
                Tentative timeline
              </h3>
              <ol className="mt-5 space-y-0 border-l border-brand-200 pl-6">
                {(ctf?.timeline ?? []).map((item, index) => (
                  <li key={index} className="relative pb-6 last:pb-0">
                    <span className="absolute -left-[30px] top-1 h-3 w-3 rounded-full border-2 border-accent-400 bg-white" />
                    <p className="text-sm leading-relaxed text-ink-soft">{item}</p>
                  </li>
                ))}
              </ol>
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
                <a
                  href={`mailto:${settings.chapterEmail}?subject=CTF interest`}
                  className="btn-green mt-7"
                >
                  <Mail className="h-4 w-4" />
                  Let us know you are interested
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


