'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function NFTsPage() {
    return (
        <main className="min-h-screen relative overflow-hidden bg-[#0A0510] text-content-primary">

            {/* GLOBAL FIXED BACKGROUND - The Aurora (Shared Aesthetic) */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="orb-glow w-[800px] h-[800px] bg-accent-mystic/10 top-[-20%] right-[-10%]" />
                <div className="orb-glow w-[600px] h-[600px] bg-accent-neon/10 bottom-[-10%] left-[-10%] animate-float-delayed" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0510]/50 to-[#0A0510]" />
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
                            Digital Assets & True Ownership
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold font-serif tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                    >
                        ALENNA'S <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#8a6e35]">NFTs</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-content-secondary max-w-2xl mx-auto text-lg font-light leading-relaxed"
                    >
                        Collect exclusive pieces from my digital universe. Verified on the blockchain, granting you true ownership and exclusive access to future experiences.
                    </motion.p>
                </header>

                {/* Featured Drop Section */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="relative"
                >
                    <div className="absolute -inset-4 bg-gradient-to-r from-accent/10 to-transparent blur-xl rounded-3xl" />
                    <div className="relative glass-panel rounded-3xl overflow-hidden border border-accent/20">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            {/* Visual */}
                            <div className="relative h-[400px] md:h-auto bg-black border-b md:border-b-0 md:border-r border-white/5 overflow-hidden group">
                                <div className="absolute inset-0 bg-accent/10 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-700" />
                                <Image
                                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
                                    alt="Featured Project"
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute top-6 left-6 z-20">
                                    <span className="bg-accent text-black font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_15px_rgba(197,160,89,0.5)]">
                                        Upcoming Drop
                                    </span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-transparent to-black/50">
                                <h2 className="text-3xl lg:text-5xl font-serif text-white mb-4">The Convergence Series</h2>
                                <p className="text-content-secondary mb-8 leading-relaxed font-light">
                                    A limited collection of 50 unique digital artifacts blending surreal geometry with high-fashion elements. Neural-generated textures combined with master-level digital painting techniques. Early access available for Genesis holders.
                                </p>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                        <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Network</div>
                                        <div className="font-mono text-accent">Ethereum</div>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                        <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Items</div>
                                        <div className="font-mono text-accent">50 / 50 Remaining</div>
                                    </div>
                                </div>

                                <button className="w-full py-4 text-center border-2 border-accent text-accent font-bold uppercase tracking-widest text-xs hover:bg-accent hover:text-black transition-all glow-button relative overflow-hidden group">
                                    <span className="relative z-10">Notify Me on Launch</span>
                                    <div className="absolute inset-0 bg-accent/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Collections Gallery - Placeholder for more NFTs */}
                <section className="relative pt-12 space-y-12">
                    <div className="flex items-center gap-6">
                        <h2 className="text-3xl font-serif font-bold text-white tracking-widest uppercase">Past Collections</h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <CollectionCard
                            title="Genesis Zero"
                            year="2024"
                            image="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop"
                            desc="The foundational 10 pieces that started the journey. Sold out."
                        />
                        <div className="glass-panel border-dashed border-white/10 flex items-center justify-center min-h-[300px] text-content-muted rounded-xl">
                            <span className="font-mono text-xs uppercase tracking-widest">Awaiting Transmission...</span>
                        </div>
                    </div>
                </section>

            </div>
        </main>
    );
}

function CollectionCard({ title, year, image, desc }: { title: string, year: string, image: string, desc: string }) {
    return (
        <div className="glass-panel rounded-xl overflow-hidden group cursor-pointer hover:bg-white/5 transition-colors border border-white/5 hover:border-accent/30 flex flex-col">
            <div className="relative h-48 overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0510] to-transparent" />
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md border border-white/10 px-2 py-1 rounded text-[9px] uppercase tracking-widest text-white/70">
                    {year}
                </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-serif font-bold text-white group-hover:text-accent transition-colors mb-2">{title}</h3>
                <p className="text-sm text-content-muted font-light leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}
