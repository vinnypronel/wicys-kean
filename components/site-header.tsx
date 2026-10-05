'use client';

import { ArrowRight, Mail, MessagesSquare, Search, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { InstagramGlyph, LinkedinGlyph } from '@/components/brand-icons';
import SiteSearch from '@/components/site-search';

const NAV_LINKS = [
  { href: '/events', label: 'Events' },
  { href: '/eboard', label: 'E-Board' },
  { href: '/get-involved', label: 'Get Involved' },
  { href: '/ctf', label: 'CTF' },
  { href: '/sponsors', label: 'Sponsors' },
  { href: '/donate', label: 'Donate' },
  { href: '/resources', label: 'Resources' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

export type HeaderSocial = {
  label: keyof typeof SOCIAL_ICONS;
  href: string;
};

const SOCIAL_ICONS = {
  Discord: MessagesSquare,
  Instagram: InstagramGlyph,
  LinkedIn: LinkedinGlyph,
  Email: Mail,
};

function Logo({ preload = false }: { preload?: boolean }) {
  return (
    <Image
      src="/images/wicys-logo.png"
      alt="WiCyS - Women in CyberSecurity"
      width={583}
      height={244}
      preload={preload}
      className="h-10 w-auto"
    />
  );
}

export default function SiteHeader({
  socials,
}: {
  socials: HeaderSocial[];
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (menuOpen) setMenuOpen(false);
    if (searchOpen) setSearchOpen(false);
  }

  const toggleSearch = () => {
    setMenuOpen(false);
    setSearchOpen((current) => !current);
  };

  // Ctrl/Cmd+K or "/" opens search, Escape closes it.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT' ||
        target?.isContentEditable;
      if ((event.key === 'k' && (event.metaKey || event.ctrlKey)) || (event.key === '/' && !typing)) {
        event.preventDefault();
        setMenuOpen(false);
        setSearchOpen(true);
      } else if (event.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 8);
    updateScrolled();
    window.addEventListener('scroll', updateScrolled, { passive: true });
    return () => window.removeEventListener('scroll', updateScrolled);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const closeMenu = () => setMenuOpen(false);
  const overlayLinks = [{ href: '/', label: 'Home' }, ...NAV_LINKS];
  const transparentAtTop = pathname === '/' && !scrolled && !menuOpen && !searchOpen;
  const iconButtonTone = transparentAtTop
    ? 'text-white/90 hover:bg-white/10 hover:text-white'
    : 'text-ink-soft hover:bg-brand-50 hover:text-brand-700';

  return (
    <>
      <header
        className={`${pathname === '/' ? 'fixed' : 'sticky'} top-0 z-50 w-full border-b transition-[background-color,border-color,box-shadow] duration-300 ${
          transparentAtTop
            ? 'site-header-overlay border-transparent bg-transparent shadow-none'
            : `bg-white/95 shadow-sm backdrop-blur ${menuOpen ? 'border-transparent' : 'border-brand-100'}`
        }`}
      >
        <div className="container-site relative z-50 flex h-16 items-center justify-between gap-4 lg:h-[72px]">
          <Link
            href="/"
            aria-label="WiCyS Kean University home"
            onClick={menuOpen ? closeMenu : undefined}
            className="flex items-center transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.04] focus-visible:-translate-y-0.5 focus-visible:scale-[1.04]"
          >
            <Logo preload />
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-4 min-[1100px]:gap-6 xl:gap-7 lg:flex"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`group relative whitespace-nowrap py-1 text-sm font-medium transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:origin-right hover:after:origin-left after:rounded-sm after:bg-accent-400 after:transition-transform after:duration-300 ${
                  transparentAtTop
                    ? 'text-white/90 after:scale-x-0 hover:text-white hover:after:scale-x-100'
                    : isActive(link.href)
                    ? 'text-brand-700 after:scale-x-100'
                    : 'text-ink-soft after:scale-x-0 hover:text-brand-700 hover:after:scale-x-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={toggleSearch}
              aria-label={searchOpen ? 'Close search' : 'Search this site'}
              aria-expanded={searchOpen}
              className={`grid h-9 w-9 place-items-center rounded-lg transition-colors ${iconButtonTone}`}
            >
              {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>
            <Link
              href="/join"
              className="btn-green px-4 py-2"
            >
              Join WiCyS
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>

          <div className="flex items-center gap-1 lg:hidden">
          {menuOpen ? null : (
            <button
              type="button"
              onClick={toggleSearch}
              aria-label={searchOpen ? 'Close search' : 'Search this site'}
              aria-expanded={searchOpen}
              className={`relative z-50 grid h-10 w-10 place-items-center rounded-lg transition-colors ${iconButtonTone}`}
            >
              {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>
          )}
          {menuOpen ? (
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-takeover"
              className="relative z-50 grid h-10 w-10 place-items-center rounded-lg"
            >
              <span
                aria-hidden="true"
                className="nav-burger-stack nav-burger-open"
              >
                <span className="nav-burger-bar nav-burger-bar-top" />
                <span className="nav-burger-bar nav-burger-bar-mid" />
                <span className="nav-burger-bar nav-burger-bar-bot" />
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setMenuOpen(true);
              }}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-takeover"
              className="relative z-50 grid h-10 w-10 place-items-center rounded-lg lg:hidden"
            >
              <span aria-hidden="true" className="nav-burger-stack">
                <span className="nav-burger-bar nav-burger-bar-top" />
                <span className="nav-burger-bar nav-burger-bar-mid" />
                <span className="nav-burger-bar nav-burger-bar-bot" />
              </span>
            </button>
          )}
          </div>
        </div>
      </header>

      <SiteSearch open={searchOpen} onClose={() => setSearchOpen(false)} />

      <div
        id="mobile-nav-takeover"
        data-lenis-prevent
        className={`nav-takeover lg:hidden${menuOpen ? ' open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <ul className="nav-takeover-links">
          {overlayLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={closeMenu}
                tabIndex={menuOpen ? 0 : -1}
                className={`nav-takeover-link${isActive(link.href) ? ' active' : ''}`}
              >
                <span className="nav-takeover-glyph" aria-hidden="true" />
                {link.label}
                <span className="nav-takeover-glyph" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-takeover-bottom">
          <Link
            href="/join"
            onClick={closeMenu}
            tabIndex={menuOpen ? 0 : -1}
            className="btn-green w-full max-w-xs"
          >
            Join WiCyS
            <ArrowRight className="h-4 w-4" />
          </Link>
          {socials.length > 0 ? (
            <div className="nav-takeover-socials">
              {socials.map((social) => {
                const Icon = SOCIAL_ICONS[social.label];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    tabIndex={menuOpen ? 0 : -1}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          ) : null}
          <p className="nav-takeover-tagline">
            Women in CyberSecurity at Kean University
          </p>
        </div>
      </div>
    </>
  );
}
