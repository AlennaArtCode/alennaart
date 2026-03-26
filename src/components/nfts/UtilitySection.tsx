import { motion } from 'framer-motion';
import { UTILITY_CARDS } from '@/app/nfts/constants';

export const UtilitySection = ({ isInView }: { isInView: boolean }) => (
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-10">
        <div className="text-center">
            <span className="text-[10px] font-mono text-accent/60 tracking-[0.4em] uppercase block mb-4">// Lo que obtienes</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
                Más que coleccionar, <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#e8c97a]">pertenecer</span>
            </h2>
        </div>

        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
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
);
