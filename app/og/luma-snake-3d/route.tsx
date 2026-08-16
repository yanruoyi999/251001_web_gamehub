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
          color: '#effff5',
          background: 'linear-gradient(135deg, #07141a 0%, #0b2a2b 55%, #123c36 100%)',
          border: '6px solid #39d98a',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: '0.16em',
            color: '#8ff4bd',
          }}
        >
          LUMA ORIGINAL
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 28,
            fontSize: 70,
            fontWeight: 900,
            lineHeight: 1.05,
          }}
        >
          SNAKE GAME 3D
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 30,
            fontSize: 34,
            fontWeight: 700,
            color: '#ffd166',
          }}
        >
          DAILY CHALLENGE · LOCAL BEST SCORE
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 26,
            fontSize: 25,
            color: '#b8cfcb',
          }}
        >
          Original browser game · Keyboard and touch controls · No download
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
