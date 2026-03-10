import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

type ProjectItem = {
    id: string;
    title: string;
    category: string;
    image_url: string;
    description?: string;
};

export default function UniversePage() {
    const { t } = useLanguage();
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            const { data, error } = await supabase
                .from('artworks')
                .select('*')
                // Filter out strict NFTs or Music if we want Universe to be purely for 'Projects' and 'Art/Concepts'
                // For now, we fetch categories that make sense for a "Project/Universe" showcase.
                .in('category', ['Fine Art', 'Concept', 'Digital Exhibit', 'Anomaly', 'Geometry', 'Photography', '3D Design'])
                .eq('is_public', true)
                .order('created_at', { ascending: false });

            if (!error && data) {
                setProjects(data);
            }
            setLoading(false);
        };

        fetchProjects();
    }, []);

    return (
        <main className="min-h-screen relative overflow-hidden bg-[#0A0510] text-content-primary">

            {/* GLOBAL FIXED BACKGROUND - The Aurora (Shared Aesthetic) */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Floating Orbs - The "Auroras" */}
                <div className="orb-glow w-[800px] h-[800px] bg-accent-mystic/10 top-[-20%] right-[-10%]" />
                <div className="orb-glow w-[600px] h-[600px] bg-accent-neon/10 bottom-[-10%] left-[-10%] animate-float-delayed" />

                {/* Ambient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0510]/50 to-[#0A0510]" />

                {/* Texture */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 space-y-24">

                {/* Header */}
                <header className="text-center space-y-6 pt-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="inline-block border border-accent/30 px-6 py-2 rounded-full backdrop-blur-md bg-white/5"
                    >
                        <span className="text-accent font-mono tracking-[0.3em] text-xs uppercase glow-text">
                            {t('universe', 'subtitle')}
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold font-serif tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                    >
                        {t('universe', 'title_part1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#8a6e35]">{t('universe', 'title_part2')}</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-content-secondary max-w-2xl mx-auto text-lg font-light leading-relaxed"
                    >
                        {t('universe', 'description')}
                    </motion.p>
                </header>


                {/* Projects Gallery */}
                <section className="relative pt-12 space-y-12">
                    <div className="flex items-center gap-6">
                        <h2 className="text-3xl font-serif font-bold text-white tracking-widest uppercase">{t('universe', 'ongoing')}</h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                    </div>

                    {loading ? (
                        <div className="py-20 text-center text-white/20 font-mono animate-pulse uppercase tracking-widest text-sm">
                            Synchronizing Neural Link...
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    title={project.title}
                                    category={project.category}
                                    status="Live"
                                    image={project.image_url}
                                    desc={project.description || "A glimpse into the creative matrix. Full analysis pending."}
                                />
                            ))}

                            {projects.length === 0 && (
                                <div className="col-span-1 md:col-span-3 glass-panel border-dashed border-white/10 flex items-center justify-center min-h-[300px] text-content-muted rounded-xl">
                                    <span className="font-mono text-xs uppercase tracking-widest">Awaiting Transmissions... The Universe is expanding.</span>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* Pre-footer Call to Action */}
                <section className="py-24 text-center">
                    <h3 className="text-2xl font-serif text-white/80 mb-6">{t('universe', 'stay_updated')}</h3>
                    <div className="inline-flex flex-col sm:flex-row gap-4 w-full max-w-md">
                        <input
                            type="email"
                            placeholder={t('universe', 'placeholder')}
                            className="flex-1 bg-white/5 border border-white/20 rounded-md px-4 py-3 text-sm focus:border-accent outline-none font-mono text-white placeholder:text-white/30"
                        />
                        <button className="bg-white text-black px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-accent transition-colors rounded-md">
                            {t('universe', 'subscribe')}
                        </button>
                    </div>
                </section>

            </div>
        </main>
    );
}

function ProjectCard({ title, category, image, desc, status }: { title: string, category: string, image: string, desc: string, status: string }) {
    const isVideo = image?.includes('.mp4');

    return (
        <div className="glass-panel rounded-xl overflow-hidden group cursor-pointer hover:bg-white/5 transition-colors border border-white/5 hover:border-accent/30 flex flex-col h-full">
            <div className="relative h-56 overflow-hidden bg-black flex items-center justify-center">
                {isVideo ? (
                    <video
                        src={image}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    />
                ) : (
                    <Image
                        src={image || 'https://placehold.co/400?text=?'}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100 grayscale hover:grayscale-0"
                    />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0510] to-transparent pointer-events-none" />
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md border border-white/10 px-2 py-1 rounded text-[9px] uppercase tracking-widest text-white/70 z-10">
                    {status}
                </div>
            </div>
            <div className="p-6 flex-1 flex flex-col relative z-20">
                <span className="text-[10px] font-bold tracking-[0.2em] text-accent block mb-2 uppercase">{category}</span>
                <h3 className="text-xl font-serif font-bold text-white group-hover:text-accent transition-colors mb-3 leading-tight">{title}</h3>
                <p className="text-sm text-content-muted font-light leading-relaxed flex-1 line-clamp-3 overflow-hidden text-ellipsis">{desc}</p>
            </div>
        </div>
    );
}
