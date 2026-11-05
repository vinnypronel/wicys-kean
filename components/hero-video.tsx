'use client';

import { useEffect, useState } from 'react';

// Shows the still poster first. Only on screens 768px and wider, for
// visitors who have not asked for less motion, does it then load and play
// the video, so phones never download it.
const PLAY_VIDEO = '(min-width: 768px) and (prefers-reduced-motion: no-preference)';

export default function HeroVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(PLAY_VIDEO);
    const update = () => setPlay(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return (
    <video
      aria-hidden="true"
      className={className}
      autoPlay
      loop
      muted
      playsInline
      poster={poster}
      // A new element when the choice changes, so the browser picks up the
      // added or removed source.
      key={play ? 'video' : 'poster'}
    >
      {play ? <source src={src} type="video/mp4" /> : null}
    </video>
  );
}
