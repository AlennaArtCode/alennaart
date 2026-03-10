'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

type ShowcaseItem = {
    id: string;
    title: string;
    category: string;
    image_url: string;
    rarity: string;
    description: string;
};

// Map rarity to colors visually matching the original aesthetic
const getRarityColor = (rarity: string) => {
    switch (rarity?.toUpperCase()) {
        case 'LEGENDARY': return '#FFD700'; // Gold
        case 'EPIC': return '#cd7f32';     // Bronze/Copper
        case 'RARE': return '#60a5fa';     // Blue
        case 'ANOMALY': return '#9d00ff';  // Purple
        default: return '#C5A059';         // Default Accent
    }
};

export default function ShowcaseGrid() {
    const [items, setItems] = useState<ShowcaseItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShowcase = async () => {
            const { data, error } = await supabase
                .from('artworks')
                .select('*')
                // Let's bring in all public visual art for the portfolio vault
                .not('category', 'eq', 'Music')
                .eq('is_public', true)
                .order('created_at', { ascending: false });

            if (!error && data) {
                setItems(data.map(d => ({
                    id: d.id,
                    title: d.title,
                    category: d.category,
                    image_url: d.image_url,
                    rarity: d.rarity || 'COMMON',
                    description: d.description || 'Verified on the main network.'
                })));
            }
            setLoading(false);
        };

        fetchShowcase();
    }, []);

    return (
        <section className="py-24 bg-[#050505] min-h-screen">
            <div className="container mx-auto px-6">

                {/* Header Section */}
                <div className="mb-20 text-center space-y-4">
                    <h2 className="text-5xl md:text-6xl font-serif font-bold text-white tracking-tight">
                        Vitrina <span className="text-accent italic">Exemplaria</span>
                    </h2>
                    <p className="text-white/40 font-mono text-sm tracking-[0.3em] uppercase">
                        The Master Collection
                    </p>
                </div>

                {/* THE GRID */}
                {loading ? (
                    <div className="py-32 text-center text-white/30 font-mono uppercase tracking-widest text-sm animate-pulse">
                        Accessing the Vault...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.map((item) => (
                            <NftCard key={item.id} item={item} />
                        ))}
                        {items.length === 0 && (
                            <div className="col-span-full border-dashed border-white/10 flex items-center justify-center min-h-[300px] text-content-muted rounded-xl">
                                <span className="font-mono text-xs uppercase tracking-widest">No assets found in the current sector.</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

// --- SUB-COMPONENT: NFT CARD ---

function NftCard({ item }: { item: ShowcaseItem }) {
    const isVideo = item.image_url?.includes('.mp4');
    const rarityColor = getRarityColor(item.rarity);

    return (
        <motion.div
            className="group relative flex flex-col h-[500px] w-full bg-[#0A0510] rounded-xl overflow-hidden cursor-crosshair transition-all duration-500"
            // Hover: Glow in Rarity Color
            whileHover={{
                boxShadow: `0 0 30px ${rarityColor}40`, // 40 is opacity hex
                y: -10
            }}
        >
            {/* 1. IMAGE AREA (Top) */}
            <div className="relative h-full w-full overflow-hidden flex items-center justify-center bg-black/50">
                {isVideo ? (
                    <video
                        src={item.image_url}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />
                ) : (
                    <Image
                        src={item.image_url && item.image_url.trim() !== '' ? item.image_url : 'https://placehold.co/400?text=No+Image'}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />
                )}

                {/* Seamless Gradient Overlay - Hides bottom cuts */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0A0510] via-[#0A0510]/60 to-transparent pointer-events-none" />

                {/* General subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/40 via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>

            {/* 2. INFO PANEL (Bottom) - Glassmorphism */}
            <div
                className="absolute bottom-4 left-4 right-4 p-5 backdrop-blur-md bg-white/[0.03] border border-white/10 rounded-lg flex flex-col gap-2 transition-all duration-300 group-hover:bg-white/[0.08]"
                style={{
                    borderLeft: `4px solid ${rarityColor}`
                }}
            >
                {/* Rarity Label */}
                <span
                    className="text-[10px] font-sans font-bold tracking-[0.3em] uppercase"
                    style={{ color: rarityColor }}
                >
                    {item.rarity}
                </span>

                {/* Title */}
                <h3 className="text-2xl font-serif font-bold text-white leading-none">
                    {item.title}
                </h3>

                {/* Subtitle / Category */}
                <p className="text-[#C5A059] text-xs font-sans font-medium uppercase tracking-wider">
                    {item.category}
                </p>

                {/* Description (Hidden by default, optional reveal on hover could go here, but staying clean per ref) */}
                <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-300">
                    <p className="text-white/60 text-[10px] mt-2 leading-relaxed border-t border-white/10 pt-2">
                        {item.description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
