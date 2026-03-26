import { motion } from 'framer-motion';
import { NFT_STORY } from '@/app/nfts/constants';

export const TimelineSection = ({ isInView }: { isInView: boolean }) => (
    <section id="que-es-un-nft" className="max-w-7xl mx-auto px-6 py-32 space-y-24">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
            <motion.span
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                className="text-[10px] font-mono text-accent/60 tracking-[0.4em] uppercase block"
            >
                // Sección 001 — El Origen
            </motion.span>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                className="text-4xl md:text-5xl font-bold font-serif text-white leading-tight"
            >
                Una historia sobre <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#e8c97a]">la propiedad del arte</span>
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                className="text-content-secondary text-lg font-light leading-relaxed"
            >
                Para entender qué cambiaron los NFTs, hay que entender qué rompieron.
                Esta es la historia de cómo el arte digital encontró su prueba de existencia.
            </motion.p>
        </div>

        <div className="relative space-y-0">
            <div className="absolute left-8 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/30 to-transparent" />

            {NFT_STORY.map((item, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.15 }}
                    className={`relative flex flex-col md:flex-row gap-8 pb-20 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                >
                    <div
                        className="absolute left-8 md:left-1/2 md:-translate-x-1/2 top-4 w-6 h-6 rounded-full border-2 -translate-x-1/2 md:translate-x-0 z-10"
                        style={{ backgroundColor: item.color, borderColor: item.color, boxShadow: `0 0 20px ${item.color}80` }}
                    />

                    <div className={`w-full md:w-[calc(50%-2rem)] pl-16 md:pl-0 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                        <span className="text-3xl md:text-5xl font-serif font-black uppercase tracking-tighter mb-4 block leading-none opacity-80" style={{ color: item.color }}>
                            {item.year}
                        </span>
                        <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-3 leading-tight">
                            {item.title}
                        </h3>
                        <p className="text-content-secondary text-base leading-relaxed font-light">
                            {item.body}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    </section>
);
