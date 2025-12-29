'use client';

import Hero from '@/components/home/Hero';
import SeasonMechanics from '@/components/home/SeasonMechanics';
import SeasonPassCard from '@/components/commerce/SeasonPassCard';
import InnerCircle from '@/components/home/InnerCircle';
import WeeklyChapterCard from '@/components/commerce/WeeklyChapterCard';
import ArtistBio from '@/components/home/ArtistBio';

export default function Home() {
  return (
    <main className="min-h-screen bg-primary text-content-primary selection:bg-accent selection:text-primary-dark relative">

      {/* GLOBAL FIXED BACKGROUND - The Canvas */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-primary-dark" />
        <div className="absolute inset-0 bg-gradient-to-b from-accent-mystic/10 via-primary to-primary opacity-80" />

        {/* Digital Starfield - Continuous */}
        <div className="absolute inset-0 starfield opacity-40" />

        {/* Da Vinci Grid - Lilac Tint - Continuous */}
        <div className="absolute inset-0 davinci-grid opacity-30 mix-blend-screen" />
      </div>

      {/* CONTENT LAYERS */}
      <div className="relative z-10">

        {/* 1. Hero Section (The Hook) */}
        {/* Passed prop for transparent background if needed, but Hero itself handles layout */}
        <Hero isFluid={true} />

        {/* 2. Mechanics (The Education) */}
        <SeasonMechanics />

        {/* 3. The Prime Product (Sales Block) */}
        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold font-serif">Your Master Key</h2>
              <p className="text-xl text-content-secondary font-light">
                The Season Pass is not just an NFT, it is your passport to the entire ecosystem.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass-panel p-6 rounded-lg">
                  <span className="text-accent-mystic font-bold block mb-1">20% OFF</span>
                  <span className="text-sm text-content-muted">Permanent discount on chapters</span>
                </div>
                <div className="glass-panel p-6 rounded-lg">
                  <span className="text-accent font-bold block mb-1">BOSS DROPS</span>
                  <span className="text-sm text-content-muted">Exclusive access to 1/1 pieces</span>
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
              <h2 className="text-3xl font-bold font-serif">Recent Drops</h2>
              <a href="/universe" className="text-content-muted hover:text-white transition-colors text-sm tracking-widest uppercase">View All &rarr;</a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <WeeklyChapterCard
                chapterNumber={2}
                title="Digital Echoes"
                image="https://placehold.co/800x600/151827/E0B0FF/png?text=Digital+Echoes"
                dropDate={new Date(Date.now() + 86400000).toISOString()}
              />
              <WeeklyChapterCard
                chapterNumber={1}
                title="Origin of the Void"
                image="https://placehold.co/800x600/151827/E5C09D/png?text=Origin+of+the+Void"
                dropDate={new Date(Date.now() - 86400000 * 5).toISOString()}
              />
            </div>
          </div>
        </section>

        {/* 5. Community */}
        <InnerCircle />

        {/* 6. Artist */}
        <ArtistBio />

      </div>
    </main>
  );
}
