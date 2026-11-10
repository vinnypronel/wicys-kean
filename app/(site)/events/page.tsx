import type { Metadata } from 'next';

import EventCard from '@/components/event-card';
import PastEventCard from '@/components/past-event-card';
import HeroPhoto from '@/components/hero-photo';
import MeetingCard from '@/components/meeting-card';
import SectionHeading from '@/components/section-heading';
import { getPastEvents, getSiteSettings, getUpcomingEvents } from '@/lib/content';
import { meetingSummary } from '@/lib/format';

export const metadata: Metadata = {
  alternates: { canonical: '/events' },
  title: 'Events',
  description:
    'Upcoming and past events from WiCyS at Kean University: weekly chapter events, workshops, guest speakers, networking nights, and conferences.',
};

// Re-check hourly so finished events move to Past without a redeploy.
export const revalidate = 3600;

export default async function EventsPage() {
  const [upcoming, past, settings] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
    getSiteSettings(),
  ]);
  const meeting = meetingSummary(settings);

  return (
    <>
      <section className="page-hero">
        <div className="hero-split hero-split-feature">
          <div>
            <SectionHeading
              level="h1"
              tone="dark"
              title={
                <>
                  <span className="block lg:whitespace-nowrap">What is happening</span>
                  <span className="block">this semester?</span>
                </>
              }
              lede="Weekly chapter events, hands-on workshops, guest speakers, conference trips, and networking events. Registration links go live as events are announced."
            />
          </div>
          <HeroPhoto
            large
            src="/images/uploads/chapter-events/photos/0.jpg"
            alt="WiCyS Kean members at an outdoor tabling event on campus"
            caption="Meetings: Tuesdays · 2:15–3:30 PM · GLAB 208"
          />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-site">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            Upcoming events
          </h2>
          {upcoming.length > 0 ? (
            <div data-reveal-group className="mt-8 space-y-5">
              {upcoming.map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </div>
          ) : (
            // With nothing else scheduled, the weekly meeting still shows.
            <div className="mt-6 max-w-xl space-y-4">
              {meeting ? <MeetingCard settings={settings} /> : null}
              <p className="text-sm leading-relaxed text-ink-soft">
                Workshops, speakers, and other events are announced on our
                Discord and Instagram first, so make sure you are following.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <div className="container-site">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            Past events
          </h2>
          {past.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((event) => (
                <PastEventCard key={event.slug} event={event} />
              ))}
            </div>
          ) : (
            <p className="mt-6 max-w-xl rounded-xl border border-dashed border-brand-200 bg-white p-7 text-sm leading-relaxed text-ink-soft">
              Recaps and photos from previous semesters will be posted here.
            </p>
          )}
        </div>
      </section>
    </>
  );
}

