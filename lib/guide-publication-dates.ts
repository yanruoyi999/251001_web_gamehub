interface GuideDates {
  /** Set only when the first public publication date has verified evidence. */
  publishedAt?: string;
  updatedAt: string;
}

/** Unknown first-publication dates must never inherit the last revision date. */
export function getGuidePublicationDates(page: GuideDates) {
  const published = page.publishedAt ? Date.parse(page.publishedAt) : NaN;
  const modified = Date.parse(page.updatedAt);
  return {
    datePublished: Number.isFinite(published) && published <= modified ? page.publishedAt : undefined,
    dateModified: page.updatedAt,
  };
}
