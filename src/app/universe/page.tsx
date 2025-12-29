'use client';

import { motion } from 'framer-motion';
import SeasonPassCard from '@/components/commerce/SeasonPassCard';
import WeeklyChapterCard from '@/components/commerce/WeeklyChapterCard';
import QuestBoard from '@/components/engagement/QuestBoard';
import RewardsTrack from '@/components/engagement/RewardsTrack';

const floatingVariant = {
    initial: { y: 0 },
    animate: {
        y: [-10, 10, -10],
        transition: {
            duration: 6,
            ease: "easeInOut",
            repeat: Infinity
        }
    }
};

const delayedFloat = {
    initial: { y: 0 },
    animate: {
        y: [10, -10, 10],
        transition: {
            duration: 7,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 1
        }
    }
};

export default function UniversePage() {
    return (
        <main className="min-h-screen relative overflow-hidden bg-primary text-white perspective-container">

            {/* 3D Perspective Grid Floor */}
            <div className="perspective-grid pointer-events-none" />

            {/* Ambient Spotlights */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-neon/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent-ruby/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 space-y-24">

                {/* Header - Command Center Style */}
                <header className="text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-block border border-accent-neon/30 px-6 py-2 rounded-full backdrop-blur-md bg-black/40"
                    >
                        <span className="text-accent-neon font-mono tracking-[0.3em] text-xs uppercase glow-text">
                            SystemStatus: Online
                        </span>
                    </motion.div>

                    <h1 className="text-7xl md:text-9xl font-bold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                        THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-neon to-accent-ruby">UNIVERSE</span>
                    </h1>

                    <p className="text-content-secondary max-w-2xl mx-auto text-lg font-light leading-relaxed">
                        Control the narrative. Build the future. <br />
                        <span className="text-accent font-mono text-sm">Welcome to the command deck, Architect.</span>
                    </p>
                </header>

                {/* Floating Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column - Season Pass (The Key) */}
                    <motion.div
                        variants={floatingVariant}
                        initial="initial"
                        animate="animate"
                        className="lg:col-span-5 sticky top-24"
                    >
                        <div className="p-1 border border-accent/20 rounded-3xl relative">
                            <div className="absolute -top-3 left-6 px-3 bg-black text-accent text-xs font-mono uppercase tracking-widest border border-accent/20">
                                Priority Access
                            </div>
                            <SeasonPassCard />
                        </div>
                    </motion.div>

                    {/* Right Column - Active Modules */}
                    <div className="lg:col-span-7 space-y-8">

                        {/* Rewards - Holographic Panel */}
                        <motion.div
                            variants={delayedFloat}
                            initial="initial"
                            animate="animate"
                            className="glass-crystal p-8 rounded-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-neon/20 blur-[60px] rounded-full" />
                            <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
                                <span className="w-2 h-2 bg-accent-neon rounded-full animate-pulse" />
                                Progression
                            </h2>
                            <RewardsTrack currentXP={1700} />
                        </motion.div>

                        {/* Quests - Data Board */}
                        <motion.div
                            variants={floatingVariant}
                            initial="initial"
                            animate="animate"
                        >
                            <QuestBoard />
                        </motion.div>

                    </div>
                </div>

                {/* Chapters Section - Horizontal Stream */}
                <section className="relative">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        <h2 className="text-3xl font-serif font-bold text-center">Data Archives</h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <WeeklyChapterCard
                            chapterNumber={2}
                            title="Digital Echoes"
                            image="https://placehold.co/800x600/0A0510/4D4DFF/png?text=System+Echo"
                            dropDate={new Date(Date.now() + 86400000).toISOString()}
                        />
                        <WeeklyChapterCard
                            chapterNumber={1}
                            title="Origin of the Void"
                            image="https://placehold.co/800x600/0A0510/E5C09D/png?text=Void+Entry"
                            dropDate={new Date(Date.now() - 86400000 * 5).toISOString()}
                        />
                    </div>
                </section>

            </div>
        </main>
    );
}
