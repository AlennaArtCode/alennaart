'use client';

import { useState, useRef, useEffect } from 'react';
import WaveformViewer from '@/components/editor/WaveformViewer';
import Toolbar from '@/components/editor/Toolbar';
import AIControls from '@/components/editor/AIControls';

export default function AudioEditorPage() {
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    
    // Stems (original, vocals, drums, bass)
    const [stems, setStems] = useState<{ name: string; url: string; active: boolean }[]>([]);

    const wavesurferRef = useRef<any>(null);

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setAudioUrl(url);
            setStems([{ name: 'Original', url, active: true }]);
        }
    };

    const togglePlay = () => {
        if (wavesurferRef.current) {
            wavesurferRef.current.playPause();
            setIsPlaying(wavesurferRef.current.isPlaying());
        }
    };

    const handleVolumeChange = (newVolume: number) => {
        setVolume(newVolume);
        if (wavesurferRef.current) {
            wavesurferRef.current.setVolume(newVolume);
        }
    };

    const toggleMute = () => {
        const nextMute = !isMuted;
        setIsMuted(nextMute);
        if (wavesurferRef.current) {
            wavesurferRef.current.setMuted(nextMute);
        }
    };

    const handleExport = () => {
        // Mock export
        alert("Exporting MP3 @ 320kbps...");
    };

    return (
        <main className="fixed inset-0 bg-[#050505] text-white flex flex-col font-sans overflow-hidden z-50">
            {/* Header */}
            <header className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-black/50 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold tracking-widest uppercase">
                        <span className="text-[#C5A059]">Alenna</span> Audio Editor
                    </h1>
                </div>
                <Toolbar 
                    onImport={handleImport} 
                    onExport={handleExport} 
                    hasAudio={!!audioUrl} 
                />
            </header>

            {/* Main Canvas Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                {!audioUrl ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center space-y-4">
                            <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-6 bg-white/[0.02]">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-serif text-white/80">Canvas Vacío</h2>
                            <p className="text-white/40 text-sm">Importa un archivo de audio para comenzar la edición.</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col p-6 overflow-y-auto space-y-6">
                        {/* WaveSurfer Tracks */}
                        {stems.map((stem, i) => (
                            <div key={i} className="bg-[#0A0510] border border-white/10 rounded-xl p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#9d00ff]">{stem.name}</span>
                                    <button className="text-xs text-white/50 hover:text-white transition-colors">Opción</button>
                                </div>
                                <WaveformViewer 
                                    url={stem.url} 
                                    onMount={(ws) => { if (i === 0) wavesurferRef.current = ws; }}
                                    isPlaying={isPlaying}
                                    volume={volume}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Transport & Effects Panel */}
            <footer className="h-24 flex items-center justify-between px-6 border-t border-white/10 bg-black/80 backdrop-blur-xl">
                {/* Transport Controls */}
                <div className="flex items-center gap-6">
                    <button onClick={togglePlay} disabled={!audioUrl} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${audioUrl ? 'bg-[#9d00ff] hover:bg-[#b033ff] text-white shadow-[0_0_15px_rgba(157,0,255,0.4)]' : 'bg-white/5 text-white/30'}`}>
                        {isPlaying ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M5 3l14 9-14 9V3z"/></svg>
                        )}
                    </button>

                    <div className="flex items-center gap-3">
                        <button onClick={toggleMute} disabled={!audioUrl} className={`transition-colors ${isMuted || !audioUrl ? 'text-white/30' : 'text-white'}`}>
                            {isMuted ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                            )}
                        </button>
                        <input 
                            type="range" min="0" max="1" step="0.01" value={volume}
                            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                            disabled={!audioUrl}
                            className="w-24 accent-[#00f0ff]"
                        />
                    </div>
                </div>

                {/* AI Effects */}
                <AIControls hasAudio={!!audioUrl} onStemSplit={() => {
                    // Mock split action
                    setStems([
                        { name: 'Vocals (Gemini API)', url: stems[0].url, active: true },
                        { name: 'Drums (Gemini API)', url: stems[0].url, active: true },
                        { name: 'Bass (Gemini API)', url: stems[0].url, active: true }
                    ]);
                }} />
            </footer>
        </main>
    );
}
