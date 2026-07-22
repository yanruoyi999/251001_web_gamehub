'use client';

import { SlidersHorizontal } from 'lucide-react';
import { type ReactNode, useId, useState } from 'react';
import clsx from 'clsx';

interface CollapsibleGameFiltersProps {
  children: ReactNode;
  defaultOpen?: boolean;
  showLabel: string;
  hideLabel: string;
}

export function CollapsibleGameFilters({
  children,
  defaultOpen = false,
  showLabel,
  hideLabel,
}: CollapsibleGameFiltersProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <>
      <button
        type="button"
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground shadow-sm transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
        aria-controls={contentId}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        {open ? hideLabel : showLabel}
      </button>
      <div
        id={contentId}
        className={clsx(
          'gap-4 md:grid md:grid-cols-2 lg:grid-cols-3',
          open ? 'grid' : 'hidden',
        )}
      >
        {children}
      </div>
    </>
  );
}
