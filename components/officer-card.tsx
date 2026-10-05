import Image from 'next/image';
import { createElement } from 'react';
import {
  BadgeCheck,
  CalendarCheck,
  Code,
  DollarSign,
  GraduationCap,
  Handshake,
  Megaphone,
  NotebookPen,
  Shield,
  Users,
  type LucideIcon,
} from 'lucide-react';

import { LinkedinGlyph } from '@/components/brand-icons';

export type OfficerProps = {
  name: string;
  role: string;
  photo?: string | null;
  bio?: string | null;
  linkedinUrl?: string | null;
  tone?: 'purple' | 'green';
};

// Matched by keyword so new or renamed roles still pick up a sensible icon.
const ROLE_ICONS: [RegExp, LucideIcon][] = [
  [/vice/i, Users],
  [/president/i, Shield],
  [/secretary/i, NotebookPen],
  [/treasurer/i, DollarSign],
  [/public relations/i, Handshake],
  [/event/i, CalendarCheck],
  [/outreach|social|media|marketing/i, Megaphone],
  [/web|developer|tech/i, Code],
  [/alumni/i, GraduationCap],
];

function roleIcon(role: string): LucideIcon {
  return ROLE_ICONS.find(([pattern]) => pattern.test(role))?.[1] ?? BadgeCheck;
}

const TONES = {
  purple: {
    card: 'border-brand-200 bg-brand-100',
    ring: 'ring-brand-600 ring-offset-brand-100',
    icon: 'text-brand-600',
    role: 'text-brand-700',
    link: 'text-brand-700 hover:text-brand-900',
  },
  green: {
    card: 'border-accent-300 bg-accent-100',
    ring: 'ring-accent-500 ring-offset-accent-100',
    icon: 'text-accent-600',
    role: 'text-accent-700',
    link: 'text-accent-700 hover:text-accent-900',
  },
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export default function OfficerCard({
  name,
  role,
  photo,
  bio,
  linkedinUrl,
  tone = 'purple',
}: OfficerProps) {
  const icon = roleIcon(role);
  const styles = TONES[tone];

  return (
    <article
      className={`relative flex min-h-64 flex-col overflow-hidden rounded-xl border p-7 transition-transform duration-500 ease-out hover:-translate-y-1.5 ${styles.card}`}
    >
      {createElement(icon, {
        'aria-hidden': true,
        strokeWidth: 1.5,
        className: `pointer-events-none absolute bottom-4 right-4 h-24 w-24 opacity-[0.08] ${styles.icon}`,
      })}
      {createElement(icon, {
        'aria-hidden': true,
        className: `absolute right-6 top-6 h-5 w-5 ${styles.icon}`,
      })}

      <div
        className={`relative h-24 w-24 overflow-hidden rounded-full bg-white ring-2 ring-offset-2 ${styles.ring}`}
      >
        {photo ? (
          <Image src={photo} alt={`Photo of ${name}`} fill sizes="96px" className="object-cover" />
        ) : (
          <span className="grid h-full w-full place-items-center font-display text-xl font-bold text-brand-600">
            {initials(name)}
          </span>
        )}
      </div>
      <h3 className="relative mt-5 font-display text-lg font-bold tracking-tight text-ink">
        {name}
      </h3>
      <p
        className={`relative mt-1.5 font-mono text-[11px] uppercase tracking-[0.14em] ${styles.role}`}
      >
        {role}
      </p>
      {bio ? (
        <p className="relative mt-3.5 text-sm leading-relaxed text-ink-soft">{bio}</p>
      ) : null}
      {linkedinUrl ? (
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} on LinkedIn`}
          className={`relative mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium transition-colors ${styles.link}`}
        >
          <LinkedinGlyph className="h-4 w-4" />
          LinkedIn
        </a>
      ) : null}
    </article>
  );
}
