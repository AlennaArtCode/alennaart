'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

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

                {/* Header */}
                <header className="text-center space-y-6 pt-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="inline-block border border-accent/30 px-6 py-2 rounded-full backdrop-blur-md bg-white/5"
                    >
                        <span className="text-accent font-mono tracking-[0.3em] text-xs uppercase glow-text">
                            Portfolio & Upcoming Mints
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold font-serif tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                    >
                        ALENNA'S <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#8a6e35]">PROJECTS</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-content-secondary max-w-2xl mx-auto text-lg font-light leading-relaxed"
                    >
                        Discover the expanding universe of my digital art. From exclusive experimental modules to ongoing creative endeavors, explore the visions shaping the Alenna Art legacy.
                    </motion.p>
                </header>


                {/* Projects Gallery */}
                <section className="relative pt-12 space-y-12">
                    <div className="flex items-center gap-6">
                        <h2 className="text-3xl font-serif font-bold text-white tracking-widest uppercase">Ongoing Projects</h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <ProjectCard
                            title="Exemplaria"
                            category="Digital Exhibit"
                            status="In Progress"
                            image="https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=2600&auto=format&fit=crop"
                            desc="The core database housing all multimedia creations. Serving as the foundation for the Alenna catalog."
                        />
                        <ProjectCard
                            title="Chromatic Resurgence"
                            category="NFT Concept"
                            status="Planning Phase"
                            image="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop"
                            desc="Exploring pure color theory merged with hyper-realistic rendering. Expected Q4."
                        />
                        <ProjectCard
                            title="Sonic Frequencies"
                            category="Audio/Visual"
                            status="Live"
                            image="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2669&auto=format&fit=crop"
                            desc="A multi-sensory experience pairing auditory tracks with visual spectacles."
                        />
                    </div>
                </section>

                {/* Pre-footer Call to Action */}
                <section className="py-24 text-center">
                    <h3 className="text-2xl font-serif text-white/80 mb-6">Stay updated on future mints</h3>
                    <div className="inline-flex flex-col sm:flex-row gap-4 w-full max-w-md">
                        <input
                            type="email"
                            placeholder="Transmission Address..."
                            className="flex-1 bg-white/5 border border-white/20 rounded-md px-4 py-3 text-sm focus:border-accent outline-none font-mono text-white placeholder:text-white/30"
                        />
                        <button className="bg-white text-black px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-accent transition-colors rounded-md">
                            Subscribe
                        </button>
                    </div>
                </section>

            </div>
        </main>
    );
}

function ProjectCard({ title, category, image, desc, status }: { title: string, category: string, image: string, desc: string, status: string }) {
    return (
        <div className="glass-panel rounded-xl overflow-hidden group cursor-pointer hover:bg-white/5 transition-colors border border-white/5 hover:border-accent/30 flex flex-col">
            <div className="relative h-56 overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100 grayscale hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0510] to-transparent" />
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md border border-white/10 px-2 py-1 rounded text-[9px] uppercase tracking-widest text-white/70">
                    {status}
                </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
                <span className="text-[10px] font-bold tracking-[0.2em] text-accent block mb-2 uppercase">{category}</span>
                <h3 className="text-xl font-serif font-bold text-white group-hover:text-accent transition-colors mb-3 leading-tight">{title}</h3>
                <p className="text-sm text-content-muted font-light leading-relaxed flex-1">{desc}</p>
            </div>
        </div>
    );
}
