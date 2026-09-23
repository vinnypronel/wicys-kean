import type { Metadata } from 'next';
import { Mail } from 'lucide-react';

import OfficerCard from '@/components/officer-card';
import SectionHeading from '@/components/section-heading';
import { getEboardMembers, getSiteSettings } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Executive Board',
  description:
    'Meet the executive board of WiCyS at Kean University, the students who plan meetings, workshops, and the annual CTF.',
};

export default async function EboardPage() {
  const [members, settings] = await Promise.all([
    getEboardMembers(),
    getSiteSettings(),
  ]);

  return (
    <>
      <section className="border-b border-brand-100 bg-surface">
        <div className="container-site py-16 sm:py-20">
          <SectionHeading
            level="h1"
            kicker="Leadership"
            title="Meet the executive board"
            lede="The students who keep WiCyS Kean running, from weekly meetings to the annual Capture the Flag."
          />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-site">
          {members.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {members.map((member) => (
                <OfficerCard
                  key={member.slug}
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

