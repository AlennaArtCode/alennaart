import { useState } from 'react';
import { galleryData, GalleryItem } from '@/data/galleryData';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// Helper to get image path (using placeholder if file likely missing)
const getImageUrl = (fileName: string) => {
    // START: Temporary mapping for user uploaded images
    if (fileName.includes('1 Sin Fondo')) return '/art/geometry_sample_1.png'; // Mapped ORIGO to sample 1
    if (fileName.includes('7 Sin Fondo')) return '/art/geometry_sample_2.jpg'; // Mapped AEGIS to sample 2
    if (fileName.includes('image_9867e8')) return '/art/lion-transparent.png'; // KAISER -> Lion
    if (fileName.includes('Mask')) return '/art/lion-transparent.png'; // LEGATUS -> Lion (Fallback until Mask is uploaded)
    // END: Temporary mapping

    // Check if it's an absolute path (placeholder) already
    if (fileName.startsWith('http')) return fileName;

    // In production, this would point to the actual file in public/
    // For now, we fallback to a stylish placeholder
    return `https://placehold.co/600x800/100515/C5A059/png?text=${fileName.split('.')[0]}`;
};

export default function GallerySection() {
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

    const trinity = galleryData.find(c => c.category === "THE TRINITY")?.items || [];
    const geometry = galleryData.find(c => c.category === "SACRED GEOMETRY")?.items || [];
    const anomalies = galleryData.find(c => c.category === "ANOMALIES")?.items || [];

    return (
        <section className="py-32 relative z-10 space-y-32">

            {/* SECCIÓN A: THE TRINITY */}
            <div className="container mx-auto px-6">
                <Header title="The Trinity" subtitle="The Architects of the Golden Web" />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {trinity.map((item) => (
                        <TrinityCard key={item.id} item={item} onSelect={() => setSelectedItem(item)} />
                    ))}
                </div>
            </div>

            {/* SECCIÓN B: SACRED GEOMETRY */}
            <div className="container mx-auto px-6">
                <Header title="Sacred Geometry" subtitle="The Imperial Guard" centered />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {geometry.map((item) => (
                        <GeometryCard key={item.id} item={item} onSelect={() => setSelectedItem(item)} />
                    ))}
                </div>
            </div>

            {/* SECCIÓN C: CHROMATIC ANOMALIES */}
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
                        src={getImageUrl(item.imageFileName)}
                        alt={item.title}
                        fill
                        className={`object-contain transition-transform duration-700 z-10 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] ${isExpanded ? 'p-4 scale-100' : 'scale-90 group-hover:scale-100'}`}
                    />

                    {/* Seamless Fade - Top and Bottom */}
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#0A0510] to-transparent z-20 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0A0510] to-transparent z-20 pointer-events-none" />

                    {/* Zoom Hint */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-30 bg-white/10 backdrop-blur text-white text-xs px-2 py-1 rounded border border-white/20">
                        {isExpanded ? 'Minimize' : 'Click to Expand'}
                    </div>
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
                                {/* Optional: A shining particle at the tip */}
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

                            {item.memory_log ? (
                                <div className="space-y-4 font-mono text-sm leading-relaxed">
                                    <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#C5A059]/20">
                                        <div>
                                            <span className="text-[#C5A059] text-[10px] uppercase block mb-1 opacity-70">Date</span>
                                            <span className="text-white/80">{item.memory_log.date_recorded}</span>
                                        </div>
                                        <div>
                                            <span className="text-[#C5A059] text-[10px] uppercase block mb-1 opacity-70">Origin State</span>
                                            <span className="text-white/80">{item.memory_log.origin_state}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-[#C5A059] text-[10px] uppercase block mb-1 opacity-70">Memory Fragment</span>
                                        <p className="text-white/90 italic">"{item.memory_log.memory_fragment}"</p>
                                    </div>

                                    <div className="pt-2">
                                        <span className="text-[#C5A059] text-[10px] uppercase block mb-1 opacity-70">Custodian Mission</span>
                                        <p className="text-white/60">{item.memory_log.custodian_mission}</p>
                                    </div>
                                </div>
                            ) : (
                                // Fallback for items without specific memory log yet
                                <div className="space-y-4 font-mono text-sm leading-relaxed opacity-60">
                                    <div className="flex items-center gap-2 text-[#C5A059]">
                                        <span className="animate-pulse">●</span>
                                        <span>Accessing Memory Banks...</span>
                                    </div>
                                    <p className="text-white/60">{item.description}</p>
                                </div>
                            )}
                        </div>

                        {/* Action Area */}
                        <div className="pt-4 flex items-center gap-4">
                            <button className="flex-1 bg-gradient-to-r from-accent to-[#8a6e35] text-black font-bold py-4 px-8 rounded-sm hover:scale-[1.02] transition-transform uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(197,160,89,0.3)]">
                                Mint Artifact
                            </button>
                        </div>
                    </div>

                    {/* Actions - Removed "Details", Kept "Mint" */}
                    <div className="pt-4">
                        <button className="w-full bg-accent text-black font-bold py-4 rounded text-sm uppercase tracking-widest hover:bg-white transition-colors shadow-[0_0_15px_rgba(197,160,89,0.3)] hover:shadow-[0_0_30px_rgba(197,160,89,0.5)]">
                            Mint Artifact
                        </button>
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
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group relative h-[600px] overflow-hidden rounded-2xl cursor-pointer"
            onClick={onSelect}
        >
            <div className="absolute inset-0 bg-[#0A0510] z-0" />

            {/* Spotlight Glow - Behind Image */}
            <div className="absolute inset-x-0 top-1/4 h-1/2 bg-accent/20 blur-[100px] opacity-60 rounded-full pointer-events-none mix-blend-screen" />

            {/* Image with Zoom Effect */}
            <Image
                src={getImageUrl(item.imageFileName)}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 z-10"
                priority={false}
            />

            {/* Gradient Overlay - Lighter and Bottom focused */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-40 group-hover:opacity-60 transition-opacity z-20" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent opacity-80 z-20" />

            {/* Content - Glass Panel within Card */}
            <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 z-30">
                <div className="backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-xl border-l-4 border-l-accent">
                    <span className="text-accent text-xs font-mono uppercase tracking-widest block mb-2">
                        {item.rarity}
                    </span>
                    <h3 className="text-3xl font-serif font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-white/80 font-light text-sm mb-4">{item.subtitle}</p>

                    <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-500 opacity-0 group-hover:opacity-100">
                        <ActionButton onDetails={onSelect} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function GeometryCard({ item, onSelect }: { item: GalleryItem, onSelect: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={onSelect}
            className="group relative bg-[#0F1116] border border-accent/20 hover:border-accent transition-colors duration-300 rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(197,160,89,0.15)] cursor-pointer"
        >
            <div className="aspect-square relative overflow-hidden bg-black/50">
                <Image
                    src={getImageUrl(item.imageFileName)}
                    alt={item.title}
                    fill
                    className="object-contain p-8 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1"
                />
            </div>

            <div className="p-6 border-t border-white/5 bg-white/[0.02]">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-serif font-bold text-white group-hover:text-accent transition-colors">
                        {item.title}
                    </h3>
                    <span className="bg-accent/10 text-accent text-[10px] px-2 py-1 rounded border border-accent/20 uppercase">
                        {item.rarity}
                    </span>
                </div>
                <p className="text-xs text-content-muted mb-3 font-mono">{item.subtitle}</p>
                <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-accent text-xs uppercase font-bold tracking-widest">View Analysis +</span>
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
            {/* Glitch Effect Overlay on Hover */}
            <div className="absolute inset-0 bg-accent-neon/5 opacity-0 group-hover:opacity-100 pointer-events-none mix-blend-overlay transition-opacity" />

            <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto">
                <Image
                    src={getImageUrl(item.imageFileName)}
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

function ActionButton({ onDetails }: { onDetails?: () => void }) {
    return (
        <div className="flex gap-3">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDetails?.();
                }}
                className="flex-1 bg-accent/10 border border-accent text-accent hover:bg-accent hover:text-black px-4 py-2 rounded font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_10px_rgba(197,160,89,0.1)] hover:shadow-[0_0_20px_rgba(197,160,89,0.5)]"
            >
                Details
            </button>
            <button className="flex-1 bg-white/5 border border-white/20 text-white hover:bg-white/10 px-4 py-2 rounded font-bold text-xs uppercase tracking-widest transition-all">
                Mint
            </button>
        </div>
    );
}
