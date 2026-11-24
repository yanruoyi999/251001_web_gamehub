import type { SeoLandingLocaleContent, SeoLandingPage } from '@/lib/seo-landing-content';
import type { Locale } from '@/i18n/config';

type Pair = [en: string, zh: string];
type Section = [heading: Pair, body: Pair];
type Source = [url: string, title: Pair, description: Pair, entryAction?: string];
interface Reference {
  slug: string;
  keywords: string[];
  homepageFeatured?: boolean;
  related: string[];
  title: Pair;
  heading: Pair;
  summary: Pair;
  introduction: Pair;
  sections: Section[];
  questions: Section[];
  sources: Source[];
}

export function bilingualReference(input: Reference): SeoLandingPage {
  function localize(locale: Locale): SeoLandingLocaleContent {
    const i = locale === 'en' ? 0 : 1;
    const sources = input.sources.map(([href, title, description, entryAction]) => ({ href, label: title[i], description: description[i], entryAction }));
    return {
      heading: input.heading[i], metaTitle: input.title[i], metaDescription: input.summary[i],
      subheading: input.summary[i], overview: [input.introduction[i]],
      sections: input.sections.map(([title, body]) => ({ title: title[i], body: body[i] })),
      faqs: input.questions.map(([question, answer]) => ({ question: question[i], answer: answer[i] })),
      externalLinks: sources, quickAnswerLink: sources[0], recommendations: [],
      ctaLabel: i === 0 ? 'Browse games' : '浏览游戏',
      ctaDescription: i === 0 ? 'Explore the Luma game library.' : '看看 Luma 的游戏目录。',
    };
  }
  return {
    slug: input.slug, primaryKeyword: input.keywords[0], keywords: input.keywords,
    updatedAt: '2026-11-24', indexable: true, documentNavigation: true,
    homepageFeatured: input.homepageFeatured,
    relatedSlugs: input.related, locales: { en: localize('en'), zh: localize('zh') },
  };
}
