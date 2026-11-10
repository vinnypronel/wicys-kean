import type { Metadata } from 'next';

import SectionHeading from '@/components/section-heading';
import { getSiteSettings } from '@/lib/content';

export const metadata: Metadata = {
  alternates: { canonical: '/privacy' },
  title: 'Privacy',
  description:
    'What WiCyS at Kean University collects through this website, who can see it, and how to ask us to delete it.',
};

const SECTIONS = [
  {
    title: 'What we collect',
    body: [
      'The contact form collects your name, email, organization if you add one, and your message.',
      'The e-board interest form collects your name, email, major, expected graduation, the roles you are interested in, your written answers, and your resume.',
      'We only have what you choose to send us. You can browse the rest of the site without giving us anything.',
    ],
  },
  {
    title: 'Who can see it',
    body: [
      'Submissions are stored in a private database and can only be opened by signed-in chapter admins. Resumes are never public, and we do not sell or share your information.',
      'We use it only to reply to you and to review e-board interest.',
    ],
  },
  {
    title: 'Cookies and outside services',
    body: [
      'This site does not use advertising or tracking cookies. A cookie is only used to keep chapter admins signed in.',
      'Videos come from YouTube and only load when you press play, at which point YouTube’s own privacy policy applies. Links to other sites, such as resources or registration pages, follow those sites’ policies.',
    ],
  },
];

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  return (
    <section className="py-16 sm:py-20">
      <div className="container-site">
        <SectionHeading
          level="h1"
          title="Privacy"
          lede="What this site collects, who can see it, and how to have it removed."
        />
        <div className="mt-10 max-w-2xl space-y-9">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="font-display text-xl font-bold tracking-tight text-ink">
                {section.title}
              </h2>
              {section.body.map((text) => (
                <p key={text} className="mt-2 text-base leading-relaxed text-ink-soft">
                  {text}
                </p>
              ))}
            </div>
          ))}
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-ink">
              Removing your information
            </h2>
            <p className="mt-2 text-base leading-relaxed text-ink-soft">
              To have your submission or resume deleted, email{' '}
              {settings?.chapterEmail ? (
                <a
                  href={`mailto:${settings.chapterEmail}`}
                  className="font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-900"
                >
                  {settings.chapterEmail}
                </a>
              ) : (
                'the chapter'
              )}
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
