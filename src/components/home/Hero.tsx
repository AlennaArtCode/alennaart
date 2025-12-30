'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

export default function Hero() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={targetRef} className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-0 md:pt-0">
            {/* Background */}
            <div className="absolute inset-0 bg-primary-dark z-0 pointer-events-none">
                {/* Radial Gradient for Spotlight Effect behind the Lion */}
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-l from-[#593E25]/20 to-transparent blur-[100px] rounded-full mix-blend-screen opacity-60" />

                {/* Subtle Ambient Light everywhere */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary-dark via-primary to-primary opacity-90" />
            </div>

            <div className="container mx-auto px-6 relative z-10 h-full flex flex-col md:flex-row items-center justify-between gap-12">

                {/* LEFT COLUMN: Typography */}
                <motion.div
                    style={{ y, opacity }}
                    className="flex-1 text-center md:text-left space-y-8 max-w-2xl"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="text-accent text-lg font-serif tracking-wide block mb-4">
                            Alenna Art
                        </span>

                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-medium leading-[0.9] text-white tracking-tight">
                            Minting <br />
                            The Future
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-xl md:text-2xl text-content-secondary font-light max-w-lg mx-auto md:mx-0 leading-relaxed"
                    >
                        Exclusive Art Pieces Tokenized <br />
                        <span className="text-content-primary">Handmade for Collectors</span>
                    </motion.p>
                </motion.div>

                {/* RIGHT COLUMN: The Artwork */}
                <div className="flex-1 relative w-full h-[50vh] md:h-[80vh] flex items-center justify-center md:justify-end">

                    {/* The Art Piece */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="relative z-10 animate-float"
                    >
                        <div className="relative w-[500px] h-[500px] md:w-[700px] md:h-[700px]">
                            <Image
                                src="/art/lion-transparent.png"
                                alt="Lion Geometric Art"
                                fill
                                className="object-contain drop-shadow-[0_0_50px_rgba(240,180,41,0.3)]"
                                priority
                            />
                            {/* Seamless Fade to Bottom - Hides the "cut" */}
                            <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent z-10 pointer-events-none" />
                        </div>
                    </motion.div>
                    {/* Scroll Down Indicator (Circular Text) */}
                    <div className="absolute bottom-0 right-1/2 translate-x-1/2 md:translate-x-0 md:right-12 md:bottom-12 z-20">
                        <Link href="#collection" className="group relative flex items-center justify-center w-32 h-32">
                            {/* Rotating Text Ring */}
                            <div className="absolute inset-0 animate-[spin_10s_linear_infinite] opacity-60 group-hover:opacity-100 transition-opacity">
                                <svg viewBox="0 0 100 100" className="w-full h-full">
                                    <defs>
                                        <path id="circle" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                                    </defs>
                                    <text fontSize="10.5" fill="currentColor" className="text-content-primary uppercase tracking-[0.2em] font-sans font-medium">
                                        <textPath xlinkHref="#circle">
                                            Scroll Down • Scroll Down •
                                        </textPath>
                                    </text>
                                </svg>
                            </div>

                            {/* Central Arrow Button */}
                            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center transform transition-transform group-hover:scale-110 shadow-glow">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 text-primary-dark"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
