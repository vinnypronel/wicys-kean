import Image from 'next/image';

import { MASCOT_ENABLED } from '@/lib/site';

// The cougar is four stacked layers, back to front, so the tail and the typing
// paw can move on their own. The laptop sits above the paw.
const ALT = 'The Kean cougar in a WiCyS hoodie, typing on a laptop';

// Kept with the component (not in the global stylesheet) so the motion and the
// layout always arrive together.
const MASCOT_CSS = `
.mascot-layer { position: absolute; inset: 0; }
.mascot-rise { animation: mascot-rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both; }
.mascot-tail { transform-origin: 21.5% 94.9%; will-change: transform; animation: mascot-tail 3.2s ease-in-out infinite alternate; }
.mascot-arm { transform-origin: 23.5% 56.3%; animation: mascot-type 1.3s ease-in-out infinite; }
.mascot-paw { transform-origin: 33% 68%; animation: mascot-tap 0.55s ease-in-out infinite; }
@keyframes mascot-rise {
  from { opacity: 0; transform: translateY(7%); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes mascot-tail {
  from { transform: rotate(-2.5deg); }
  to { transform: rotate(2.5deg); }
}
@keyframes mascot-type {
  0%, 24%, 49%, 76%, 100% { transform: translateY(0) rotate(0); }
  12% { transform: translateY(-0.3%) rotate(-0.3deg); }
  36% { transform: translateY(-0.4%) rotate(-0.4deg); }
  62% { transform: translateY(-0.25%) rotate(-0.25deg); }
}
@keyframes mascot-tap {
  0%, 100% { transform: rotate(0) scaleY(1); }
  30% { transform: rotate(-2deg) scaleY(0.985); }
  65% { transform: rotate(0.8deg) scaleY(1.01); }
}
@media (prefers-reduced-motion: reduce) {
  .mascot-rise, .mascot-tail, .mascot-arm, .mascot-paw { animation: none; }
}
`;

// Size is passed as an inline width so it holds even if styles load late.
export default function Mascot({
  width,
  className = '',
  sizes = '320px',
  backdrop = false,
}: {
  width: string;
  className?: string;
  sizes?: string;
  // A pale disc behind him, for dark backgrounds where the purple hoodie
  // would otherwise blend in.
  backdrop?: boolean;
}) {
  if (!MASCOT_ENABLED) return null;

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width,
        maxWidth: '100%',
        aspectRatio: '1 / 1',
      }}
    >
      <style>{MASCOT_CSS}</style>
      {backdrop ? (
        <>
          {/* A darker purple ring behind the light circle, like the frames
              behind the hero photos on other pages. */}
          <span
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '9999px',
              background: 'var(--color-brand-800)',
            }}
          />
          <span
            aria-hidden
            style={{
              position: 'absolute',
              inset: '1rem',
              borderRadius: '9999px',
              background: 'var(--color-brand-50)',
              border: '3px solid var(--color-accent-400)',
            }}
          />
        </>
      ) : null}
      <div
        className="mascot-rise"
        style={{ position: 'absolute', inset: backdrop ? '13%' : 0 }}
      >
        {/* Back to front. The paw rides on the arm and taps on its own; the
            laptop sits above both. */}
        <Image
          src="/images/mascot/tail.webp"
          alt=""
          fill
          sizes={sizes}
          className="mascot-tail"
          style={{ objectFit: 'contain' }}
        />
        <Image
          src="/images/mascot/body.webp"
          alt={ALT}
          fill
          sizes={sizes}
         
          style={{ objectFit: 'contain' }}
        />
        <div className="mascot-layer mascot-arm">
          <Image
            src="/images/mascot/arm.webp"
            alt=""
            fill
            sizes={sizes}
           
            style={{ objectFit: 'contain' }}
          />
          <Image
            src="/images/mascot/paw.webp"
            alt=""
            fill
            sizes={sizes}
            className="mascot-paw"
            style={{ objectFit: 'contain' }}
          />
        </div>
        <Image
          src="/images/mascot/laptop.webp"
          alt=""
          fill
          sizes={sizes}
         
          style={{ objectFit: 'contain' }}
        />
      </div>
    </div>
  );
}
