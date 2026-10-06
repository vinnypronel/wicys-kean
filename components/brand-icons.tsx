type IconProps = {
  className?: string;
};

export function LinkedinGlyph({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V9h4v1.5" />
      <rect width="4" height="11" x="2" y="10" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function InstagramGlyph({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

// Full-color brand logos. Discord glyph path from Simple Icons (CC0).
export function DiscordLogo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="#5865F2"
        d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"
      />
    </svg>
  );
}

export function InstagramLogo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <defs>
        <radialGradient id="instagram-logo-gradient" cx="0.3" cy="1.07" r="1.2">
          <stop offset="0" stopColor="#FFDD55" />
          <stop offset="0.1" stopColor="#FFDD55" />
          <stop offset="0.5" stopColor="#FF543E" />
          <stop offset="1" stopColor="#C837AB" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#instagram-logo-gradient)" />
      <rect
        x="5"
        y="5"
        width="14"
        height="14"
        rx="4"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3.3" fill="none" stroke="#ffffff" strokeWidth="1.8" />
      <circle cx="16.2" cy="7.8" r="1.05" fill="#ffffff" />
    </svg>
  );
}

// Drawn to match the current Outlook app icon (envelope with the "O" tile).
export function OutlookLogo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className}>
      <defs>
        <linearGradient id="outlook-logo-body" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#1FA2F0" />
          <stop offset="1" stopColor="#6A7BF5" />
        </linearGradient>
        <linearGradient id="outlook-logo-band" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#2A7DE8" />
          <stop offset="1" stopColor="#3E3FC9" />
        </linearGradient>
        <linearGradient id="outlook-logo-fold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#58C3FA" />
          <stop offset="1" stopColor="#2F8BEB" />
        </linearGradient>
        <linearGradient id="outlook-logo-tile" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2C86E8" />
          <stop offset="1" stopColor="#1747B8" />
        </linearGradient>
      </defs>
      <path
        fill="url(#outlook-logo-body)"
        d="M8 17.2 21.4 8.3a4.8 4.8 0 0 1 5.2 0L40 17.2a4.4 4.4 0 0 1 2 3.7V37a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5V20.9a4.4 4.4 0 0 1 2-3.7Z"
      />
      <path
        fill="url(#outlook-logo-band)"
        d="M16 26.5 38.6 15.8 40 17.2a4.4 4.4 0 0 1 2 3.7v1.6L19.4 33.6Z"
      />
      <path
        fill="url(#outlook-logo-fold)"
        opacity="0.9"
        d="M24.5 29.6 42 21.4V37a5 5 0 0 1-5 5H24.5l6-5.6Z"
      />
      <rect x="2" y="20" width="19" height="19" rx="4.5" fill="url(#outlook-logo-tile)" />
      <ellipse cx="11.5" cy="29.5" rx="4.1" ry="4.9" fill="none" stroke="#ffffff" strokeWidth="2.6" />
    </svg>
  );
}

export function LinkedinLogo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <circle cx="7.1" cy="7.2" r="1.75" fill="#ffffff" />
      <rect x="5.6" y="10" width="3" height="8.5" fill="#ffffff" />
      <path
        fill="#ffffff"
        d="M10.6 10h2.9v1.3c.5-.9 1.6-1.6 3-1.6 2.9 0 3.5 1.9 3.5 4.4v4.4h-3v-3.9c0-1.1-.1-2.3-1.5-2.3s-1.8 1-1.8 2.2v4h-3.1z"
      />
    </svg>
  );
}
