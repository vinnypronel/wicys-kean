export const CHAPTER_TIME_ZONE = 'America/New_York';

const DEFAULT_EVENT_HOURS = 2;

// Keystatic stores datetimes as wall-clock strings ("2026-09-15T17:00") with
// no offset. They are entered in Eastern time, so convert them explicitly
// instead of letting the server's own time zone (UTC on Vercel) decide.
function zoneOffsetMs(utcMs: number): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: CHAPTER_TIME_ZONE,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(utcMs));
  const get = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);
  const asUtc = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute'),
    get('second')
  );
  return asUtc - utcMs;
}

export function parseEventDate(value: string): Date {
  if (/[zZ]|[+-]\d{2}:?\d{2}$/.test(value)) return new Date(value);
  const [datePart, timePart = '00:00'] = value.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  const wallClock = Date.UTC(year, month - 1, day, hour || 0, minute || 0);
  let utc = wallClock - zoneOffsetMs(wallClock);
  const corrected = wallClock - zoneOffsetMs(utc);
  if (corrected !== utc) utc = corrected;
  return new Date(utc);
}

export function eventEndDate(event: {
  startDate: string;
  endDate?: string | null;
}): Date {
  if (event.endDate) return parseEventDate(event.endDate);
  const start = parseEventDate(event.startDate);
  return new Date(start.getTime() + DEFAULT_EVENT_HOURS * 60 * 60 * 1000);
}

function format(value: string, options: Intl.DateTimeFormatOptions): string {
  return parseEventDate(value).toLocaleString('en-US', {
    ...options,
    timeZone: CHAPTER_TIME_ZONE,
  });
}

export function formatEventDate(value: string): string {
  return format(value, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatShortDate(value: string): string {
  return format(value, { month: 'short', day: 'numeric' });
}

export function formatMonth(value: string): string {
  return format(value, { month: 'short' });
}

export function formatLongDate(value: string): string {
  return format(value, { month: 'long', day: 'numeric', year: 'numeric' });
}

export function formatTime(value: string): string {
  return format(value, { hour: 'numeric', minute: '2-digit' });
}

// "20260915T170000" in Eastern wall-clock time, for calendar links and .ics.
export function toCalendarStamp(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: CHAPTER_TIME_ZONE,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date);
  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? '00';
  return `${get('year')}${get('month')}${get('day')}T${get('hour')}${get('minute')}${get('second')}`;
}

const TYPE_LABELS: Record<string, string> = {
  meeting: 'General body meeting',
  workshop: 'Workshop',
  speaker: 'Guest speaker',
  conference: 'Conference',
  networking: 'Networking',
  ctf: 'CTF competition',
  social: 'Social',
  other: 'Community',
};

export function eventTypeLabel(type: string | null | undefined): string {
  if (!type) return 'Community';
  return TYPE_LABELS[type] ?? 'Community';
}

export const ALBUM_CATEGORY_LABELS: Record<string, string> = {
  meetings: 'Meetings',
  workshops: 'Workshops',
  ctf: 'Capture the Flag',
  conferences: 'Conferences',
  networking: 'Speakers and networking',
  socials: 'Socials',
  events: 'Chapter events',
  research: 'Research',
  other: 'Other',
};

export function meetingSummary(
  settings: {
    meetingDay?: string | null;
    meetingTime?: string | null;
    meetingLocation?: string | null;
  } | null
): string | null {
  if (!settings) return null;
  const parts = [
    settings.meetingDay,
    settings.meetingTime,
    settings.meetingLocation,
  ].filter((part): part is string => Boolean(part && part.trim()));
  return parts.length > 0 ? parts.join(' · ') : null;
}
