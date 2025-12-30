'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
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
        <main className="min-h-screen relative overflow-hidden bg-[#0A0510] text-content-primary">

            {/* GLOBAL FIXED BACKGROUND - The Aurora (Shared Aesthetic) */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Floating Orbs - The "Auroras" */}
                <div className="orb-glow w-[800px] h-[800px] bg-accent-mystic/10 top-[-20%] right-[-10%]" />
                <div className="orb-glow w-[600px] h-[600px] bg-accent-neon/10 bottom-[-10%] left-[-10%] animate-float-delayed" />

                {/* Ambient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0510]/50 to-[#0A0510]" />

                {/* Texture */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 space-y-24">

                {/* Header - Command Center Style */}
                <header className="text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-block border border-accent/30 px-6 py-2 rounded-full backdrop-blur-md bg-white/5"
                    >
                        {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
                        <span className="text-accent font-mono tracking-[0.3em] text-xs uppercase glow-text">
                            Alennaverse System | Hub
                        </span>
                    </motion.div>

                    <h1 className="text-6xl md:text-8xl font-bold font-serif tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-hover">UNIVERSE</span>
                    </h1>

                    <p className="text-content-secondary max-w-2xl mx-auto text-lg font-light leading-relaxed">
                        The nexus of all creation. Manage your assets, track your progress, and explore the archives of the past.
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
                        <div className="glass-panel p-2 rounded-3xl relative group">
                            <div className="absolute -top-3 left-6 px-3 bg-[#0A0510] text-accent text-xs font-mono uppercase tracking-widest border border-accent/20 rounded">
                                Season Access
                            </div>
                            <SeasonPassCard />
                        </div>
                    </motion.div>

                    {/* Right Column - Active Modules */}
                    <div className="lg:col-span-7 space-y-8">

                        {/* Rewards */}
                        <motion.div
                            variants={delayedFloat}
                            initial="initial"
                            animate="animate"
                            className="glass-panel p-8 rounded-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 blur-[50px] rounded-full" />
                            <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3 text-white">
                                <span className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-[0_0_10px_#F0B429]" />
                                Your Progression
                            </h2>
                            <RewardsTrack currentXP={1700} />
                        </motion.div>

                        {/* Quests */}
                        <motion.div
                            variants={floatingVariant}
                            initial="initial"
                            animate="animate"
                        >
                            <QuestBoard />
                        </motion.div>

                    </div>
                </div>

                {/* Legacy Collections - Horizontal Stream */}
                <section className="relative pt-12">
                    <div className="flex items-center gap-6 mb-16">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <h2 className="text-3xl font-serif font-bold text-center text-white/50 tracking-widest uppercase">Legacy Archives</h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Placeholder for Past Collections */}
                        <ArchiveCard
                            year="2024"
                            title="Genesis Zero"
                            image="https://placehold.co/600x400/100515/333/png?text=Genesis"
                        />
                        <ArchiveCard
                            year="2023"
                            title="Pre-Alpha Specs"
                            image="https://placehold.co/600x400/100515/333/png?text=Pre-Alpha"
                        />
                        <div className="glass-panel border-dashed border-white/10 flex items-center justify-center min-h-[200px] text-content-muted">
                            <span className="font-mono text-xs uppercase tracking-widest">More Data Recovering...</span>
                        </div>
                    </div>
                </section>

            </div>
        </main>
    );
}

function ArchiveCard({ title, year, image }: { title: string, year: string, image: string }) {
    return (
        <div className="glass-panel rounded-xl overflow-hidden group cursor-pointer hover:bg-white/5 transition-colors">
            <div className="relative h-48 opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0">
                {/* Using standard img for placeholder or next/image if you prefer, keeping simple for archive */}
                <Image src={image} alt={title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0510] to-transparent" />
            </div>
            <div className="p-6">
                <span className="text-xs font-mono text-accent-muted block mb-1">{year}</span>
                <h3 className="text-xl font-serif font-bold text-white group-hover:text-accent transition-colors">{title}</h3>
            </div>
        </div>
    );
}
