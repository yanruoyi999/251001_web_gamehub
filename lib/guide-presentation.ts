import type {
  SeoLandingLocaleContent,
  SeoLandingSection,
} from '@/lib/seo-landing-content';

interface GuidePresentation {
  quickAnswer: SeoLandingSection;
  detailSections: SeoLandingSection[];
}

export function getGuidePresentation(
  content: SeoLandingLocaleContent,
): GuidePresentation {
  const [firstSection, ...detailSections] = content.sections;

  return {
    quickAnswer: firstSection ?? {
      title: 'Quick answer',
      body: content.overview[0] ?? '',
    },
    detailSections,
  };
}
