import { normalizeEnglishStaticHtml } from '../scripts/static-locale-html';

describe('static English locale HTML normalization', () => {
  test('patches an English route that was rendered with zh locale markers', () => {
    const result = normalizeEnglishStaticHtml(
      '<!doctype html><html lang="zh" data-locale="zh"><body>page</body></html>',
      'en/example.html',
    );

    expect(result.status).toBe('patched');
    expect(result.html).toContain('<html lang="en" data-locale="en">');
  });

  test('accepts an already-correct English route without rewriting it', () => {
    const html = '<!doctype html><html lang="en" data-locale="en"><body>page</body></html>';
    const result = normalizeEnglishStaticHtml(html, 'en/example.html');

    expect(result).toEqual({ html, status: 'already-correct' });
  });

  test('classifies Next redirect/error shells separately from localized pages', () => {
    const html = '<!doctype html><html id="__next_error__"><body>redirect shell</body></html>';
    const result = normalizeEnglishStaticHtml(
      html,
      'en/game/popcorn/how-to-play.html',
    );

    expect(result).toEqual({ html, status: 'next-error-shell' });
  });

  test('still fails closed on an unknown normal page without locale markers', () => {
    expect(() =>
      normalizeEnglishStaticHtml(
        '<!doctype html><html><body>unexpected</body></html>',
        'en/unexpected.html',
      ),
    ).toThrow(/Unrecognized locale markers/);
  });
});
