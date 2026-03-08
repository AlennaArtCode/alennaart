'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Eye, EyeOff, Wand2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// --- TYPES ---
type GalleryItem = {
    id: string; // UUID from Supabase
    title: string;
    category: string;
    rarity: string;
    image_url: string;
    description?: string;
    is_public: boolean;
    created_at?: string;
};

// --- CONFIG ---
const STORAGE_BUCKET = 'portfolio';

export default function AdminPanel() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);

    // Auth State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState<string | null>(null);

    // Data State
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [newItem, setNewItem] = useState<Partial<GalleryItem>>({
        title: '', category: 'Geometry', rarity: 'Common', image_url: '', is_public: false, description: ''
    });

    // NFT Decorator State (New Request)
    const [activeTab, setActiveTab] = useState<'upload' | 'music' | 'decorator'>('upload');

    // --- EFFECT: CHECK AUTH & LOAD DATA ---
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setIsAuthenticated(true);
                fetchItems();
            }
        };
        checkSession();
    }, []);

    // --- ACTIONS: AUTH ---
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setAuthError(null);

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            console.error(error);
            setAuthError(error.message);
        } else {
            setIsAuthenticated(true);
            fetchItems();
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsAuthenticated(false);
    };

    // --- ACTIONS: DATA ---
    const fetchItems = async () => {
        const { data, error } = await supabase
            .from('artworks')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching:', error);
        else setGalleryItems(data || []);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isAudio: boolean = false) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from(STORAGE_BUCKET)
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(filePath);

            setNewItem({ ...newItem, image_url: publicUrl, category: isAudio ? 'Music' : newItem.category });
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert('Error uploading file: ' + error.message);
            }
        } finally {
            setUploading(false);
        }
    };

    const addItem = async () => {
        if (!newItem.title || !newItem.image_url) return alert("Faltan datos (Título o Imagen)");

        const { error } = await supabase.from('artworks').insert([{
            title: newItem.title,
            category: newItem.category,
            rarity: newItem.rarity,
            image_url: newItem.image_url,
            // image_path: '', // Not strictly needed if we use URL, or can store path too
            image_path: newItem.image_url, // Fallback
            is_public: newItem.is_public,
            description: newItem.description
        }]);

        if (error) {
            alert("Error saving: " + error.message);
        } else {
            fetchItems();
            setNewItem({ title: '', category: 'Geometry', rarity: 'Common', image_url: '', is_public: false, description: '' });
            alert("Arte minteado en la base de datos.");
        }
    };

    const deleteItem = async (id: string) => {
        if (!confirm("¿Eliminar obra de la colección permanentemente?")) return;

        // 1. Delete DB Record
        const { error } = await supabase.from('artworks').delete().eq('id', id);
        if (error) alert("Error deleting: " + error.message);
        else fetchItems();

        // Optional: Delete from storage too if you want to save space
    };

    const toggleVisibility = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase.from('artworks').update({ is_public: !currentStatus }).eq('id', id);
        if (!error) fetchItems();
    };

    // If not logged in
    if (!isAuthenticated) return <LoginScreen email={email} setEmail={setEmail} password={password} setPassword={setPassword} handleLogin={handleLogin} loading={loading} error={authError} />;

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans pb-20">
            {/* TOP BAR */}
            <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-accent rounded-full animate-pulse shadow-[0_0_10px_#C5A059]" />
                    <h1 className="font-serif text-xl tracking-widest text-accent">EXEMPLARIA <span className="text-xs font-sans text-white/50 tracking-normal">ADMIN SUITE</span></h1>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`text-sm uppercase tracking-wider px-4 py-2 rounded transition-colors ${activeTab === 'upload' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                    >
                        Upload Art
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('music');
                            setNewItem({ ...newItem, category: 'Music', image_url: '' });
                        }}
                        className={`text-sm uppercase tracking-wider px-4 py-2 rounded transition-colors ${activeTab === 'music' ? 'bg-accent/20 text-accent' : 'text-white/40 hover:text-accent'}`}
                    >
                        Upload Music
                    </button>
                    <button
                        onClick={() => setActiveTab('decorator')}
                        className={`flex items-center gap-2 text-sm uppercase tracking-wider px-4 py-2 rounded transition-colors ${activeTab === 'decorator' ? 'bg-accent/20 text-accent' : 'text-white/40 hover:text-accent'}`}
                    >
                        <Wand2 size={16} />
                        NFT Decorator
                    </button>
                    <button onClick={handleLogout} className="text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors border-l border-white/10 pl-4 ml-2">
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 pt-10">

                {/* --- TAB: UPLOAD SUTDIO --- */}
                {activeTab === 'upload' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* LEFT COL: CREATION STUDIO */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-[#0A0510] border-l-4 border-accent p-6 rounded-r-xl shadow-2xl relative overflow-hidden group">

                                <h2 className="text-2xl font-serif text-white mb-6">Mint New Artifact</h2>

                                <div className="space-y-4 relative z-10">
                                    {/* Title */}
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-white/40 mb-1 block">Title</label>
                                        <input
                                            value={newItem.title}
                                            onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                                            className="w-full bg-white/5 border-b border-white/10 focus:border-accent outline-none py-2 px-3 text-lg font-serif placeholder:text-white/20 transition-colors"
                                            placeholder="Naming the divine..."
                                        />
                                    </div>

                                    {/* Selects */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-white/40 mb-1 block">Rarity</label>
                                            <select
                                                value={newItem.rarity}
                                                onChange={e => setNewItem({ ...newItem, rarity: e.target.value })}
                                                className="w-full bg-[#111] border border-white/10 rounded px-2 py-2 text-sm focus:border-accent outline-none"
                                            >
                                                <option value="Common">Common</option>
                                                <option value="Rare">Rare</option>
                                                <option value="Epic">Epic</option>
                                                <option value="Legendary">Legendary</option>
                                                <option value="Anomaly">Anomaly</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-white/40 mb-1 block">Category</label>
                                            <select
                                                value={newItem.category}
                                                onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                                className="w-full bg-[#111] border border-white/10 rounded px-2 py-2 text-sm focus:border-accent outline-none"
                                            >
                                                <option value="Trinity">Trinity</option>
                                                <option value="Geometry">Geometry</option>
                                                <option value="Fine Art">Fine Art</option>
                                                <option value="Concept">Concept</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* DROPZONE (REAL) */}
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-white/40 mb-1 block">Asset Source (PNG Supported)</label>
                                        <div
                                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer relative ${newItem.image_url ? 'border-accent bg-accent/5' : 'border-white/10 hover:border-white/30'
                                                }`}
                                        >
                                            <input
                                                type="file"
                                                accept="image/png, image/jpeg, image/gif"
                                                onChange={handleFileUpload}
                                                disabled={uploading}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                            />

                                            <div className="flex flex-col items-center gap-2 relative z-10">
                                                {uploading ? (
                                                    <div className="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full" />
                                                ) : newItem.image_url ? (
                                                    <div className="relative w-full aspect-video rounded overflow-hidden mb-2">
                                                        {newItem.category === 'Music' ? (
                                                            <div className="flex px-4 items-center justify-center w-full h-full bg-white/5 border border-white/10 text-accent">Audio Selected ✓</div>
                                                        ) : (
                                                            /* eslint-disable-next-line @next/next/no-img-element */
                                                            <img src={newItem.image_url} alt="Preview" className="w-full h-full object-cover" />
                                                        )}
                                                    </div>
                                                ) : (
                                                    <Upload size={24} className="text-white/30" />
                                                )}

                                                <span className="text-xs text-accent placeholder:text-white/20">
                                                    {uploading ? 'Uploading to Cloud...' : newItem.image_url ? 'Click to Change' : 'Click or Drag PNG/JPG here'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Visibility Toggle */}
                                    <div className="flex items-center justify-between bg-white/5 p-3 rounded">
                                        <span className="text-sm text-white/70">Public Visibility</span>
                                        <button
                                            onClick={() => setNewItem({ ...newItem, is_public: !newItem.is_public })}
                                            className={`w-10 h-5 rounded-full relative transition-colors ${newItem.is_public ? 'bg-accent' : 'bg-white/20'}`}
                                        >
                                            <div className={`absolute top-1 w-3 h-3 bg-black rounded-full transition-transform ${newItem.is_public ? 'left-6' : 'left-1'}`} />
                                        </button>
                                    </div>

                                    {/* SUBMIT */}
                                    <button
                                        onClick={addItem}
                                        disabled={uploading || !newItem.image_url}
                                        className="w-full py-4 bg-gradient-to-r from-accent to-[#8a6e35] text-black font-bold uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(197,160,89,0.3)] rounded-sm disabled:opacity-50"
                                    >
                                        Mint to Database
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COL: CURATOR INVENTORY */}
                        <div className="lg:col-span-2">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-serif text-white">Curator Grid (Realtime)</h2>
                                <p className="text-xs text-white/30 font-mono">SYNCED WITH SUPABASE</p>
                            </div>

                            {/* LIST */}
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {galleryItems.map((item) => (
                                        <InventoryCard key={item.id} item={item} onDelete={() => deleteItem(item.id)} onToggle={() => toggleVisibility(item.id, item.is_public)} />
                                    ))}
                                    {galleryItems.length === 0 && (
                                        <div className="text-center py-20 text-white/20 font-mono">
                                            NO ARTIFACTS FOUND IN DATABASE
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB: UPLOAD MUSIC --- */}
                {activeTab === 'music' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* LEFT COL: MUSIC STUDIO */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-[#0A0510] border-l-4 border-accent p-6 rounded-r-xl shadow-2xl relative overflow-hidden group">

                                <h2 className="text-2xl font-serif text-white mb-6">Upload Sonic Artifact</h2>

                                <div className="space-y-4 relative z-10">
                                    {/* Title */}
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-white/40 mb-1 block">Track Name</label>
                                        <input
                                            value={newItem.title}
                                            onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                                            className="w-full bg-white/5 border-b border-white/10 focus:border-accent outline-none py-2 px-3 text-lg font-serif placeholder:text-white/20 transition-colors"
                                            placeholder="Frequency Title..."
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-white/40 mb-1 block">Description (Optional)</label>
                                        <textarea
                                            value={newItem.description || ''}
                                            onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                                            className="w-full bg-white/5 border-b border-white/10 focus:border-accent outline-none py-2 px-3 text-sm font-mono placeholder:text-white/20 transition-colors h-20 resize-none"
                                            placeholder="Notes about this soundscape..."
                                        />
                                    </div>

                                    {/* SOURCE (AUDIO OR YOUTUBE) */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-white/40 mb-1 block">YouTube URL (Video Visualizer)</label>
                                            <input
                                                value={newItem.image_url?.includes('youtu') ? newItem.image_url : ''}
                                                onChange={e => setNewItem({ ...newItem, image_url: e.target.value })}
                                                className="w-full bg-white/5 border-b border-white/10 focus:border-accent outline-none py-2 px-3 text-sm font-mono placeholder:text-white/20 transition-colors"
                                                placeholder="https://youtu.be/..."
                                            />
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="h-px bg-white/10 flex-1" />
                                            <span className="text-[10px] uppercase tracking-widest text-white/30">OR</span>
                                            <div className="h-px bg-white/10 flex-1" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-white/40 mb-1 block">Audio File (MP3/WAV)</label>
                                            <div
                                                className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer relative ${newItem.image_url && !newItem.image_url.includes('youtu') ? 'border-accent bg-accent/5' : 'border-white/10 hover:border-white/30'
                                                    }`}
                                            >
                                                <input
                                                    type="file"
                                                    accept="audio/mpeg, audio/wav, audio/mp3"
                                                    onChange={(e) => handleFileUpload(e, true)}
                                                    disabled={uploading}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                                />

                                                <div className="flex flex-col items-center gap-2 relative z-10">
                                                    {uploading ? (
                                                        <div className="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full" />
                                                    ) : newItem.image_url && !newItem.image_url.includes('youtu') ? (
                                                        <div className="relative w-full rounded overflow-hidden mb-2 py-4 bg-white/5 border border-white/10 text-accent font-mono text-xs break-all px-2">
                                                            Audio Selected ✓
                                                        </div>
                                                    ) : (
                                                        <Upload size={24} className="text-white/30" />
                                                    )}

                                                    <span className="text-xs text-accent placeholder:text-white/20">
                                                        {uploading ? 'Uploading Audio...' : newItem.image_url && !newItem.image_url.includes('youtu') ? 'Click to Change File' : 'Click or Drag Audio here'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Visibility Toggle */}
                                    <div className="flex items-center justify-between bg-white/5 p-3 rounded">
                                        <span className="text-sm text-white/70">Public Visibility</span>
                                        <button
                                            onClick={() => setNewItem({ ...newItem, is_public: !newItem.is_public })}
                                            className={`w-10 h-5 rounded-full relative transition-colors ${newItem.is_public ? 'bg-accent' : 'bg-white/20'}`}
                                        >
                                            <div className={`absolute top-1 w-3 h-3 bg-black rounded-full transition-transform ${newItem.is_public ? 'left-6' : 'left-1'}`} />
                                        </button>
                                    </div>

                                    {/* SUBMIT */}
                                    <button
                                        onClick={addItem}
                                        disabled={uploading || !newItem.image_url}
                                        className="w-full py-4 bg-gradient-to-r from-accent to-[#8a6e35] text-black font-bold uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(197,160,89,0.3)] rounded-sm disabled:opacity-50"
                                    >
                                        Mint Audio to Database
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COL: CURATOR INVENTORY */}
                        <div className="lg:col-span-2">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-serif text-white">Music Inventory (Realtime)</h2>
                                <p className="text-xs text-white/30 font-mono">SYNCED WITH SUPABASE</p>
                            </div>

                            {/* LIST */}
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {galleryItems.filter(item => item.category === 'Music').map((item) => (
                                        <InventoryCard key={item.id} item={item} onDelete={() => deleteItem(item.id)} onToggle={() => toggleVisibility(item.id, item.is_public)} />
                                    ))}
                                    {galleryItems.filter(item => item.category === 'Music').length === 0 && (
                                        <div className="text-center py-20 text-white/20 font-mono">
                                            NO AUDIO FILES FOUND IN DATABASE
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB: DECORATOR STUDIO (PLACEHOLDER) --- */}
                {activeTab === 'decorator' && (
                    <div className="w-full h-[600px] border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-white/5 relative overflow-hidden">
                        <div className="absolute inset-0 bg-accent/5 animate-pulse" />
                        <Wand2 size={64} className="text-accent mb-6" />
                        <h2 className="text-3xl font-serif text-white mb-2">NFT Neural Decorator</h2>
                        <p className="text-white/50 max-w-md mx-auto mb-8">
                            This module is currently under construction. Here you will be able to layer assets, apply filters, and customize your PNGs before minting.
                        </p>
                        <div className="flex gap-4">
                            <span className="px-4 py-2 bg-white/10 rounded text-xs uppercase tracking-widest text-white/60">Frames</span>
                            <span className="px-4 py-2 bg-white/10 rounded text-xs uppercase tracking-widest text-white/60">Stickers</span>
                            <span className="px-4 py-2 bg-white/10 rounded text-xs uppercase tracking-widest text-white/60">Metadata</span>
                        </div>
                        <p className="mt-8 text-xs text-accent font-mono">COMING SOON IN PHASE 2</p>
                    </div>
                )}

            </main>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function InventoryCard({ item, onDelete, onToggle }: { item: GalleryItem, onDelete: () => void, onToggle: () => void }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`
                group relative flex items-center gap-4 bg-[#0A0510] border rounded-lg p-2 overflow-hidden
                ${item.is_public ? 'border-white/10' : 'border-dashed border-white/10 opacity-60'}
                hover:border-accent hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all
            `}
        >
            {/* IMAGE OR AUDIO ICON */}
            <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-black flex items-center justify-center">
                {item.category === 'Music' ? (
                    <div className="text-accent">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                    </div>
                ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = 'https://placehold.co/100?text=?')}
                    />
                )}
            </div>

            {/* INFO */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h4 className="text-white font-serif text-lg leading-none truncate">{item.title}</h4>
                    {!item.is_public && <span className="text-[9px] bg-red-900/50 text-red-300 px-1 rounded border border-red-500/20">HIDDEN</span>}
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-white/40 font-mono uppercase tracking-wide">
                    <span>{item.category}</span>
                    <span className="w-1 h-1 bg-white/20 rounded-full" />
                    <span style={{ color: item.rarity === 'Legendary' ? '#FFD700' : 'inherit' }}>{item.rarity}</span>
                </div>
            </div>

            {/* ACTIONS (Hover reveal) */}
            <div className="flex items-center gap-2 pr-4 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={onToggle}
                    className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
                    title={item.is_public ? "Hide (Vault)" : "Show (Publish)"}
                >
                    {item.is_public ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button
                    onClick={onDelete}
                    className="p-2 hover:bg-red-900/30 rounded-full text-white/50 hover:text-red-400 transition-colors"
                >
                    <Trash2 size={18} />
                </button>
            </div>

        </motion.div>
    );
}

function LoginScreen({ email, setEmail, password, setPassword, handleLogin, loading, error }: { email: string, setEmail: (val: string) => void, password: string, setPassword: (val: string) => void, handleLogin: (e: React.FormEvent) => void, loading: boolean, error: string | null }) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a1005] via-black to-black opacity-50" />

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-10">
                    <h1 className="font-serif text-4xl text-accent mb-2">ACCESS CONTROL</h1>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/40">Exemplaria Neural Interface</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6 bg-white/5 backdrop-blur-xl p-8 rounded-xl border border-white/10">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-accent">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-[#050505] border border-white/10 rounded p-3 text-white focus:border-accent outline-none transition-colors"
                            placeholder="admin@alenna.art"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-accent">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-[#050505] border border-white/10 rounded p-3 text-white focus:border-accent outline-none transition-colors"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-900/20 border border-red-500/50 p-3 rounded text-red-200 text-xs text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 mt-4 bg-accent text-primary-dark font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : 'Authenticate'}
                    </button>
                </form>
            </div>
        </div>
    );
}
