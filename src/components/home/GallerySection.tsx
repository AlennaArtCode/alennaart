'use client';

import { galleryData, GalleryItem } from '@/data/galleryData';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Helper to get image path (using placeholder if file likely missing)
const getImageUrl = (fileName: string) => {
    // START: Temporary mapping for user uploaded images
    if (fileName.includes('1 Sin Fondo')) return '/art/geometry_sample_1.png'; // Mapped ORIGO to sample 1
    if (fileName.includes('7 Sin Fondo')) return '/art/geometry_sample_2.jpg'; // Mapped AEGIS to sample 2
    // END: Temporary mapping

    // Check if it's an absolute path (placeholder) already
    if (fileName.startsWith('http')) return fileName;

    // In production, this would point to the actual file in public/
    // For now, we fallback to a stylish placeholder
    return `https://placehold.co/600x800/100515/C5A059/png?text=${fileName.split('.')[0]}`;
};

export default function GallerySection() {
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
                        <TrinityCard key={item.id} item={item} />
                    ))}
                </div>
            </div>

            {/* SECCIÓN B: SACRED GEOMETRY */}
            <div className="container mx-auto px-6">
                <Header title="Sacred Geometry" subtitle="The Imperial Guard" centered />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {geometry.map((item) => (
                        <GeometryCard key={item.id} item={item} />
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
                            <AnomalyCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </div>

        </section>
    );
}

// --- SUB-COMPONENTS ---

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

function TrinityCard({ item }: { item: GalleryItem }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group relative h-[600px] overflow-hidden rounded-2xl cursor-pointer"
        >
            <div className="absolute inset-0 bg-black/20 z-0" />

            {/* Image with Zoom Effect */}
            <Image
                src={getImageUrl(item.imageFileName)}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                priority={false}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

            {/* Content - Glass Panel within Card */}
            <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-xl border-l-4 border-l-accent">
                    <span className="text-accent text-xs font-mono uppercase tracking-widest block mb-2">
                        {item.rarity}
                    </span>
                    <h3 className="text-3xl font-serif font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-white/80 font-light text-sm mb-4">{item.subtitle}</p>

                    <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-500 opacity-0 group-hover:opacity-100">
                        <p className="text-content-secondary text-sm mb-4 border-t border-white/10 pt-4">
                            {item.description}
                        </p>
                        <ActionButton />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function GeometryCard({ item }: { item: GalleryItem }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-[#0F1116] border border-accent/20 hover:border-accent transition-colors duration-300 rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(197,160,89,0.15)]"
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
                <p className="text-sm text-content-secondary line-clamp-2 group-hover:line-clamp-none transition-all">
                    {item.description}
                </p>
            </div>
        </motion.div>
    );
}

function AnomalyCard({ item }: { item: GalleryItem }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative flex flex-col md:flex-row bg-black/60 border border-accent-neon/30 rounded-xl overflow-hidden group"
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
                <p className="text-sm text-gray-400 mb-6 relative z-10">
                    {item.description}
                </p>

                <button className="self-start px-6 py-2 border border-accent-neon text-accent-neon hover:bg-accent-neon hover:text-white transition-all duration-300 rounded font-mono text-xs uppercase tracking-widest shadow-[0_0_10px_rgba(77,77,255,0.2)] hover:shadow-[0_0_20px_rgba(77,77,255,0.6)]">
                    Analyze Signal
                </button>
            </div>
        </motion.div>
    );
}

function ActionButton() {
    return (
        <div className="flex gap-3">
            <button className="flex-1 bg-accent/10 border border-accent text-accent hover:bg-accent hover:text-black px-4 py-2 rounded font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_10px_rgba(197,160,89,0.1)] hover:shadow-[0_0_20px_rgba(197,160,89,0.5)]">
                Details
            </button>
            <button className="flex-1 bg-white/5 border border-white/20 text-white hover:bg-white/10 px-4 py-2 rounded font-bold text-xs uppercase tracking-widest transition-all">
                Mint
            </button>
        </div>
    );
}
