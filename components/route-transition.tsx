'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Full-screen curtain between pages: it slides down over the old page, the
// route changes underneath, then it slides up to reveal the new page.

type Phase = 'hidden' | 'enter' | 'exit';

// Which page transition to use. Change this one word to switch.
//   'fade'    the old page fades out, the new one fades in and rises, with a
//             thin green line across the top of the screen
//   'curtain' the full purple screen with the logo and loading bar
const MODE: 'fade' | 'curtain' = 'fade';

// How the curtain moves. 'sideways' comes in from the left and leaves to the
// right. 'vertical' is the original: down from the top, back up to leave.
// Change this one word to switch.
const DIRECTION: 'sideways' | 'vertical' = 'sideways';

const CURTAIN_POSITIONS = {
  sideways: {
    hidden: '-translate-x-full',
    enter: 'translate-x-0',
    exit: 'translate-x-full',
  },
  vertical: {
    hidden: '-translate-y-full',
    enter: 'translate-y-0',
    exit: '-translate-y-full',
  },
}[DIRECTION];

// COVER: old page leaving. HOLD: pause once the new page is ready (the curtain
// uses it to run its bar to 100%). EXIT: new page arriving.
const COVER_MS = MODE === 'fade' ? 180 : 300;
const HOLD_MS = MODE === 'fade' ? 0 : 160;
const EXIT_MS = MODE === 'fade' ? 420 : 300;
// If a navigation never lands (network error, same page), lift the curtain anyway.
const FAILSAFE_MS = 4000;

export default function RouteTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('hidden');
  const phaseRef = useRef<Phase>('hidden');
  const barRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLParagraphElement>(null);
  // Set when the new page has rendered, so the bar can finish its run.
  const finishingRef = useRef(false);

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
      finishingRef.current = false;
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

    finishingRef.current = true;
    const exitTimer = window.setTimeout(() => setPhase('exit'), HOLD_MS);
    return () => window.clearTimeout(exitTimer);
  }, [pathname]);

  useEffect(() => {
    if (phase !== 'exit') return;
    const hideTimer = window.setTimeout(() => setPhase('hidden'), EXIT_MS);
    return () => window.clearTimeout(hideTimer);
  }, [phase]);

  // Fade mode: the page content is animated by CSS keyed off <html data-route>.
  useEffect(() => {
    if (MODE !== 'fade') return;
    const root = document.documentElement;
    if (phase === 'enter') root.dataset.route = 'out';
    else if (phase === 'exit') root.dataset.route = 'in';
    else delete root.dataset.route;
    return () => {
      delete root.dataset.route;
    };
  }, [phase]);

  // Perceived progress, drawn straight to the DOM every frame so it never
  // steps or stalls: it glides toward 90% while the page loads, then runs out
  // to 100% as soon as the new page is ready.
  useEffect(() => {
    const paint = (value: number) => {
      if (barRef.current) barRef.current.style.transform = `scaleX(${value / 100})`;
      if (percentRef.current) percentRef.current.textContent = `${Math.round(value)}%`;
    };

    if (phase === 'hidden') {
      paint(0);
      return;
    }
    if (phase === 'exit') {
      paint(100);
      return;
    }

    let frame = 0;
    let value = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      if (finishingRef.current) {
        value = Math.min(100, value + (dt / HOLD_MS) * 110);
      } else {
        // Ease toward 90%: quick at first, slower as it gets close.
        value += (90 - value) * (1 - Math.exp(-dt / (COVER_MS * 0.6)));
      }
      paint(value);
      if (value < 100) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [phase]);

  const visible = phase !== 'hidden';

  if (MODE === 'fade') {
    return (
      <div
        aria-hidden
        className={`route-line route-line-${phase} pointer-events-none fixed inset-x-0 top-0 z-[200] h-[3px] origin-left bg-accent-400`}
      />
    );
  }

  return (
    <div aria-hidden={!visible} className="pointer-events-none fixed inset-0 z-[200]">
      <div
        className={`absolute inset-0 bg-plum ${
          phase === 'hidden'
            ? CURTAIN_POSITIONS.hidden
            : phase === 'enter'
              ? `${CURTAIN_POSITIONS.enter} transition-transform duration-300 ease-out`
              : `${CURTAIN_POSITIONS.exit} transition-transform duration-300 ease-in`
        }`}
      />

      <div
        className={`absolute inset-0 flex flex-col items-center justify-center px-6 transition-opacity duration-200 ${
          phase === 'enter' ? 'opacity-100 delay-75' : 'opacity-0'
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
              ref={barRef}
              className="h-full w-full origin-left bg-gradient-to-r from-accent-500 via-accent-300 to-accent-400 will-change-transform"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
          <p
            ref={percentRef}
            className="mt-3 text-center font-display text-sm font-bold tabular-nums tracking-[0.2em] text-accent-300"
          >
            0%
          </p>
        </div>
      </div>
    </div>
  );
}
