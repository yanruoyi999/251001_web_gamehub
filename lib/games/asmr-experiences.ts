import type { Locale } from '@/i18n/config';

export const ASMR_EXPERIENCES = [
  {
    id: 'soft-rain',
    en: {
      label: 'Soft rain',
      instruction: 'Place a few quiet drops on the window.',
    },
    zh: {
      label: '软雨滴',
      instruction: '在窗面上放置几颗安静的雨滴。',
    },
  },
  {
    id: 'pebble-stack',
    en: {
      label: 'Pebble stack',
      instruction: 'Tap to add one small stone to the stack.',
    },
    zh: {
      label: '石子堆叠',
      instruction: '点击，让石子一块一块安静地堆起来。',
    },
  },
  {
    id: 'line-garden',
    en: {
      label: 'Line garden',
      instruction: 'Add a short stroke to the calm garden.',
    },
    zh: {
      label: '线条花园',
      instruction: '点击，在安静花园里增加一笔短线。',
    },
  },
  {
    id: 'color-sort',
    en: {
      label: 'Color sort',
      instruction: 'Tap the soft tiles and arrange a small color rhythm.',
    },
    zh: {
      label: '柔和排序',
      instruction: '点击柔和色块，整理一段小小的颜色节奏。',
    },
  },
] as const;

export type AsmrExperienceId = (typeof ASMR_EXPERIENCES)[number]['id'];

export function getAsmrExperience(id: AsmrExperienceId) {
  return ASMR_EXPERIENCES.find((experience) => experience.id === id) ?? ASMR_EXPERIENCES[0];
}

export function getAsmrExperienceCopy(id: AsmrExperienceId, locale: Locale) {
  const experience = getAsmrExperience(id);
  return experience[locale];
}
