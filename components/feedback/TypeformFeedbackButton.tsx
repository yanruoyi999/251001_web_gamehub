"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
        className="fixed bottom-5 right-5 z-40 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground shadow-lg transition hover:bg-accent"
      >
        {isZh ? '反馈问题' : 'Feedback'}
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
      className="fixed bottom-5 right-5 z-40 rounded-full border border-primary/20 bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg transition hover:bg-primary/90"
    >
      {isZh ? '反馈问题' : 'Feedback'}
    </a>
  );
}
