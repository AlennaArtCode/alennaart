'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function Codex() {
    const { t } = useLanguage();
    return (
        <section className="py-32 relative bg-[#050505] overflow-hidden">
            {/* Background Texture/Noise could go here */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-5 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 max-w-5xl">

                {/* HEADLINES */}
                <div className="text-center mb-20 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="text-6xl md:text-8xl font-serif text-white tracking-tight"
                    >
                        {t('codex', 'title')}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.4, ease: "easeInOut" }}
                        className="text-accent text-sm md:text-base font-sans uppercase tracking-[0.4em] font-light"
                    >
                        {t('codex', 'subtitle')}
                    </motion.p>
                </div>

                {/* EDITORIAL CONTENT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-lg md:text-xl font-light text-white/80 leading-relaxed font-serif text-justify">

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.6, ease: "easeInOut" }}
                    >
                        <p>
                            <span className="float-left text-7xl md:text-8xl font-serif text-accent mr-4 mt-[-10px] leading-none">{t('codex', 'p1_first_letter')}</span>
                            {t('codex', 'p1_rest')}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
                        className="flex flex-col justify-between"
                    >
                        <p>
                            {t('codex', 'p2')}
                        </p>

                        {/* Signature or Seal */}
                        <div className="mt-8 self-end">
                            <div className="w-24 h-px bg-accent/50 mb-2" />
                            <p className="text-right text-xs font-sans uppercase tracking-widest text-accent/80">
                                {t('codex', 'signature')}
                            </p>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
