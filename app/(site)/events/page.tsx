import type { Metadata } from 'next';

import EventCard from '@/components/event-card';
import PastEventCard from '@/components/past-event-card';
import SectionHeading from '@/components/section-heading';
import { getPastEvents, getUpcomingEvents } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Upcoming and past events from WiCyS at Kean University: general body meetings, workshops, guest speakers, networking nights, and conferences.',
};

// Re-check hourly so finished events move to Past without a redeploy.
export const revalidate = 3600;

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
  ]);

  return (
    <>
      <section className="page-hero">
        <div className="container-site py-16 sm:py-24">
          <SectionHeading
            level="h1"
            tone="dark"
            kicker="Events and activities"
            title="What is happening this semester"
            lede="General body meetings, hands-on workshops, guest speakers, conference trips, and networking events. Registration links go live as events are announced."
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
            <p className="mt-6 max-w-xl rounded-xl border border-dashed border-brand-200 bg-white p-7 text-sm leading-relaxed text-ink-soft">
              Nothing on the calendar right now. New events are announced on
              our Discord and Instagram first, so make sure you are following.
            </p>
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

