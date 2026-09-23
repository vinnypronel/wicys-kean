import type { EventEntry } from '@/lib/content';
import {
  CHAPTER_TIME_ZONE,
  eventEndDate,
  parseEventDate,
  toCalendarStamp,
} from '@/lib/format';
import { SITE_URL } from '@/lib/site';

function eventUrl(event: EventEntry) {
  return `${SITE_URL}/events/${event.slug}`;
}

export function googleCalendarUrl(event: EventEntry): string {
  const start = toCalendarStamp(parseEventDate(event.startDate));
  const end = toCalendarStamp(eventEndDate(event));
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${start}/${end}`,
    ctz: CHAPTER_TIME_ZONE,
    details: `${event.description}\n\n${eventUrl(event)}`,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function escapeIcs(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

// Lines longer than 75 octets must be folded per RFC 5545.
function fold(line: string): string {
  const chunks: string[] = [];
  let rest = line;
  while (rest.length > 74) {
    chunks.push(rest.slice(0, 74));
    rest = ` ${rest.slice(74)}`;
  }
  chunks.push(rest);
  return chunks.join('\r\n');
}

export function buildIcs(event: EventEntry): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//WiCyS Kean//Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.slug}@wicys-kean`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=${CHAPTER_TIME_ZONE}:${toCalendarStamp(parseEventDate(event.startDate))}`,
    `DTEND;TZID=${CHAPTER_TIME_ZONE}:${toCalendarStamp(eventEndDate(event))}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    `LOCATION:${escapeIcs(event.location)}`,
    `DESCRIPTION:${escapeIcs(event.description)}`,
    `URL:${eventUrl(event)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}
