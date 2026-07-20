"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

import { getLocalizedPath } from '@/i18n/config';
import { trackInteraction } from '@/lib/analytics/events';

const formUrl =
  process.env.NEXT_PUBLIC_GAMEHUB_TYPEFORM_URL ||
  process.env.NEXT_PUBLIC_TYPEFORM_URL ||
  '';
const formId =
  process.env.NEXT_PUBLIC_GAMEHUB_TYPEFORM_FORM_ID ||
  process.env.NEXT_PUBLIC_TYPEFORM_FORM_ID ||
  '';

function buildTypeformHref(locale: string, pathname: string | null) {
  const base = formUrl || (formId ? `https://form.typeform.com/to/${formId}` : '');
  if (!base) return '';

  const url = new URL(base);
  url.searchParams.set('source', 'gamehub');
  url.searchParams.set('locale', locale);
  if (pathname) {
    url.searchParams.set('page', pathname);
  }
  return url.toString();
}

interface TypeformFeedbackButtonProps {
  locale: string;
}

export function TypeformFeedbackButton({ locale }: TypeformFeedbackButtonProps) {
  const pathname = usePathname();
  const isZh = locale === 'zh';
  const label = isZh ? '反馈问题' : 'Feedback';
  const typeformHref = buildTypeformHref(locale, pathname);

  if (!typeformHref) {
    return (
      <Link
        href={getLocalizedPath(locale, '/contact')}
        onClick={() =>
          trackInteraction('feedback_open', {
            locale,
            page: pathname ?? '',
            source: 'contact_fallback',
          })
        }
        aria-label={label}
        title={label}
        className="z-40 mx-auto mb-[calc(1rem+env(safe-area-inset-bottom))] mt-4 inline-flex size-11 items-center justify-center rounded-full border border-border bg-background p-0 text-sm font-semibold text-foreground shadow-lg transition hover:bg-accent sm:fixed sm:bottom-5 sm:right-5 sm:m-0 sm:h-auto sm:w-auto sm:px-4 sm:py-2"
      >
        <MessageCircle className="size-5 sm:hidden" aria-hidden="true" />
        <span className="hidden sm:inline">{label}</span>
      </Link>
    );
  }

  return (
    <a
      href={typeformHref}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackInteraction('feedback_open', {
          locale,
          page: pathname ?? '',
          source: 'typeform',
        })
      }
      aria-label={label}
      title={label}
      className="z-40 mx-auto mb-[calc(1rem+env(safe-area-inset-bottom))] mt-4 inline-flex size-11 items-center justify-center rounded-full border border-primary/20 bg-primary p-0 text-sm font-semibold text-primary-foreground shadow-lg transition hover:bg-primary/90 sm:fixed sm:bottom-5 sm:right-5 sm:m-0 sm:h-auto sm:w-auto sm:px-4 sm:py-2"
    >
      <MessageCircle className="size-5 sm:hidden" aria-hidden="true" />
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}
