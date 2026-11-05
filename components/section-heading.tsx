import type { ReactNode } from 'react';

type SectionHeadingProps = {
  // Leave out for a heading with no label above it.
  kicker?: string;
  title: ReactNode;
  lede?: string;
  tone?: 'light' | 'dark';
  align?: 'left' | 'center';
  level?: 'h1' | 'h2';
  // Lets a long title run wider before it wraps.
  wide?: boolean;
};

export default function SectionHeading({
  kicker,
  title,
  lede,
  tone = 'light',
  align = 'left',
  level = 'h2',
  wide = false,
}: SectionHeadingProps) {
  const alignment =
    align === 'center' ? 'items-center text-center mx-auto' : 'items-start';
  const HeadingTag = level;
  return (
    <div className={`flex ${wide ? 'max-w-4xl' : 'max-w-2xl'} flex-col gap-4 ${alignment}`}>
      {kicker ? (
        <p className={`kicker ${tone === 'dark' ? 'kicker-light' : ''}`}>
          {kicker}
        </p>
      ) : null}
      <HeadingTag
        className={`font-display text-3xl font-bold tracking-tight sm:text-4xl ${
          tone === 'dark' ? 'text-white' : 'text-ink'
        }`}
      >
        {title}
      </HeadingTag>
      {lede ? (
        <p
          className={`text-base leading-relaxed ${
            tone === 'dark' ? 'text-brand-200' : 'text-ink-soft'
          }`}
        >
          {lede}
        </p>
      ) : null}
    </div>
  );
}
