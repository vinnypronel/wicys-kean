// Set NEXT_PUBLIC_SITE_URL once the chapter has a custom domain. Until then the
// Vercel production URL is used for share previews and the sitemap.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')
).replace(/\/$/, '');

export const SITE_NAME = 'WiCyS Kean University Student Chapter';
