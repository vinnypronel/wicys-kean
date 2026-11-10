'use client';

import { useEffect, useState } from 'react';

// Shows the still poster first, then plays the video for visitors who have
// not asked for less motion. Phones get a smaller copy made for their
// screens, so they never download the full desktop file.
const MOTION_OK = '(prefers-reduced-motion: no-preference)';
const WIDE = '(min-width: 768px)';

type Choice = 'poster' | 'mobile' | 'desktop';

export default function HeroVideo({
  src,
  mobileSrc,
  poster,
  className,
}: {
  src: string;
  mobileSrc?: string;
  poster: string;
  className?: string;
}) {
  const [choice, setChoice] = useState<Choice>('poster');

  useEffect(() => {
    const motion = window.matchMedia(MOTION_OK);
    const wide = window.matchMedia(WIDE);
    const update = () => {
      if (!motion.matches) setChoice('poster');
      else if (wide.matches || !mobileSrc) setChoice('desktop');
      else setChoice('mobile');
    };
    update();
    motion.addEventListener('change', update);
    wide.addEventListener('change', update);
    return () => {
      motion.removeEventListener('change', update);
      wide.removeEventListener('change', update);
    };
  }, [mobileSrc]);

  const source = choice === 'desktop' ? src : choice === 'mobile' ? mobileSrc : null;

  return (
    <video
      aria-hidden="true"
      className={className}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      poster={poster}
      // A new element when the choice changes, so the browser picks up the
      // new source.
      key={choice}
    >
      {source ? <source src={source} type="video/mp4" /> : null}
    </video>
  );
}
