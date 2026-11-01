"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLocalizedPath } from '@/i18n/config';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { Search } from 'lucide-react';
import { trackEvent } from '@/lib/gtag';

interface SearchInputProps {
  locale: string;
  className?: string;
  variant?: 'default' | 'header';
}

interface SuggestionItem {
  id: number;
  title: string;
  titleEn?: string | null;
  slug?: string | null;
}

interface SearchApiItem {
  id?: unknown;
  gameId?: unknown;
  objectID?: unknown;
  title?: unknown;
  name?: unknown;
  titleEn?: unknown;
  title_en?: unknown;
  name_en?: unknown;
  slug?: unknown;
  slugified?: unknown;
}

function toOptionalString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null;
}

export function SearchInput({
  locale,
  className,
  variant = 'default',
}: SearchInputProps) {
  const router = useRouter();
  const t = useTranslations('nav');

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const composingRef = useRef(false);
  const suppressFocusOpen = useRef(false);

  const trimmedQuery = query.trim();

  useEffect(() => {
    if (trimmedQuery.length < 2) {
      setSuggestions([]);
      setLoading(false);
      setOpen(false);
      abortRef.current?.abort();
      return;
    }

    setLoading(true);
    setOpen(document.activeElement === inputRef.current);

    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(trimmedQuery)}&limit=5`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Search request failed with status ${response.status}`);
        }

        const data = await response.json() as { games?: unknown };
        const rawGames = Array.isArray(data.games) ? data.games : [];
        const matches = rawGames
          .map((rawItem): SuggestionItem | null => {
            const item = rawItem as SearchApiItem;
            const id = Number(item.id ?? item.gameId ?? item.objectID);
            const title = toOptionalString(item.title ?? item.name);
            if (!Number.isInteger(id) || !title) return null;

            return {
              id,
              title,
              titleEn: toOptionalString(item.titleEn ?? item.title_en ?? item.name_en),
              slug: toOptionalString(item.slug ?? item.slugified),
            };
          })
          .filter((item): item is SuggestionItem => item !== null);

        setSuggestions(matches);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error('搜索建议获取失败', error);
        setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmedQuery]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (composingRef.current) return;
    const nextQuery = trimmedQuery;
    if (!nextQuery) return;
    setOpen(false);
    trackEvent('search_submit', {
      query: nextQuery,
      locale,
      suggestion_count: suggestions.length,
    });
    router.push(`${getLocalizedPath(locale, '/search')}?q=${encodeURIComponent(nextQuery)}`);
  };

  const handleSelect = useCallback(
    (item: SuggestionItem) => {
      const currentQuery = trimmedQuery;
      setOpen(false);
      setQuery('');
      const target = item.slug ?? String(item.id);
      trackEvent('search_suggestion_click', {
        query: currentQuery || undefined,
        locale,
        suggestion_id: item.id,
        suggestion_slug: item.slug ?? undefined,
      });
      router.push(getLocalizedPath(locale, `/games/${target}`));
    },
    [locale, router, trimmedQuery],
  );

  const suggestionList = useMemo(() => {
    if (!open) return null;

    if (loading) {
      return (
        <li className="px-3 py-2 text-sm text-muted-foreground">
          {t('searchLoading')}
        </li>
      );
    }

    if (suggestions.length === 0) {
      return (
        <li className="px-3 py-2 text-sm text-muted-foreground">
          {t('searchNoResult')}
        </li>
      );
    }

    return suggestions.map((item) => (
      <li key={item.id}>
        <button
          type="button"
          tabIndex={0}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => handleSelect(item)}
          className="flex min-h-11 w-full items-start gap-2 px-3 py-2 text-left text-sm text-popover-foreground hover:bg-accent"
        >
          <span className="line-clamp-1 font-medium text-popover-foreground">
            {locale === 'en' ? item.titleEn ?? item.title : item.title}
          </span>
        </button>
      </li>
    ));
  }, [open, loading, suggestions, locale, t, handleSelect]);

  return (
    <div
      className={clsx('relative', className)}
      data-site-search={variant}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Escape' || composingRef.current || event.nativeEvent.isComposing) return;
        event.preventDefault();
        suppressFocusOpen.current = true;
        inputRef.current?.focus();
        suppressFocusOpen.current = false;
        setOpen(false);
      }}
    >
      <form action={getLocalizedPath(locale, '/search')} method="get" onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="search"
          name="q"
          aria-label={t('searchPlaceholder')}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onCompositionStart={() => { composingRef.current = true; }}
          onCompositionEnd={() => { composingRef.current = false; }}
          onFocus={() => {
            if (!suppressFocusOpen.current && (suggestions.length > 0 || loading)) setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && (composingRef.current || event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229)) event.preventDefault();
          }}
          placeholder={t('searchPlaceholder')}
          className={clsx(
            'min-h-11 w-full rounded-md border py-2 pl-3 pr-12 text-sm shadow-sm focus:outline-none focus:ring-2',
            variant === 'header'
              ? 'border-white/15 bg-white/10 text-white placeholder:text-white/55 focus:border-emerald-300 focus:ring-emerald-300/30'
              : 'border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-ring',
          )}
        />
        {open ? (
          <ul className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-md border border-border bg-popover text-popover-foreground shadow-lg">
            {suggestionList}
          </ul>
        ) : null}
        <button
          type="submit"
          tabIndex={0}
          aria-label={locale === 'zh' ? '提交搜索' : 'Submit search'}
          className={clsx(
            'absolute right-0 top-0 inline-flex h-11 w-11 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            variant === 'header' ? 'text-white' : 'text-foreground',
          )}
        >
          <Search className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
