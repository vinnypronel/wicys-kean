// Set NEXT_PUBLIC_SITE_URL once the chapter has a custom domain. Until then the
// Vercel production URL is used for share previews and the sitemap.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')
).replace(/\/$/, '');

export const SITE_NAME = 'WiCyS Kean University Student Chapter';

// The one question every e-board member answers for their card. Change it
// here, and ask the board for new answers, when a new board takes over.
export const EBOARD_QUESTION = 'What got you into cybersecurity?';

// The Kean cougar in a WiCyS hoodie, shown on the 404 and CTF pages. Built from
// the Kean CTF site's artwork with the hoodie recolored (layers in
// public/images/mascot). Set to false to hide him.
export const MASCOT_ENABLED = true;
