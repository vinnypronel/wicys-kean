import Image from 'next/image';
import { LinkedinGlyph } from '@/components/brand-icons';

export type OfficerProps = {
  name: string;
  role: string;
  photo?: string | null;
  bio?: string | null;
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

export default function OfficerCard({
  name,
  role,
  photo,
  bio,
  linkedinUrl,
}: OfficerProps) {
  return (
    <article className="flex flex-col rounded-xl border border-brand-100 bg-white p-6 transition-colors hover:border-brand-300">
      <div className="relative h-20 w-20 overflow-hidden rounded-full bg-brand-100">
        {photo ? (
          <Image src={photo} alt={`Photo of ${name}`} fill sizes="96px" className="object-cover" />
        ) : (
          <span className="grid h-full w-full place-items-center font-display text-xl font-bold text-brand-600">
            {initials(name)}
          </span>
        )}
      </div>
      <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-ink">
        {name}
      </h3>
      <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-700">
        {role}
      </p>
      {bio ? (
        <p className="mt-3.5 text-sm leading-relaxed text-ink-soft">{bio}</p>
      ) : null}
      {linkedinUrl ? (
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} on LinkedIn`}
          className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-brand-700 transition-colors hover:text-accent-700"
        >
          <LinkedinGlyph className="h-4 w-4" />
          LinkedIn
        </a>
      ) : null}
    </article>
  );
}

