import { CalendarClock } from 'lucide-react';

type MeetingSettings = {
  meetingDay?: string | null;
  meetingTime?: string | null;
  meetingLocation?: string | null;
} | null;

// The chapter's weekly event slot, shown when no other events are on the
// calendar. The day, time and room come from the site settings.
export default function MeetingCard({
  settings,
  compact = false,
}: {
  settings: MeetingSettings;
  compact?: boolean;
}) {
  const day = settings?.meetingDay?.trim().replace(/s$/i, '');
  const details = [settings?.meetingTime, settings?.meetingLocation]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(' · ');
  if (!day && !details) return null;

  return (
    <div
      className={`flex items-start gap-4 rounded-xl border border-brand-200 bg-white ${
        compact ? 'p-5' : 'p-6 sm:p-7'
      }`}
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-plum text-white">
        <CalendarClock aria-hidden className="h-5 w-5" />
      </span>
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent-700">
          Weekly event
        </p>
        <p
          className={`mt-1 font-display font-bold tracking-tight text-ink ${
            compact ? 'text-base' : 'text-lg'
          }`}
        >
          {day ? `Every ${day}` : 'Every week'}
        </p>
        {details ? (
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{details}</p>
        ) : null}
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
          Unless an event says otherwise. Open to every Kean student.
        </p>
      </div>
    </div>
  );
}
