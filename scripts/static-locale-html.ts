export type EnglishHtmlNormalizationStatus =
  | 'patched'
  | 'already-correct'
  | 'next-error-shell';

const HTML_TAG = /<html\b[^>]*>/i;

function hasLocaleMarker(openingTag: string, locale: 'en' | 'zh') {
  return (
    new RegExp(`\\blang=["']${locale}["']`, 'i').test(openingTag) &&
    new RegExp(`\\bdata-locale=["']${locale}["']`, 'i').test(openingTag)
  );
}

function isNextErrorShell(openingTag: string) {
  return /\bid=["']__next_error__["']/i.test(openingTag);
}

export function normalizeEnglishStaticHtml(
  html: string,
  fileLabel = 'unknown English static HTML file',
): { html: string; status: EnglishHtmlNormalizationStatus } {
  const openingTag = html.match(HTML_TAG)?.[0];

  if (!openingTag) {
    throw new Error(`Missing <html> tag in ${fileLabel}`);
  }

  if (isNextErrorShell(openingTag)) {
    return { html, status: 'next-error-shell' };
  }

  if (hasLocaleMarker(openingTag, 'en')) {
    return { html, status: 'already-correct' };
  }

  if (!hasLocaleMarker(openingTag, 'zh')) {
    throw new Error(
      `Unrecognized locale markers in ${fileLabel}: ${openingTag}`,
    );
  }

  const normalizedTag = openingTag
    .replace(/\blang=["']zh["']/i, 'lang="en"')
    .replace(/\bdata-locale=["']zh["']/i, 'data-locale="en"');

  return {
    html: html.replace(openingTag, normalizedTag),
    status: 'patched',
  };
}
