import { motion } from 'framer-motion';
import Image from 'next/image';
import { AURUM_GENESIS, RARITY_COLOR } from '@/app/nfts/constants';

export const CollectionSection = ({ onOpenModal, isInView }: { onOpenModal: (piece: typeof AURUM_GENESIS[0]) => void, isInView: boolean }) => (
    <section id="collection" className="max-w-7xl mx-auto px-6 py-20 space-y-16">
        <div className="text-center space-y-4">
            <span className="text-[10px] font-mono text-accent/60 tracking-[0.4em] uppercase">// Colección 001 — Por Alenna</span>
            <h2 className="text-4xl md:text-6xl font-bold font-serif text-white tracking-tighter">
                AURUM <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#e8c97a] to-accent">GENESIS</span>
            </h2>
            <p className="text-content-secondary max-w-xl mx-auto font-light text-base leading-relaxed">
                50 piezas únicas. Un universo que nace. La primera colección oficial de NFTs de Alenna.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {AURUM_GENESIS.map((piece, i) => {
                const rarityColor = RARITY_COLOR[piece.rarity] || '#C5A059';
                return (
                    <motion.div
                        key={piece.id}
                        initial={{ opacity: 0, y: 40 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: i * 0.15 }}
                        onClick={() => onOpenModal(piece)}
                        className="group relative cursor-pointer"
                    >
                        <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{ background: `radial-gradient(ellipse at top, ${rarityColor}30, transparent 70%)`, boxShadow: `0 0 40px ${rarityColor}20` }}
                        />
                        <div className="relative glass-panel rounded-2xl overflow-hidden border transition-all duration-500 group-hover:-translate-y-2"
                            style={{ borderColor: `${rarityColor}30` }}
                        >
                            <div className="relative aspect-square overflow-hidden bg-black">
                                <Image src={piece.image} alt={piece.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0510] via-transparent to-transparent" />
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-md"
                                        style={{ backgroundColor: `${rarityColor}25`, color: rarityColor, border: `1px solid ${rarityColor}50` }}>
                                        {piece.rarity}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 space-y-3">
                                <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: rarityColor }}>AURUM GENESIS {piece.num}</span>
                                <h3 className="text-2xl font-serif font-bold text-white mt-0.5 group-hover:text-accent transition-colors">{piece.name}</h3>
                                <div className="flex flex-wrap gap-1 pt-1">
                                    {piece.traits.map(t => (
                                        <span key={t} className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded font-mono text-white/40">{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    </section>
);
