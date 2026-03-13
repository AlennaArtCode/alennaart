'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Gem, ShieldCheck, Key, Zap, Users, TrendingUp, ChevronDown, ExternalLink, Sparkles } from 'lucide-react';

type GalleryItem = {
    id: string;
    title: string;
    category: string;
    rarity: string;
    image_url: string;
    image_path?: string;
    description?: string;
    created_at?: string;
};

// AURUM GENESIS — static collection data
const AURUM_GENESIS = [
    {
        id: 'ag-001',
        num: '#001',
        name: 'The Emergence',
        edition: '1 / 50',
        rarity: 'Legendary',
        image: '/nfts/aurum-genesis-001.png',
        desc: 'El primer grito del universo de Alenna cristalizado en forma digital. La diosa emerge del oro líquido para marcar el inicio de una nueva era en el arte generacional.',
        traits: ['Aura: Gold Genesis', 'Background: Void', 'Crown: Sacred Arch'],
        color: '#C5A059',
    },
    {
        id: 'ag-002',
        num: '#002',
        name: 'The Geometry',
        edition: '1 / 50',
        rarity: 'Epic',
        image: '/nfts/aurum-genesis-002.png',
        desc: 'El lenguaje secreto del universo codificado en geometría sagrada. Cada patrón es una puerta, cada ángulo una respuesta a preguntas que el mundo aún no ha formulado.',
        traits: ['Aura: Aurora', 'Background: Cosmic', 'Pattern: Sacred'],
        color: '#9B59B6',
    },
    {
        id: 'ag-003',
        num: '#003',
        name: 'The Oracle',
        edition: '1 / 50',
        rarity: 'Epic',
        image: '/nfts/aurum-genesis-003.png',
        desc: 'La que ve más allá del velo. The Oracle guarda los secretos de lo que viene. Ser su dueño no es poseer una imagen — es ser invitado a la visión.',
        traits: ['Aura: Prophetic', 'Background: Mystic Ink', 'Element: Runes'],
        color: '#E67E22',
    },
];

const RARITY_COLOR: Record<string, string> = {
    Legendary: '#FFD700',
    Epic: '#9B59B6',
    Rare: '#4DA6FF',
};

// NFT Story timeline
const NFT_STORY = [
    {
        year: '1993',
        title: 'El Arte Tiene Dueño... Pero No Lo Puedes Probar',
        body: 'Durante décadas, los artistas digitales crearon obras que el mundo amaba pero no podía poseer de verdad. Cualquiera podía copiar un archivo. Nada diferenciaba al original de la réplica. El arte digital existía en un limbo: famoso, pero sin valor comprobable.',
        color: '#C5A059',
    },
    {
        year: '2009',
        title: 'Nace la Blockchain: El Notario del Universo Digital',
        body: 'Con Bitcoin apareció algo radical: un registro público, inmutable e incorruptible que nadie controla y todos pueden verificar. Por primera vez en la historia, "esto es mío" podía ser una verdad matemática — no una promesa legal.',
        color: '#4DA6FF',
    },
    {
        year: '2017',
        title: 'Los NFTs: Cuando el Arte Digital Encontró Su Prueba',
        body: 'Los Non-Fungible Tokens adaptaron esa tecnología para el arte. Cada pieza recibe un certificado único en la cadena: serial, historial de dueños, fecha de creación. No importa cuántas copias haya — la blockchain sabe cuál es el original. Y ese original, es tuyo.',
        color: '#9B59B6',
    },
    {
        year: 'Hoy',
        title: 'Coleccionar es Creer en Algo Antes de Que Todos Lo Vean',
        body: 'Los grandes coleccionistas del arte siempre tuvieron una habilidad: reconocer el talento antes de que se hiciera famoso. Hoy, los NFTs democratizan ese privilegio. No necesitas ser millonario para ser el primero. Solo necesitas ver lo que otros aún no ven.',
        color: '#E67E22',
    },
];

const UTILITY_CARDS = [
    {
        icon: ShieldCheck,
        color: '#C5A059',
        title: 'Propiedad Real y Verificada',
        body: 'La blockchain registra que esa pieza es tuya. Sin contratos, sin abogados, sin intermediarios. El código es la ley, y la ley dice: esto es tuyo.',
    },
    {
        icon: Key,
        color: '#9B59B6',
        title: 'Acceso al Círculo Interno',
        body: 'Los holders de AURUM GENESIS tienen acceso prioritario a drops exclusivos, eventos privados, y la comunidad cerrada. Una llave que no caduca.',
    },
    {
        icon: Zap,
        color: '#4DA6FF',
        title: 'Más Que Una Imagen',
        body: 'Tu NFT puede ser tu entrada a conciertos, ediciones físicas firmadas, o el pase para la siguiente temporada de contenido. Es un activo de membresía.',
    },
    {
        icon: TrendingUp,
        color: '#E74C3C',
        title: 'Arte con Historia Creciente',
        body: 'Ser el primero tiene un valor que el tiempo confirma. Cada holder de la génesis es parte de la historia documentada en la cadena — para siempre.',
    },
    {
        icon: Users,
        color: '#2ECC71',
        title: 'Una Comunidad de Fundadores',
        body: 'Hay algo que dinero no compra: el status de haber creído primero. Ser holder desde el inicio es pertenecer a un grupo que existirá en los archivos de este universo.',
    },
    {
        icon: Gem,
        color: '#F39C12',
        title: 'Regalías que nos Unen',
        body: 'Cada vez que una pieza se revende, quien la creó recibe regalías automáticas. Eso convierte a cada coleccionista en un aliado directo del artista.',
    },
];

export default function NFTsPage() {
    const [vaultNfts, setVaultNfts] = useState<GalleryItem[]>([]);
    const [loadingVault, setLoadingVault] = useState(true);
    const [selectedCard, setSelectedCard] = useState<typeof AURUM_GENESIS[0] | null>(null);
    const storyRef = useRef(null);
    const collectionRef = useRef(null);
    const storyInView = useInView(storyRef, { once: true, margin: '-80px' });
    const collectionInView = useInView(collectionRef, { once: true, margin: '-80px' });

    useEffect(() => {
        const fetchNFTs = async () => {
            const { data, error } = await supabase
                .from('artworks')
                .select('*')
                .in('category', ['Season Pass', 'Weekly Chapter', '1/1 Edition', 'DELUXE NFT', 'NFT Collection', 'NFT'])
                .eq('is_public', true)
                .order('created_at', { ascending: false });

            if (!error && data) setVaultNfts(data);
            setLoadingVault(false);
        };
        fetchNFTs();
    }, []);

    return (
        <main className="min-h-screen relative overflow-hidden bg-[#0A0510] text-content-primary">

            {/* BACKGROUND */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="orb-glow w-[900px] h-[900px] bg-accent-mystic/15 top-[-20%] right-[-15%]" />
                <div className="orb-glow w-[700px] h-[700px] bg-[#C5A059]/8 bottom-[-10%] left-[-10%] animate-float-delayed" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0510]/60 to-[#0A0510]" />
            </div>

            <div className="relative z-10">

                {/* ─── HERO: NFT + TEXTO ─── */}
                <section className="min-h-screen flex flex-col lg:flex-row items-center gap-0">

                    {/* Left: NFT Visual prominente */}
                    <div className="w-full lg:w-1/2 relative flex items-center justify-center py-24 lg:py-0 lg:min-h-screen">
                        {/* Glow detrás del NFT */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-[500px] h-[500px] rounded-full bg-[#C5A059]/10 blur-[100px]" />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.88, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 1.2, ease: 'easeOut' }}
                            className="relative w-[340px] lg:w-[420px] group cursor-pointer"
                            onClick={() => setSelectedCard(AURUM_GENESIS[0])}
                        >
                            {/* Glow border animado */}
                            <div className="absolute -inset-1 rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                                style={{ background: 'radial-gradient(ellipse at top, #C5A05940, transparent 70%)', boxShadow: '0 0 60px #C5A05930' }}
                            />

                            <div className="relative rounded-2xl overflow-hidden border border-[#C5A059]/30 group-hover:border-[#C5A059]/60 transition-all duration-500 shadow-[0_0_80px_rgba(197,160,89,0.15)]">
                                <div className="relative aspect-square">
                                    <Image
                                        src="/nfts/aurum-genesis-001.png"
                                        alt="AURUM GENESIS #001 — The Emergence"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0510]/80 via-transparent to-transparent" />

                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-md"
                                            style={{ backgroundColor: '#FFD70025', color: '#FFD700', border: '1px solid #FFD70050' }}>
                                            Legendary
                                        </span>
                                    </div>
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className="text-[9px] font-mono bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded text-white/60">
                                            1 / 50
                                        </span>
                                    </div>
                                </div>

                                {/* Info card inferior */}
                                <div className="p-5 bg-black/60 backdrop-blur-md">
                                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#C5A059]">AURUM GENESIS #001</span>
                                    <h3 className="text-xl font-serif font-bold text-white mt-0.5">The Emergence</h3>
                                    <p className="text-xs text-white/50 mt-1 leading-relaxed line-clamp-2">
                                        El primer grito del universo cristalizado. La diosa emerge del oro líquido.
                                    </p>
                                    <div className="flex gap-1 mt-3 flex-wrap">
                                        {AURUM_GENESIS[0].traits.map(t => (
                                            <span key={t} className="text-[8px] bg-white/5 border border-white/10 px-2 py-0.5 rounded font-mono text-white/40">{t}</span>
                                        ))}
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 text-[#C5A059]">
                                        <Sparkles size={12} />
                                        <span className="text-[9px] font-mono uppercase tracking-widest">Haz click para ver detalle</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Texto hero */}
                    <div className="w-full lg:w-1/2 px-8 lg:px-16 py-16 lg:py-0 space-y-8 lg:min-h-screen flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.9, delay: 0.3 }}
                            className="space-y-6"
                        >
                            <div className="inline-block border border-accent/30 px-5 py-2 rounded-full backdrop-blur-md bg-white/5">
                                <span className="text-accent font-mono tracking-[0.3em] text-xs uppercase">
                                    Propiedad Real · Arte Digital · Acceso Exclusivo
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif tracking-tighter text-white leading-tight">
                                El universo digital{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#e8c97a]">
                                    ahora tiene dueño.
                                </span>
                            </h1>

                            <p className="text-content-secondary text-lg font-light leading-relaxed max-w-lg">
                                Durante años, el arte digital se compartió libremente — hermoso, pero sin raíz. Los NFTs cambiaron esa ecuación. Hoy, ser el dueño de una obra digital significa algo real, verificable, e irrefutable.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <a
                                    href="#collection"
                                    className="px-8 py-4 bg-gradient-to-r from-accent to-[#8a6e35] text-black font-bold uppercase text-xs tracking-widest rounded hover:opacity-90 transition-opacity shadow-[0_0_25px_rgba(197,160,89,0.3)] text-center"
                                >
                                    Ver Colección
                                </a>
                                <a
                                    href="#que-es-un-nft"
                                    className="px-8 py-4 border border-white/20 text-white/70 font-bold uppercase text-xs tracking-widest rounded hover:bg-white/5 hover:text-white transition-all text-center"
                                >
                                    ¿Qué es un NFT?
                                </a>
                            </div>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.7 }}
                            className="flex gap-10 pt-4"
                        >
                            {[
                                { val: '50', label: 'Piezas Únicas' },
                                { val: '3', label: 'Niveles de Rareza' },
                                { val: '∞', label: 'Acceso Permanente' },
                            ].map(({ val, label }) => (
                                <div key={label} className="text-center">
                                    <div className="text-3xl font-bold text-accent font-serif">{val}</div>
                                    <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest mt-1">{label}</div>
                                </div>
                            ))}
                        </motion.div>

                        <motion.a
                            href="#que-es-un-nft"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 1.1 }}
                            className="flex items-center gap-2 text-white/30 hover:text-accent transition-colors w-fit"
                        >
                            <span className="text-[9px] font-mono uppercase tracking-widest">Descubre la historia</span>
                            <ChevronDown size={16} className="animate-bounce" />
                        </motion.a>
                    </div>
                </section>

                {/* ─── LA HISTORIA DE LOS NFTs ─── */}
                <section id="que-es-un-nft" ref={storyRef} className="max-w-7xl mx-auto px-6 py-32 space-y-24">

                    {/* Intro */}
                    <div className="text-center space-y-6 max-w-3xl mx-auto">
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={storyInView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.6 }}
                            className="text-[10px] font-mono text-accent/60 tracking-[0.4em] uppercase block"
                        >
                            // Sección 001 — El Origen
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={storyInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-4xl md:text-5xl font-bold font-serif text-white leading-tight"
                        >
                            Una historia sobre{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#e8c97a]">
                                la propiedad del arte
                            </span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={storyInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.25 }}
                            className="text-content-secondary text-lg font-light leading-relaxed"
                        >
                            Para entender qué cambiaron los NFTs, hay que entender qué rompieron.
                            Esta es la historia de cómo el arte digital encontró su prueba de existencia.
                        </motion.p>
                    </div>

                    {/* Timeline de la historia */}
                    <div className="relative space-y-0">
                        {/* Línea vertical */}
                        <div className="absolute left-8 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/30 to-transparent" />

                        {NFT_STORY.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                                animate={storyInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.8, delay: 0.2 + i * 0.15 }}
                                className={`relative flex flex-col md:flex-row gap-8 pb-20 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                            >
                                {/* Dot en la línea */}
                                <div
                                    className="absolute left-8 md:left-1/2 md:-translate-x-1/2 top-0 w-4 h-4 rounded-full border-2 -translate-x-1/2 md:translate-x-0"
                                    style={{ backgroundColor: item.color, borderColor: item.color, boxShadow: `0 0 15px ${item.color}60` }}
                                />

                                {/* Contenido */}
                                <div className={`w-full md:w-[calc(50%-2rem)] pl-16 md:pl-0 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                                    <span className="text-[10px] font-mono uppercase tracking-widest mb-2 block" style={{ color: item.color }}>
                                        {item.year}
                                    </span>
                                    <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-3 leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-content-secondary text-sm leading-relaxed font-light">
                                        {item.body}
                                    </p>
                                </div>

                                <div className="hidden md:block w-[calc(50%-2rem)]" />
                            </motion.div>
                        ))}
                    </div>

                    {/* Utility Cards */}
                    <div className="space-y-10">
                        <div className="text-center">
                            <span className="text-[10px] font-mono text-accent/60 tracking-[0.4em] uppercase block mb-4">// Lo que obtienes</span>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
                                Más que coleccionar,{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#e8c97a]">pertenecer</span>
                            </h2>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={storyInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.9, delay: 0.4 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {UTILITY_CARDS.map((item, i) => (
                                <div key={i} className="group glass-panel p-6 rounded-xl border border-white/5 hover:border-white/15 transition-all duration-300 hover:-translate-y-1">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: `${item.color}20`, border: `1px solid ${item.color}40` }}>
                                            <item.icon size={20} style={{ color: item.color }} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-sm mb-1 group-hover:text-accent transition-colors">{item.title}</h3>
                                            <p className="text-content-muted text-xs leading-relaxed">{item.body}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* ─── AURUM GENESIS COLLECTION ─── */}
                <section id="collection" ref={collectionRef} className="max-w-7xl mx-auto px-6 py-20 space-y-16">

                    <div className="text-center space-y-4">
                        <span className="text-[10px] font-mono text-accent/60 tracking-[0.4em] uppercase">// Colección 001 — Por Alenna</span>
                        <h2 className="text-4xl md:text-6xl font-bold font-serif text-white tracking-tighter">
                            AURUM{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#e8c97a] to-accent">
                                GENESIS
                            </span>
                        </h2>
                        <p className="text-content-secondary max-w-xl mx-auto font-light text-base leading-relaxed">
                            50 piezas únicas. Un universo que nace. La primera colección oficial de NFTs de Alenna — donde cada obra es el inicio de algo que crecerá contigo.
                        </p>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {AURUM_GENESIS.map((piece, i) => {
                            const rarityColor = RARITY_COLOR[piece.rarity] || '#C5A059';
                            return (
                                <motion.div
                                    key={piece.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={collectionInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.7, delay: i * 0.15 }}
                                    onClick={() => setSelectedCard(piece)}
                                    className="group relative cursor-pointer"
                                >
                                    {/* Card glow */}
                                    <div
                                        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                        style={{ background: `radial-gradient(ellipse at top, ${rarityColor}30, transparent 70%)`, boxShadow: `0 0 40px ${rarityColor}20` }}
                                    />

                                    <div
                                        className="relative glass-panel rounded-2xl overflow-hidden border transition-all duration-500 group-hover:-translate-y-2"
                                        style={{ borderColor: `${rarityColor}30` }}
                                    >
                                        {/* Image */}
                                        <div className="relative aspect-square overflow-hidden bg-black">
                                            <Image
                                                src={piece.image}
                                                alt={`AURUM GENESIS ${piece.num} — ${piece.name}`}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0510] via-transparent to-transparent" />

                                            {/* Rarity badge */}
                                            <div className="absolute top-4 left-4 z-10">
                                                <span
                                                    className="text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-md"
                                                    style={{ backgroundColor: `${rarityColor}25`, color: rarityColor, border: `1px solid ${rarityColor}50` }}
                                                >
                                                    {piece.rarity}
                                                </span>
                                            </div>

                                            {/* Edition */}
                                            <div className="absolute top-4 right-4 z-10">
                                                <span className="text-[9px] font-mono bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded text-white/60">
                                                    {piece.edition}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="p-6 space-y-3">
                                            <div>
                                                <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: rarityColor }}>AURUM GENESIS {piece.num}</span>
                                                <h3 className="text-2xl font-serif font-bold text-white mt-0.5 group-hover:text-accent transition-colors">
                                                    {piece.name}
                                                </h3>
                                            </div>
                                            <p className="text-xs text-content-muted leading-relaxed line-clamp-2">{piece.desc}</p>

                                            {/* Traits preview */}
                                            <div className="flex flex-wrap gap-1 pt-1">
                                                {piece.traits.map((t) => (
                                                    <span key={t} className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded font-mono text-white/40">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>

                                            <button
                                                className="w-full mt-2 py-3 text-xs font-bold uppercase tracking-widest border transition-all duration-300 rounded"
                                                style={{ borderColor: `${rarityColor}50`, color: rarityColor }}
                                                onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${rarityColor}20` }}
                                                onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent' }}
                                            >
                                                Ver Pieza
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* ─── VAULT: DB-driven extras ─── */}
                {(!loadingVault && vaultNfts.length > 0) && (
                    <section className="max-w-7xl mx-auto px-6 py-12 space-y-12">
                        <div className="flex items-center gap-6">
                            <h2 className="text-3xl font-serif font-bold text-white tracking-widest uppercase">Vault Collection</h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {vaultNfts.map((nft) => {
                                const img = nft.image_url && nft.image_url.trim() !== '' ? nft.image_url : (nft.image_path || 'https://placehold.co/400?text=No+Image');
                                return (
                                    <div key={nft.id} className="glass-panel rounded-xl overflow-hidden group cursor-pointer hover:border-accent/30 transition-all border border-white/5 flex flex-col">
                                        <div className="relative h-64 overflow-hidden bg-black/50">
                                            {img.includes('.mp4') ? (
                                                <video src={img} autoPlay loop muted playsInline className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
                                            ) : (
                                                <Image src={img} alt={nft.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0510] to-transparent pointer-events-none" />
                                            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md border border-white/10 px-2 py-1 rounded text-[9px] uppercase tracking-widest text-white/70 z-10">
                                                {nft.category}
                                            </div>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="text-xl font-serif font-bold text-white group-hover:text-accent transition-colors mb-2">{nft.title}</h3>
                                            <p className="text-sm text-content-muted font-light leading-relaxed flex-1">
                                                {nft.description || `Un artefacto raro de la colección ${nft.category}.`}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* ─── CLOSING CTA ─── */}
                <section className="max-w-7xl mx-auto px-6 py-24">
                    <div className="relative text-center py-24 space-y-8 rounded-3xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent" />
                        <div className="absolute inset-0 border border-accent/10 rounded-3xl" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#C5A059]/5 to-transparent" />

                        {/* NFT preview flotante en background */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                            <div className="w-96 h-96 relative">
                                <Image src="/nfts/aurum-genesis-001.png" alt="" fill className="object-cover rounded-full" />
                            </div>
                        </div>

                        <div className="relative space-y-6">
                            <span className="text-[10px] font-mono text-accent/60 tracking-[0.4em] uppercase">// El próximo movimiento</span>
                            <h2 className="text-4xl md:text-5xl font-bold font-serif text-white leading-tight">
                                ¿Listo para ser parte<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#e8c97a]">del origen?</span>
                            </h2>
                            <p className="text-content-secondary max-w-lg mx-auto font-light text-base leading-relaxed">
                                AURUM GENESIS lanza pronto. Los primeros 10 holders recibirán beneficios de fundadores: acceso directo, nombre en los créditos del universo y sorpresas que no puedo revelar aún.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="tu@email.com"
                                    className="flex-1 bg-white/5 border border-white/20 rounded px-4 py-3 text-sm focus:border-accent outline-none font-mono text-white placeholder:text-white/30"
                                />
                                <button className="bg-gradient-to-r from-accent to-[#8a6e35] text-black px-6 py-3 font-bold uppercase text-xs tracking-widest hover:opacity-90 transition-opacity rounded shadow-[0_0_20px_rgba(197,160,89,0.3)] whitespace-nowrap">
                                    Notifícame
                                </button>
                            </div>
                            <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                                Sin spam. Solo cuando AURUM GENESIS esté listo.
                            </p>
                        </div>
                    </div>
                </section>

            </div>

            {/* ─── PIECE DETAIL MODAL ─── */}
            {selectedCard && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg"
                    onClick={() => setSelectedCard(null)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 glass-panel rounded-2xl overflow-hidden border border-white/10"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="relative h-72 md:h-auto">
                            <Image src={selectedCard.image} alt={selectedCard.name} fill className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A0510] hidden md:block" />
                        </div>
                        <div className="p-8 space-y-5 flex flex-col justify-center">
                            <div>
                                <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: RARITY_COLOR[selectedCard.rarity] }}>
                                    AURUM GENESIS {selectedCard.num} · {selectedCard.rarity}
                                </span>
                                <h2 className="text-3xl font-serif font-bold text-white mt-1">{selectedCard.name}</h2>
                                <p className="text-sm text-content-muted mt-1 font-mono">{selectedCard.edition}</p>
                            </div>
                            <p className="text-content-secondary text-sm leading-relaxed">{selectedCard.desc}</p>
                            <div className="space-y-2">
                                <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Traits</span>
                                <div className="flex flex-wrap gap-2">
                                    {selectedCard.traits.map(t => (
                                        <span key={t} className="text-[10px] bg-white/5 border border-white/10 px-3 py-1 rounded font-mono text-white/50">{t}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button className="flex-1 py-3 text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-accent to-[#8a6e35] text-black rounded hover:opacity-90 transition-opacity">
                                    Registrar Interés
                                </button>
                                <button
                                    onClick={() => setSelectedCard(null)}
                                    className="px-4 py-3 text-xs font-bold uppercase tracking-widest border border-white/15 text-white/60 rounded hover:bg-white/5 transition-colors"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </main>
    );
}
