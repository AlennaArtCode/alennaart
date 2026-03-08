'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Play, Pause } from 'lucide-react';

type MusicItem = {
    id: string;
    title: string;
    description: string;
    image_url: string; // Used for audio file here
    created_at: string;
};

export default function MusicClientView() {
    const [tracks, setTracks] = useState<MusicItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [playingId, setPlayingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchMusic = async () => {
            const { data, error } = await supabase
                .from('artworks')
                .select('*')
                .eq('category', 'Music')
                .eq('is_public', true)
                .order('created_at', { ascending: false });

            if (!error && data) {
                setTracks(data);
            }
            setLoading(false);
        };
        fetchMusic();
    }, []);

    const togglePlay = (id: string, audioUrl: string) => {
        const audioEl = document.getElementById(`audio-${id}`) as HTMLAudioElement;

        if (playingId === id) {
            audioEl?.pause();
            setPlayingId(null);
        } else {
            // Pause any other playing audio
            if (playingId) {
                const prevEl = document.getElementById(`audio-${playingId}`) as HTMLAudioElement;
                if (prevEl) prevEl.pause();
            }
            audioEl?.play();
            setPlayingId(id);
        }
    };

    return (
        <section className="relative min-h-screen bg-[#0F1116] text-white pt-32 pb-20 overflow-hidden">

            {/* BACKGROUND GLOW */}
            <div className="absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(ellipse_at_top,rgba(197,160,89,0.15),transparent_70%)] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">

                {/* HEADER SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="text-center mb-16"
                >
                    <h3 className="text-xs uppercase tracking-[0.3em] text-accent mb-4 font-mono">
                        Sonic Frequencies // 001
                    </h3>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-content-primary to-content-secondary drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] mb-6">
                        Trayectoria Musical
                    </h1>

                    {/* Golden Line Separator */}
                    <div className="flex justify-center items-center gap-4 my-8">
                        <div className="w-12 h-[1px] bg-accent/30" />
                        <div className="w-2 h-2 rounded-full bg-accent/80 shadow-[0_0_10px_rgba(197,160,89,0.5)]" />
                        <div className="w-12 h-[1px] bg-accent/30" />
                    </div>

                    <p className="max-w-2xl mx-auto text-lg text-content-primary font-serif italic mb-8">
                        Explorando los límites del sonido. Aquí encontrarás mis proyectos musicales, colaboraciones y frecuencias en desarrollo.
                    </p>
                </motion.div>

                {/* CONTENT SECTION (Glassmorphism card) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="relative p-1 bg-gradient-to-br from-white/10 to-transparent rounded-2xl">
                        <div className="bg-[#0A0B0E]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 md:p-12 shadow-[0_0_40px_rgba(0,0,0,0.5)]">

                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-8 h-8 rounded-full border-t-2 border-accent animate-spin mb-4" />
                                    <p className="font-mono text-accent text-sm tracking-widest uppercase animate-pulse">Scanning Frequencies...</p>
                                </div>
                            ) : tracks.length > 0 ? (
                                <div className="space-y-4">
                                    <AnimatePresence>
                                        {tracks.map((track, i) => (
                                            <motion.div
                                                key={track.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className={`group flex flex-col md:flex-row items-center gap-6 p-4 md:p-6 rounded-xl border transition-all duration-500 ${playingId === track.id ? 'bg-accent/5 border-accent shadow-[0_0_30px_rgba(197,160,89,0.15)] scale-[1.02]' : 'bg-primary-dark/50 border-white/5 hover:border-white/20'}`}
                                            >
                                                {/* Play Button */}
                                                <button
                                                    onClick={() => togglePlay(track.id, track.image_url)}
                                                    className={`w-14 h-14 flex items-center justify-center shrink-0 rounded-full border transition-all ${playingId === track.id ? 'bg-accent border-accent text-primary-dark shadow-[0_0_15px_rgba(197,160,89,0.5)]' : 'bg-transparent border-white/10 text-white/70 hover:border-accent hover:text-accent group-hover:bg-accent/10'}`}
                                                >
                                                    {playingId === track.id ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                                                </button>

                                                {/* Track Info */}
                                                <div className="flex-1 text-center md:text-left">
                                                    <h3 className={`text-xl font-serif font-bold transition-colors ${playingId === track.id ? 'text-accent' : 'text-content-primary group-hover:text-white'}`}>
                                                        {track.title}
                                                    </h3>
                                                    {track.description && (
                                                        <p className="text-content-muted text-sm mt-1 max-w-xl hidden md:block">{track.description}</p>
                                                    )}
                                                </div>

                                                {/* Hidden Audio Element */}
                                                <audio
                                                    id={`audio-${track.id}`}
                                                    src={track.image_url}
                                                    onEnded={() => setPlayingId(null)}
                                                    preload="none"
                                                />

                                                {/* Visualizer (Fake/Aesthetic) */}
                                                <div className="flex items-center gap-1 h-8 opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity hidden sm:flex">
                                                    {[...Array(6)].map((_, idx) => (
                                                        <motion.div
                                                            key={idx}
                                                            className={`w-1 rounded-full ${playingId === track.id ? 'bg-accent' : 'bg-white/20'}`}
                                                            animate={playingId === track.id ? { height: ["20%", "100%", "40%", "80%", "20%"] } : { height: "20%" }}
                                                            transition={{ repeat: Infinity, duration: 1 + Math.random(), ease: "easeInOut" }}
                                                            style={{ height: '4px' }}
                                                        />
                                                    ))}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
                                    <div className="w-16 h-16 rounded-full border border-accent/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(197,160,89,0.1)]">
                                        <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-serif font-bold text-white mb-2">No audio tracks uploaded yet</h3>
                                    <p className="text-white/40 font-mono text-sm max-w-md">
                                        Head over to the Curator Panel to mint your latest sonic artifacts.
                                    </p>
                                </div>
                            )}

                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
