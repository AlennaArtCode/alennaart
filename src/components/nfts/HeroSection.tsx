import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronDown, Sparkles } from 'lucide-react';
import { AURUM_GENESIS } from '@/app/nfts/constants';

export const HeroSection = ({ onOpenModal }: { onOpenModal: (piece: typeof AURUM_GENESIS[0]) => void }) => (
    <section className="min-h-screen flex flex-col lg:flex-row items-center gap-0">
        <div className="w-full lg:w-1/2 relative flex items-center justify-center py-24 lg:py-0 lg:min-h-screen">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[500px] h-[500px] rounded-full bg-[#C5A059]/10 blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.88, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="relative w-[340px] lg:w-[420px] group cursor-pointer"
                onClick={() => onOpenModal(AURUM_GENESIS[0])}
            >
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
                    <a href="#collection" className="px-8 py-4 bg-gradient-to-r from-accent to-[#8a6e35] text-black font-bold uppercase text-xs tracking-widest rounded hover:opacity-90 transition-opacity shadow-[0_0_25px_rgba(197,160,89,0.3)] text-center">
                        Ver Colección
                    </a>
                    <a href="#que-es-un-nft" className="px-8 py-4 border border-white/20 text-white/70 font-bold uppercase text-xs tracking-widest rounded hover:bg-white/5 hover:text-white transition-all text-center">
                        ¿Qué es un NFT?
                    </a>
                </div>
            </motion.div>

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
);
