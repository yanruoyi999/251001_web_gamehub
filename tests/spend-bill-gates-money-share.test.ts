import { describe, expect, it } from 'vitest';

import {
  buildExternalShareUrl,
  getShareChannels,
  type ShareChannelId,
} from '@/lib/games/spend-bill-gates-money-share';

const shareText = 'I spent $75,000,000. My identity is Luxury King.';
const shareUrl =
  'https://www.lumagamehub.com/en/games/spend-bill-gates-money';
const shareTitle = 'Spend Bill Gates Money';

function parseExternalUrl(channel: ShareChannelId): URL {
  const value = buildExternalShareUrl(
    channel,
    shareText,
    shareUrl,
    shareTitle,
  );
  expect(value).not.toBeNull();
  return new URL(value as string);
}

describe('Spend Bill Gates Money share channels', () => {
  it('orders international channels for English users', () => {
    expect(getShareChannels('en').map((channel) => channel.id)).toEqual([
      'x',
      'telegram',
      'whatsapp',
      'facebook',
      'system',
      'copy',
    ]);
  });

  it('orders China-focused channels first for Chinese users', () => {
    expect(getShareChannels('zh').map((channel) => channel.id)).toEqual([
      'wechat',
      'weibo',
      'qq',
      'telegram',
      'x',
      'copy',
      'system',
    ]);
  });

  it('builds encoded X, Telegram, WhatsApp, Facebook, Weibo, and QQ URLs', () => {
    const x = parseExternalUrl('x');
    expect(x.origin + x.pathname).toBe('https://twitter.com/intent/tweet');
    expect(x.searchParams.get('text')).toBe(shareText);
    expect(x.searchParams.get('url')).toBe(shareUrl);

    const telegram = parseExternalUrl('telegram');
    expect(telegram.origin + telegram.pathname).toBe(
      'https://t.me/share/url',
    );
    expect(telegram.searchParams.get('text')).toBe(shareText);
    expect(telegram.searchParams.get('url')).toBe(shareUrl);

    const whatsapp = parseExternalUrl('whatsapp');
    expect(whatsapp.origin + whatsapp.pathname).toBe('https://wa.me/');
    expect(whatsapp.searchParams.get('text')).toBe(
      `${shareText}\n${shareUrl}`,
    );

    const facebook = parseExternalUrl('facebook');
    expect(facebook.origin + facebook.pathname).toBe(
      'https://www.facebook.com/sharer/sharer.php',
    );
    expect(facebook.searchParams.get('u')).toBe(shareUrl);

    const weibo = parseExternalUrl('weibo');
    expect(weibo.origin + weibo.pathname).toBe(
      'https://service.weibo.com/share/share.php',
    );
    expect(weibo.searchParams.get('url')).toBe(shareUrl);
    expect(weibo.searchParams.get('title')).toContain(shareText);

    const qq = parseExternalUrl('qq');
    expect(qq.origin + qq.pathname).toBe(
      'https://connect.qq.com/widget/shareqq/index.html',
    );
    expect(qq.searchParams.get('url')).toBe(shareUrl);
    expect(qq.searchParams.get('title')).toBe(shareTitle);
    expect(qq.searchParams.get('summary')).toBe(shareText);
  });

  it('leaves WeChat, system share, and copy for local browser handling', () => {
    expect(
      buildExternalShareUrl('wechat', shareText, shareUrl, shareTitle),
    ).toBeNull();
    expect(
      buildExternalShareUrl('system', shareText, shareUrl, shareTitle),
    ).toBeNull();
    expect(
      buildExternalShareUrl('copy', shareText, shareUrl, shareTitle),
    ).toBeNull();
  });

  it('provides bilingual labels and descriptions for every channel', () => {
    for (const locale of ['zh', 'en'] as const) {
      expect(
        getShareChannels(locale).every(
          (channel) =>
            channel.label[locale].length > 0 &&
            channel.description[locale].length > 0,
        ),
      ).toBe(true);
    }
  });
});
