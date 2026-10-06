import type { Metadata } from 'next';
import Image from 'next/image';
import { Mail } from 'lucide-react';

import AlumniCard from '@/components/alumni-card';
import OfficerCard from '@/components/officer-card';
import PersonCard from '@/components/person-card';
import SectionHeading from '@/components/section-heading';
import {
  getAlumni,
  getEboardMembers,
  getScholars,
  getSiteSettings,
} from '@/lib/content';

export const metadata: Metadata = {
  title: 'Executive Board',
  description:
    'Meet the executive board of WiCyS at Kean University, our scholarship recipients, and the alumni who led the chapter before us.',
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
      <section className="page-hero relative overflow-hidden">
        <div className="container-site flex items-center py-16 sm:py-20 lg:min-h-[38rem]">
          <div className="lg:w-1/2 lg:pr-12">
            <SectionHeading
              level="h1"
              tone="dark"
              kicker="Leadership"
              title="Meet the executive board"
              lede="The students who keep WiCyS Kean running."
            />
          </div>
        </div>
        {/* The photo fills the right half on desktop, with a purple margin on
            its top, bottom, and right. */}
        <div className="relative aspect-[4/3] w-full lg:absolute lg:inset-y-8 lg:right-8 lg:aspect-auto lg:w-[calc(50%-2rem)]">
          <Image
            src="/images/eboard-group.jpg"
            alt="WiCyS Kean members and e-board standing together for a group photo"
            fill
            preload
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          {/* Green corner brackets on all four corners. */}
          <span
            aria-hidden
            className="absolute left-0 top-0 h-14 w-14 border-l-[5px] border-t-[5px] border-accent-400 sm:h-16 sm:w-16"
          />
          <span
            aria-hidden
            className="absolute right-0 top-0 h-14 w-14 border-r-[5px] border-t-[5px] border-accent-400 sm:h-16 sm:w-16"
          />
          <span
            aria-hidden
            className="absolute bottom-0 left-0 h-14 w-14 border-b-[5px] border-l-[5px] border-accent-400 sm:h-16 sm:w-16"
          />
          <span
            aria-hidden
            className="absolute bottom-0 right-0 h-14 w-14 border-b-[5px] border-r-[5px] border-accent-400 sm:h-16 sm:w-16"
          />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          {members.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {members.map((member, index) => (
                <OfficerCard
                  key={member.slug}
                  tone={index % 2 === 0 ? 'purple' : 'green'}
                  name={member.name}
                  role={member.role}
                  photo={member.photo}
                  bio={member.bio}
                  linkedinUrl={member.linkedinUrl}
                />
              ))}
            </div>
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
            <div className="mt-20">
              <SectionHeading
                kicker="Alumni"
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
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-xl border border-brand-100 bg-surface p-7 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                Interested in joining the board?
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                Elections are held every spring, and committees open up
                throughout the year.
              </p>
            </div>
            {settings?.chapterEmail ? (
              <a
                href={`mailto:${settings.chapterEmail}?subject=E-board inquiry`}
                className="btn-outline shrink-0"
              >
                <Mail className="h-4 w-4" />
                Email the board
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}

