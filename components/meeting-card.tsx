import { CalendarClock } from 'lucide-react';

// The chapter's regular meeting, shown when no other events are on the
// calendar. The day, time and room come from the site settings.
export default function MeetingCard({
  summary,
  compact = false,
}: {
  summary: string;
  compact?: boolean;
}) {
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
          Every week
        </p>
        <p
          className={`mt-1 font-display font-bold tracking-tight text-ink ${
            compact ? 'text-base' : 'text-lg'
          }`}
        >
          General body meeting
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">{summary}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
          Unless an event says otherwise. Open to every Kean student.
        </p>
      </div>
    </div>
  );
}
