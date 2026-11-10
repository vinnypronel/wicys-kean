import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the e-board interest form carry a resume up to 4MB (the form
  // checks the limit; Vercel caps requests at 4.5MB).
  experimental: {
    serverActions: {
      bodySizeLimit: '4.5mb',
    },
  },
  turbopack: {
    root: process.cwd(),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75],
    deviceSizes: [640, 828, 1080, 1280, 1920],
  },
  // Pages re-read content/ when they revalidate, so ship it with the server.
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
  async redirects() {
    return [
      // The Join page was folded into Get Involved.
      { source: "/join", destination: "/get-involved#join", permanent: true },
      // The Vercel address sends visitors and search engines to the real
      // domain, so Google never sees two copies of the site.
      {
        source: "/:path*",
        has: [{ type: "host", value: "wicys-kean.vercel.app" }],
        destination: "https://www.wicyskean.me/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/keystatic/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
