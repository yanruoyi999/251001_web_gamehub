'use client';

import { RotateCcw, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import type { Locale } from '@/i18n/config';
import { trackInteraction } from '@/lib/analytics/events';
import {
  ASMR_EXPERIENCES,
  getAsmrExperienceCopy,
  type AsmrExperienceId,
} from '@/lib/games/asmr-experiences';

interface AsmrExperiencesProps {
  locale: Locale;
}

const copy = {
  en: {
    eyebrow: 'Luma original sensory collection',
    title: 'A small, quiet interaction loop',
    description: 'Choose a scene, tap the surface, and keep the canvas as gentle as you like.',
    enableSound: 'Enable sound',
    muteSound: 'Mute sound',
    defaultStatus: 'The page starts muted. Choose a scene to begin.',
    interactions: 'interactions',
    reset: 'Reset scene',
    soundNote: 'Sound is optional and only starts after your tap.',
    reducedMotion: 'Reduced-motion friendly',
    original: 'Original local scene',
  },
  zh: {
    eyebrow: 'Luma 原创感官合集',
    title: '一段安静的轻量互动',
    description: '选择一个场景，点击画面，让这块小画布保持你喜欢的节奏。',
    enableSound: '开启声音',
    muteSound: '静音',
    defaultStatus: '页面默认静音，选择一个场景后开始。',
    interactions: '次互动',
    reset: '重置场景',
    soundNote: '声音是可选的，只有主动点击后才会开始。',
    reducedMotion: '支持减少动态效果',
    original: '原创本地场景',
  },
} as const;

const STORAGE_KEY = 'luma-asmr-sound-enabled';

function emptyCounts(): Record<AsmrExperienceId, number> {
  return {
    'soft-rain': 0,
    'pebble-stack': 0,
    'line-garden': 0,
    'color-sort': 0,
  };
}

export function AsmrExperiences({ locale }: AsmrExperiencesProps) {
  const text = copy[locale];
  const [activeId, setActiveId] = useState<AsmrExperienceId>('soft-rain');
  const [counts, setCounts] = useState<Record<AsmrExperienceId, number>>(emptyCounts);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    try {
      setSoundEnabled(window.localStorage.getItem(STORAGE_KEY) === 'true');
    } catch {
      setSoundEnabled(false);
    }

    return () => {
      void audioContextRef.current?.close();
      audioContextRef.current = null;
    };
  }, []);

  const playTone = () => {
    if (!soundEnabled || typeof window === 'undefined') return;

    const AudioContextConstructor = window.AudioContext;
    if (!AudioContextConstructor) return;

    const context = audioContextRef.current ?? new AudioContextConstructor();
    audioContextRef.current = context;
    void context.resume();

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 220 + counts[activeId] * 12;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.035, context.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.16);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.17);
  };

  const toggleSound = () => {
    const nextValue = !soundEnabled;
    setSoundEnabled(nextValue);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(nextValue));
    } catch {
      // Local storage is an enhancement; the control still works without it.
    }
    trackInteraction('asmr_sound_toggle', {
      locale,
      enabled: nextValue,
      source: 'asmr_games',
    });
  };

  const interact = () => {
    const nextCount = Math.min(12, counts[activeId] + 1);
    setCounts((previous) => ({ ...previous, [activeId]: nextCount }));
    playTone();
    trackInteraction('asmr_experience_interaction', {
      locale,
      experience: activeId,
      count: nextCount,
      source: 'asmr_games',
    });
  };

  const resetScene = () => {
    setCounts((previous) => ({ ...previous, [activeId]: 0 }));
    trackInteraction('asmr_experience_reset', {
      locale,
      experience: activeId,
      source: 'asmr_games',
    });
  };

  const currentCopy = getAsmrExperienceCopy(activeId, locale);
  const currentCount = counts[activeId];
  const marks = Array.from({ length: currentCount }, (_, index) => index);

  return (
    <section data-asmr-experiences aria-labelledby="asmr-experiences-title" className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-white shadow-xl">
      <header className="flex flex-col gap-5 border-b border-slate-800 p-5 sm:p-7 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-cyan-300"><Sparkles aria-hidden="true" className="h-4 w-4" />{text.eyebrow}</p>
          <h2 id="asmr-experiences-title" className="mt-3 text-2xl font-black sm:text-3xl">{text.title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">{text.description}</p>
        </div>
        <button type="button" onClick={toggleSound} aria-pressed={soundEnabled} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-cyan-300/60 px-4 py-3 font-bold text-cyan-100 transition hover:bg-cyan-300/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200">
          {soundEnabled ? <Volume2 aria-hidden="true" className="h-4 w-4" /> : <VolumeX aria-hidden="true" className="h-4 w-4" />}
          {soundEnabled ? text.muteSound : text.enableSound}
        </button>
      </header>

      <div className="grid grid-cols-2 divide-x divide-slate-800 border-b border-slate-800 bg-slate-900/80 sm:grid-cols-3">
        <div className="p-4 text-center"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{text.original}</p><p className="mt-1 text-lg font-black text-cyan-300">{currentCopy.label}</p></div>
        <div className="p-4 text-center"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{text.interactions}</p><p className="mt-1 text-2xl font-black tabular-nums text-amber-300">{currentCount}/12</p></div>
        <div className="col-span-2 p-4 text-center sm:col-span-1"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{text.reducedMotion}</p><p className="mt-1 text-lg font-black text-emerald-300">{locale === 'zh' ? '可用' : 'Ready'}</p></div>
      </div>

      <div className="space-y-5 p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="tablist" aria-label={locale === 'zh' ? '感官场景' : 'Sensory scenes'}>
          {ASMR_EXPERIENCES.map((experience) => {
            const experienceCopy = getAsmrExperienceCopy(experience.id, locale);
            return (
              <button key={experience.id} type="button" role="tab" aria-selected={activeId === experience.id} onClick={() => setActiveId(experience.id)} className={`min-h-11 rounded-lg px-3 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${activeId === experience.id ? 'bg-cyan-300 text-slate-950' : 'border border-slate-700 text-slate-200 hover:border-cyan-300'}`}>
                {experienceCopy.label}
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-100">{currentCopy.instruction}</p>
            <button type="button" onClick={resetScene} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-bold text-slate-200 transition hover:border-cyan-300 hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"><RotateCcw aria-hidden="true" className="h-4 w-4" />{text.reset}</button>
          </div>

          <button type="button" data-asmr-surface onClick={interact} aria-label={currentCopy.instruction} className="relative mt-5 block min-h-72 w-full overflow-hidden rounded-xl border border-cyan-200/20 bg-[radial-gradient(circle_at_50%_30%,rgba(103,232,249,.18),transparent_44%),linear-gradient(145deg,#0f172a,#172554)] transition hover:border-cyan-200/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300 motion-reduce:transition-none">
            {activeId === 'soft-rain' ? marks.map((index) => <span key={index} className="absolute h-3 w-3 rounded-full bg-cyan-200/80 shadow-[0_0_18px_rgba(165,243,252,.75)]" style={{ left: `${10 + ((index * 17) % 80)}%`, top: `${12 + ((index * 23) % 72)}%` }} aria-hidden="true" />) : null}
            {activeId === 'pebble-stack' ? <div className="absolute inset-x-0 bottom-8 flex items-end justify-center"><div className="flex items-end gap-1">{marks.map((index) => <span key={index} className="block h-10 w-10 rounded-full border border-amber-100/40 bg-amber-200/70 shadow-[inset_-5px_-5px_8px_rgba(120,53,15,.22),0_6px_12px_rgba(0,0,0,.2)]" style={{ transform: `translateY(${-(index % 4) * 15}px) rotate(${(index % 3) * 5 - 5}deg)` }} aria-hidden="true" />)}</div></div> : null}
            {activeId === 'line-garden' ? <div className="absolute inset-0">{marks.map((index) => <span key={index} className="absolute block h-1 rounded-full bg-emerald-200/75 shadow-[0_0_14px_rgba(167,243,208,.55)]" style={{ width: `${28 + ((index * 9) % 34)}%`, left: `${8 + ((index * 13) % 55)}%`, top: `${18 + ((index * 19) % 64)}%`, transform: `rotate(${(index % 5) * 9 - 18}deg)` }} aria-hidden="true" />)}</div> : null}
            {activeId === 'color-sort' ? <div className="flex h-full min-h-72 items-center justify-center gap-3">{marks.map((index) => <span key={index} className={`h-12 w-12 rounded-xl border border-white/30 shadow-lg ${['bg-rose-300/80', 'bg-amber-200/80', 'bg-emerald-300/80', 'bg-sky-300/80'][index % 4]}`} aria-hidden="true" />)}</div> : null}
            {currentCount === 0 ? <span className="absolute inset-0 flex items-center justify-center px-8 text-center text-sm font-semibold text-slate-300">{currentCopy.instruction}</span> : null}
          </button>
          <p className="mt-3 text-sm text-slate-400" role="status" aria-live="polite">{currentCount === 0 ? text.defaultStatus : `${currentCount} ${text.interactions}`}</p>
          <p className="mt-2 text-xs text-slate-500">{text.soundNote}</p>
        </div>
      </div>
    </section>
  );
}
