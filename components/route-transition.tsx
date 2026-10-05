'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Full-screen curtain between pages: it slides down over the old page, the
// route changes underneath, then it slides up to reveal the new page.

type Phase = 'hidden' | 'enter' | 'exit';

const COVER_MS = 450;
const HOLD_MS = 80;
const EXIT_MS = 450;
const PROGRESS_START_DELAY_MS = 170;
// If a navigation never lands (network error, same page), lift the curtain anyway.
const FAILSAFE_MS = 4000;

export default function RouteTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('hidden');
  const [progress, setProgress] = useState(0);
  const phaseRef = useRef<Phase>('hidden');

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // Intercept internal link clicks so navigation waits for the cover animation.
  useEffect(() => {
    const timers: number[] = [];

    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const anchor = (event.target as Element | null)?.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href) return;
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;
      if (/^(#|mailto:|tel:|https?:\/\/)/.test(href)) return;

      let url: URL;
      try {
        url = new URL(href, window.location.origin);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;
      // The admin editor has its own layout, let the browser load it normally.
      if (url.pathname.startsWith('/keystatic') || url.pathname === '/admin') return;

      event.preventDefault();
      const destination = url.pathname + url.search + url.hash;
      phaseRef.current = 'enter';
      setProgress(0);
      setPhase('enter');

      timers.push(
        window.setTimeout(() => router.push(destination), COVER_MS),
        window.setTimeout(() => {
          if (phaseRef.current === 'enter') setPhase('exit');
        }, COVER_MS + FAILSAFE_MS)
      );
    }

    // Capture phase so this runs before Next's own link handling.
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [router]);

  // Once the new route has rendered, hold briefly then slide the curtain away.
  const lastSettled = useRef(pathname);
  useEffect(() => {
    if (pathname === lastSettled.current) return;
    lastSettled.current = pathname;
    if (phaseRef.current !== 'enter') return;

    const exitTimer = window.setTimeout(() => setPhase('exit'), HOLD_MS);
    return () => window.clearTimeout(exitTimer);
  }, [pathname]);

  useEffect(() => {
    if (phase !== 'exit') return;
    const hideTimer = window.setTimeout(() => setPhase('hidden'), EXIT_MS);
    return () => window.clearTimeout(hideTimer);
  }, [phase]);

  // Perceived progress: fill to 92% while covering, snap to 100% on exit.
  useEffect(() => {
    let frame = 0;
    if (phase === 'hidden') {
      frame = window.requestAnimationFrame(() => setProgress(0));
      return () => window.cancelAnimationFrame(frame);
    }
    if (phase === 'exit') {
      frame = window.requestAnimationFrame(() => setProgress(100));
      return () => window.cancelAnimationFrame(frame);
    }

    const start = performance.now() + PROGRESS_START_DELAY_MS;
    const tick = (now: number) => {
      if (now < start) {
        frame = window.requestAnimationFrame(tick);
        return;
      }
      const elapsed = now - start;
      setProgress(Math.min(92, Math.round((elapsed / COVER_MS) * 92)));
      if (elapsed < COVER_MS) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [phase]);

  const visible = phase !== 'hidden';

  return (
    <div aria-hidden={!visible} className="pointer-events-none fixed inset-0 z-[200]">
      <div
        className={`absolute inset-0 bg-plum ${
          phase === 'hidden'
            ? '-translate-y-full'
            : phase === 'enter'
              ? 'translate-y-0 transition-transform duration-[450ms] ease-out'
              : '-translate-y-full transition-transform duration-[450ms] ease-in'
        }`}
      />

      <div
        className={`absolute inset-0 flex flex-col items-center justify-center px-6 transition-opacity duration-300 ${
          phase === 'enter' ? 'opacity-100 delay-150' : 'opacity-0'
        }`}
      >
        <div className="mb-6 h-1 w-16 -skew-x-[18deg] bg-accent-400" />
        <div className="rounded-2xl bg-white px-7 py-5 shadow-xl shadow-black/15">
          <Image
            src="/images/wicys-logo.png"
            alt=""
            width={583}
            height={244}
            preload
            className="h-auto w-[210px] sm:w-[260px]"
          />
        </div>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.32em] text-accent-400">
          Kean University Chapter
        </p>
        <div className="mt-7 w-[240px] sm:w-[300px]">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full bg-gradient-to-r from-accent-500 via-accent-300 to-accent-400 ease-out"
              style={{
                width: `${progress}%`,
                transition: `width ${progress === 0 ? 0 : 150}ms ease-out`,
              }}
            />
          </div>
          <p className="mt-3 text-center font-display text-sm font-bold tracking-[0.2em] text-accent-300">
            {progress}%
          </p>
        </div>
      </div>
    </div>
  );
}
