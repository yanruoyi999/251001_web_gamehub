import type {
  LocalizedText,
  SpendGameLocale,
} from '@/lib/games/spend-bill-gates-money';

export type ShareChannelId =
  | 'x'
  | 'telegram'
  | 'whatsapp'
  | 'facebook'
  | 'wechat'
  | 'weibo'
  | 'qq'
  | 'system'
  | 'copy';

export type ShareMethod =
  | 'x'
  | 'telegram'
  | 'whatsapp'
  | 'facebook'
  | 'wechat'
  | 'weibo'
  | 'qq'
  | 'system'
  | 'clipboard'
  | 'manual';

export interface ShareChannel {
  id: ShareChannelId;
  icon: string;
  label: LocalizedText;
  description: LocalizedText;
}

const CHANNELS: Record<ShareChannelId, ShareChannel> = {
  x: {
    id: 'x',
    icon: '𝕏',
    label: { zh: 'X', en: 'X' },
    description: { zh: '发布到 X', en: 'Post your result on X' },
  },
  telegram: {
    id: 'telegram',
    icon: '✈',
    label: { zh: 'Telegram', en: 'Telegram' },
    description: { zh: '发送到聊天或频道', en: 'Send to a chat or channel' },
  },
  whatsapp: {
    id: 'whatsapp',
    icon: '◉',
    label: { zh: 'WhatsApp', en: 'WhatsApp' },
    description: { zh: '发送给 WhatsApp 联系人', en: 'Send to a WhatsApp contact' },
  },
  facebook: {
    id: 'facebook',
    icon: 'f',
    label: { zh: 'Facebook', en: 'Facebook' },
    description: { zh: '分享到 Facebook', en: 'Share the game on Facebook' },
  },
  wechat: {
    id: 'wechat',
    icon: '微',
    label: { zh: '微信', en: 'WeChat' },
    description: { zh: '通过微信或系统分享', en: 'Share through WeChat or your device' },
  },
  weibo: {
    id: 'weibo',
    icon: '博',
    label: { zh: '微博', en: 'Weibo' },
    description: { zh: '发布到微博', en: 'Post your result on Weibo' },
  },
  qq: {
    id: 'qq',
    icon: 'Q',
    label: { zh: 'QQ', en: 'QQ' },
    description: { zh: '分享给 QQ 好友', en: 'Share with a QQ contact' },
  },
  system: {
    id: 'system',
    icon: '↗',
    label: { zh: '系统分享', en: 'System Share' },
    description: { zh: '使用设备分享菜单', en: 'Use your device share menu' },
  },
  copy: {
    id: 'copy',
    icon: '⧉',
    label: { zh: '复制结果', en: 'Copy Result' },
    description: { zh: '复制文案和链接', en: 'Copy the result text and link' },
  },
};

const ENGLISH_ORDER: ShareChannelId[] = [
  'x',
  'telegram',
  'whatsapp',
  'facebook',
  'system',
  'copy',
];

const CHINESE_ORDER: ShareChannelId[] = [
  'wechat',
  'weibo',
  'qq',
  'telegram',
  'x',
  'copy',
  'system',
];

export function getShareChannels(locale: SpendGameLocale): ShareChannel[] {
  const order = locale === 'zh' ? CHINESE_ORDER : ENGLISH_ORDER;
  return order.map((id) => CHANNELS[id]);
}

function createUrl(base: string, params: Record<string, string>): string {
  const url = new URL(base);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

export function buildExternalShareUrl(
  channel: ShareChannelId,
  text: string,
  url: string,
  title: string,
): string | null {
  switch (channel) {
    case 'x':
      return createUrl('https://twitter.com/intent/tweet', { text, url });
    case 'telegram':
      return createUrl('https://t.me/share/url', { url, text });
    case 'whatsapp':
      return createUrl('https://wa.me/', { text: `${text}\n${url}` });
    case 'facebook':
      return createUrl('https://www.facebook.com/sharer/sharer.php', { u: url });
    case 'weibo':
      return createUrl('https://service.weibo.com/share/share.php', {
        url,
        title: `${title} — ${text}`,
      });
    case 'qq':
      return createUrl('https://connect.qq.com/widget/shareqq/index.html', {
        url,
        title,
        summary: text,
      });
    case 'wechat':
    case 'system':
    case 'copy':
      return null;
  }
}
