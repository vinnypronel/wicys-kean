type SectionHeadingProps = {
  kicker: string;
  title: string;
  lede?: string;
  tone?: 'light' | 'dark';
  align?: 'left' | 'center';
  level?: 'h1' | 'h2';
};

export default function SectionHeading({
  kicker,
  title,
  lede,
  tone = 'light',
  align = 'left',
  level = 'h2',
}: SectionHeadingProps) {
  const alignment =
    align === 'center' ? 'items-center text-center mx-auto' : 'items-start';
  const HeadingTag = level;
  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignment}`}>
      <p className={`kicker ${tone === 'dark' ? 'kicker-light' : ''}`}>
        {kicker}
      </p>
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
