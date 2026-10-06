'use client';

import { ArrowRight, CornerDownLeft, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useRef, useState } from 'react';

import type { SearchItem } from '@/lib/search';

const MAX_RESULTS = 8;

const SUGGESTIONS = [
  { label: 'Events', href: '/events' },
  { label: 'Join WiCyS', href: '/join' },
  { label: 'CTF', href: '/ctf' },
  { label: 'Sponsor us', href: '/sponsors' },
  { label: 'Resources', href: '/resources' },
];

function normalize(value: string) {
  return value.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');
}

function scoreItem(item: SearchItem, terms: string[]): number {
  const title = normalize(item.title);
  const description = normalize(item.description ?? '');
  const keywords = normalize(`${item.type} ${item.keywords ?? ''}`);
  const pageKeywords = item.type === 'Page' ? keywords.split(/\s+/) : [];
  let score = 0;
  for (const term of terms) {
    if (title.startsWith(term)) score += 10;
    else if (pageKeywords.includes(term)) score += 8;
    else if (title.split(/\s+/).some((word) => word.startsWith(term))) score += 7;
    else if (title.includes(term)) score += 5;
    else if (description.includes(term)) score += 3;
    else if (keywords.includes(term)) score += 1;
    else return 0;
  }
  // Pages win ties so "events" finds the Events page before a single event.
  return item.type === 'Page' ? score + 0.5 : score;
}

let cachedIndex: SearchItem[] | null = null;

export default function SiteSearch({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [index, setIndex] = useState<SearchItem[] | null>(cachedIndex);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  // Load the index the first time the bar opens.
  useEffect(() => {
    if (!open || index) return;
    let cancelled = false;
    fetch('/api/search')
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((items: SearchItem[]) => {
        cachedIndex = items;
        if (!cancelled) setIndex(items);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [open, index]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => window.clearTimeout(timer);
  }, [open]);

  const results = useMemo(() => {
    const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
    if (!index || terms.length === 0) return [];
    return index
      .map((item) => ({ item, score: scoreItem(item, terms) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_RESULTS)
      .map((entry) => entry.item);
  }, [index, query]);

  const go = (href: string) => {
    setQuery('');
    setActive(0);
    onClose();
    router.push(href);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((current) => Math.min(current + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((current) => Math.max(current - 1, 0));
    } else if (event.key === 'Enter') {
      const target = results[active];
      if (target) {
        event.preventDefault();
        go(target.href);
      }
    }
  };

  const hasQuery = query.trim().length > 0;

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`site-search-backdrop${open ? ' open' : ''}`}
      />
      <div
        role="search"
        aria-hidden={!open}
        className={`site-search-panel${open ? ' open' : ''}`}
      >
        <div className="site-search-inner">
          <div className="container-site py-4 sm:py-5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-400" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeyDown}
                tabIndex={open ? 0 : -1}
                placeholder="Search events, people, resources..."
                aria-label="Search this site"
                role="combobox"
                aria-expanded={hasQuery && results.length > 0}
                aria-controls={listId}
                aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
                autoComplete="off"
                spellCheck={false}
                className="block w-full rounded-lg border border-brand-100 bg-white py-3.5 pl-12 pr-12 text-base text-ink placeholder:text-ink-soft/60 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 [&::-webkit-search-cancel-button]:hidden"
              />
              <button
                type="button"
                onClick={onClose}
                tabIndex={open ? 0 : -1}
                aria-label="Close search"
                className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-3" aria-live="polite">
              {!hasQuery ? (
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                    Popular
                  </span>
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion.href}
                      type="button"
                      tabIndex={open ? 0 : -1}
                      onClick={() => go(suggestion.href)}
                      className="font-medium text-brand-700 underline-offset-4 transition-colors hover:text-accent-700 hover:underline"
                    >
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              ) : failed ? (
                <p className="py-2 text-sm text-ink-soft">Search is unavailable right now. Please try again later.</p>
              ) : !index ? (
                <p className="py-2 text-sm text-ink-soft">Loading...</p>
              ) : results.length === 0 ? (
                <p className="py-2 text-sm text-ink-soft">
                  No results for &ldquo;{query.trim()}&rdquo;. Try another word, or{' '}
                  <button
                    type="button"
                    onClick={() => go('/contact')}
                    className="font-semibold text-brand-700 underline underline-offset-4 hover:text-accent-700"
                  >
                    contact us
                  </button>
                  .
                </p>
              ) : (
                <ul id={listId} role="listbox" aria-label="Search results" className="site-search-results">
                  {results.map((item, i) => (
                    <li
                      key={`${item.type}-${item.href}-${item.title}`}
                      id={`${listId}-${i}`}
                      role="option"
                      aria-selected={i === active}
                    >
                      <button
                        type="button"
                        tabIndex={-1}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => go(item.href)}
                        className={`group relative flex w-full items-center gap-4 overflow-hidden rounded-lg px-3 py-2.5 text-left transition-colors duration-200 before:absolute before:inset-y-0 before:left-0 before:w-1 before:origin-top before:scale-y-0 before:bg-accent-400 before:transition-transform before:duration-200 hover:bg-brand-100 hover:before:scale-y-100 ${
                          i === active ? 'bg-brand-50' : ''
                        }`}
                      >
                        <span className="w-20 shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-700">
                          {item.type}
                        </span>
                        <span className="min-w-0 flex-1 transition-transform duration-200 group-hover:translate-x-1">
                          <span className="block truncate text-sm font-semibold text-ink transition-colors duration-200 group-hover:text-brand-700">{item.title}</span>
                          {item.description ? (
                            <span className="block truncate text-xs text-ink-soft">{item.description}</span>
                          ) : null}
                        </span>
                        {i === active ? (
                          <CornerDownLeft className="hidden h-4 w-4 shrink-0 text-brand-400 transition-colors duration-200 group-hover:text-brand-700 sm:block" />
                        ) : (
                          <ArrowRight className="h-4 w-4 shrink-0 text-brand-300 sm:hidden" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
