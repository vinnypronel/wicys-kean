import Image from 'next/image';
import { GraduationCap } from 'lucide-react';

import { LinkedinLogo } from '@/components/brand-icons';

export type AlumniCardProps = {
  name: string;
  photo?: string | null;
  pastRole?: string | null;
  years?: string | null;
  currentTitle?: string | null;
  currentCompany?: string | null;
  highlights?: readonly string[] | null;
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

export default function AlumniCard({
  name,
  photo,
  pastRole,
  years,
  currentTitle,
  currentCompany,
  highlights,
  linkedinUrl,
}: AlumniCardProps) {
  const chapterRole = [pastRole, years].filter(Boolean).join(', ');
  const points = (highlights ?? []).filter(Boolean);

  return (
    <article className="group flex flex-col rounded-2xl border border-brand-200 bg-white p-6 transition-[transform,border-color,box-shadow] duration-500 ease-out hover:-translate-y-1.5 hover:border-brand-600 hover:shadow-xl hover:shadow-brand-950/10 sm:p-7">
      <div className="flex items-center gap-5">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full bg-brand-100 ring-2 ring-accent-400 ring-offset-2 ring-offset-white sm:h-32 sm:w-32">
          {photo ? (
            <Image
              src={photo}
              alt={`Photo of ${name}`}
              fill
              sizes="128px"
              className="object-cover"
            />
          ) : (
            <span className="grid h-full w-full place-items-center font-display text-3xl font-bold text-brand-600">
              {initials(name)}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-accent-700">
            <GraduationCap aria-hidden className="h-4 w-4 shrink-0" />
            {chapterRole ? `WiCyS Kean ${chapterRole}` : 'WiCyS Kean alumni'}
          </p>
          <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
            {name}
          </h3>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {currentTitle || currentCompany ? (
          <div className="mt-5 rounded-xl bg-plum px-5 py-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-400">
              Now
            </p>
            {currentTitle ? (
              <p className="mt-1.5 font-display text-lg font-bold leading-snug tracking-tight text-white">
                {currentTitle}
              </p>
            ) : null}
            {currentCompany ? (
              <p className="mt-0.5 text-sm font-medium text-brand-200">
                {currentCompany}
              </p>
            ) : null}
          </div>
        ) : null}

        {points.length > 0 ? (
          <div className="mt-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
              Along the way
            </p>
            <ul className="mt-3 space-y-2">
              {points.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-soft"
                >
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-accent-400" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {linkedinUrl ? (
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name} on LinkedIn`}
            className="mt-auto inline-flex items-center gap-2.5 self-start pt-6 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900"
          >
            <LinkedinLogo className="h-5 w-5" />
            <span className="hover-underline">Connect on LinkedIn</span>
          </a>
        ) : null}
      </div>
    </article>
  );
}
