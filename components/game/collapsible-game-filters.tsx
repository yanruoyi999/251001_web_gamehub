import { SlidersHorizontal } from 'lucide-react';
import { type ReactNode } from 'react';

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
  return (
    <>
      <input
        id="game-filter-toggle"
        type="checkbox"
        className="peer sr-only md:hidden"
        defaultChecked={defaultOpen}
        aria-controls="advanced-game-filters"
      />
      <label
        htmlFor="game-filter-toggle"
        className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground shadow-sm transition hover:bg-accent peer-checked:hidden peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring md:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        <span>{showLabel}</span>
      </label>
      <label
        htmlFor="game-filter-toggle"
        className="hidden min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground shadow-sm transition hover:bg-accent peer-checked:flex peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring md:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        <span>{hideLabel}</span>
      </label>
      <div
        id="advanced-game-filters"
        className="hidden gap-4 peer-checked:grid md:grid md:grid-cols-2 lg:grid-cols-3"
      >
        {children}
      </div>
    </>
  );
}
