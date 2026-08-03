export type SpendGameLocale = 'zh' | 'en';

export interface LocalizedText {
  zh: string;
  en: string;
}

export type ProductCategory = 'luxury' | 'power' | 'world' | 'viral';
export type FeedbackLevel = 'normal' | 'epic' | 'legendary';
export type BillionaireStyle =
  | 'chaos'
  | 'luxury'
  | 'empire'
  | 'world-changer'
  | 'visionary';

export interface Product {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  price: number;
  emoji: string;
  category: ProductCategory;
  feedback: FeedbackLevel;
  toast?: LocalizedText;
}

export interface Purchase {
  productId: string;
  count: number;
}

export const INITIAL_WEALTH = 100_000_000_000;
export const PRODUCTS: Product[] = [];

export function upsertPurchase(purchases: Purchase[], productId: string): Purchase[] {
  return purchases;
}

export function calculateRemainingWealth(_purchases: Purchase[]): number {
  return INITIAL_WEALTH;
}

export function getCategorySpend(_purchases: Purchase[]): Record<ProductCategory, number> {
  return { luxury: 0, power: 0, world: 0, viral: 0 };
}

export function calculateBillionaireStyle(_purchases: Purchase[]): BillionaireStyle {
  return 'visionary';
}

export function formatCompactUsd(value: number, locale: SpendGameLocale): string {
  return new Intl.NumberFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatFullUsd(value: number, locale: SpendGameLocale): string {
  return new Intl.NumberFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function getSpentBucket(_spent: number): string {
  return '0';
}
