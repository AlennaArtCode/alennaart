'use client';

import Hero from '@/components/home/Hero';
import SeasonPassCard from '@/components/commerce/SeasonPassCard';
import InnerCircle from '@/components/home/InnerCircle';
import WeeklyChapterCard from '@/components/commerce/WeeklyChapterCard';
import ArtistBio from '@/components/home/ArtistBio';
import Codex from '@/components/home/Codex';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  return (
    <main className="min-h-screen bg-primary text-content-primary selection:bg-accent selection:text-primary-dark relative">

      {/* GLOBAL FIXED BACKGROUND - The Aurora */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Deep Space Base */}
        <div className="absolute inset-0 bg-[#0A0510]" />

        {/* Floating Orbs - The "Auroras" */}
        <div className="orb-glow w-[800px] h-[800px] bg-accent-mystic/20 top-[-20%] left-[-10%]" />
        <div className="orb-glow w-[600px] h-[600px] bg-accent-neon/10 bottom-[-10%] right-[-10%] animate-float-delayed" />
        <div className="orb-glow w-[500px] h-[500px] bg-accent/10 top-[40%] left-[30%]" style={{ animationDuration: '25s' }} />

        {/* Ambient Overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/50 to-primary" />

        {/* Optional: Subtle Mesh Texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      </div>

      {/* CONTENT LAYERS */}
      <div className="relative z-10">

        {/* 1. Hero Section (The Hook) */}
        {/* Passed prop for transparent background if needed, but Hero itself handles layout */}
        <Hero />

        {/* 3. The Prime Product (Sales Block) */}
        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold font-serif">{t('master_key', 'title')}</h2>
              <p className="text-xl text-content-secondary font-light">
                {t('master_key', 'desc')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass-panel p-6 rounded-lg">
                  <span className="text-accent-mystic font-bold block mb-1">{t('master_key', 'discount_badge')}</span>
                  <span className="text-sm text-content-muted">{t('master_key', 'discount_desc')}</span>
                </div>
                <div className="glass-panel p-6 rounded-lg">
                  <span className="text-accent font-bold block mb-1">{t('master_key', 'boss_badge')}</span>
                  <span className="text-sm text-content-muted">{t('master_key', 'boss_desc')}</span>
                </div>
              </div>
            </div>

            {/* The Buy Module */}
            <div className="transform md:rotate-1 hover:rotate-0 transition-transform duration-500">
              <SeasonPassCard />
            </div>
          </div>
        </section>

        {/* 4. Recent Drops (Activity) */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-3xl font-bold font-serif">{t('recent_drops', 'title')}</h2>
              <a href="/universe" className="text-content-muted hover:text-white transition-colors text-sm tracking-widest uppercase">{t('recent_drops', 'view_all')}</a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <WeeklyChapterCard
                chapterNumber={2}
                title="Digital Echoes"
                image="https://placehold.co/800x600/151827/E0B0FF/png?text=Digital+Echoes"
                dropDate="2025-01-20T12:00:00.000Z"
              />
              <WeeklyChapterCard
                chapterNumber={1}
                title="Origin of the Void"
                image="https://placehold.co/800x600/151827/E5C09D/png?text=Origin+of+the+Void"
                dropDate="2025-01-05T12:00:00.000Z"
              />
            </div>
          </div>
        </section>

        {/* 5. Community */}
        <InnerCircle />

        {/* 6. Artist */}
        <ArtistBio />

        {/* 7. The Codex (Manifesto) */}
        <Codex />

      </div>
    </main>
  );
}
