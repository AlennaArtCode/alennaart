'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const roadmapData = [
    {
        phase: 'Phase 01',
        title: 'The Awakening',
        description: 'Launch of the Genesis Collection. Early access for whitelisted members. First story chapter unveiled.',
        date: 'Q1 2025',
        active: true,
    },
    {
        phase: 'Phase 02',
        title: 'Expansion',
        description: 'Community events and collaborative storytelling. New character visuals revealed. Holder-exclusive drops.',
        date: 'Q2 2025',
        active: false,
    },
    {
        phase: 'Phase 03',
        title: 'Tokenization',
        description: 'Testing of the governance token. Integration with major marketplaces. Staking mechanisms live.',
        date: 'Q3 2025',
        active: false,
    },
    {
        phase: 'Phase 04',
        title: 'The Metaverse',
        description: '3D galleries and virtual meetups. Full immersion into the Alennaverse. Cross-chain partnerships.',
        date: 'Q4 2025',
        active: false,
    },
];

export default function Roadmap() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end end'],
    });

    const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
        <section ref={containerRef} className="py-32 relative z-10 overflow-hidden">
            <div className="container mx-auto px-6 relative">
                <div className="text-center mb-24">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-4"
                    >
                        The Roadmap
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-content-secondary text-lg max-w-2xl mx-auto"
                    >
                        A journey through creation, innovation, and digital eternity.
                    </motion.p>
                </div>

                {/* Central Laser Line */}
                <div className="absolute left-1/2 top-40 bottom-20 w-1 bg-gradient-to-b from-transparent via-accent-neon/20 to-transparent -translate-x-1/2 hidden md:block">
                    <motion.div
                        style={{ height: pathLength, scaleY: scrollYProgress }}
                        className="w-full bg-gradient-to-b from-accent via-accent-neon to-accent-ruby origin-top shadow-[0_0_20px_rgba(77,77,255,0.5)]"
                    />
                </div>

                <div className="space-y-24 md:space-y-32">
                    {roadmapData.map((item, index) => (
                        <RoadmapItem key={index} item={item} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function RoadmapItem({ item, index }: { item: typeof roadmapData[0]; index: number }) {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
        >
            {/* Date / Phase indicator for Mobile */}
            <div className="md:hidden w-full text-center">
                <span className="text-accent text-sm font-mono tracking-widest uppercase">{item.phase} • {item.date}</span>
            </div>

            {/* Content Card */}
            <div className={`flex-1 w-full md:w-auto ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                <div className="glass-panel p-8 md:p-10 rounded-2xl relative group hover:bg-white/10 transition-colors duration-500">
                    <div className={`absolute top-0 w-32 h-32 bg-accent-neon/10 blur-[50px] rounded-full transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${isEven ? 'right-0' : 'left-0'}`} />

                    <span className="hidden md:block text-accent text-xs font-mono tracking-widest uppercase mb-2">
                        {item.phase}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold font-serif mb-4 text-white group-hover:text-accent-mystic transition-colors">
                        {item.title}
                    </h3>
                    <p className="text-content-secondary leading-relaxed">
                        {item.description}
                    </p>
                </div>
            </div>

            {/* Center Node */}
            <div className="relative z-20 flex-shrink-0">
                <div className="w-4 h-4 rounded-full bg-black border-2 border-accent shadow-[0_0_15px_rgba(240,180,41,0.5)] relative">
                    <div className="absolute inset-0 bg-accent animate-ping opacity-20" />
                </div>
            </div>

            {/* Date Side (Desktop Only) */}
            <div className={`hidden md:block flex-1 ${isEven ? 'text-left' : 'text-right'}`}>
                <span className="text-4xl font-bold text-white/10 font-serif">
                    {item.date}
                </span>
            </div>
        </motion.div>
    );
}
