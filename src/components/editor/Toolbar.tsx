'use client';

import { Upload, Download, Scissors, Send } from 'lucide-react';

interface ToolbarProps {
    onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onExport: () => void;
    hasAudio: boolean;
}

export default function Toolbar({ onImport, onExport, hasAudio }: ToolbarProps) {
    return (
        <div className="flex items-center gap-4">
            {/* Hidden File Input */}
            <input 
                type="file" 
                id="audio-upload" 
                accept="audio/mp3, audio/wav" 
                className="hidden" 
                onChange={onImport}
            />
            
            <label 
                htmlFor="audio-upload" 
                className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded hover:border-[#00f0ff] hover:text-[#00f0ff] transition-colors cursor-pointer text-sm font-bold uppercase tracking-widest text-white/80"
            >
                <Upload size={16} />
                <span>Importar WAV/MP3</span>
            </label>

            <button 
                disabled={!hasAudio}
                className={`flex items-center gap-2 px-4 py-2 border border-white/20 rounded transition-colors text-sm font-bold uppercase tracking-widest ${hasAudio ? 'hover:border-[#9d00ff] hover:text-[#9d00ff] text-white/80' : 'text-white/30 border-white/10 cursor-not-allowed'}`}
            >
                <Scissors size={16} />
                <span>Recortar (Trim)</span>
            </button>

            <button 
                onClick={onExport}
                disabled={!hasAudio}
                className={`flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/20 rounded transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)] text-sm font-bold uppercase tracking-widest ${hasAudio ? 'hover:bg-accent/10 hover:border-accent hover:text-accent hover:shadow-[0_0_20px_rgba(197,160,89,0.3)] text-white' : 'text-white/30 cursor-not-allowed border-white/10'}`}
            >
                <Download size={16} />
                <span className="hidden lg:inline">Exportar MP3 320k</span>
            </button>

            {/* DITTO INTEGRATION */}
            <div className="w-px h-8 bg-white/20 ml-2 hidden sm:block" />
            <button 
                onClick={() => {
                    if (hasAudio) {
                        alert("Iniciando integración con DITTO: Preparando metadatos para subir track finalizado...");
                        setTimeout(() => alert("Track subido exitosamente a la cola de distribución de DITTO (Simulación)."), 1500);
                    }
                }}
                disabled={!hasAudio}
                className={`flex items-center gap-2 px-5 py-2 ml-2 rounded transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] text-sm font-bold uppercase tracking-widest ${hasAudio ? 'bg-[#0A0510] border border-[#00f0ff]/50 hover:bg-[#00f0ff]/10 hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] text-[#00f0ff]' : 'bg-transparent text-[#00f0ff]/30 cursor-not-allowed border-[#00f0ff]/10'}`}
            >
                <Send size={16} />
                <span className="hidden sm:inline">Distribuir en DITTO</span>
            </button>
        </div>
    );
}
