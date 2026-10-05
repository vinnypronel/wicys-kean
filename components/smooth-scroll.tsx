'use client';

import Lenis from 'lenis';
import { useEffect, useRef, type ReactNode } from 'react';

const SCROLLBAR_IDLE_MS = 4500;
const SCROLLBAR_EVENT = 'site-scrollbar-scroll';

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const thumb = thumbRef.current;
    if (!thumb) return;

    const root = document.documentElement;
    let idleTimer = 0;
    let drag: { y: number; scroll: number } | null = null;

    const metrics = () => {
      const viewport = root.clientHeight;
      const height = root.scrollHeight;
      const track = Math.max(0, viewport - 8);
      const size = Math.min(track, Math.max(64, (viewport / height) * track));

      return {
        size,
        travel: track - size,
        max: Math.max(0, height - viewport),
      };
    };

    const updateScrollbar = () => {
      const { size, travel, max } = metrics();
      const progress = max
        ? Math.max(0, Math.min(1, window.scrollY / max))
        : 0;

      thumb.hidden = max === 0;
      thumb.style.height = `${size}px`;
      thumb.style.transform = `translateY(${4 + progress * travel}px)`;
      thumb.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
    };

    const showScrollbar = () => {
      updateScrollbar();
      thumb.dataset.visible = 'true';
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        if (!drag) thumb.dataset.visible = 'false';
      }, SCROLLBAR_IDLE_MS);
    };

    const scrollTo = (top: number) => {
      window.scrollTo({ top, behavior: 'instant' });
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;

      drag = { y: event.clientY, scroll: window.scrollY };
      thumb.setPointerCapture(event.pointerId);
      showScrollbar();
      event.preventDefault();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!drag) return;

      const { travel, max } = metrics();
      if (travel > 0) {
        scrollTo(drag.scroll + ((event.clientY - drag.y) / travel) * max);
      }
    };

    const onPointerUp = () => {
      drag = null;
      showScrollbar();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const targets: Record<string, number> = {
        ArrowDown: window.scrollY + 40,
        ArrowUp: window.scrollY - 40,
        PageDown: window.scrollY + window.innerHeight,
        PageUp: window.scrollY - window.innerHeight,
        Home: 0,
        End: metrics().max,
      };

      if (!(event.key in targets)) return;

      event.preventDefault();
      scrollTo(targets[event.key]);
      showScrollbar();
    };

    root.classList.add('overlay-scrollbar');
    updateScrollbar();
    showScrollbar();

    const observer = new ResizeObserver(updateScrollbar);
    observer.observe(document.body);

    window.addEventListener('scroll', showScrollbar, { passive: true });
    window.addEventListener('wheel', showScrollbar, { passive: true });
    window.addEventListener('touchmove', showScrollbar, { passive: true });
    window.addEventListener(SCROLLBAR_EVENT, showScrollbar);
    window.addEventListener('resize', updateScrollbar);
    thumb.addEventListener('pointerdown', onPointerDown);
    thumb.addEventListener('pointermove', onPointerMove);
    thumb.addEventListener('lostpointercapture', onPointerUp);
    thumb.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(idleTimer);
      observer.disconnect();
      root.classList.remove('overlay-scrollbar');
      window.removeEventListener('scroll', showScrollbar);
      window.removeEventListener('wheel', showScrollbar);
      window.removeEventListener('touchmove', showScrollbar);
      window.removeEventListener(SCROLLBAR_EVENT, showScrollbar);
      window.removeEventListener('resize', updateScrollbar);
      thumb.removeEventListener('pointerdown', onPointerDown);
      thumb.removeEventListener('pointermove', onPointerMove);
      thumb.removeEventListener('lostpointercapture', onPointerUp);
      thumb.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      anchors: true,
    });
    const showScrollbar = () => {
      window.dispatchEvent(new Event(SCROLLBAR_EVENT));
    };
    lenis.on('scroll', showScrollbar);

    let running = true;
    function raf(time: number) {
      if (!running) return;
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      running = false;
      lenis.off('scroll', showScrollbar);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {children}
      <div
        ref={thumbRef}
        className="site-scroll-thumb"
        role="scrollbar"
        aria-label="Page scroll"
        aria-controls="main-content"
        aria-orientation="vertical"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        tabIndex={0}
      />
    </>
  );
}
