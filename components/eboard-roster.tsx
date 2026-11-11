import Image from 'next/image';
import { createElement } from 'react';

import { LinkedinLogo } from '@/components/brand-icons';
import { roleIcon } from '@/components/officer-card';
import { EBOARD_QUESTION } from '@/lib/site';

export type RosterMember = {
  slug: string;
  name: string;
  role: string;
  photo?: string | null;
  bio?: string | null;
  major?: string | null;
  duties?: string | null;
  answer?: string | null;
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

// Three tiers, decided by role: the president and vice president lead, the
// alumni support roles support, everyone else is an executive officer. New or
// renamed roles fall into the middle tier.
function tierOf(role: string): 'lead' | 'support' | 'officer' {
  if (/president/i.test(role)) return 'lead';
  if (/alumni/i.test(role)) return 'support';
  return 'officer';
}

function TierLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-4">
      <p className="shrink-0 font-mono text-xs font-medium uppercase tracking-[0.18em] text-brand-700">
        {children}
      </p>
      <span aria-hidden className="h-px flex-1 bg-brand-100" />
    </div>
  );
}

// The president and vice president: the same layout as the officer cards,
// larger, with a purple frame and a faint WiCyS shield in place of a role
// icon.
function LeadCard({ member }: { member: RosterMember }) {
  return (
    // The card checks its own width: photo beside the text when there is
    // room, photo on top (shown whole) when the card is narrow.
    // Hovering the wrapper (which stays put) lifts the card, so the effect
    // never flickers at the card's edge.
    <div className="group @container">
    <article className="flex flex-col overflow-hidden rounded-2xl border-2 border-plum bg-white shadow-lg shadow-brand-950/10 transition-[translate,box-shadow] duration-500 ease-out group-hover:-translate-y-1.5 group-hover:shadow-xl @min-[32rem]:flex-row">
      <div
        className="relative w-full shrink-0 overflow-hidden bg-brand-50 @min-[32rem]:w-(--photo-w)"
        style={
          {
            // Smaller until the member's major or answer is filled in, so
            // the card has no big empty space.
            '--photo-w':
              member.major || member.duties || member.answer
                ? 'clamp(10rem, calc((100svh - 18rem) / 2), 15rem)'
                : '11rem',
            aspectRatio: '1 / 1',
          } as React.CSSProperties
        }
      >
        {member.photo ? (
          <Image
            src={member.photo}
            alt={`Photo of ${member.name}`}
            fill
            sizes="(min-width: 1024px) 480px, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <span className="grid h-full w-full place-items-center font-display text-4xl font-bold text-brand-600">
            {initials(member.name)}
          </span>
        )}
      </div>
      <div className="relative flex min-w-0 flex-1 flex-col border-t-4 border-plum p-6 sm:p-7 @min-[32rem]:border-l-4 @min-[32rem]:border-t-0">
        <Image
          src="/images/wicys-shield.png"
          alt=""
          aria-hidden
          width={202}
          height={244}
          className="pointer-events-none absolute right-6 top-3 h-32 w-auto opacity-[0.18]"
        />
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
          {member.role}
        </p>
        <h3 className="mt-2 font-display text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
          {member.name}
        </h3>
        {member.major ? (
          <p className="mt-1.5 text-sm text-ink-soft"><MajorLine text={member.major} /></p>
        ) : null}
        {member.duties ? (
          <p className="mt-1.5 text-sm leading-snug text-ink">{member.duties}</p>
        ) : null}
        {member.answer ? (
          <figure className="mt-4 border-l-2 border-brand-300 pl-3">
            <figcaption className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
              {EBOARD_QUESTION}
            </figcaption>
            <blockquote className="mt-1 text-sm italic leading-relaxed text-ink">
              &ldquo;{member.answer}&rdquo;
            </blockquote>
          </figure>
        ) : null}
        {member.linkedinUrl ? (
          <a
            href={member.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on LinkedIn`}
            className="tap-target relative mt-auto inline-flex items-center gap-2 self-end pt-3 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900"
          >
            <LinkedinLogo className="h-5 w-5" />
            <span className="hover-underline">LinkedIn</span>
          </a>
        ) : null}
      </div>
    </article>
    </div>
  );
}

// An executive officer: the square headshot shown whole on the left, so no
// face is ever cropped, with the role, name and LinkedIn beside it.
function OfficerPortrait({ member }: { member: RosterMember }) {
  const icon = roleIcon(member.role);
  return (
    // Photo beside the text when the card is 24rem or wider, on top when it is
    // narrow, so the name and role never get squeezed.
    // Hovering the wrapper (which stays put) lifts the card, so the effect
    // never flickers at the card's edge.
    <div className="group @container">
    <article
      className={`flex flex-col overflow-hidden rounded-2xl border bg-white transition-[translate,border-color,box-shadow] duration-500 ease-out group-hover:-translate-y-1.5 group-hover:shadow-xl group-hover:shadow-brand-950/10 border-brand-200 group-hover:border-brand-500 @min-[24rem]:flex-row`}
    >
      {/* Square, like the photos themselves. Beside the text it is sized
          from the screen height so both rows of officers fit on one
          screen. */}
      <div
        className="relative w-full shrink-0 overflow-hidden bg-brand-50 @min-[24rem]:w-(--photo-w)"
        style={
          {
            // Smaller until the member's major or answer is filled in, so
            // the card has no big empty space.
            '--photo-w':
              member.major || member.duties || member.answer
                ? 'clamp(8.5rem, calc((100svh - 22rem) / 2), 12.5rem)'
                : '9rem',
            aspectRatio: '1 / 1',
          } as React.CSSProperties
        }
      >
        {member.photo ? (
          <Image
            src={member.photo}
            alt={`Photo of ${member.name}`}
            fill
            sizes="(min-width: 640px) 400px, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <span className="grid h-full w-full place-items-center font-display text-3xl font-bold text-brand-600">
            {initials(member.name)}
          </span>
        )}
      </div>
      <div
        className="relative flex min-w-0 flex-1 flex-col border-t-4 border-plum p-5 @min-[24rem]:border-l-4 @min-[24rem]:border-t-0"
      >
        {/* The role sits beside its icon. */}
        <div className="flex items-center gap-2.5">
          <span className="shrink-0 text-plum">
            {createElement(icon, { 'aria-hidden': true, weight: 'duotone', className: 'h-6 w-6' })}
          </span>
          <p className="font-mono text-[11px] font-medium uppercase leading-snug tracking-[0.14em] text-brand-700">
            {member.role}
          </p>
        </div>
        <h3 className="mt-3 font-display text-xl font-bold leading-tight tracking-tight text-ink">
          {member.name}
        </h3>
        {member.major ? (
          <p className="mt-1 text-xs text-ink-soft"><MajorLine text={member.major} /></p>
        ) : null}
        {member.duties ? (
          <p className="mt-1 text-xs leading-snug text-ink">{member.duties}</p>
        ) : null}
        {member.answer ? (
          <blockquote className="mt-2 text-sm italic leading-relaxed text-ink">
            &ldquo;{member.answer}&rdquo;
          </blockquote>
        ) : null}
        {member.linkedinUrl ? (
          <a
            href={member.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on LinkedIn`}
            className="tap-target relative mt-auto inline-flex items-center gap-2 self-end pt-3 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900"
          >
            <LinkedinLogo className="h-5 w-5" />
            <span className="hover-underline">LinkedIn</span>
          </a>
        ) : null}
      </div>
    </article>
    </div>
  );
}

// Each comma-separated part (major, option, graduation term) on its own
// line. A bare year like '28 stays on the line before it.
function MajorLine({ text }: { text: string }) {
  const parts: string[] = [];
  for (const part of text.split(', ')) {
    if (parts.length > 0 && /^'\d{2}$/.test(part)) {
      parts[parts.length - 1] += `, ${part}`;
    } else {
      parts.push(part);
    }
  }
  return (
    <>
      {parts.map((part, index) => (
        <span key={index} className="block">
          {part}
          {index < parts.length - 1 ? ',' : null}
        </span>
      ))}
    </>
  );
}

// A small horizontal card for the support roles.
function SupportCard({ member }: { member: RosterMember }) {
  return (
    <div className="group">
    <article className="flex items-center gap-4 rounded-xl border border-brand-100 bg-white p-4 transition-[translate,border-color] duration-500 ease-out group-hover:-translate-y-1 group-hover:border-brand-400">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-brand-50 ring-2 ring-plum ring-offset-2">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={`Photo of ${member.name}`}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <span className="grid h-full w-full place-items-center font-display text-base font-bold text-brand-600">
            {initials(member.name)}
          </span>
        )}
      </div>
      {/* The section heading already says Alumni support, so the card only
          shows the name and degrees. */}
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1">
        <h3 className="font-display text-lg font-bold tracking-tight text-ink">
          {member.name}
        </h3>
        {member.major ? (
          <p className="w-full text-xs text-ink-soft">{member.major}</p>
        ) : null}
      </div>
      {member.linkedinUrl ? (
        <a
          href={member.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} on LinkedIn`}
          className="tap-target inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900"
        >
          <LinkedinLogo className="h-5 w-5" />
          <span className="hover-underline">LinkedIn</span>
        </a>
      ) : null}
    </article>
    </div>
  );
}

export default function EboardRoster({ members }: { members: RosterMember[] }) {
  const leads = members.filter((m) => tierOf(m.role) === 'lead');
  const officers = members.filter((m) => tierOf(m.role) === 'officer');
  const support = members.filter((m) => tierOf(m.role) === 'support');
  const anyAnswers = members.some((m) => m.answer);

  return (
    <div className="mt-10 space-y-12">
      {leads.length > 0 ? (
        <div>
          <TierLabel>Leadership</TierLabel>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {leads.map((member) => (
              <LeadCard key={member.slug} member={member} />
            ))}
          </div>
        </div>
      ) : null}

      {officers.length > 0 ? (
        <div>
          <TierLabel>Executive officers</TierLabel>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {officers.map((member) => (
              <OfficerPortrait key={member.slug} member={member} />
            ))}
          </div>
        </div>
      ) : null}

      {support.length > 0 ? (
        <div>
          <TierLabel>Alumni support</TierLabel>
          {/* Spans the same width as the officer rows above. */}
          <div
            className={`mt-6 grid gap-5 sm:grid-cols-2 ${
              support.length > 2 ? 'lg:grid-cols-3' : ''
            }`}
          >
            {support.map((member) => (
              <SupportCard key={member.slug} member={member} />
            ))}
          </div>
        </div>
      ) : null}

      {anyAnswers ? (
        <p className="text-sm text-ink-soft">
          Quotes are each officer&apos;s answer to: <em>{EBOARD_QUESTION}</em>
        </p>
      ) : null}
    </div>
  );
}

