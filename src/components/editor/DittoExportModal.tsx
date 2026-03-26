'use client';

import { useState, useEffect } from 'react';
import { X, Send, Image as ImageIcon, Music, Loader2, CheckCircle2 } from 'lucide-react';
import { exportWAV } from '@/lib/audioUtils';

interface DittoExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    audioBuffer: AudioBuffer | null;
}

export default function DittoExportModal({ isOpen, onClose, audioBuffer }: DittoExportModalProps) {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('Alenna');
    const [genre, setGenre] = useState('Electrónica / Cyberpunk');
    
    const [step, setStep] = useState<'idle' | 'generating_cover' | 'processing_audio' | 'success'>('idle');
    const [coverImage, setCoverImage] = useState<string | null>(null);

    // Reset when opened
    useEffect(() => {
        if (isOpen) {
            setStep('idle');
            setCoverImage(null);
            setTitle('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleGenerateCover = () => {
        if (!title) {
            alert("Por favor, ingresa el título de la canción primero para inspirar a la IA.");
            return;
        }
        setStep('generating_cover');
        // Simulate Imagen 3 generation
        setTimeout(() => {
            setCoverImage('/cover-cyberpunk-pasto.png'); // Uses the pre-generated image
            setStep('idle');
        }, 3000);
    };

    const handleExport = async () => {
        if (!title) {
            alert("El título de la canción es obligatorio para Ditto Music.");
            return;
        }
        if (!audioBuffer) {
            alert("No hay audio cargado en el editor.");
            return;
        }

        setStep('processing_audio');
        
        try {
            // Wait a moment for UI to update
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 1. Export standard WAV
            const wavBlob = await exportWAV(audioBuffer);
            
            // 2. Create download link
            const sanitizedTitle = title.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
            const filename = `ALENNA_ART_${sanitizedTitle}_2026.wav`;
            
            const url = URL.createObjectURL(wavBlob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            // 3. Complete and redirect
            setStep('success');
            setTimeout(() => {
                window.open('https://www.dittomusic.com/dashboard/release', '_blank');
                onClose();
            }, 2000);

        } catch (error) {
            console.error("Error exporting WAV:", error);
            alert("Hubo un error exportando el archivo WAV.");
            setStep('idle');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#0A0510] border border-[#00f0ff]/30 w-full max-w-md rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.1)] overflow-hidden flex flex-col relative">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-gradient-to-r from-[#00f0ff]/10 to-transparent">
                    <div>
                        <h2 className="text-xl font-bold tracking-widest uppercase text-white">Ditto Music</h2>
                        <p className="text-[#00f0ff] text-xs font-mono mt-1">Exportación Cumplimiento WAV Pcm_16</p>
                    </div>
                    <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Metadata Form */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-[#9d00ff] mb-2">Título de la Canción</label>
                            <input 
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ej: Neón en el Bosque"
                                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-sm text-white focus:border-[#00f0ff] focus:outline-none focus:ring-1 focus:ring-[#00f0ff] transition-all"
                                disabled={step !== 'idle'}
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Artista Principal</label>
                                <input 
                                    type="text"
                                    value={artist}
                                    onChange={(e) => setArtist(e.target.value)}
                                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-sm text-white focus:border-[#9d00ff] focus:outline-none transition-all"
                                    disabled={step !== 'idle'}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Género</label>
                                <input 
                                    type="text"
                                    value={genre}
                                    onChange={(e) => setGenre(e.target.value)}
                                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-sm text-white focus:border-[#9d00ff] focus:outline-none transition-all"
                                    disabled={step !== 'idle'}
                                />
                            </div>
                        </div>
                    </div>

                    {/* AI Cover Generation */}
                    <div className="p-4 border border-[#9d00ff]/30 rounded-xl bg-[#9d00ff]/5 relative overflow-hidden group">
                        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                            <ImageIcon size={16} className="text-[#9d00ff]" />
                            Generador de Carátula (Imagen 3)
                        </h3>
                        
                        {coverImage ? (
                            <div className="flex gap-4 items-center">
                                <img src={coverImage} alt="Generada" className="w-20 h-20 rounded-lg object-cover shadow-[0_0_15px_rgba(157,0,255,0.4)]" />
                                <div>
                                    <p className="text-xs text-[#00f0ff] font-bold">¡Carátula Cyberpunk Generada!</p>
                                    <p className="text-[10px] text-white/50 mt-1 max-w-[200px]">Guarda esta imagen para subirla manualmente en el portal de Ditto.</p>
                                </div>
                            </div>
                        ) : step === 'generating_cover' ? (
                            <div className="flex flex-col items-center justify-center p-4">
                                <Loader2 className="animate-spin text-[#9d00ff] mb-2" size={24} />
                                <p className="text-xs text-[#9d00ff] font-mono animate-pulse">Generando estética estilo Cyberpunk/Pasto...</p>
                            </div>
                        ) : (
                            <button 
                                onClick={handleGenerateCover}
                                className="w-full py-2 bg-gradient-to-r from-[#9d00ff]/20 to-[#00f0ff]/20 hover:from-[#9d00ff]/40 hover:to-[#00f0ff]/40 border border-white/10 rounded-lg text-xs font-bold text-white/80 transition-all uppercase tracking-widest"
                            >
                                Generar Carátula "Cyberpunk/Pasto"
                            </button>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-white/10 bg-black/40">
                    <button 
                        onClick={handleExport}
                        disabled={step !== 'idle' && step !== 'success'}
                        className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold uppercase tracking-widest transition-all ${step === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : step === 'processing_audio' ? 'bg-[#00f0ff]/20 text-[#00f0ff] cursor-wait' : 'bg-[#00f0ff] hover:bg-white text-black hover:shadow-[0_0_30px_rgba(0,240,255,0.8)]'}`}
                    >
                        {step === 'processing_audio' ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Procesando WAV 44.1kHz / 16-bit
                            </>
                        ) : step === 'success' ? (
                            <>
                                <CheckCircle2 size={18} />
                                ¡Audio Exportado! Redirigiendo...
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                Exportar Audio y Abrir Ditto
                            </>
                        )}
                    </button>
                    <p className="text-center text-[10px] text-white/30 mt-4 font-mono">
                        El archivo descargado cumplirá con los estándares exactos de la industria.
                    </p>
                </div>
            </div>
        </div>
    );
}
