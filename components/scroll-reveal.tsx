'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const STAGGER_MS = 80;
const MAX_STAGGER_STEPS = 5;
const CLEANUP_MS = 900;

function isGroup(element: Element) {
  return (
    element.classList.contains('grid') || element.hasAttribute('data-reveal-group')
  );
}

// Reveal targets are the blocks inside each page container. Grids and marked
// groups reveal their children one by one instead of as a single block.
function collectTargets(main: HTMLElement) {
  const targets: { element: HTMLElement; delay: number }[] = [];
  const addGroup = (group: Element) => {
    Array.from(group.children).forEach((child, index) => {
      targets.push({
        element: child as HTMLElement,
        delay: Math.min(index, MAX_STAGGER_STEPS) * STAGGER_MS,
      });
    });
  };

  main.querySelectorAll('.container-site').forEach((container) => {
    if (isGroup(container)) {
      addGroup(container);
      return;
    }
    Array.from(container.children).forEach((child) => {
      if (isGroup(child) && child.children.length > 1) addGroup(child);
      else targets.push({ element: child as HTMLElement, delay: 0 });
      child.querySelectorAll(':scope > [data-reveal-group]').forEach(addGroup);
    });
  });
  return targets;
}

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const main = document.querySelector('main');
    if (!main) return;

    const viewportBottom = window.innerHeight;
    // Only hide what is still below the fold, so nothing on screen flickers.
    const pending = collectTargets(main).filter(
      ({ element }) => element.getBoundingClientRect().top > viewportBottom
    );
    if (pending.length === 0) return;

    const delays = new Map<Element, number>();
    const timers: number[] = [];

    pending.forEach(({ element, delay }) => {
      delays.set(element, delay);
      element.classList.add('reveal-hidden');
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          observer.unobserve(element);
          const delay = delays.get(element) ?? 0;
          element.style.setProperty('--reveal-delay', `${delay}ms`);
          element.classList.add('reveal-in');
          element.classList.remove('reveal-hidden');
          // Drop the reveal styles afterwards so hover transitions work again.
          timers.push(
            window.setTimeout(() => {
              element.classList.remove('reveal-in');
              element.style.removeProperty('--reveal-delay');
            }, CLEANUP_MS + delay)
          );
        });
      },
      { rootMargin: '0px 0px -12% 0px' }
    );

    pending.forEach(({ element }) => observer.observe(element));

    return () => {
      observer.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
      pending.forEach(({ element }) => {
        element.classList.remove('reveal-hidden', 'reveal-in');
        element.style.removeProperty('--reveal-delay');
      });
    };
  }, [pathname]);

  return null;
}
