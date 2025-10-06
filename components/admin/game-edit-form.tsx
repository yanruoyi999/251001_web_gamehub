"use client";

import { FormEvent, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

interface Option {
  id: number;
  name: string;
}

interface AdminGameEditFormProps {
  game: {
    id: number;
    title: string;
    titleEn?: string | null;
    slug: string;
    status: string;
    description?: string | null;
    descriptionEn?: string | null;
    thumbnailUrl?: string | null;
    iframeUrl: string;
    isNew?: boolean | null;
    isHot?: boolean | null;
    featured?: boolean | null;
    categoryIds: number[];
    tagIds: number[];
  };
  categories: Option[];
  tags: Option[];
}

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

export function AdminGameEditForm({ game, categories, tags }: AdminGameEditFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(game.title);
  const [slug, setSlug] = useState(game.slug);
  const [status, setStatus] = useState(game.status ?? 'active');
  const [description, setDescription] = useState(game.description ?? '');
  const [thumbnailUrl, setThumbnailUrl] = useState(game.thumbnailUrl ?? '');
  const [iframeUrl, setIframeUrl] = useState(game.iframeUrl);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(game.categoryIds);
  const [selectedTags, setSelectedTags] = useState<number[]>(game.tagIds);
  const [isNew, setIsNew] = useState(Boolean(game.isNew));
  const [isHot, setIsHot] = useState(Boolean(game.isHot));
  const [featured, setFeatured] = useState(Boolean(game.featured));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const categoryMap = useMemo(() => new Map(categories.map((item) => [item.id, item])), [categories]);
  const tagMap = useMemo(() => new Map(tags.map((item) => [item.id, item])), [tags]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      setError(null);
      setSuccess(null);

      try {
        const response = await fetch(`/api/admin/games/${game.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            slug,
            status,
            description: description.trim() || null,
            thumbnailUrl: thumbnailUrl.trim() || null,
            iframeUrl: iframeUrl.trim(),
            isNew,
            isHot,
            featured,
            categoryIds: selectedCategories,
            tagIds: selectedTags,
          }),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error ?? 'Failed to update');
        }

        setSuccess('Game updated successfully.');
        router.refresh();
      } catch (err) {
        console.error('Failed to update game', err);
        setError(err instanceof Error ? err.message : 'Failed to update');
      }
    });
  };

  const handleCheckboxChange = (id: number, current: number[], setter: (value: number[]) => void) => {
    if (current.includes(id)) {
      setter(current.filter((item) => item !== id));
    } else {
      setter([...current, id]);
    }
  };

  const resolvedCategories = selectedCategories.filter((id) => categoryMap.has(id));
  const resolvedTags = selectedTags.filter((id) => tagMap.has(id));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Slug
          </label>
          <input
            type="text"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            required
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Status
          </label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Game URL (iframe)
          </label>
          <input
            type="url"
            value={iframeUrl}
            onChange={(event) => setIframeUrl(event.target.value)}
            required
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Description
        </label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Thumbnail URL
          </label>
          <input
            type="url"
            value={thumbnailUrl}
            onChange={(event) => setThumbnailUrl(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="https://..."
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <label className="flex items-center gap-2 text-xs text-slate-300">
            <input
              type="checkbox"
              checked={isNew}
              onChange={(event) => setIsNew(event.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-indigo-500"
            />
            New
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-300">
            <input
              type="checkbox"
              checked={isHot}
              onChange={(event) => setIsHot(event.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-indigo-500"
            />
            Hot
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-300">
            <input
              type="checkbox"
              checked={featured}
              onChange={(event) => setFeatured(event.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-indigo-500"
            />
            Featured
          </label>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Categories</p>
          <div className="grid gap-2 border border-slate-800 bg-slate-900/60 p-3 text-xs">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center gap-2 text-slate-300">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCheckboxChange(category.id, selectedCategories, setSelectedCategories)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-indigo-500"
                />
                {category.name}
              </label>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tags</p>
          <div className="grid gap-2 border border-slate-800 bg-slate-900/60 p-3 text-xs">
            {tags.map((tag) => (
              <label key={tag.id} className="flex items-center gap-2 text-slate-300">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => handleCheckboxChange(tag.id, selectedTags, setSelectedTags)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-indigo-500"
                />
                {tag.name}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2 text-xs text-slate-400">
        <p>
          Selected categories:{' '}
          {resolvedCategories.length
            ? resolvedCategories.map((id) => categoryMap.get(id)?.name).join(', ')
            : 'None'}
        </p>
        <p>
          Selected tags:{' '}
          {resolvedTags.length ? resolvedTags.map((id) => tagMap.get(id)?.name).join(', ') : 'None'}
        </p>
      </div>

      {error ? (
        <div className="rounded-md border border-rose-700 bg-rose-900/40 px-4 py-2 text-sm text-rose-200">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="rounded-md border border-emerald-700 bg-emerald-900/40 px-4 py-2 text-sm text-emerald-200">
          {success}
        </div>
      ) : null}

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : 'Save changes'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setTitle(game.title);
            setSlug(game.slug);
            setStatus(game.status ?? 'active');
            setDescription(game.description ?? '');
            setThumbnailUrl(game.thumbnailUrl ?? '');
            setIframeUrl(game.iframeUrl);
            setSelectedCategories(game.categoryIds);
            setSelectedTags(game.tagIds);
            setIsNew(Boolean(game.isNew));
            setIsHot(Boolean(game.isHot));
            setFeatured(Boolean(game.featured));
            setError(null);
            setSuccess(null);
          }}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
