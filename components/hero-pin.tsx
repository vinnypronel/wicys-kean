'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Works out where a page's purple hero should pin. A hero that fits on screen
// pins right under the header. A taller one (phones, mostly) pins only once
// its bottom edge has reached the bottom of the screen, so none of it is
// covered before it has been seen.
export default function HeroPin() {
  const pathname = usePathname();

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>('.page-hero');
    const header = document.querySelector<HTMLElement>('header');
    if (!hero) return;

    const update = () => {
      // A floating (fixed) header sits over the hero, so the hero pins at the
      // very top of the screen instead of below it.
      const floating = header ? getComputedStyle(header).position === 'fixed' : true;
      const headerHeight = floating ? 0 : (header?.offsetHeight ?? 0);
      const top = Math.min(headerHeight, window.innerHeight - hero.offsetHeight);
      hero.style.setProperty('--hero-pin-top', `${top}px`);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(hero);
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [pathname]);

  return null;
}
