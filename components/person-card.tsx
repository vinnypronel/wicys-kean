import Image from 'next/image';

import { LinkedinGlyph } from '@/components/brand-icons';

type PersonCardProps = {
  name: string;
  photo?: string | null;
  label?: string;
  title?: string | null;
  subtitle?: string | null;
  note?: string | null;
  linkedinUrl?: string | null;
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

// Compact card for alumni and scholarship recipients.
export default function PersonCard({
  name,
  photo,
  label,
  title,
  subtitle,
  note,
  linkedinUrl,
}: PersonCardProps) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-brand-100 bg-white p-6 transition-colors hover:border-brand-300">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-brand-50 ring-2 ring-brand-100">
          {photo ? (
            <Image src={photo} alt={`Photo of ${name}`} fill sizes="64px" className="object-cover" />
          ) : (
            <span className="grid h-full w-full place-items-center font-display text-lg font-bold text-brand-600">
              {initials(name)}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-base font-bold tracking-tight text-ink">{name}</h3>
          {label ? (
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-700">
              {label}
            </p>
          ) : null}
        </div>
      </div>

      {title || subtitle ? (
        <div className="mt-5 border-t border-brand-100 pt-4">
          {title ? <p className="text-sm font-semibold text-ink">{title}</p> : null}
          {subtitle ? <p className="mt-0.5 text-sm text-brand-700">{subtitle}</p> : null}
        </div>
      ) : null}

      {note ? <p className="mt-3 text-sm leading-relaxed text-ink-soft">{note}</p> : null}

      {linkedinUrl ? (
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} on LinkedIn`}
          className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-brand-700 transition-colors hover:text-brand-900"
        >
          <LinkedinGlyph className="h-4 w-4" />
          LinkedIn
        </a>
      ) : null}
    </article>
  );
}
