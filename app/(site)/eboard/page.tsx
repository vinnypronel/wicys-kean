import type { Metadata } from 'next';
import { Mail } from 'lucide-react';

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
      <section className="page-hero">
        <div className="container-site py-16 sm:py-24">
          <SectionHeading
            level="h1"
            tone="dark"
            kicker="Leadership"
            title="Meet the executive board"
            lede="The students who keep WiCyS Kean running."
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
                lede="WiCyS Kean alumni and what they have gone on to do."
              />
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {alumni.map((alum) => (
                  <PersonCard
                    key={alum.slug}
                    name={alum.name}
                    photo={alum.photo}
                    label={[alum.pastRole, alum.years].filter(Boolean).join(', ') || undefined}
                    title={alum.currentTitle}
                    subtitle={alum.currentCompany}
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

