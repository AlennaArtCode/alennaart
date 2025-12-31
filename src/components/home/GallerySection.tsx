'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Helper to keep types consistent
type GalleryItem = {
    id: string;
    title: string;
    category: string;
    rarity: string;
    image_url: string;
    description?: string;
    subtitle?: string; // Mapped from DB description or type
    memory_log?: any; // kept for compatibility if we add complex json later
};

export default function GallerySection() {
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            const { data, error } = await supabase
                .from('artworks')
                .select('*')
                .eq('is_public', true)
                .order('created_at', { ascending: false });

            if (data) {
                // Map DB fields to UI expected structure
                const mappedItems = data.map((d: any) => ({
                    id: d.id,
                    title: d.title,
                    category: d.category,
                    rarity: d.rarity || 'Common',
                    image_url: d.image_url || d.image_path, // Fallback
                    description: d.description,
                    subtitle: d.description ? d.description.substring(0, 50) + "..." : "Artifact from the Void",
                    memory_log: null // DB doesn't have this JSON yet, can be added later
                }));
                setItems(mappedItems);
            }
            setLoading(false);
        };

        fetchGallery();
    }, []);

    const trinity = items.filter(i => i.category === "Trinity");
    // const geometry = items.filter(i => i.category === "Geometry"); 
    // Show ALL non-trinity/non-anomalies as Geometry for now to ensure content appears
    const geometry = items.filter(i => i.category === "Geometry" || i.category === "Fine Art" || i.category === "Concept");
    const anomalies = items.filter(i => i.category === "Anomaly" || i.category === "Anomalies");

    if (loading) return <div className="py-32 text-center text-white/20 font-mono animate-pulse">Scanning Archives...</div>;

    return (
        <section className="py-32 relative z-10 space-y-32">

            {/* SECCIÓN A: THE TRINITY */}
            {trinity.length > 0 && (
                <div className="container mx-auto px-6">
                    <Header title="The Trinity" subtitle="The Architects of the Golden Web" />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {trinity.map((item) => (
                            <TrinityCard key={item.id} item={item} onSelect={() => setSelectedItem(item)} />
                        ))}
                    </div>
                </div>
            )}

            {/* SECCIÓN B: SACRED GEOMETRY */}
            {geometry.length > 0 && (
                <div className="container mx-auto px-6">
                    <Header title="Sacred Geometry" subtitle="The Imperial Guard" centered />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {geometry.map((item) => (
                            <GeometryCard key={item.id} item={item} onSelect={() => setSelectedItem(item)} />
                        ))}
                    </div>
                </div>
            )}

            {/* SECCIÓN C: CHROMATIC ANOMALIES */}
            {anomalies.length > 0 && (
                <div className="relative border-t border-accent-neon/20 bg-black/40 backdrop-blur-sm py-24">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-neon to-transparent shadow-[0_0_20px_#4D4DFF]" />
                    <div className="container mx-auto px-6">
                        <div className="mb-16 text-center">
                            <h2 className="text-4xl md:text-5xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-accent-neon to-accent-ruby animate-pulse tracking-tighter">
                                CHROMATIC ANOMALIES
                            </h2>
                            <p className="text-accent-neon/60 font-mono text-sm tracking-widest mt-2 uppercase">
                            // System Warning: Foreign Frequency Detected
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                            {anomalies.map((item) => (
                                <AnomalyCard key={item.id} item={item} onSelect={() => setSelectedItem(item)} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* EMPTY STATE */}
            {items.length === 0 && (
                <div className="py-20 text-center text-white/30 font-serif">
                    <p>The archives are currently silent.</p>
                </div>
            )}

            {/* FLOATING DETAIL MODAL */}
            <AnimatePresence>
                {selectedItem && (
                    <ArtDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
                )}
            </AnimatePresence>

        </section>
    );
}

// --- SUB-COMPONENTS ---

function ArtDetailModal({ item, onClose }: { item: GalleryItem, onClose: () => void }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={onClose}
        >
            <motion.div
                layoutId={`card-${item.id}`}
                className={`relative bg-[#0A0510]/95 border border-accent/40 rounded-2xl shadow-[0_0_50px_rgba(197,160,89,0.2)] overflow-hidden transition-all duration-500 ${isExpanded ? 'w-full h-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row' : 'w-full max-w-md'}`}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
                {/* Background Glows (Only in standard view) */}
                {!isExpanded && (
                    <>
                        <div className="absolute -top-20 -left-20 w-40 h-40 bg-accent/20 blur-[60px] rounded-full" />
                        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent/20 blur-[60px] rounded-full" />
                    </>
                )}

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 text-white/50 hover:text-white transition-colors bg-black/20 p-2 rounded-full backdrop-blur-sm"
                >
                    <X size={24} />
                </button>

                {/* IMAGE SECTION */}
                <div
                    className={`relative cursor-zoom-in group flex items-center justify-center overflow-hidden ${isExpanded ? 'w-full md:w-2/3 h-[30vh] md:h-full bg-black/40' : 'w-full h-80'}`}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {/* Spotlight Effect - Behind Image - Softer and Larger */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.25)_0%,transparent_60%)] opacity-100 blur-3xl" />

                    <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        className={`object-contain transition-transform duration-700 z-10 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] ${isExpanded ? 'p-4 scale-100' : 'scale-90 group-hover:scale-100'}`}
                    />

                    {/* Seamless Fade - Top and Bottom */}
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#0A0510] to-transparent z-20 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0A0510] to-transparent z-20 pointer-events-none" />
                </div>

                {/* INFO SECTION */}
                <div className={`relative p-6 md:p-8 space-y-6 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent ${isExpanded ? 'w-full md:w-1/3 border-t md:border-t-0 md:border-l border-white/10 h-[calc(100%-30vh)] md:h-full' : 'justify-center'}`}>

                    <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div>
                            <h3 className="text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-2 font-mono">Archive // 024-X</h3>
                            <h2 className="text-4xl md:text-5xl font-serif text-white leading-none">{item.title}</h2>
                            <p className="text-lg text-white/50 font-serif italic mt-2">{item.subtitle}</p>
                        </div>

                        {/* GOLDEN THREAD ANIMATION - Module 3 */}
                        <div className="relative py-4">
                            <svg width="100%" height="2" className="overflow-visible">
                                <motion.line
                                    x1="0" y1="1" x2="100%" y2="1"
                                    stroke="#C5A059"
                                    strokeWidth="1"
                                    strokeOpacity="0.5"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                                />
                                <motion.circle
                                    r="2" fill="#C5A059"
                                    initial={{ cx: "0%", opacity: 0 }}
                                    animate={{ cx: "100%", opacity: [0, 1, 0] }}
                                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                                    cy="1"
                                />
                            </svg>
                        </div>

                        {/* MEMORY LOG / BITÁCORA */}
                        <div className="border border-[#C5A059]/30 bg-[#0A0510]/50 p-6 rounded-sm relative overflow-hidden group">
                            {/* Decorative "Confidential" elements */}
                            <div className="absolute top-0 right-0 p-2 opacity-20">
                                <div className="border border-[#C5A059] px-2 text-[8px] font-mono text-[#C5A059] uppercase">Classified</div>
                            </div>
                            <div className="space-y-4 font-mono text-sm leading-relaxed opacity-80">
                                <p className="text-white/80">{item.description || "Data corruption detected. Description unavailable."}</p>
                            </div>
                        </div>

                        {/* Action Area */}
                        <div className="pt-4 flex items-center gap-4">
                            <button className="flex-1 bg-gradient-to-r from-accent to-[#8a6e35] text-black font-bold py-4 px-8 rounded-sm hover:scale-[1.02] transition-transform uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(197,160,89,0.3)]">
                                Mint Artifact
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

function Header({ title, subtitle, centered = false }: { title: string, subtitle: string, centered?: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`mb-16 ${centered ? 'text-center' : 'text-left'}`}
        >
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-2">{title}</h2>
            <p className="text-accent text-lg font-light tracking-wide border-b border-accent/20 inline-block pb-1">
                {subtitle}
            </p>
        </motion.div>
    );
}

function TrinityCard({ item, onSelect }: { item: GalleryItem, onSelect: () => void }) {
    const isLegendary = item.rarity === 'Legendary';

    // Trinity-specific styling
    const containerClasses = isLegendary
        ? "border-[1px] border-[#FFD700]/40 shadow-[0_0_30px_rgba(255,215,0,0.15)]"
        : "border-transparent shadow-premium";

    const glowColor = isLegendary
        ? "bg-[#FFD700]/20 mix-blend-screen"
        : "bg-accent/20 mix-blend-screen";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`group relative h-[600px] overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] ${containerClasses}`}
            onClick={onSelect}
        >
            <div className="absolute inset-0 bg-[#0A0510] z-0" />

            {/* Dynamic Glow Blob */}
            <div className={`absolute inset-x-0 top-1/4 h-1/2 blur-[100px] opacity-60 rounded-full pointer-events-none ${glowColor}`} />

            <Image
                src={item.image_url}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 z-10"
                priority={false}
            />

            {/* Legendary Shine Overlay */}
            {isLegendary && (
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FFD700]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20 pointer-events-none" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-40 group-hover:opacity-60 transition-opacity z-20" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent opacity-80 z-20" />

            <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 z-30">
                <div className={`backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-xl border-l-4 ${isLegendary ? 'border-l-[#FFD700]' : 'border-l-accent'}`}>
                    <span className={`text-xs font-mono uppercase tracking-widest block mb-2 ${isLegendary ? 'text-[#FFD700] drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]' : 'text-accent'}`}>
                        {item.rarity} // {item.category}
                    </span>
                    <h3 className={`text-3xl font-serif font-bold text-white mb-2 ${isLegendary ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-white' : ''}`}>
                        {item.title}
                    </h3>
                    <p className="text-white/80 font-light text-sm mb-4">{item.subtitle}</p>

                    <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-500 opacity-0 group-hover:opacity-100">
                        <ActionButton onDetails={onSelect} isLegendary={isLegendary} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function GeometryCard({ item, onSelect }: { item: GalleryItem, onSelect: () => void }) {
    // Rarity Styling Logic
    const isLegendary = item.rarity === 'Legendary';
    const isEpic = item.rarity === 'Epic';
    const isRare = item.rarity === 'Rare';

    let borderColor = 'border-white/10';
    let glowColor = 'hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]';
    let badgeStyle = 'bg-white/10 text-white/60';
    let titleStyle = 'group-hover:text-white';

    if (isLegendary) {
        borderColor = 'border-[#FFD700]/50';
        glowColor = 'shadow-[0_0_15px_rgba(255,215,0,0.1)] hover:shadow-[0_0_30px_rgba(255,215,0,0.4)]';
        badgeStyle = 'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/40';
        titleStyle = 'group-hover:text-[#FFD700]';
    } else if (isEpic) {
        borderColor = 'border-purple-500/40';
        glowColor = 'hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]';
        badgeStyle = 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
        titleStyle = 'group-hover:text-purple-300';
    } else if (isRare) {
        borderColor = 'border-blue-400/30';
        glowColor = 'hover:shadow-[0_0_20px_rgba(96,165,250,0.2)]';
        badgeStyle = 'bg-blue-400/10 text-blue-300 border border-blue-400/20';
        titleStyle = 'group-hover:text-blue-300';
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={onSelect}
            className={`
                group relative bg-[#0F1116] border ${borderColor} 
                transition-all duration-500 rounded-xl overflow-hidden cursor-pointer
                ${glowColor}
            `}
        >
            {isLegendary && (
                <div className="absolute inset-0 bg-gradient-to-t from-[#FFD700]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            )}

            <div className="aspect-square relative overflow-hidden bg-black/50">
                <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className={`object-contain p-8 transition-transform duration-500 group-hover:scale-105 ${isLegendary ? 'drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]' : ''}`}
                />
            </div>

            <div className="p-6 border-t border-white/5 bg-white/[0.02] relative z-10">
                <div className="flex justify-between items-start mb-2">
                    <h3 className={`text-xl font-serif font-bold text-white transition-colors ${titleStyle}`}>
                        {item.title}
                    </h3>
                    <span className={`text-[10px] px-2 py-1 rounded uppercase tracking-wider font-bold ${badgeStyle}`}>
                        {item.rarity}
                    </span>
                </div>
                <p className="text-xs text-white/40 mb-3 font-mono truncate">{item.subtitle}</p>
                <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className={`text-xs uppercase font-bold tracking-widest ${isLegendary ? 'text-[#FFD700]' : 'text-accent'}`}>View Analysis +</span>
                </div>
            </div>
        </motion.div>
    );
}

function AnomalyCard({ item, onSelect }: { item: GalleryItem, onSelect: () => void }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={onSelect}
            className="relative flex flex-col md:flex-row bg-black/60 border border-accent-neon/30 rounded-xl overflow-hidden group cursor-pointer"
        >
            <div className="absolute inset-0 bg-accent-neon/5 opacity-0 group-hover:opacity-100 pointer-events-none mix-blend-overlay transition-opacity" />

            <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto">
                <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-accent-neon/20 mix-blend-color" />
            </div>

            <div className="p-8 md:w-1/2 flex flex-col justify-center relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-accent-ruby/20 blur-[40px] rounded-full" />

                <h3 className="text-3xl font-bold font-serif text-white mb-1 group-hover:translate-x-1 transition-transform">
                    {item.title}
                </h3>
                <span className="text-accent-neon text-xs font-mono mb-4 block">
                    &gt;&gt; {item.subtitle}
                </span>

                <button className="self-start px-6 py-2 border border-accent-neon text-accent-neon group-hover:bg-accent-neon group-hover:text-white transition-all duration-300 rounded font-mono text-xs uppercase tracking-widest shadow-[0_0_10px_rgba(77,77,255,0.2)] hover:shadow-[0_0_20px_rgba(77,77,255,0.6)]">
                    Analyze Signal
                </button>
            </div>
        </motion.div>
    );
}

function ActionButton({ onDetails, isLegendary = false }: { onDetails?: () => void, isLegendary?: boolean }) {

    const btnStyle = isLegendary
        ? "bg-[#FFD700]/10 border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700] hover:text-black shadow-[0_0_15px_rgba(255,215,0,0.2)]"
        : "bg-accent/10 border-accent text-accent hover:bg-accent hover:text-black shadow-[0_0_10px_rgba(197,160,89,0.1)]";

    return (
        <div className="flex gap-3">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDetails?.();
                }}
                className={`flex-1 border px-4 py-2 rounded font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 ${btnStyle}`}
            >
                Details
            </button>
            <button className="flex-1 bg-white/5 border border-white/20 text-white hover:bg-white/10 px-4 py-2 rounded font-bold text-xs uppercase tracking-widest transition-all hover:scale-105">
                Mint
            </button>
        </div>
    );
}
