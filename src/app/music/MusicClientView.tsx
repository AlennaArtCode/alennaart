'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// --- TYPES ---

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

// --- HELPERS ---

function getYouTubeEmbedUrl(url: string) {
    let videoId = '';
    if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split('?')[0];
    else if (url.includes('youtube.com/watch')) {
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

// --- COMPONENTS ---

const MusicHero = ({ t }: { t: any }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="text-center mb-24 max-w-4xl mx-auto space-y-6"
    >
        <div className="inline-block border border-accent/30 px-5 py-2 rounded-full backdrop-blur-md bg-white/5 mb-4">
            <span className="text-accent font-mono tracking-[0.4em] text-[10px] uppercase">
                {t('music', 'hero_badge')}
            </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white tracking-tighter leading-none mb-8">
            {t('music', 'hero_title_main')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#e8c97a] to-accent">{t('music', 'hero_title_sub')}</span>
        </h1>

        <p className="text-content-secondary text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
            {t('music', 'hero_description')}
        </p>

        <div className="flex justify-center items-center gap-6 pt-8">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-accent/30" />
            <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse shadow-[0_0_15px_rgba(197,160,89,0.5)]" />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-accent/30" />
        </div>
    </motion.div>
);

const AudioArchives = ({ 
    genres, 
    audioTracks, 
    currentTrackIndex, 
    isPlaying, 
    onPlayPause,
    t
}: { 
    genres: string[], 
    audioTracks: MusicItem[], 
    currentTrackIndex: number | null, 
    isPlaying: boolean,
    onPlayPause: (index: number) => void,
    t: any
}) => {
    const getGenreInfo = (genre: string) => {
        const key = genre.toLowerCase().includes('techno') ? 'techno' :
                    genre.toLowerCase().includes('experimental') ? 'experimental' :
                    (genre.toLowerCase().includes('trap') || genre.toLowerCase().includes('urbano')) ? 'trap' : 'other';
        return {
            title: t('music', `genre_${key}_title`),
            desc: t('music', `genre_${key}_desc`)
        };
    };

    return (
        <div className="space-y-20">
            <div className="flex items-center gap-4 mb-16">
                <h2 className="text-3xl font-serif font-bold text-white tracking-widest uppercase">{t('music', 'section_archives')}</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
            </div>

            {genres.map((genre) => {
                const info = getGenreInfo(genre);
                return (
                    <div key={genre} className="space-y-8">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-2"
                        >
                            <h3 className="text-2xl md:text-3xl font-serif font-bold text-accent">{info.title}</h3>
                            <p className="text-content-muted text-sm font-light max-w-xl italic">{info.desc}</p>
                        </motion.div>

                        <div className="grid grid-cols-1 gap-2">
                            {audioTracks.map((track, globalIndex) => {
                                const normalizeGenre = (rarity: string) => {
                                    if (!rarity || ['Common', 'Rare', 'Legendary', 'Epic', 'Mythic'].includes(rarity)) return 'Otras Frecuencias';
                                    return rarity;
                                };
                                if (normalizeGenre(track.rarity) !== genre) return null;

                                const isTrackActive = currentTrackIndex === globalIndex;
                                const isTrackPlaying = isTrackActive && isPlaying;

                                return (
                                    <motion.div
                                        key={track.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: globalIndex * 0.05 }}
                                        className={`group relative p-5 rounded-xl border transition-all duration-500 cursor-pointer overflow-hidden ${isTrackActive ? 'bg-accent/10 border-accent/50 shadow-[0_0_40px_rgba(197,160,89,0.1)]' : 'bg-white/[0.02] border-white/5 hover:border-white/20'}`}
                                        onClick={() => onPlayPause(globalIndex)}
                                    >
                                        {isTrackActive && (
                                            <motion.div 
                                                className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent pointer-events-none"
                                                animate={{ opacity: [0.3, 0.6, 0.3] }}
                                                transition={{ duration: 4, repeat: Infinity }}
                                            />
                                        )}

                                        <div className="relative z-10 flex items-center gap-6">
                                            <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0 border border-white/10 group-hover:border-accent/40 transition-colors">
                                                {track.image_path && track.image_path !== track.image_url && !track.image_path.includes('youtu') ? (
                                                    <img src={track.image_path} alt={track.title} className="w-full h-full object-cover" />
                                                ) : <div className="w-full h-full flex items-center justify-center bg-white/5"><Volume2 size={24} className="text-white/20" /></div>}
                                                {isTrackActive && (
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                        {isTrackPlaying ? (
                                                            <div className="flex gap-1 h-5 items-end">
                                                                {[1, 2, 3].map(i => (
                                                                    <motion.div 
                                                                        key={i}
                                                                        className="w-1 bg-accent rounded-full"
                                                                        animate={{ height: ["20%", "100%", "40%"] }}
                                                                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        ) : <Play size={20} className="text-white" />}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3">
                                                    <h4 className={`text-xl font-serif font-bold truncate transition-colors ${isTrackActive ? 'text-accent' : 'text-white group-hover:text-accent'}`}>{track.title}</h4>
                                                    {isTrackActive && <span className="text-[9px] font-mono text-accent uppercase tracking-widest animate-pulse">Now Playing</span>}
                                                </div>
                                                <p className="text-content-muted text-sm font-light leading-relaxed line-clamp-1 mt-1">{track.description || t('music', 'track_placeholder')}</p>
                                            </div>

                                            <div className="hidden md:flex items-center gap-4 text-white/20 group-hover:text-white/40 transition-colors">
                                               <span className="text-[10px] font-mono tracking-widest uppercase">{genre}</span>
                                               <Play size={16} className={isTrackActive ? 'text-accent' : ''} />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const VisualTransmissions = ({ videoGenres, videoTracks, t }: { videoGenres: string[], videoTracks: MusicItem[], t: any }) => (
    <div className="space-y-16 pt-32 border-t border-white/5">
        <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-serif font-bold text-white tracking-widest uppercase">{t('music', 'section_transmissions')}</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-accent/20 to-transparent" />
        </div>

        {videoGenres.map(genre => (
            <div key={genre} className="space-y-8">
                <div className="border-l-2 border-accent/40 pl-6 mb-8">
                    <h3 className="text-xl font-serif font-bold text-white uppercase tracking-wider">{genre}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {videoTracks
                        .filter(video => {
                            const normalizeGenre = (rarity: string) => {
                                if (!rarity || ['Common', 'Rare', 'Legendary', 'Epic', 'Mythic'].includes(rarity)) return 'Otras Frecuencias';
                                return rarity;
                            };
                            return normalizeGenre(video.rarity) === genre;
                        })
                        .map(video => (
                            <motion.div 
                                key={video.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="group bg-black/40 border border-white/5 rounded-2xl overflow-hidden hover:border-accent/40 transition-all duration-700 hover:-translate-y-2 shadow-2xl"
                            >
                                <div className="aspect-video w-full relative bg-black">
                                    <iframe
                                        src={getYouTubeEmbedUrl(video.image_url)}
                                        title={video.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="absolute inset-0 w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-1000"
                                    ></iframe>
                                </div>
                                <div className="p-8 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                        <h3 className="font-serif text-2xl font-bold text-white group-hover:text-accent transition-colors">{video.title}</h3>
                                    </div>
                                    <p className="text-content-secondary text-sm font-light leading-relaxed h-12 line-clamp-2">{video.description || t('music', 'video_placeholder')}</p>
                                </div>
                            </motion.div>
                        ))}
                </div>
            </div>
        ))}
    </div>
);

// --- MAIN COMPONENT ---

export default function MusicClientView() {
    const { t } = useLanguage();
    const [audioTracks, setAudioTracks] = useState<MusicItem[]>([]);
    const [videoTracks, setVideoTracks] = useState<MusicItem[]>([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
    }, [volume, isMuted, currentTrackIndex]);

    useEffect(() => {
        if (audioRef.current && currentTrackIndex !== null && isPlaying) {
            audioRef.current.play().catch((e) => console.error("Playback failed", e));
        } else if (audioRef.current && !isPlaying) audioRef.current.pause();
    }, [currentTrackIndex, isPlaying]);

    const handlePlayPause = (index?: number) => {
        if (index !== undefined) {
            if (currentTrackIndex === index) setIsPlaying(!isPlaying);
            else { setCurrentTrackIndex(index); setIsPlaying(true); }
        } else setIsPlaying(!isPlaying);
    };

    const handleNext = () => {
        if (currentTrackIndex === null) return;
        if (currentTrackIndex < audioTracks.length - 1) { setCurrentTrackIndex(currentTrackIndex + 1); setIsPlaying(true); }
        else if (loopMode === 'all') { setCurrentTrackIndex(0); setIsPlaying(true); }
        else { setIsPlaying(false); setProgress(0); }
    };

    const handlePrev = () => {
        if (currentTrackIndex === null) return;
        if (progress > 3) { if (audioRef.current) audioRef.current.currentTime = 0; }
        else if (currentTrackIndex > 0) { setCurrentTrackIndex(currentTrackIndex - 1); setIsPlaying(true); }
        else if (loopMode === 'all') { setCurrentTrackIndex(audioTracks.length - 1); setIsPlaying(true); }
    };

    const handleEnded = () => {
        if (loopMode === 'one' && audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play(); }
        else handleNext();
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) { setProgress(audioRef.current.currentTime); setDuration(audioRef.current.duration || 0); }
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

    const normalizeGenre = (rarity: string) => {
        if (!rarity || ['Common', 'Rare', 'Legendary', 'Epic', 'Mythic'].includes(rarity)) return 'Otras Frecuencias';
        return rarity;
    };

    const genres = Array.from(new Set(audioTracks.map(t => normalizeGenre(t.rarity))));
    genres.sort((a, b) => {
        const order = ['Techno', 'Experimental', 'Trap/Reggaeton', 'Urbano Trap', 'Otras Frecuencias'];
        const indexA = order.indexOf(a);
        const indexB = order.indexOf(b);
        if (indexA === -1 && indexB !== -1) return 1;
        if (indexB === -1 && indexA !== -1) return -1;
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        return a.localeCompare(b);
    });

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
        <main className="min-h-screen relative overflow-hidden bg-[#0A0510] text-content-primary">
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="orb-glow w-[900px] h-[900px] bg-accent-mystic/10 top-[-20%] right-[-15%]" />
                <div className="orb-glow w-[700px] h-[700px] bg-[#C5A059]/5 bottom-[-10%] left-[-10%]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0510]/80 to-[#0A0510]" />
            </div>

            <div className="relative z-10 pt-32 pb-48">
                <div className="container mx-auto px-6">
                    <MusicHero t={t} />

                    <div className="max-w-5xl mx-auto">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 text-center">
                                <div className="w-10 h-10 rounded-full border-t-2 border-accent animate-spin mb-4" />
                                <p className="font-mono text-accent text-sm tracking-[0.5em] uppercase">{t('music', 'section_loading')}</p>
                            </div>
                        ) : (audioTracks.length > 0 || videoTracks.length > 0) ? (
                            <>
                                <AudioArchives 
                                    genres={genres}
                                    audioTracks={audioTracks}
                                    currentTrackIndex={currentTrackIndex}
                                    isPlaying={isPlaying}
                                    onPlayPause={handlePlayPause}
                                    t={t}
                                />
                                <VisualTransmissions 
                                    videoGenres={videoGenres}
                                    videoTracks={videoTracks}
                                    t={t}
                                />
                            </>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-32 text-center space-y-4"
                            >
                                <div className="w-16 h-px bg-white/20" />
                                <h3 className="text-xl font-serif text-white/40 italic">Silencio Creativo</h3>
                                <p className="text-content-muted text-sm max-w-xs font-light">Las frecuencias están siendo calibradas. Vuelve pronto para escuchar el eco de lo nuevo.</p>
                                <div className="w-16 h-px bg-white/20" />
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {currentTrack && (
                    <motion.div
                        initial={{ y: 200, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 200, opacity: 0 }}
                        className="fixed bottom-0 left-0 right-0 z-50 p-6 pointer-events-none"
                    >
                        <div className="container mx-auto max-w-5xl pointer-events-auto">
                            <div className="bg-black/80 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_-20px_60px_rgba(0,0,0,0.6)] overflow-hidden">
                                <div ref={progressRef} className="h-1 bg-white/10 w-full cursor-pointer group" onClick={handleProgressClick}>
                                    <motion.div className="h-full bg-accent" style={{ width: `${(progress / duration) * 100}%` }} />
                                </div>
                                <div className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-5 w-full md:w-1/3">
                                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 shrink-0">
                                            {currentTrack.image_path && currentTrack.image_path !== currentTrack.image_url ? (
                                                <img src={currentTrack.image_path} alt="" className="w-full h-full object-cover" />
                                            ) : <div className="w-full h-full bg-accent/20 flex items-center justify-center"><Volume2 className="text-accent" /></div>}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-white font-serif font-bold truncate text-lg">{currentTrack.title}</h4>
                                            <p className="text-accent/60 text-xs font-mono uppercase tracking-widest">{normalizeGenre(currentTrack.rarity)}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-3 w-full md:w-1/3">
                                        <div className="flex items-center gap-8">
                                            <button onClick={handlePrev} className="text-white/60 hover:text-white transition-colors"><SkipBack fill="currentColor" size={28} /></button>
                                            <button 
                                                onClick={() => handlePlayPause()} 
                                                className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                                            >
                                                {isPlaying ? <Pause fill="currentColor" size={32} /> : <Play fill="currentColor" size={32} className="ml-1" />}
                                            </button>
                                            <button onClick={handleNext} className="text-white/60 hover:text-white transition-colors"><SkipForward fill="currentColor" size={28} /></button>
                                        </div>
                                        <div className="flex items-center gap-4 w-full">
                                            <span className="text-[10px] font-mono text-white/40">{formatTime(progress)}</span>
                                            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-white/20" style={{ width: `${(progress / duration) * 100}%` }} />
                                            </div>
                                            <span className="text-[10px] font-mono text-white/40">{formatTime(duration)}</span>
                                        </div>
                                    </div>
                                    <div className="hidden md:flex items-center justify-end gap-6 w-1/3 text-white/40">
                                        <button onClick={toggleLoopMode} className={loopMode !== 'none' ? 'text-accent' : ''}>
                                            {loopMode === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
                                        </button>
                                        <div className="flex items-center gap-2 group">
                                            <button onClick={() => setIsMuted(!isMuted)}>{isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}</button>
                                            <input 
                                                type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} 
                                                onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
                                                className="w-20 h-1 bg-white/10 rounded-full appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {currentTrack && (
                <audio ref={audioRef} src={currentTrack.image_url} onTimeUpdate={handleTimeUpdate} onEnded={handleEnded} onLoadedMetadata={handleTimeUpdate} preload="auto" />
            )}
        </main>
    );
}
