import type { Metadata } from 'next';
import Link from 'next/link';

import { CircleGame } from '@/components/games/draw-a-perfect-circle/circle-game';
import { drawPerfectCircleContent } from '@/content/en/games/draw-a-perfect-circle';

const canonicalUrl = 'https://www.lumagamehub.com/en/games/draw-a-perfect-circle';

export const dynamic = 'force-static';
export const revalidate = 86_400;

export const metadata: Metadata = {
  title: 'Draw a Perfect Circle Game | Luma Game Hub',
  description: drawPerfectCircleContent.description,
  alternates: {
    canonical: canonicalUrl,
    languages: { 'en-US': canonicalUrl },
  },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Draw a Perfect Circle',
    description: drawPerfectCircleContent.description,
    type: 'website',
    url: canonicalUrl,
    locale: 'en-US',
  },
};

export default function DrawPerfectCirclePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
          <Link className="rounded-sm hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300" href="/en/games">
            Games
          </Link>
          <span aria-hidden="true" className="px-2">/</span>
          <span aria-current="page">Draw a Perfect Circle</span>
        </nav>

        <header className="max-w-3xl py-10 sm:py-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Original Luma canvas challenge</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-6xl">
            {drawPerfectCircleContent.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            {drawPerfectCircleContent.description}
          </p>
        </header>

        <CircleGame />

        <section className="grid gap-6 py-12 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.7fr)]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
            <h2 className="text-2xl font-black text-white">How to draw a better circle</h2>
            <ol className="mt-5 space-y-3 text-slate-300">
              {drawPerfectCircleContent.instructions.map((instruction, index) => (
                <li key={instruction} className="flex gap-3 leading-7">
                  <span className="font-black text-cyan-300">{index + 1}.</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 rounded-xl border border-emerald-300/20 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-100">
              {drawPerfectCircleContent.privacyNote}
            </p>
          </div>

          <div className="space-y-3">
            {drawPerfectCircleContent.scoringNotes.map((note) => (
              <article key={note.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <h2 className="font-black text-white">{note.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">{note.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="related-games-title" className="border-t border-slate-800 py-10">
          <h2 id="related-games-title" className="text-xl font-black text-white">More original skill games</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link className="rounded-2xl border border-slate-700 bg-slate-900 p-5 font-bold text-cyan-200 hover:border-cyan-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/40" href="/en/games/connect-the-dots">
              Connect the Dots
            </Link>
            <Link className="rounded-2xl border border-slate-700 bg-slate-900 p-5 font-bold text-cyan-200 hover:border-cyan-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/40" href="/en/games/sorting-games">
              Sorting Games
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
