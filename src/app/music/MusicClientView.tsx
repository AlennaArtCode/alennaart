'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, Rewind, FastForward, Volume2, VolumeX } from 'lucide-react';

type MusicItem = {
    id: string;
    title: string;
    description: string;
    image_url: string;
    image_path: string;
    rarity: string;
    category: string;
    created_at: string;
};

// YOUTUBE HELPER
function getYouTubeEmbedUrl(url: string) {
    let videoId = '';
    if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get('v') || '';
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1` : url;
}

const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default function MusicClientView() {
    const [audioTracks, setAudioTracks] = useState<MusicItem[]>([]);
    const [videoTracks, setVideoTracks] = useState<MusicItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Player State
    const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loopMode, setLoopMode] = useState<"none" | "all" | "one">("all");
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const progressRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchMusic = async () => {
            const { data, error } = await supabase
                .from('artworks')
                .select('*')
                .eq('category', 'Music')
                .eq('is_public', true)
                .order('created_at', { ascending: false });

            if (!error && data) {
                const audio = data.filter(t => !t.image_url.includes('youtu'));
                const video = data.filter(t => t.image_url.includes('youtu'));
                setAudioTracks(audio);
                setVideoTracks(video);
            }
            setLoading(false);
        };
        fetchMusic();
    }, []);

    // Sync Audio Element
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted, currentTrackIndex]);

    useEffect(() => {
        if (audioRef.current && currentTrackIndex !== null && isPlaying) {
            audioRef.current.play().catch((e) => console.error("Playback failed", e));
        } else if (audioRef.current && !isPlaying) {
            audioRef.current.pause();
        }
    }, [currentTrackIndex, isPlaying]);

    // Player Controls
    const handlePlayPause = (index?: number) => {
        if (index !== undefined) {
            if (currentTrackIndex === index) {
                setIsPlaying(!isPlaying);
            } else {
                setCurrentTrackIndex(index);
                setIsPlaying(true);
            }
        } else {
            setIsPlaying(!isPlaying);
        }
    };

    const handleNext = () => {
        if (currentTrackIndex === null) return;
        if (currentTrackIndex < audioTracks.length - 1) {
            setCurrentTrackIndex(currentTrackIndex + 1);
            setIsPlaying(true);
        } else if (loopMode === 'all') {
            setCurrentTrackIndex(0);
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
            setProgress(0);
        }
    };

    const handlePrev = () => {
        if (currentTrackIndex === null) return;
        if (progress > 3) {
            if (audioRef.current) audioRef.current.currentTime = 0;
        } else if (currentTrackIndex > 0) {
            setCurrentTrackIndex(currentTrackIndex - 1);
            setIsPlaying(true);
        } else if (loopMode === 'all') {
            setCurrentTrackIndex(audioTracks.length - 1);
            setIsPlaying(true);
        }
    };

    const handleRewind = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
        }
    };

    const handleFastForward = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
        }
    };

    const handleEnded = () => {
        if (loopMode === 'one') {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
            }
        } else {
            handleNext();
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        }
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (progressRef.current && audioRef.current) {
            const rect = progressRef.current.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const newTime = (clickX / rect.width) * duration;
            audioRef.current.currentTime = newTime;
            setProgress(newTime);
        }
    };

    const toggleLoopMode = () => {
        if (loopMode === 'none') setLoopMode('all');
        else if (loopMode === 'all') setLoopMode('one');
        else setLoopMode('none');
    };

    // --- MÓDULO DE CLASIFICACIÓN DINÁMICA DE GÉNEROS ---
    // Función que normaliza la rareza (que usamos como género musical)
    // Si la rareza es un valor por defecto ('Common', 'Rare', etc), la agrupa en 'Otras Frecuencias'
    const normalizeGenre = (rarity: string) => {
        if (!rarity || ['Common', 'Rare', 'Legendary', 'Epic', 'Mythic'].includes(rarity)) {
            return 'Otras Frecuencias';
        }
        return rarity;
    };

    // Extraemos todos los géneros únicos de las canciones directamente desde la Base de Datos
    const genres = Array.from(new Set(audioTracks.map(t => normalizeGenre(t.rarity))));

    // Lógica para ordenar los géneros:
    // Priorizamos que Techno, Experimental y Urbano Trap aparezcan primero.
    // El resto se ordena alfabéticamente.
    genres.sort((a, b) => {
        const order = ['Techno', 'Experimental', 'Trap/Reggaeton', 'Urbano Trap', 'Otras Frecuencias'];
        const indexA = order.indexOf(a);
        const indexB = order.indexOf(b);
        if (indexA === -1 && indexB !== -1) return 1;
        if (indexB === -1 && indexA !== -1) return -1;
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        return a.localeCompare(b);
    });

    // --- MÓDULO DE CLASIFICACIÓN DE VIDEOS ---
    const videoGenres = Array.from(new Set(videoTracks.map(t => normalizeGenre(t.rarity))));
    videoGenres.sort((a, b) => {
        const order = ['Techno', 'Experimental', 'Trap/Reggaeton', 'Urbano Trap', 'Otras Frecuencias'];
        const indexA = order.indexOf(a);
        const indexB = order.indexOf(b);
        if (indexA === -1 && indexB !== -1) return 1;
        if (indexB === -1 && indexA !== -1) return -1;
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        return a.localeCompare(b);
    });

    const currentTrack = currentTrackIndex !== null ? audioTracks[currentTrackIndex] : null;

    return (
        <section className="relative min-h-screen bg-[#0F1116] text-white pt-32 pb-40 overflow-hidden">
            {/* BACKGROUND GLOW */}
            <div className="absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(ellipse_at_top,rgba(197,160,89,0.15),transparent_70%)] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
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
                    <div className="flex justify-center items-center gap-4 my-8">
                        <div className="w-12 h-[1px] bg-accent/30" />
                        <div className="w-2 h-2 rounded-full bg-accent/80 shadow-[0_0_10px_rgba(197,160,89,0.5)]" />
                        <div className="w-12 h-[1px] bg-accent/30" />
                    </div>
                </motion.div>

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
                            ) : audioTracks.length > 0 || videoTracks.length > 0 ? (
                                <div className="space-y-16">
                                    {/* AUDIO TRACKS GROUPED BY GENRE */}
                                    {genres.length > 0 && (
                                        <div className="space-y-12">
                                            <h2 className="text-3xl font-serif text-white flex items-center gap-3">
                                                <span className="w-2 h-2 rounded-full bg-white/30" />
                                                Archivos Sonoros
                                            </h2>

                                            {genres.map(genre => (
                                                <div key={genre} className="space-y-4">
                                                    <h3 className="text-xl font-serif text-accent/80 border-b border-white/10 pb-2 mb-4">
                                                        {genre}
                                                    </h3>
                                                    <AnimatePresence>
                                                        {audioTracks.map((track, globalIndex) => {
                                                            const trackGenre = normalizeGenre(track.rarity);
                                                            if (trackGenre !== genre) return null;

                                                            const isTrackPlaying = currentTrackIndex === globalIndex && isPlaying;
                                                            return (
                                                                <motion.div
                                                                    key={track.id}
                                                                    initial={{ opacity: 0, y: 20 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    className={`group flex items-center gap-6 p-4 rounded-xl border transition-all duration-500 cursor-pointer ${currentTrackIndex === globalIndex ? 'bg-accent/10 border-accent shadow-[0_0_30px_rgba(197,160,89,0.15)]' : 'bg-primary-dark/50 border-white/5 hover:border-white/20'}`}
                                                                    onClick={() => handlePlayPause(globalIndex)}
                                                                >
                                                                    {track.image_path && track.image_path !== track.image_url && !track.image_path.includes('youtu') ? (
                                                                        <div className="w-14 h-14 rounded-md overflow-hidden shrink-0 border border-white/10 relative shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                                                                            <img src={track.image_path} alt={track.title} className="w-full h-full object-cover" />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="w-14 h-14 flex items-center justify-center shrink-0 rounded-md border border-white/10 bg-white/5">
                                                                            {isTrackPlaying ? <Pause size={20} className="text-accent" /> : <Play size={20} className="text-white/50 ml-1" />}
                                                                        </div>
                                                                    )}

                                                                    <div className="flex-1">
                                                                        <h3 className={`text-lg font-serif font-bold transition-colors ${currentTrackIndex === globalIndex ? 'text-accent' : 'text-content-primary group-hover:text-white'}`}>
                                                                            {track.title}
                                                                        </h3>
                                                                        {track.description && (
                                                                            <p className="text-content-muted text-sm line-clamp-1">{track.description}</p>
                                                                        )}
                                                                    </div>

                                                                    <div className="flex items-center gap-1 h-6 opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity">
                                                                        {[...Array(4)].map((_, idx) => (
                                                                            <motion.div
                                                                                key={idx}
                                                                                className={`w-1 rounded-full ${isTrackPlaying ? 'bg-accent' : 'bg-white/20'}`}
                                                                                animate={isTrackPlaying ? { height: ["20%", "100%", "40%", "80%", "20%"] } : { height: "20%" }}
                                                                                transition={{ repeat: Infinity, duration: 0.8 + Math.random(), ease: "easeInOut" }}
                                                                                style={{ height: '4px' }}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </motion.div>
                                                            );
                                                        })}
                                                    </AnimatePresence>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* VIDEO STRIP */}
                                    {videoTracks.length > 0 && (
                                        <div className="space-y-6 pt-8 border-t border-white/5">
                                            <h2 className="text-2xl font-serif text-white flex items-center gap-3">
                                                <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_rgba(197,160,89,0.5)]" />
                                                Transmisiones Audiovisuales
                                            </h2>
                                            {videoGenres.map(genre => (
                                                <div key={genre} className="space-y-4 mt-8 first:mt-4">
                                                    <h3 className="text-xl font-serif text-accent/80 border-b border-white/10 pb-2 mb-6">
                                                        {genre}
                                                    </h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        {videoTracks
                                                            .filter(video => normalizeGenre(video.rarity) === genre)
                                                            .map(video => (
                                                                <div key={video.id} className="bg-[#0A0B0E]/80 border border-white/5 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] group hover:border-accent/40 transition-all duration-500 hover:-translate-y-1">
                                                                    <div className="aspect-video w-full relative bg-black">
                                                                        <iframe
                                                                            src={getYouTubeEmbedUrl(video.image_url)}
                                                                            title={video.title}
                                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                            allowFullScreen
                                                                            className="absolute inset-0 w-full h-full border-0"
                                                                        ></iframe>
                                                                    </div>
                                                                    <div className="p-6">
                                                                        <div className="mb-2">
                                                                            <span className="text-[10px] font-mono uppercase tracking-widest text-accent border border-accent/30 bg-accent/5 px-2 py-0.5 rounded-full">
                                                                                {normalizeGenre(video.rarity)}
                                                                            </span>
                                                                        </div>
                                                                        <h3 className="font-serif text-xl font-bold text-white group-hover:text-accent transition-colors">{video.title}</h3>
                                                                        {video.description && <p className="text-sm text-content-muted mt-2 font-mono leading-relaxed truncate">{video.description}</p>}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* GLOBAL STICKY AUDIO PLAYER */}
            <AnimatePresence>
                {currentTrack && (
                    <motion.div
                        initial={{ y: 150, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 150, opacity: 0 }}
                        className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 md:pb-4 pointer-events-none"
                    >
                        <div className="container mx-auto max-w-5xl pointer-events-auto">
                            <div className="bg-[#0A0B0E]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.8)] overflow-hidden">

                                {/* Top Progress Bar */}
                                <div
                                    ref={progressRef}
                                    className="h-1.5 w-full bg-white/10 cursor-pointer group relative"
                                    onClick={handleProgressClick}
                                >
                                    <div
                                        className="h-full bg-gradient-to-r from-accent/50 to-accent relative"
                                        style={{ width: `${(progress / duration) * 100 || 0}%` }}
                                    >
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                                    </div>
                                </div>

                                <div className="p-4 px-6 flex flex-col md:flex-row items-center justify-between gap-4">

                                    {/* Track Info */}
                                    <div className="flex items-center gap-4 w-full md:w-1/3">
                                        {currentTrack.image_path && currentTrack.image_path !== currentTrack.image_url ? (
                                            <img src={currentTrack.image_path} alt={currentTrack.title} className="w-12 h-12 rounded-md object-cover border border-white/10" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-md bg-white/5 border border-white/10 flex items-center justify-center">
                                                <Play size={16} className="text-white/20" />
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <h4 className="text-white font-serif font-bold truncate text-sm md:text-base">{currentTrack.title}</h4>
                                            <p className="text-accent/80 text-xs font-mono tracking-wider truncate">{normalizeGenre(currentTrack.rarity)}</p>
                                        </div>
                                    </div>

                                    {/* Controls */}
                                    <div className="flex flex-col items-center justify-center w-full md:w-1/3 gap-2">
                                        <div className="flex items-center gap-6">
                                            <button onClick={toggleLoopMode} className={`transition-colors ${loopMode !== 'none' ? 'text-accent' : 'text-white/40 hover:text-white'}`} title="Loop">
                                                {loopMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
                                            </button>

                                            <button onClick={handleRewind} className="text-white/60 hover:text-white transition-colors" title="Rewind 10s">
                                                <Rewind size={20} />
                                            </button>

                                            <button onClick={handlePrev} className="text-white/80 hover:text-white transition-colors">
                                                <SkipBack size={24} fill="currentColor" />
                                            </button>

                                            <button
                                                onClick={() => handlePlayPause()}
                                                className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-[#0A0B0E] hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                            >
                                                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                                            </button>

                                            <button onClick={handleNext} className="text-white/80 hover:text-white transition-colors">
                                                <SkipForward size={24} fill="currentColor" />
                                            </button>

                                            <button onClick={handleFastForward} className="text-white/60 hover:text-white transition-colors" title="Forward 10s">
                                                <FastForward size={20} />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 w-full max-w-[300px] justify-between px-4">
                                            <span>{formatTime(progress)}</span>
                                            <span>{formatTime(duration)}</span>
                                        </div>
                                    </div>

                                    {/* Volume */}
                                    <div className="hidden md:flex items-center justify-end gap-3 w-1/3">
                                        <button onClick={() => setIsMuted(!isMuted)} className="text-white/60 hover:text-white transition-colors">
                                            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                        </button>
                                        <div className="w-24 h-1 bg-white/10 rounded-full cursor-pointer relative"
                                            onClick={(e) => {
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                const vol = (e.clientX - rect.left) / rect.width;
                                                setVolume(Math.max(0, Math.min(1, vol)));
                                                setIsMuted(false);
                                            }}>
                                            <div className="absolute left-0 top-0 bottom-0 bg-white/60 rounded-full" style={{ width: `${(isMuted ? 0 : volume) * 100}%` }} />
                                            <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 hover:opacity-100 shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ left: `calc(${(isMuted ? 0 : volume) * 100}% - 4px)` }} />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hidden Native Audio Element */}
            {currentTrack && (
                <audio
                    ref={audioRef}
                    src={currentTrack.image_url}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleEnded}
                    onLoadedMetadata={handleTimeUpdate}
                    preload="auto"
                />
            )}
        </section>
    );
}
