import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowDown, ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';

import AlumniCard from '@/components/alumni-card';
import EboardInterestForm from '@/components/eboard-interest-form';
import EboardRoster from '@/components/eboard-roster';
import PersonCard from '@/components/person-card';
import SectionHeading from '@/components/section-heading';
import {
  filterPhotos,
  getAlumni,
  getEboardMembers,
  getScholars,
  getSiteSettings,
} from '@/lib/content';

export const metadata: Metadata = {
  title: 'Executive Board',
  description:
    'Meet the executive board of WiCyS at Kean University and the alumni who led the chapter before us.',
};

export default async function EboardPage() {
  const [members, scholars, alumni, settings] = await Promise.all([
    getEboardMembers(),
    getScholars(),
    getAlumni(),
    getSiteSettings(),
  ]);

  return (
    <>
      {/* Fills the whole screen. The group photo on the left, the text on
          solid purple on the right. */}
      <section
        className="page-hero"
        // Runs to the very top of the screen, behind the see-through header.
        style={{ overflow: 'hidden', top: 'var(--hero-pin-top, 0px)' }}
      >
        {/* Wide screens (1280px and up): the group photo on the left with a
            clean edge against the purple, its bottom right corner rounded and
            a darker purple panel peeking out behind it. It always stops short
            of the title (see .eboard-hero-photo). Narrower screens show the
            photo under the text instead. */}
        <div aria-hidden className="hidden xl:block" style={{ position: 'absolute', inset: 0 }}>
          <div
            className="eboard-hero-photo"
            style={{
              position: 'absolute',
              left: 0,
              top: '-22.5%',
              height: '115%',
              aspectRatio: '4 / 3',
            }}
          >
            <div className="absolute -bottom-4 -right-4 left-0 top-0 rounded-br-[2.5rem] bg-brand-800" />
            <div className="absolute inset-0 overflow-hidden rounded-br-[2.5rem]">
              <Image
                src="/images/eboard-group.jpg"
                alt=""
                fill
                preload
                sizes="100vw"
                style={{ objectFit: 'cover', objectPosition: '0% 50%' }}
              />
            </div>
          </div>
        </div>
        <div
          className="container-site flex flex-col pb-16 pt-28 sm:pb-20 xl:min-h-[100svh] xl:flex-row xl:items-center xl:justify-end"
          style={{ position: 'relative' }}
        >
          {/* Only as wide as the title, so the buttons can line up under its
              right edge. */}
          <div
            className="ml-auto max-w-xl"
            style={{
              width: 'fit-content',
              // Pushed right into the page margin on wide screens (up to
              // 11rem), so the text sits on solid purple, clear of the photo.
              marginRight:
                'calc(-1 * clamp(0px, (100vw - 72rem) / 2 - 1.5rem, 11rem))',
              // Keeps the white text readable now that less purple sits
              // behind it.
              textShadow: '0 1px 12px rgba(42, 13, 48, 0.55)',
            }}
          >
            <SectionHeading
              level="h1"
              tone="dark"
              title="Meet the executive board"
              lede="The students who keep WiCyS Kean running."
            />

            {/* Stacked from the shortest label to the longest and lined up on
                their right edge, under the end of the title. Each button sits
                on a hidden copy of itself so it can grow on hover without
                shifting anything. */}
            <div
              className="hero-cta-end mt-9"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '0.75rem',
              }}
            >
              <span className="relative inline-flex">
                <span aria-hidden className="btn-green hero-cta invisible">
                  Join WiCyS
                </span>
                <Link href="/get-involved#join" className="btn-green hero-cta hero-cta-live">
                  Join WiCyS
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </span>
              {alumni.length > 0 ? (
                <span className="relative inline-flex">
                  <span aria-hidden className="btn-outline-light hero-cta invisible">
                    Meet the alumni
                  </span>
                  <a href="#alumni" className="btn-outline-light hero-cta hero-cta-live">
                    Meet the alumni
                    <ArrowDown className="h-4 w-4" />
                  </a>
                </span>
              ) : null}
              <span className="relative inline-flex">
                <span aria-hidden className="btn-outline-light hero-cta invisible">
                  2027–2028 Interest form
                </span>
                <a href="#interest-form" className="btn-outline-light hero-cta hero-cta-live">
                  2027–2028 Interest form
                  <ArrowDown className="h-4 w-4" />
                </a>
              </span>
            </div>
          </div>
          {/* Phones, tablets and small laptops: the photo sits under the
              text, so the text never sits on top of it. */}
          <div className="relative mt-10 aspect-[3/2] w-full overflow-hidden rounded-2xl xl:hidden">
            <Image
              src="/images/eboard-group.jpg"
              alt="WiCyS Kean members and e-board standing together for a group photo"
              fill
              sizes="(min-width: 1152px) 1152px, 100vw"
              style={{ objectFit: 'cover', objectPosition: '50% 70%' }}
            />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionHeading
            title="The 2026–2027 E-Board"
          />
          {members.length > 0 ? (
            <EboardRoster members={members} />
          ) : (
            <p className="max-w-xl rounded-xl border border-dashed border-brand-200 bg-white p-7 text-sm leading-relaxed text-ink-soft">
              The e-board roster for this year is being finalized and will be
              posted here soon.
            </p>
          )}

          {scholars.length > 0 ? (
            <div className="mt-20">
              <SectionHeading
                kicker="Scholars"
                title="Scholarship recipients"
                lede="Members recognized with WiCyS and industry scholarships."
              />
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {scholars.map((scholar) => (
                  <PersonCard
                    key={scholar.slug}
                    name={scholar.name}
                    photo={scholar.photo}
                    label={scholar.year}
                    title={scholar.award}
                    note={scholar.note}
                    linkedinUrl={scholar.linkedinUrl}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {alumni.length > 0 ? (
            <div id="alumni" className="mt-20 scroll-mt-28">
              <SectionHeading
                title="Where our alumni are now"
                lede="WiCyS Kean members go on to industry roles, competitive internships, and graduate programs. This is where the community can take you."
              />
              <div className="mt-10 grid gap-6 lg:grid-cols-2">
                {alumni.map((alum) => (
                  <AlumniCard
                    key={alum.slug}
                    name={alum.name}
                    photo={alum.photo}
                    pastRole={alum.pastRole}
                    years={alum.years}
                    currentTitle={alum.currentTitle}
                    currentCompany={alum.currentCompany}
                    highlights={alum.highlights}
                    linkedinUrl={alum.linkedinUrl}
                    photos={filterPhotos(alum.photos)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div id="interest-form" className="mt-20 scroll-mt-28">
            <SectionHeading
              // "Interest" and "Form" always stay on the same line.
              title={'2027–2028 Executive Board Interest\u00A0Form'}
              wide
              lede="Step up and help lead WiCyS Kean for the 2027–2028 academic year. Shape chapter events, workshops, CTF competitions, and industry partnerships."
            />
            <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start lg:gap-12">
              <EboardInterestForm />

              <div className="space-y-6">
                <div className="rounded-2xl border border-brand-100 bg-surface p-7">
                  <h4 className="font-display text-lg font-bold tracking-tight text-ink">
                    Why join the E-Board?
                  </h4>
                  <ul className="mt-4 space-y-3.5 text-sm text-ink-soft">
                    <li className="flex items-start gap-2.5">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-accent-500" />
                      <span>
                        <strong className="text-ink">Hands-on leadership:</strong> Plan and host technical workshops, study jams, and guest speaker events.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-accent-500" />
                      <span>
                        <strong className="text-ink">Industry & WiCyS visibility:</strong> Network with cybersecurity professionals, sponsors, and national conference organizers.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-accent-500" />
                      <span>
                        <strong className="text-ink">Standout experience:</strong> Demonstrate impactful teamwork and management on your resume and LinkedIn.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-accent-500" />
                      <span>
                        <strong className="text-ink">Mentorship:</strong> Collaborate with current officers and Kean faculty to make a difference on campus.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-accent-200 bg-accent-50/60 p-7">
                  <h4 className="font-display text-lg font-bold tracking-tight text-ink">
                    Who can apply?
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    Open to all Kean University undergraduate and graduate students enrolled for the 2027–2028 academic year. You do not need prior board experience, and we welcome all skill levels and majors.
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    <span className="font-semibold text-ink">Eligibility:</span> The 2027–2028 term begins in fall 2027. To serve on the e-board, you need to be at least starting your sophomore year of college by the start of that semester.
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    After you submit, an officer will reach out with election timeline details, committee openings, and next steps.
                  </p>
                </div>

                {settings?.chapterEmail ? (
                  <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-brand-100 bg-white p-6 sm:flex-row sm:items-center">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand-700">Questions?</p>
                      <p className="mt-1 text-sm font-medium text-ink">
                        Want to learn more about a specific position before applying?
                      </p>
                    </div>
                    <a
                      href={`mailto:${settings.chapterEmail}?subject=2027-2028 E-Board inquiry`}
                      className="btn-outline shrink-0 text-xs px-4 py-2.5"
                    >
                      <Mail className="h-4 w-4" />
                      Email the board
                    </a>
                  </div>
                ) : null}

                <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-brand-100 bg-white p-6 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand-700">Get involved</p>
                    <p className="mt-1 text-sm font-medium text-ink">
                      Looking for more ways to participate in chapter events and workshops?
                    </p>
                  </div>
                  <Link
                    href="/get-involved"
                    className="btn-outline shrink-0 text-xs px-4 py-2.5"
                  >
                    Get involved
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

