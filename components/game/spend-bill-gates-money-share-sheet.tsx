'use client';

import * as React from 'react';

import type { SpendGameLocale } from '@/lib/games/spend-bill-gates-money';
import {
  buildExternalShareUrl,
  getShareChannels,
  type ShareChannelId,
  type ShareMethod,
} from '@/lib/games/spend-bill-gates-money-share';

interface SpendBillGatesMoneyShareSheetProps {
  locale: SpendGameLocale;
  open: boolean;
  onClose: () => void;
  shareText: string;
  shareUrl: string;
  shareTitle: string;
  identityEmoji: string;
  identityLabel: string;
  totalSpentLabel: string;
  totalSpentValue: string;
  onShare: (method: ShareMethod) => void;
}

const copy = {
  zh: {
    title: '分享你的亿万富翁结果',
    subtitle: '选择一个渠道，把结果发给朋友。',
    close: '关闭分享面板',
    copied: '结果和链接已复制。',
    manual: '自动复制失败，请手动复制下面的内容：',
    wechatInside:
      '你正在微信中打开此页面。请点击右上角菜单，选择“发送给朋友”或“分享到朋友圈”。',
    wechatCopied:
      '结果和链接已复制。请打开微信，粘贴后发送给好友或群聊。',
    systemCopied: '系统分享不可用，结果和链接已复制。',
    preview: '结果预览',
  },
  en: {
    title: 'Share your billionaire result',
    subtitle: 'Choose a channel and challenge your friends.',
    close: 'Close share panel',
    copied: 'Your result and link were copied.',
    manual: 'Automatic copying failed. Copy this text manually:',
    wechatInside:
      'You are viewing this page inside WeChat. Use the top-right menu to send it to a friend or share it to Moments.',
    wechatCopied:
      'Your result and link were copied. Open WeChat and paste them into a chat.',
    systemCopied: 'System sharing is unavailable, so the result was copied.',
    preview: 'Result preview',
  },
} as const;

function isShareAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

export function SpendBillGatesMoneyShareSheet({
  locale,
  open,
  onClose,
  shareText,
  shareUrl,
  shareTitle,
  identityEmoji,
  identityLabel,
  totalSpentLabel,
  totalSpentValue,
  onShare,
}: SpendBillGatesMoneyShareSheetProps) {
  const text = copy[locale];
  const channels = getShareChannels(locale);
  const closeButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const previouslyFocusedRef = React.useRef<HTMLElement | null>(null);
  const [status, setStatus] = React.useState<string | null>(null);
  const [manualFallback, setManualFallback] = React.useState<string | null>(
    null,
  );
  const [wechatInstruction, setWechatInstruction] = React.useState<
    string | null
  >(null);

  React.useEffect(() => {
    if (!open) return;

    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const frame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedRef.current?.focus();
    };
  }, [onClose, open]);

  React.useEffect(() => {
    if (!open) {
      setStatus(null);
      setManualFallback(null);
      setWechatInstruction(null);
    }
  }, [open]);

  const copyResult = React.useCallback(
    async (successMethod: ShareMethod, successMessage: string) => {
      const value = `${shareText}\n${shareUrl}`;
      try {
        await navigator.clipboard.writeText(value);
        setManualFallback(null);
        setStatus(successMessage);
        onShare(successMethod);
        return true;
      } catch {
        setStatus(null);
        setManualFallback(value);
        onShare('manual');
        return false;
      }
    },
    [onShare, shareText, shareUrl],
  );

  const handleSystemShare = React.useCallback(async () => {
    setStatus(null);
    setManualFallback(null);
    setWechatInstruction(null);

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        onShare('system');
        onClose();
        return;
      } catch (error) {
        if (isShareAbort(error)) return;
      }
    }

    await copyResult('clipboard', text.systemCopied);
  }, [copyResult, onClose, onShare, shareText, shareTitle, shareUrl, text.systemCopied]);

  const handleWechatShare = React.useCallback(async () => {
    setStatus(null);
    setManualFallback(null);

    if (/MicroMessenger/i.test(navigator.userAgent)) {
      setWechatInstruction(text.wechatInside);
      onShare('wechat');
      return;
    }

    setWechatInstruction(null);
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        onShare('wechat');
        onClose();
        return;
      } catch (error) {
        if (isShareAbort(error)) return;
      }
    }

    const copied = await copyResult('wechat', text.wechatCopied);
    if (copied) {
      setWechatInstruction(text.wechatCopied);
    }
  }, [copyResult, onClose, onShare, shareText, shareTitle, shareUrl, text.wechatCopied, text.wechatInside]);

  const handleChannel = React.useCallback(
    async (channel: ShareChannelId) => {
      setStatus(null);
      setManualFallback(null);
      setWechatInstruction(null);

      if (channel === 'copy') {
        await copyResult('clipboard', text.copied);
        return;
      }
      if (channel === 'system') {
        await handleSystemShare();
        return;
      }
      if (channel === 'wechat') {
        await handleWechatShare();
        return;
      }

      const externalUrl = buildExternalShareUrl(
        channel,
        shareText,
        shareUrl,
        shareTitle,
      );
      if (!externalUrl) return;

      window.open(externalUrl, '_blank', 'noopener,noreferrer');
      onShare(channel);
      onClose();
    },
    [copyResult, handleSystemShare, handleWechatShare, onClose, onShare, shareText, shareTitle, shareUrl, text.copied],
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/80 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="billionaire-share-title"
        data-testid="billionaire-share-dialog"
        className="max-h-[calc(100svh-5rem)] w-full overflow-y-auto rounded-t-3xl border border-white/10 bg-slate-900 px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 text-white shadow-2xl sm:max-w-2xl sm:rounded-3xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="billionaire-share-title"
              className="text-xl font-black sm:text-2xl"
            >
              {text.title}
            </h2>
            <p className="mt-1 text-sm text-slate-400">{text.subtitle}</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            data-testid="billionaire-share-close"
            onClick={onClose}
            aria-label={text.close}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xl text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20"
          >
            ×
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-amber-300/30 bg-gradient-to-br from-slate-950 to-slate-900 p-5 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
            {text.preview}
          </p>
          <p className="mt-3 text-5xl" aria-hidden="true">
            {identityEmoji}
          </p>
          <p className="mt-3 text-2xl font-black">{identityLabel}</p>
          <p className="mt-2 text-sm text-slate-400">{totalSpentLabel}</p>
          <p className="mt-1 text-xl font-black text-amber-300">
            {totalSpentValue}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {channels.map((channel) => (
            <button
              key={channel.id}
              type="button"
              data-testid={`share-channel-${channel.id}`}
              onClick={() => void handleChannel(channel.id)}
              className="min-h-24 rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-left transition hover:border-amber-300/40 hover:bg-slate-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200/30"
            >
              <span className="text-2xl font-black" aria-hidden="true">
                {channel.icon}
              </span>
              <span className="mt-2 block font-black">
                {channel.label[locale]}
              </span>
              <span className="mt-1 block text-xs leading-5 text-slate-400">
                {channel.description[locale]}
              </span>
            </button>
          ))}
        </div>

        {wechatInstruction ? (
          <p
            className="mt-5 rounded-xl border border-emerald-300/25 bg-emerald-300/10 p-4 text-sm leading-6 text-emerald-100"
            role="status"
          >
            {wechatInstruction}
          </p>
        ) : null}

        {status ? (
          <p className="mt-5 text-sm font-semibold text-emerald-300" role="status">
            {status}
          </p>
        ) : null}

        {manualFallback ? (
          <div className="mt-5">
            <label
              htmlFor="billionaire-share-manual"
              className="mb-2 block text-sm font-semibold text-amber-200"
            >
              {text.manual}
            </label>
            <textarea
              id="billionaire-share-manual"
              data-testid="billionaire-share-manual"
              readOnly
              value={manualFallback}
              rows={5}
              onFocus={(event) => event.currentTarget.select()}
              className="w-full rounded-xl border border-white/15 bg-slate-950 p-3 text-sm leading-6 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            />
          </div>
        ) : null}
      </section>
    </div>
  );
}
