'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    return (
        <section ref={containerRef} className="relative h-screen min-h-[800px] flex flex-col justify-center overflow-hidden">

            {/* BACKGROUND ELEMENTS */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Spotlight behind lion */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(240,180,41,0.1)_0%,transparent_70%)] blur-[100px] opacity-60 animate-pulse-slow" />
            </div>

            {/* MAIN CONTENT - VISIBLE IMMEDIATELY */}
            <motion.div
                className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center md:justify-between px-6 pt-20"
            >

                {/* LEFT: TEXT CONTENT */}
                <div className="flex-1 text-center md:text-left space-y-8 z-20 order-2 md:order-1">
                    <div className="opacity-100 flex flex-col items-center md:items-start">
                        <p className="text-xl md:text-2xl text-accent font-serif italic mb-4">
                            &quot;Pain has no form. <br /> But the cure is geometric.&quot;
                        </p>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium leading-[0.9] text-white tracking-tight mb-6">
                            Minting <br />
                            The Future
                        </h1>

                        <p className="text-lg text-white/40 font-light max-w-lg mx-auto md:mx-0 leading-relaxed mb-8">
                            Discover the <strong>Exemplaria</strong> collection. <br />
                            Exclusive Art Pieces Tokenized on the Blockchain.
                        </p>

                        {/* PLAY / START INTERACTION */}
                        <div className="flex items-center justify-center md:justify-start gap-6">
                            <Link
                                href="#collection"
                                className="group flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 border border-accent hover:bg-accent hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(197,160,89,0.2)] hover:shadow-[0_0_40px_rgba(197,160,89,0.5)] cursor-pointer"
                            >
                                <svg
                                    className="w-6 h-6 text-accent group-hover:text-black ml-1 transition-colors"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </Link>
                            <span className="text-sm uppercase tracking-widest text-white/60 font-bold">Start Experience</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT: THE LION (HERO IMAGE) */}
                <div
                    className="flex-1 relative w-full h-[50vh] md:h-[80vh] flex items-center justify-center order-1 md:order-2"
                >
                    <div className="relative w-[350px] h-[350px] md:w-[650px] md:h-[650px]">
                        <Image
                            src="/art/lion-transparent.png"
                            alt="Lion Geometric Art"
                            fill
                            className="object-contain drop-shadow-[0_0_60px_rgba(240,180,41,0.3)] animate-float-slow"
                            priority
                        />
                        {/* Seamless Fade at bottom */}
                        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent z-10" />
                    </div>
                </div>

            </motion.div>

            {/* SCROLL INDICATOR */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20 text-[10px] tracking-[0.4em] font-sans animate-bounce cursor-pointer hover:text-accent transition-colors"
            >
                SCROLL TO EXPLORE
            </motion.div>

        </section >
    );
}
