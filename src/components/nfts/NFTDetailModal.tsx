import { motion } from 'framer-motion';
import Image from 'next/image';
import { AURUM_GENESIS, RARITY_COLOR } from '@/app/nfts/constants';

export const NFTDetailModal = ({ piece, onClose }: { piece: typeof AURUM_GENESIS[0], onClose: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg" onClick={onClose}>
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 glass-panel rounded-2xl overflow-hidden border border-white/10"
            onClick={e => e.stopPropagation()}
        >
            <div className="relative h-72 md:h-auto">
                <Image src={piece.image} alt={piece.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A0510] hidden md:block" />
            </div>
            <div className="p-8 space-y-5 flex flex-col justify-center">
                <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: RARITY_COLOR[piece.rarity] }}>
                        AURUM GENESIS {piece.num} · {piece.rarity}
                    </span>
                    <h2 className="text-3xl font-serif font-bold text-white mt-1">{piece.name}</h2>
                    <p className="text-sm text-content-muted mt-1 font-mono">{piece.edition}</p>
                </div>
                <p className="text-content-secondary text-sm leading-relaxed">{piece.desc}</p>
                <div className="flex gap-3 pt-2">
                    <button className="flex-1 py-3 text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-accent to-[#8a6e35] text-black rounded hover:opacity-90 transition-opacity">
                        Registrar Interés
                    </button>
                    <button onClick={onClose} className="px-4 py-3 text-xs font-bold uppercase tracking-widest border border-white/15 text-white/60 rounded hover:bg-white/5 transition-colors">
                        Cerrar
                    </button>
                </div>
            </div>
        </motion.div>
    </div>
);
