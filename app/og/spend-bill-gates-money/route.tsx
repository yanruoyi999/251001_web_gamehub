import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '64px 76px',
          color: '#f8fafc',
          background:
            'radial-gradient(circle at 85% 10%, #243553 0, #0b1424 38%, #07111f 100%)',
          border: '6px solid #f5c84c',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: '0.16em',
            color: '#f5c84c',
          }}
        >
          LUMA ORIGINAL
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 28,
            fontSize: 60,
            fontWeight: 900,
            lineHeight: 1.05,
          }}
        >
          SPEND BILL GATES MONEY
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 28,
            fontSize: 104,
            fontWeight: 900,
            lineHeight: 1,
            color: '#f5c84c',
          }}
        >
          $100 BILLION
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 34,
            fontSize: 29,
            fontWeight: 700,
          }}
        >
          BUY · REMOVE · SHARE YOUR BILLIONAIRE IDENTITY
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 24,
            fontSize: 23,
            color: '#a9b4c4',
          }}
        >
          Free browser game · Mobile friendly · No download
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 28,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: '#77869b',
          }}
        >
          UNOFFICIAL ENTERTAINMENT GAME
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=31536000, immutable',
      },
    },
  );
}
