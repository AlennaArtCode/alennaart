'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // Smooth scroll progress
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    // --- ANIMATION RANGES (Refined for "Stop" Effect) ---

    // TEXT 1: "Sé por qué estás aquí..." (0.0 - 0.2)
    const opacityText1 = useTransform(smoothProgress, [0, 0.05, 0.15, 0.2], [0, 1, 1, 0]);
    const yText1 = useTransform(smoothProgress, [0, 0.2], [50, -50]);

    // TEXT 2: "Exemplaria no son dibujos..." (0.2 - 0.4)
    const opacityText2 = useTransform(smoothProgress, [0.25, 0.3, 0.35, 0.4], [0, 1, 1, 0]);
    const yText2 = useTransform(smoothProgress, [0.25, 0.4], [50, -50]);

    // CLIMAX: LION & FINAL TEXT (0.4 - 1.0)
    // Reveal starts earlier so user can "linger"
    const lionOpacity = useTransform(smoothProgress, [0.45, 0.55], [0, 1]);
    const lionScale = useTransform(smoothProgress, [0.45, 0.7], [0.8, 1]);

    // Final Text: "El dolor no tiene forma..."
    const opacityText3 = useTransform(smoothProgress, [0.5, 0.6], [0, 1]);

    // Main Title "Minting The Future"
    const titleOpacity = useTransform(smoothProgress, [0.6, 0.7], [0, 1]);
    const titleY = useTransform(smoothProgress, [0.6, 0.8], [50, 0]);

    // NEW: "CONTINUE" BUTTON INDICATOR (Appears during the "Stop" phase 0.7-0.9)
    const continueOpacity = useTransform(smoothProgress, [0.75, 0.85, 0.95, 1], [0, 1, 1, 0]);

    return (
        // TALLER CONTAINER to force a longer scroll duration
        <section ref={containerRef} className="relative h-[400vh]">

            {/* STICKY VIEWPORT */}
            <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-[#050505]">

                {/* --- PHANTOM TEXTS --- */}

                {/* 1. THE INVITATION */}
                <motion.div
                    style={{ opacity: opacityText1, y: yText1 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 px-6"
                >
                    <p className="text-3xl md:text-5xl font-serif text-white text-center leading-relaxed">
                        I know why you are here. <br />
                        <span className="text-white/50 italic">You seek order in the chaos.</span>
                    </p>
                </motion.div>

                {/* 2. THE REVELATION */}
                <motion.div
                    style={{ opacity: opacityText2, y: yText2 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 px-6"
                >
                    <p className="text-3xl md:text-5xl font-serif text-white text-center leading-relaxed">
                        Exemplaria are not drawings. <br />
                        <span className="text-accent">They are scars turned into light.</span>
                    </p>
                </motion.div>


                {/* --- THE CLIMAX (LION + FINAL LAYOUT) --- */}

                <div className="relative w-full h-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center md:justify-between px-6 z-20">

                    {/* LEFT: FINAL TEXTS */}
                    <motion.div
                        style={{ opacity: titleOpacity, y: titleY }}
                        className="flex-1 text-center md:text-left space-y-6 md:pr-12 mt-20 md:mt-0"
                    >
                        {/* Text 3 */}
                        <motion.p
                            style={{ opacity: opacityText3 }}
                            className="text-xl md:text-2xl text-accent font-serif italic mb-8"
                        >
                            "Pain has no form. <br /> But the cure is geometric."
                        </motion.p>

                        <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif font-medium leading-[0.9] text-white tracking-tight">
                            Minting <br />
                            The Future
                        </h1>
                        <p className="text-xl text-white/40 font-light max-w-lg mx-auto md:mx-0">
                            Exclusive Art Pieces Tokenized <br />
                            Handmade for Collectors
                        </p>
                    </motion.div>

                    {/* RIGHT: THE LION */}
                    <motion.div
                        style={{ opacity: lionOpacity, scale: lionScale }}
                        className="flex-1 relative w-full h-[50vh] md:h-[80vh] flex items-center justify-center"
                    >
                        <div className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px]">
                            {/* Spotlight behind lion */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(240,180,41,0.15)_0%,transparent_70%)] blur-[80px]" />

                            <Image
                                src="/art/lion-transparent.png"
                                alt="Lion Geometric Art"
                                fill
                                className="object-contain drop-shadow-[0_0_50px_rgba(240,180,41,0.2)]"
                                priority
                            />
                            {/* Seamless Fade */}
                            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent z-10" />
                        </div>
                    </motion.div>
                </div>

                {/* SCROLL INDICATOR 1 (Start) */}
                <motion.div
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 text-xs tracking-[0.3em] font-sans animate-bounce"
                >
                    SCROLL TO BEGIN
                </motion.div>

                {/* SCROLL INDICATOR 2 (The "Stop" point - Continue to Collection) */}
                <motion.div
                    style={{ opacity: continueOpacity }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-10 flex flex-col items-center gap-2 z-50 cursor-pointer"
                >
                    <span className="text-accent text-[10px] uppercase tracking-[0.3em] font-bold">Enter the Collection</span>
                    <Link href="#collection" className="w-12 h-12 border border-accent/30 rounded-full flex items-center justify-center hover:bg-accent/10 transition-colors animate-pulse">
                        <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </Link>
                </motion.div>

            </div>
        </section>
    );
}
