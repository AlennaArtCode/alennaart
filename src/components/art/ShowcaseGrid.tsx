'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

// --- DATA SOURCE ---
// Using the exact JSON provided in the prompt

type ShowcaseItem = {
    id: string;
    name: string;
    subtitle: string;
    image: string;
    rarity: string;
    rarityColor: string;
    description: string;
};

const showcaseData: ShowcaseItem[] = [
    {
        "id": "001",
        "name": "KAISER",
        "subtitle": "El Soberano de la Red Áurea",
        "image": "image_9867e8.jpg",
        "rarity": "LEGENDARY",
        "rarityColor": "#FFD700",
        "description": "El Arquitecto silencioso."
    },
    {
        "id": "002",
        "name": "ORIGO",
        "subtitle": "La Semilla Cero",
        "image": "1 Sin Fondo.jpg",
        "rarity": "LEGENDARY",
        "rarityColor": "#FFD700",
        "description": "Donde nace la eternidad."
    },
    {
        "id": "003",
        "name": "LEGATUS",
        "subtitle": "Diplomacia Digital",
        "image": "Mask Sin fondo.jpg",
        "rarity": "LEGENDARY",
        "rarityColor": "#FFD700",
        "description": "Testigo de polígonos áureos."
    },
    {
        "id": "004",
        "name": "AEGIS",
        "subtitle": "Baluarte Impenetrable",
        "image": "7 Sin Fondo.jpg",
        "rarity": "EPIC",
        "rarityColor": "#cd7f32",
        "description": "Geometría de protección absoluta."
    },
    {
        "id": "005",
        "name": "CHRONOS",
        "subtitle": "Motor de los Ciclos",
        "image": "5 Sin Fondo.jpg",
        "rarity": "EPIC",
        "rarityColor": "#cd7f32",
        "description": "Mecanismo estelar del tiempo."
    },
    {
        "id": "006",
        "name": "VOID WALKER",
        "subtitle": "Intrusión Astral",
        "image": "3 Sin Fondo.jpg",
        "rarity": "ANOMALY",
        "rarityColor": "#9d00ff",
        "description": "Falla en la Matrix detectada."
    }
];

// Helper to get image path (mapping placeholders to local files if needed)
const getImageUrl = (fileName: string) => {
    // Basic mapping logic based on previous context, can be expanded
    if (fileName.includes('image_9867e8')) return '/art/lion-transparent.png'; // Assuming Kaiser is the Lion or similar
    if (fileName.includes('1 Sin Fondo')) return '/art/geometry_sample_1.png';
    if (fileName.includes('7 Sin Fondo')) return '/art/geometry_sample_2.jpg';

    // Fallback for others to placeholders if files don't strictly exist yet under those names
    if (!fileName.startsWith('/')) {
        return `https://placehold.co/600x800/100515/C5A059/png?text=${fileName.split('.')[0]}`;
    }

    return fileName;
};


export default function ShowcaseGrid() {
    return (
        <section className="py-24 bg-[#050505] min-h-screen">
            <div className="container mx-auto px-6">

                {/* Header Section */}
                <div className="mb-20 text-center space-y-4">
                    <h2 className="text-5xl md:text-6xl font-serif font-bold text-white tracking-tight">
                        Vitrina <span className="text-accent italic">Exemplaria</span>
                    </h2>
                    <p className="text-white/40 font-mono text-sm tracking-[0.3em] uppercase">
                        The Exclusive Collection
                    </p>
                </div>

                {/* THE GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {showcaseData.map((item) => (
                        <NftCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </section>
    );
}

// --- SUB-COMPONENT: NFT CARD ---

function NftCard({ item }: { item: ShowcaseItem }) {
    return (
        <motion.div
            className="group relative flex flex-col h-[500px] w-full bg-[#0A0510] rounded-xl overflow-hidden cursor-crosshair transition-all duration-500"
            // Hover: Glow in Rarity Color
            whileHover={{
                boxShadow: `0 0 30px ${item.rarityColor}40`, // 40 is opacity hex
                y: -10
            }}
        >
            {/* 1. IMAGE AREA (Top) */}
            <div className="relative h-full w-full overflow-hidden">
                <Image
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />

                {/* Subtle gradient overlay to make text pop if needed, though text is in separate panel */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
            </div>

            {/* 2. INFO PANEL (Bottom) - Glassmorphism */}
            <div
                className="absolute bottom-4 left-4 right-4 p-5 backdrop-blur-md bg-white/[0.03] border border-white/10 rounded-lg flex flex-col gap-2 transition-all duration-300 group-hover:bg-white/[0.08]"
                style={{
                    borderLeft: `4px solid ${item.rarityColor}`
                }}
            >
                {/* Rarity Label */}
                <span
                    className="text-[10px] font-sans font-bold tracking-[0.3em] uppercase"
                    style={{ color: item.rarityColor }}
                >
                    {item.rarity}
                </span>

                {/* Title */}
                <h3 className="text-2xl font-serif font-bold text-white leading-none">
                    {item.name}
                </h3>

                {/* Subtitle */}
                <p className="text-[#C5A059] text-xs font-sans font-medium uppercase tracking-wider">
                    {item.subtitle}
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
