"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLocalizedPath } from '@/i18n/config';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { trackEvent } from '@/lib/gtag';

interface SearchInputProps {
  locale: string;
}

interface SuggestionItem {
  id: number;
  title: string;
  titleEn?: string | null;
  slug?: string | null;
}

export function SearchInput({ locale }: SearchInputProps) {
  const router = useRouter();
  const t = useTranslations('nav');

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const blurTimeout = useRef<NodeJS.Timeout>();

  const trimmedQuery = query.trim();

  useEffect(() => {
    if (trimmedQuery.length < 2) {
      setSuggestions([]);
      setLoading(false);
      setOpen(false);
      if (abortRef.current) {
        abortRef.current.abort();
      }
      return;
    }

    setLoading(true);
    setOpen(true);

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

        const data = await response.json();

        const matches: SuggestionItem[] = Array.isArray(data.games)
          ? data.games
              .map((item: any) => {
                const id = Number(item.id ?? item.gameId ?? item.objectID);
                if (!Number.isInteger(id)) return null;
                return {
                  id,
                  title: item.title ?? item.name ?? '',
                  titleEn: item.titleEn ?? item.title_en ?? item.name_en ?? null,
                  slug: item.slug ?? item.slugified ?? null,
                } as SuggestionItem;
              })
              .filter(Boolean) as SuggestionItem[]
          : [];

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
      if (blurTimeout.current) {
        clearTimeout(blurTimeout.current);
      }
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
    [locale, router, trimmedQuery]
  );

  const suggestionList = useMemo(() => {
    if (!open) return null;

    if (loading) {
      return (
        <li className="px-3 py-2 text-sm text-gray-500">
          {t('searchLoading')}
        </li>
      );
    }

    if (suggestions.length === 0) {
      return (
        <li className="px-3 py-2 text-sm text-gray-400">
          {t('searchNoResult')}
        </li>
      );
    }

    return suggestions.map((item) => (
      <li key={item.id}>
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => handleSelect(item)}
          className="flex w-full items-start gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
        >
          <span className="line-clamp-1 font-medium text-gray-900">
            {locale === 'en' ? item.titleEn ?? item.title : item.title}
          </span>
        </button>
      </li>
    ));
  }, [open, loading, suggestions, locale, t, handleSelect]);

  return (
    <div className="relative hidden w-64 md:block">
      <form onSubmit={handleSubmit}>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {
            if (suggestions.length > 0 || loading) {
              setOpen(true);
            }
          }}
          onBlur={() => {
            blurTimeout.current = setTimeout(() => setOpen(false), 120);
          }}
          onKeyDown={() => {
            if (blurTimeout.current) {
              clearTimeout(blurTimeout.current);
            }
          }}
          placeholder={t('searchPlaceholder')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </form>
      {open ? (
        <ul
          className={clsx(
            'absolute left-0 right-0 top-full z-30 mt-2 rounded-md border border-gray-200 bg-white shadow-lg',
            'max-h-72 overflow-y-auto'
          )}
        >
          {suggestionList}
        </ul>
      ) : null}
    </div>
  );
}
