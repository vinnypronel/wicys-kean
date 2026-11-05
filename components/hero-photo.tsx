import Image from 'next/image';

// The framed photo on the right side of a page hero. It is sized from the
// screen height so the hero still fits on one screen.
export default function HeroPhoto({
  src,
  alt,
  caption,
  position = '50% 50%',
  large = false,
}: {
  src: string;
  alt: string;
  // A short line shown under the photo.
  caption?: string;
  // Which part of the photo to keep when it is cropped to 4:3.
  position?: string;
  // Lets feature-page heroes use more of the available desktop height.
  large?: boolean;
}) {
  return (
    <figure
      className="mx-auto lg:mx-0 lg:justify-self-end"
      // A caption takes a little height, so the photo is capped lower then.
      style={{
        width: `min(100%, calc((100svh - 73px - ${large ? (caption ? '5.5rem' : '3.5rem') : caption ? '9.5rem' : '7.5rem'}) * 4 / 3))`,
      }}
    >
      {/* A darker purple frame sits behind the photo and shows evenly on
          every side. The margin keeps it inside the figure. */}
      <div className="relative m-4">
        <div
          aria-hidden
          className="absolute -inset-4 rounded-2xl bg-brand-800"
        />
        <div
          className="overflow-hidden rounded-xl shadow-xl shadow-black/25"
          style={{ position: 'relative', aspectRatio: '4 / 3' }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            preload
            sizes="(max-width: 1024px) 100vw, 50vw"
            style={{ objectFit: 'cover', objectPosition: position }}
          />
        </div>
      </div>
      {caption ? (
        <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-brand-200">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
