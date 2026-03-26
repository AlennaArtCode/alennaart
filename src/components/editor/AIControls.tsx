'use client';

import { Sparkles, Wand2, Orbit } from 'lucide-react';
import { useState } from 'react';

interface AIControlsProps {
    hasAudio: boolean;
    onStemSplit: () => void;
}

export default function AIControls({ hasAudio, onStemSplit }: AIControlsProps) {
    const [isSplitting, setIsSplitting] = useState(false);

    const handleStemSplit = async () => {
        if (!hasAudio || isSplitting) return;
        setIsSplitting(true);
        
        try {
            // Mocking the call to the Gemini API via our Next.js backend
            const res = await fetch('/api/gemini-audio', {
                method: 'POST',
                // body: ... (the audio file data)
            });
            await res.json();
            
            // Artificial delay to simulate processing
            setTimeout(() => {
                onStemSplit();
                setIsSplitting(false);
            }, 2500);

        } catch (error) {
            console.error('Stem splitting failed', error);
            setIsSplitting(false);
        }
    };

    return (
        <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mr-2 block sm:hidden md:block">
                AI / FX
            </span>

            <button 
                disabled={!hasAudio || isSplitting}
                className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors ${hasAudio ? 'bg-white/5 border border-white/10 hover:bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]' : 'text-white/30 cursor-not-allowed bg-transparent'}`}
            >
                <Wand2 size={14} />
                <span className="hidden lg:inline">Denoise</span>
            </button>

            <button 
                disabled={!hasAudio || isSplitting}
                className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors ${hasAudio ? 'bg-white/5 border border-white/10 hover:bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]' : 'text-white/30 cursor-not-allowed bg-transparent'}`}
            >
                <Sparkles size={14} />
                <span className="hidden lg:inline">Normalizar</span>
            </button>

            <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />

            <button 
                onClick={handleStemSplit}
                disabled={!hasAudio || isSplitting}
                className={`group relative flex items-center gap-2 px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-all overflow-hidden ${hasAudio ? 'bg-[#100A1A] border border-[#9d00ff]/50 text-white hover:shadow-[0_0_25px_rgba(157,0,255,0.4)]' : 'text-white/30 cursor-not-allowed bg-transparent border-transparent'}`}
            >
                {/* Neon Background effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#9d00ff]/0 via-[#9d00ff]/20 to-[#00f0ff]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <Orbit size={16} className={`relative z-10 text-[#00f0ff] ${isSplitting ? 'animate-spin' : ''}`} />
                <span className="relative z-10 hidden sm:inline">
                    {isSplitting ? 'Gemini 3 Analizando...' : 'Separar Stems (Gemini)'}
                </span>
            </button>
        </div>
    );
}
