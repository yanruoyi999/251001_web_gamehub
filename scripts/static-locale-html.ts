export type EnglishHtmlNormalizationStatus =
  | 'already-correct'
  | 'next-error-shell';

const HTML_TAG = /<html\b[^>]*>/i;
const KNOWN_NEXT_REDIRECT_SHELL_SUFFIXES = [
  '/en/game/popcorn/how-to-play.html',
] as const;

function hasLocaleMarker(openingTag: string, locale: 'en' | 'zh') {
  return (
    new RegExp(`\\blang=["']${locale}["']`, 'i').test(openingTag) &&
    new RegExp(`\\bdata-locale=["']${locale}["']`, 'i').test(openingTag)
  );
}

function isNextErrorShell(openingTag: string) {
  return /\bid=["']__next_error__["']/i.test(openingTag);
}

function isKnownNextRedirectShell(fileLabel: string) {
  const normalizedLabel = `/${fileLabel.replace(/\\/g, '/').replace(/^\/+/, '')}`;
  return KNOWN_NEXT_REDIRECT_SHELL_SUFFIXES.some((suffix) =>
    normalizedLabel.endsWith(suffix),
  );
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
    if (!isKnownNextRedirectShell(fileLabel)) {
      throw new Error(`Unexpected Next error shell in ${fileLabel}`);
    }

    return { html, status: 'next-error-shell' };
  }

  if (hasLocaleMarker(openingTag, 'en')) {
    return { html, status: 'already-correct' };
  }

  throw new Error(`Incorrect locale markers in ${fileLabel}: ${openingTag}`);
}

export function verifyChineseStaticHtml(html: string, fileLabel: string) {
  const openingTag = html.match(HTML_TAG)?.[0];
  if (!openingTag) throw new Error(`Missing <html> tag in ${fileLabel}`);
  if (isNextErrorShell(openingTag) && fileLabel.replace(/\\/g, '/').endsWith('zh/game/popcorn/how-to-play.html')) return 'next-error-shell' as const;
  if (!hasLocaleMarker(openingTag, 'zh')) throw new Error(`Incorrect locale markers in ${fileLabel}: ${openingTag}`);
  return 'already-correct' as const;
}
