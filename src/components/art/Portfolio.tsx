'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { defaultPortfolioItems, PortfolioItem } from '@/data/portfolioData';

type FilterType = 'All' | 'NFT Drop' | 'Logos' | 'Fine Art' | 'Concept';

export default function Portfolio() {
    const [filter, setFilter] = useState<FilterType>('All');

    const categories: FilterType[] = ['All', 'NFT Drop', 'Logos', 'Fine Art', 'Concept'];

    const filteredItems = filter === 'All'
        ? defaultPortfolioItems
        : defaultPortfolioItems.filter(item => item.category === filter);

    return (
        <section className="min-h-screen p-8 bg-zinc-950 text-white">
            <div className="max-w-7xl mx-auto space-y-12">
                <header className="space-y-4">
                    <h2 className="text-4xl font-bold tracking-tighter">Selected Works</h2>
                    <div className="flex gap-4 flex-wrap">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-4 py-2 rounded-full text-sm transition-colors ${filter === cat
                                        ? 'bg-white text-black font-medium'
                                        : 'bg-zinc-900 text-zinc-400 hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </header>

                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[300px]"
                >
                    <AnimatePresence>
                        {filteredItems.map((item) => (
                            <PortfolioCard key={item.id} item={item} />
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
}

function PortfolioCard({ item }: { item: PortfolioItem }) {
    // Size classes mapping
    const sizeClasses = {
        normal: "md:col-span-1 md:row-span-1",
        wide: "md:col-span-2 md:row-span-1",
        tall: "md:col-span-1 md:row-span-2",
        large: "md:col-span-2 md:row-span-2",
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`group relative overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 ${sizeClasses[item.size]}`}
        >
            {item.image ? (
                <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            ) : (
                <div
                    className="h-full w-full"
                    style={{ backgroundColor: item.color || '#18181b' }}
                />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <p className="text-zinc-400 text-sm">{item.category}</p>
                <h3 className="text-xl font-bold">{item.title}</h3>
            </div>
        </motion.div>
    );
}
