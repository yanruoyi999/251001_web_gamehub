import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { getSeoLandingPage } from '@/lib/seo-landing-content';

describe('source-first Snake guides', () => {
  it('keeps the winning titles while making the short answer useful', () => {
    const mods = getSeoLandingPage('google-snake-mods')!;
    expect(mods.locales.en.metaTitle).toBe('Google Snake Mods: Mod Menu, More Menu, Mods 2 & Loader');
    expect(mods.locales.en.heading).toBe('Google Snake Mods: Mod Menu, More Menu, Loader & Mods 2');
    expect(mods.locales.en.sections[0].body.length).toBeLessThan(250);
    expect(mods.locales.en.sections[0].body).toMatch(/standard.*not.*modded/i);
    expect(mods.documentationCheckedAt).toBe('2026-09-15');
  });
  it('does not claim to host a working editor or a tested installation', () => {
    const editor = getSeoLandingPage('google-snake-level-editor')!;
    expect(editor.locales.en.heading).toBe('Google Snake Level Editor Guide: Presets, Challenges & Safe Setup');
    expect(editor.locales.en.sections[0].body).toMatch(/work in progress/i);
    expect(editor.locales.en.sections[0].body).toMatch(/does not contain a working editor/i);
    expect(editor.embedGame).toBeUndefined();
    expect(editor.documentationCheckedAt).toBe('2026-09-15');
  });
  it('promotes the existing counterpart link and removes the unrelated simulator block', () => {
    const page = readFileSync('app/[locale]/guides/[slug]/page.tsx', 'utf8');
    expect(page).not.toContain('related-spend-bill-gates-money');
    expect(page).toContain('earlyRelatedPage');
    expect(page).toContain('remainingRelatedPages');
    expect(page.indexOf('data-snake-next-step')).toBeLessThan(page.indexOf('id="guide-details"'));
  });
});
