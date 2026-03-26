'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { Music } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Hero({ customImage }: { customImage?: string | null }) {
    const { t } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    return (
        <section ref={containerRef} className="relative h-screen min-h-[600px] md:min-h-[800px] flex flex-col justify-center overflow-hidden">

            {/* BACKGROUND ELEMENTS */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Spotlight behind lion */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[800px] md:h-[800px] bg-[radial-gradient(circle_at_center,rgba(240,180,41,0.1)_0%,transparent_70%)] blur-[60px] md:blur-[100px] opacity-60 animate-pulse-slow" />
            </div>

            {/* MAIN CONTENT - VISIBLE IMMEDIATELY */}
            <motion.div
                className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center md:justify-between px-6 pt-10 md:pt-20"
            >

                {/* LEFT: TEXT CONTENT */}
                <div className="flex-1 text-center md:text-left space-y-6 md:space-y-8 z-20 order-2 md:order-1">
                    <div className="opacity-100 flex flex-col items-center md:items-start">
                        <p className="text-lg md:text-2xl text-accent font-serif italic mb-2 md:mb-4 px-4 md:px-0">
                            &quot;{t('hero', 'quote_1')}&quot; <br /> {t('hero', 'quote_2')}
                        </p>

                        <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-medium leading-[1.1] md:leading-[0.9] text-white tracking-tight mb-4 md:mb-6">
                            {t('hero', 'title_1')} <br className="hidden md:block" />
                            {t('hero', 'title_2')}
                        </h1>

                        <p className="text-base md:text-lg text-white/40 font-light max-w-lg mx-auto md:mx-0 leading-relaxed mb-6 md:mb-8 px-4 md:px-0">
                            {t('hero', 'subtitle_1')} <br className="hidden md:block" />
                            {t('hero', 'subtitle_2')}
                        </p>

                        {/* PLAY / START INTERACTION */}
                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 sm:gap-6 pt-2">
                            <div className="flex items-center gap-4">
                                <Link
                                    href="#collection"
                                    className="group flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-accent/10 border border-accent hover:bg-accent hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(197,160,89,0.2)] hover:shadow-[0_0_40px_rgba(197,160,89,0.5)] cursor-pointer"
                                >
                                    <svg
                                        className="w-5 h-5 sm:w-6 sm:h-6 text-accent group-hover:text-black ml-1 transition-colors"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </Link>
                                <span className="text-xs sm:text-sm uppercase tracking-widest text-white/60 font-bold hidden xs:block">{t('hero', 'explore')}</span>
                            </div>

                            <div className="w-px h-8 bg-white/20 hidden sm:block" />

                            <Link
                                href="/music"
                                className="group flex items-center gap-3 px-5 py-2 sm:px-6 sm:py-4 rounded-full bg-white/5 border border-white/20 hover:border-accent hover:bg-accent/10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                            >
                                <Music size={16} className="text-accent group-hover:scale-110 transition-transform sm:w-[18px]" />
                                <span className="text-xs sm:text-sm uppercase tracking-widest text-white font-bold group-hover:text-accent transition-colors">{t('hero', 'listen')}</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* RIGHT: THE LION (HERO IMAGE) */}
                <div
                    className="flex-1 relative w-full h-[45vh] min-h-[320px] md:h-[80vh] flex items-center justify-center order-1 md:order-2 mb-4 md:mb-0"
                >
                    <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[650px] md:h-[650px]">
                        <Image
                            src={customImage || "/art/lion-transparent.png"}
                            alt="Hero Art"
                            fill
                            className="object-contain animate-float-slow"
                            style={{ mixBlendMode: 'screen' }}
                            priority
                            sizes="(max-width: 768px) 280px, 650px"
                        />
                        {/* Seamless Fade at bottom */}
                        <div className="absolute bottom-0 left-0 w-full h-12 md:h-32 bg-gradient-to-t from-[#050505] to-transparent z-10" />
                    </div>
                </div>

            </motion.div>

            {/* SCROLL INDICATOR */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
                className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 text-white/20 text-[8px] md:text-[10px] tracking-[0.4em] font-sans animate-bounce cursor-pointer hover:text-accent transition-colors"
            >
                {t('hero', 'scroll')}
            </motion.div>

        </section >
    );
}
