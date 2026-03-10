'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        tag: 'Colaboración', // Default tag
        message: ''
    });

    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        try {
            const { error } = await supabase
                .from('tickets')
                .insert([
                    {
                        name: formData.name,
                        email: formData.email,
                        tag: formData.tag,
                        message: formData.message,
                        status: 'open'
                    }
                ]);

            if (error) throw error;

            setStatus('success');
            // Reset form
            setFormData({
                name: '',
                email: '',
                tag: 'Colaboración',
                message: ''
            });

        } catch (error: any) {
            console.error('Error submitting ticket:', error);
            setStatus('error');
            setErrorMessage(error.message || 'Hubo un error al enviar tu mensaje. Intenta de nuevo.');
        }
    };

    return (
        <main className="min-h-screen relative overflow-hidden bg-[#0A0510] text-content-primary">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="orb-glow w-[600px] h-[600px] bg-accent/10 top-[-10%] right-[-10%]" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0A0510]/80 via-[#0A0510] to-[#0A0510]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-32 space-y-16">

                {/* Header */}
                <header className="text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-block border border-accent/30 px-6 py-2 rounded-full backdrop-blur-md bg-white/5"
                    >
                        <span className="text-accent font-mono tracking-[0.3em] text-xs uppercase glow-text">
                            Transmission Link
                        </span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-bold font-serif tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        INITIATE <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#8a6e35]">CONTACT</span>
                    </h1>

                    <p className="text-content-secondary max-w-xl mx-auto text-lg font-light leading-relaxed">
                        Selecciona el tipo de ticket y envía tu mensaje directamente a la base de operaciones de Alenna Art.
                    </p>
                </header>

                {/* Contact Form Board */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[80px] rounded-full pointer-events-none" />

                    {status === 'success' ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center border border-accent/50"
                            >
                                <CheckCircle2 className="w-10 h-10 text-accent" />
                            </motion.div>
                            <h2 className="text-3xl font-serif text-white">Transmisión Exitosa</h2>
                            <p className="text-content-muted max-w-md">
                                Tu ticket ha sido encriptado y enviado al sistema maestro. Nos pondremos en contacto contigo pronto.
                            </p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="mt-8 px-8 py-3 bg-white/5 border border-white/20 text-white rounded hover:bg-white/10 transition-colors uppercase text-xs tracking-widest font-bold font-mono"
                            >
                                Enviar otro mensaje
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Name Input */}
                                <div className="space-y-3">
                                    <label htmlFor="name" className="text-xs uppercase tracking-[0.2em] text-white/50 font-bold ml-1">Identity (Name)</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-white/20"
                                        placeholder="Tu nombre completo..."
                                    />
                                </div>

                                {/* Email Input */}
                                <div className="space-y-3">
                                    <label htmlFor="email" className="text-xs uppercase tracking-[0.2em] text-white/50 font-bold ml-1">Return Address (Email)</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-white/20"
                                        placeholder="correo@ejemplo.com"
                                    />
                                </div>
                            </div>

                            {/* Tag Selection */}
                            <div className="space-y-3">
                                <label htmlFor="tag" className="text-xs uppercase tracking-[0.2em] text-white/50 font-bold ml-1">Signal Type (Tag)</label>
                                <div className="relative">
                                    <select
                                        id="tag"
                                        name="tag"
                                        value={formData.tag}
                                        onChange={handleChange}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="Colaboración">🤝 Colaboración Artística</option>
                                        <option value="Producción">🎬 Producción Audiovisual</option>
                                        <option value="Presupuesto">💰 Solicitud de Presupuesto / Compras</option>
                                        <option value="Prensa/Medios">📸 Prensa / Medios</option>
                                        <option value="Soporte">🔧 Soporte Técnico / General</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-white/50">
                                        ▼
                                    </div>
                                </div>
                            </div>

                            {/* Message Area */}
                            <div className="space-y-3">
                                <label htmlFor="message" className="text-xs uppercase tracking-[0.2em] text-white/50 font-bold ml-1">Encrypted Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-white/20 resize-none"
                                    placeholder="Describe en detalle tu consulta, idea o propuesta..."
                                />
                            </div>

                            {/* Error Alert */}
                            {status === 'error' && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 text-red-400">
                                    <AlertCircle className="shrink-0 w-5 h-5 mt-0.5" />
                                    <p className="text-sm">{errorMessage}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className={`w-full py-5 rounded-xl font-bold uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all ${status === 'submitting'
                                        ? 'bg-white/10 text-white/50 cursor-not-allowed border border-white/5'
                                        : 'bg-gradient-to-r from-accent to-[#8a6e35] text-black hover:scale-[1.01] shadow-[0_0_20px_rgba(197,160,89,0.3)]'
                                    }`}
                            >
                                {status === 'submitting' ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
                                        Transmitting...
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Send Transmission
                                    </>
                                )}
                            </button>

                        </form>
                    )}
                </motion.div>

            </div>
        </main>
    );
}
