'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Keeps a link like /eboard#interest-form landing on its section. Photos
// above the target finish loading after the first jump and push it down the
// page, so for a few seconds the page is re-aligned whenever its height
// changes. It stops as soon as the visitor scrolls on their own.
export default function HashAnchor() {
  const pathname = usePathname();

  useEffect(() => {
    let stop: (() => void) | undefined;

    const follow = () => {
      stop?.();
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      if (!target) return;

      const align = () =>
        target.scrollIntoView({ behavior: 'instant', block: 'start' });
      const observer = new ResizeObserver(align);
      observer.observe(document.body);
      const first = window.setTimeout(align, 120);
      const timeout = window.setTimeout(() => stop?.(), 8000);
      const onUserScroll = () => stop?.();
      window.addEventListener('wheel', onUserScroll, { passive: true });
      window.addEventListener('touchstart', onUserScroll, { passive: true });
      window.addEventListener('keydown', onUserScroll);

      stop = () => {
        observer.disconnect();
        window.clearTimeout(first);
        window.clearTimeout(timeout);
        window.removeEventListener('wheel', onUserScroll);
        window.removeEventListener('touchstart', onUserScroll);
        window.removeEventListener('keydown', onUserScroll);
        stop = undefined;
      };
    };

    follow();
    window.addEventListener('hashchange', follow);
    return () => {
      window.removeEventListener('hashchange', follow);
      stop?.();
    };
  }, [pathname]);

  return null;
}
