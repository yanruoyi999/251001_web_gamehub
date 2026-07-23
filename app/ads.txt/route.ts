function cleanPublisherId(value: string | undefined) {
  const raw = value?.trim();
  if (!raw) return null;
  const normalized = raw.replace(/^ca-/, '');
  return /^pub-\d+$/.test(normalized) ? normalized : null;
}

export function GET() {
  const publisherId = cleanPublisherId(
    process.env.ADSENSE_PUBLISHER_ID ?? process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID,
  );
  const content = publisherId
    ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`
    : '# Configure ADSENSE_PUBLISHER_ID after AdSense approval.\n';

  return new Response(content, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}
