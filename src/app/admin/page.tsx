'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Eye, EyeOff, Wand2, Edit2, X, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ImageCropperModal from '@/components/admin/ImageCropperModal';

// --- TYPES ---
type GalleryItem = {
    id: string; // UUID from Supabase
    title: string;
    category: string;
    rarity: string;
    image_url: string; // Media URL (audio or video or main image)
    image_path?: string; // Cover URL for Media (also used as DB fallback)
    description?: string;
    is_public: boolean;
    created_at?: string;
};

type Ticket = {
    id: string;
    name: string;
    email: string;
    tag: string;
    message: string;
    status: string;
    created_at: string;
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
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [newItem, setNewItem] = useState<Partial<GalleryItem>>({
        title: '', category: 'Geometry', rarity: 'Common', image_url: '', image_path: '', is_public: false, description: ''
    });

    const [editingId, setEditingId] = useState<string | null>(null);

    // Navigation State
    const [activeTab, setActiveTab] = useState<'upload' | 'music' | 'nfts' | 'decorator' | 'tickets' | 'settings'>('upload');

    // Cropper State
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
    const [cropIsCover, setCropIsCover] = useState(false);
    const [cropFileName, setCropFileName] = useState<string>('');

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

        fetchTickets();
    };

    const fetchTickets = async () => {
        const { data, error } = await supabase
            .from('tickets')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching tickets:', error);
        else setTickets(data || []);
    };

    const resolveTicket = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'open' ? 'closed' : 'open';
        const { error } = await supabase.from('tickets').update({ status: newStatus }).eq('id', id);
        if (!error) fetchTickets();
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isAudio: boolean = false, isCover: boolean = false) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];

        // Intercept images for cropping
        // Si el archivo es una imagen y no es audio, evitamos subirlo directo
        // y lo preparamos para el modal de recorte (ImageCropperModal)
        if (!isAudio && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Guardamos la imagen localmente para mostrarla en el cropper
                setCropImageSrc(reader.result as string);
                setCropIsCover(isCover); // Sabemos si es portada o arte principal
                setCropFileName(file.name);
            };
            // Clear input so same file can be selected again if canceled
            // Vaciamos el input para que detecte si subimos el mismo archivo de nuevo
            e.target.value = '';
            return;
        }

        // Proceed directly for audio files
        await executeUpload(file, isAudio, isCover, file.name);
    };

    const executeUpload = async (fileOrBlob: File | Blob, isAudio: boolean, isCover: boolean, originalName: string) => {
        setUploading(true);
        const fileExt = originalName.split('.').pop() || 'png';
        const fileName = `${Date.now()}_${isCover ? 'cover' : 'media'}.${fileExt}`;
        const filePath = `${fileName}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from(STORAGE_BUCKET)
                .upload(filePath, fileOrBlob);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(filePath);

            if (isCover) {
                setNewItem(prev => ({ ...prev, image_path: publicUrl }));
            } else {
                setNewItem(prev => ({ ...prev, image_url: publicUrl, category: isAudio ? 'Music' : prev.category }));
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert('Error uploading file: ' + error.message);
            }
        } finally {
            setUploading(false);
        }
    };

    // Se ejecuta al confirmar el recorte en el modal
    const handleCropComplete = async (croppedBlob: Blob) => {
        setCropImageSrc(null); // Cierra el modal de recorte
        // Sube el Blob de la imagen ya recortada a la base de datos
        await executeUpload(croppedBlob, false, cropIsCover, cropFileName);
    };

    // Cancela el recorte y regresa a la pantalla anterior
    const handleCropCancel = () => {
        setCropImageSrc(null); // Cierra el modal de recorte
    };

    const saveItem = async () => {
        if (!newItem.title || !newItem.image_url) return alert("Faltan datos (Título o Imagen/Media)");

        if (editingId) {
            const { error } = await supabase.from('artworks').update({
                title: newItem.title,
                category: newItem.category || 'Geometry',
                rarity: newItem.rarity || 'Common',
                image_url: newItem.image_url,
                image_path: newItem.image_path || newItem.image_url,
                is_public: newItem.is_public,
                description: newItem.description
            }).eq('id', editingId);

            if (error) {
                alert("Error updating: " + error.message);
            } else {
                fetchItems();
                cancelEdit();
                alert("Modificación guardada éxitosamente.");
            }
        } else {
            const { error } = await supabase.from('artworks').insert([{
                title: newItem.title,
                category: newItem.category,
                rarity: newItem.rarity,
                image_url: newItem.image_url,
                image_path: newItem.image_path || newItem.image_url, // Fallback
                is_public: newItem.is_public,
                description: newItem.description
            }]);

            if (error) {
                alert("Error saving: " + error.message);
            } else {
                fetchItems();
                if (activeTab === 'music') {
                    setNewItem({ title: '', category: 'Music', rarity: 'Experimental', image_url: '', image_path: '', is_public: false, description: '' });
                } else if (activeTab === 'nfts') {
                    setNewItem({ title: '', category: 'Season Pass', rarity: 'Legendary', image_url: '', image_path: '', is_public: false, description: '' });
                } else {
                    setNewItem({ title: '', category: 'Geometry', rarity: 'Common', image_url: '', image_path: '', is_public: false, description: '' });
                }
                alert("Arte minteado en la base de datos.");
            }
        }
    };

    const handleEditItem = (item: GalleryItem) => {
        setNewItem(item);
        setEditingId(item.id);

        // Auto-switch tabs based on category if needed
        const nftCategories = ['Season Pass', 'Weekly Chapter', '1/1 Edition', 'DELUXE NFT', 'NFT Collection'];
        if (item.category === 'Music' || item.category === 'Videos' || item.image_url?.includes('youtu') || item.image_url?.includes('.mp3')) {
            setActiveTab('music');
        } else if (nftCategories.includes(item.category)) {
            setActiveTab('nfts');
        } else {
            setActiveTab('upload');
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        if (activeTab === 'music') {
            setNewItem({ title: '', category: 'Music', rarity: 'Experimental', image_url: '', image_path: '', is_public: false, description: '' });
        } else if (activeTab === 'nfts') {
            setNewItem({ title: '', category: 'Season Pass', rarity: 'Legendary', image_url: '', image_path: '', is_public: false, description: '' });
        } else {
            setNewItem({ title: '', category: 'Geometry', rarity: 'Common', image_url: '', image_path: '', is_public: false, description: '' });
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
            <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="w-3 h-3 bg-accent rounded-full animate-pulse shadow-[0_0_10px_#C5A059]" />
                    <h1 className="font-serif text-xl tracking-widest text-accent">EXEMPLARIA <span className="text-xs font-sans text-white/50 tracking-normal">ADMIN SUITE</span></h1>
                </div>

                <div className="flex flex-wrap gap-2 md:gap-4 justify-center md:justify-end w-full md:w-auto">
                    <button
                        onClick={() => {
                            setActiveTab('upload');
                            if (!editingId) setNewItem({ ...newItem, category: 'Geometry', rarity: 'Common', image_url: '' });
                        }}
                        className={`text-xs md:text-sm uppercase tracking-wider px-3 md:px-4 py-2 rounded transition-colors ${activeTab === 'upload' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                    >
                        Upload Art
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('nfts');
                            if (!editingId) setNewItem({ ...newItem, category: 'Season Pass', rarity: 'Legendary', image_url: '' });
                        }}
                        className={`text-xs md:text-sm uppercase tracking-wider px-3 md:px-4 py-2 rounded transition-colors ${activeTab === 'nfts' ? 'bg-accent/20 text-accent' : 'text-white/40 hover:text-accent'}`}
                    >
                        NFTs
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('music');
                            if (!editingId) setNewItem({ ...newItem, category: 'Music', rarity: 'Experimental', image_url: '' });
                        }}
                        className={`text-xs md:text-sm uppercase tracking-wider px-3 md:px-4 py-2 rounded transition-colors ${activeTab === 'music' ? 'bg-accent/20 text-accent' : 'text-white/40 hover:text-accent'}`}
                    >
                        Media/Audio
                    </button>
                    <button
                        onClick={() => setActiveTab('decorator')}
                        className={`flex items-center gap-2 text-xs md:text-sm uppercase tracking-wider px-3 md:px-4 py-2 rounded transition-colors ${activeTab === 'decorator' ? 'bg-accent/20 text-accent' : 'text-white/40 hover:text-accent'}`}
                    >
                        <Wand2 size={16} />
                        Decorator
                    </button>
                    <button
                        onClick={() => setActiveTab('tickets')}
                        className={`flex items-center gap-2 text-xs md:text-sm uppercase tracking-wider px-3 md:px-4 py-2 rounded transition-colors ${activeTab === 'tickets' ? 'bg-accent/20 text-accent' : 'text-white/40 hover:text-accent'} relative`}
                    >
                        Inbox
                        {tickets.filter(t => t.status === 'open').length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                {tickets.filter(t => t.status === 'open').length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('settings');
                            const configItem = galleryItems.find(item => item.category === 'Site Config' && item.title === 'Hero Image');
                            if (configItem) {
                                setNewItem(configItem);
                                setEditingId(configItem.id);
                            } else {
                                setNewItem({ title: 'Hero Image', category: 'Site Config', rarity: 'Common', image_url: '', is_public: true });
                                setEditingId(null);
                            }
                        }}
                        className={`text-xs md:text-sm uppercase tracking-wider px-3 md:px-4 py-2 rounded transition-colors ${activeTab === 'settings' ? 'bg-accent/20 text-accent' : 'text-white/40 hover:text-accent'}`}
                    >
                        Settings
                    </button>
                    <button onClick={handleLogout} className="text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors border-l border-white/10 pl-3 md:pl-4 ml-1 md:ml-2 py-2">
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
                            <div className={`bg-[#0A0510] border-l-4 ${editingId ? 'border-primary' : 'border-accent'} p-6 rounded-r-xl shadow-2xl relative overflow-hidden group transition-all duration-300`}>

                                <div className="flex justify-between items-center mb-6 relative z-10">
                                    <h2 className="text-2xl font-serif text-white flex items-center gap-2">
                                        {editingId ? <Edit2 size={24} className="text-primary" /> : <Upload size={24} className="text-accent" />}
                                        {editingId ? 'Edit Artifact' : 'Mint New Artifact'}
                                    </h2>
                                    {editingId && (
                                        <button onClick={cancelEdit} className="text-white/40 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs">
                                            <X size={14} /> Cancel
                                        </button>
                                    )}
                                </div>

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
                                                <option value="Videos">Videos</option>
                                                <option value="Music">Music</option>
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
                                        onClick={saveItem}
                                        disabled={uploading || !newItem.image_url}
                                        className={`w-full py-4 text-black font-bold uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all rounded-sm disabled:opacity-50 flex items-center justify-center gap-2 ${editingId ? 'bg-gradient-to-r from-primary to-primary-light shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-gradient-to-r from-accent to-[#8a6e35] shadow-[0_0_20px_rgba(197,160,89,0.3)]'}`}
                                    >
                                        {editingId ? <Save size={18} /> : null}
                                        {editingId ? 'Update Database' : 'Mint to Database'}
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
                                    {galleryItems
                                        .filter(item => {
                                            const nftCategories = ['Season Pass', 'Weekly Chapter', '1/1 Edition', 'DELUXE NFT', 'NFT Collection'];
                                            const isMedia = item.category === 'Music' || item.category === 'Videos' || item.image_url?.includes('youtu');
                                            const isNFT = nftCategories.includes(item.category);
                                            return !isMedia && !isNFT;
                                        })
                                        .map((item) => (
                                            <InventoryCard key={item.id} item={item} onEdit={() => handleEditItem(item)} onDelete={() => deleteItem(item.id)} onToggle={() => toggleVisibility(item.id, item.is_public)} editingId={editingId} />
                                        ))}
                                    {galleryItems.filter(item => {
                                        const nftCategories = ['Season Pass', 'Weekly Chapter', '1/1 Edition', 'DELUXE NFT', 'NFT Collection'];
                                        const isMedia = item.category === 'Music' || item.category === 'Videos' || item.image_url?.includes('youtu');
                                        const isNFT = nftCategories.includes(item.category);
                                        return !isMedia && !isNFT;
                                    }).length === 0 && (
                                            <div className="text-center py-20 text-white/20 font-mono">
                                                NO ARTIFACTS FOUND IN DATABASE
                                            </div>
                                        )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB: UPLOAD NFTS --- */}
                {activeTab === 'nfts' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* LEFT COL: NFT STUDIO */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className={`bg-[#0A0510] border-l-4 ${editingId ? 'border-primary' : 'border-accent'} p-6 rounded-r-xl shadow-2xl relative overflow-hidden group transition-all duration-300`}>

                                <div className="flex justify-between items-center mb-6 relative z-10">
                                    <h2 className="text-2xl font-serif text-white flex items-center gap-2">
                                        {editingId ? <Edit2 size={24} className="text-primary" /> : <Upload size={24} className="text-accent" />}
                                        {editingId ? 'Edit NFT Record' : 'Tokenize New NFT'}
                                    </h2>
                                    {editingId && (
                                        <button onClick={cancelEdit} className="text-white/40 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs">
                                            <X size={14} /> Cancel
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-4 relative z-10">
                                    {/* Title */}
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-white/40 mb-1 block">NFT Name / Identifier</label>
                                        <input
                                            value={newItem.title}
                                            onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                                            className="w-full bg-white/5 border-b border-white/10 focus:border-accent outline-none py-2 px-3 text-lg font-serif placeholder:text-white/20 transition-colors"
                                            placeholder="e.g. Genesis Key #001"
                                        />
                                    </div>

                                    {/* Selects */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-white/40 mb-1 block">Collection</label>
                                            <select
                                                value={newItem.category}
                                                onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                                className="w-full bg-[#111] border border-white/10 rounded px-2 py-2 text-sm focus:border-accent outline-none"
                                            >
                                                <option value="Season Pass">Season Pass</option>
                                                <option value="DELUXE NFT">DELUXE NFT</option>
                                                <option value="Weekly Chapter">Weekly Chapter</option>
                                                <option value="1/1 Edition">1/1 Edition</option>
                                                <option value="NFT Collection">Other Collection</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-white/40 mb-1 block">Tier / Rarity</label>
                                            <select
                                                value={newItem.rarity}
                                                onChange={e => setNewItem({ ...newItem, rarity: e.target.value })}
                                                className="w-full bg-[#111] border border-white/10 rounded px-2 py-2 text-sm focus:border-accent outline-none"
                                            >
                                                <option value="Legendary">Legendary (1/1)</option>
                                                <option value="Epic">Epic</option>
                                                <option value="Rare">Rare</option>
                                                <option value="Common">Common</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-white/40 mb-1 block">Metadata Description</label>
                                        <textarea
                                            value={newItem.description || ''}
                                            onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                                            className="w-full bg-white/5 border-b border-white/10 focus:border-accent outline-none py-2 px-3 text-sm font-mono placeholder:text-white/20 transition-colors h-24 resize-none"
                                            placeholder="Lore or utility details..."
                                        />
                                    </div>

                                    {/* DROPZONE (REAL) */}
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-white/40 mb-1 block">NFT Master Asset</label>
                                        <div
                                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer relative ${newItem.image_url ? 'border-accent bg-accent/5' : 'border-white/10 hover:border-white/30'
                                                }`}
                                        >
                                            <input
                                                type="file"
                                                accept="image/png, image/jpeg, image/gif, video/mp4"
                                                onChange={handleFileUpload}
                                                disabled={uploading}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                            />

                                            <div className="flex flex-col items-center gap-2 relative z-10">
                                                {uploading ? (
                                                    <div className="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full" />
                                                ) : newItem.image_url ? (
                                                    <div className="relative w-full aspect-square rounded overflow-hidden mb-2 border border-white/20 relative group">
                                                        {newItem.image_url.includes('.mp4') ? (
                                                            <video src={newItem.image_url} autoPlay loop muted className="w-full h-full object-cover" />
                                                        ) : (
                                                            /* eslint-disable-next-line @next/next/no-img-element */
                                                            <img src={newItem.image_url} alt="NFT Preview" className="w-full h-full object-cover" />
                                                        )}
                                                    </div>
                                                ) : (
                                                    <Upload size={24} className="text-white/30" />
                                                )}

                                                <span className="text-xs text-accent placeholder:text-white/20">
                                                    {uploading ? 'Minting Media...' : newItem.image_url ? 'Click to Change Asset' : 'Drop main image/video here'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Visibility Toggle */}
                                    <div className="flex items-center justify-between bg-white/5 p-3 rounded">
                                        <span className="text-sm text-white/70">List Publicly on Site</span>
                                        <button
                                            onClick={() => setNewItem({ ...newItem, is_public: !newItem.is_public })}
                                            className={`w-10 h-5 rounded-full relative transition-colors ${newItem.is_public ? 'bg-accent' : 'bg-white/20'}`}
                                        >
                                            <div className={`absolute top-1 w-3 h-3 bg-black rounded-full transition-transform ${newItem.is_public ? 'left-6' : 'left-1'}`} />
                                        </button>
                                    </div>

                                    {/* SUBMIT */}
                                    <button
                                        onClick={saveItem}
                                        disabled={uploading || !newItem.image_url}
                                        className={`w-full py-4 text-black font-bold uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all rounded-sm disabled:opacity-50 flex items-center justify-center gap-2 ${editingId ? 'bg-gradient-to-r from-primary to-primary-light shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-gradient-to-r from-accent to-[#8a6e35] shadow-[0_0_20px_rgba(197,160,89,0.3)]'}`}
                                    >
                                        {editingId ? <Save size={18} /> : null}
                                        {editingId ? 'Update Record' : 'Save NFT to Database'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COL: NFT INVENTORY */}
                        <div className="lg:col-span-2">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-serif text-white">NFT Collection Manager (Realtime)</h2>
                                <p className="text-xs text-white/30 font-mono">SYNCED WITH SUPABASE</p>
                            </div>

                            {/* LIST */}
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {galleryItems.filter(item => {
                                        const nftCategories = ['Season Pass', 'Weekly Chapter', '1/1 Edition', 'DELUXE NFT', 'NFT Collection'];
                                        return nftCategories.includes(item.category);
                                    }).map((item) => (
                                        <InventoryCard key={item.id} item={item} onEdit={() => handleEditItem(item)} onDelete={() => deleteItem(item.id)} onToggle={() => toggleVisibility(item.id, item.is_public)} editingId={editingId} />
                                    ))}
                                    {galleryItems.filter(item => {
                                        const nftCategories = ['Season Pass', 'Weekly Chapter', '1/1 Edition', 'DELUXE NFT', 'NFT Collection'];
                                        return nftCategories.includes(item.category);
                                    }).length === 0 && (
                                            <div className="text-center py-20 text-white/20 font-mono">
                                                NO NFTS FOUND IN DATABASE
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
                            <div className={`bg-[#0A0510] border-l-4 ${editingId ? 'border-primary' : 'border-accent'} p-6 rounded-r-xl shadow-2xl relative overflow-hidden group transition-all duration-300`}>

                                <div className="flex justify-between items-center mb-6 relative z-10">
                                    <h2 className="text-2xl font-serif text-white flex items-center gap-2">
                                        {editingId ? <Edit2 size={24} className="text-primary" /> : <Upload size={24} className="text-accent" />}
                                        {editingId ? 'Edit Media/Audio' : 'Upload Media/Audio'}
                                    </h2>
                                    {editingId && (
                                        <button onClick={cancelEdit} className="text-white/40 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs">
                                            <X size={14} /> Cancel
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-4 relative z-10">
                                    {/* Title */}
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-white/40 mb-1 block">Title / Track Name</label>
                                        <input
                                            value={newItem.title}
                                            onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                                            className="w-full bg-white/5 border-b border-white/10 focus:border-accent outline-none py-2 px-3 text-lg font-serif placeholder:text-white/20 transition-colors"
                                            placeholder="Frequency Title..."
                                        />
                                    </div>

                                    {/* Category Select for Media */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-white/40 mb-1 block">Genre / Classification</label>
                                            <select
                                                value={newItem.rarity || 'Experimental'}
                                                onChange={e => setNewItem({ ...newItem, rarity: e.target.value })}
                                                className="w-full bg-[#111] border border-white/10 rounded px-2 py-2 text-sm focus:border-accent outline-none"
                                            >
                                                <optgroup label="Audio Genres">
                                                    <option value="Experimental">Experimental</option>
                                                    <option value="Baladas">Baladas</option>
                                                    <option value="Rock">Rock</option>
                                                    <option value="Techno">Techno</option>
                                                    <option value="Ambient">Ambient</option>
                                                </optgroup>
                                                <optgroup label="Video Classifications">
                                                    <option value="Cinematic">Cinematic</option>
                                                    <option value="Live Performance">Live Performance</option>
                                                    <option value="Visualizer">Visualizer</option>
                                                    <option value="Legendary">Legendary</option>
                                                </optgroup>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-white/40 mb-1 block">Media Type (Category)</label>
                                            <select
                                                value={newItem.category || 'Music'}
                                                onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                                className="w-full bg-[#111] border border-white/10 rounded px-2 py-2 text-sm focus:border-accent outline-none"
                                            >
                                                <option value="Music">Music (Audio)</option>
                                                <option value="Videos">Videos</option>
                                                <option value="Geometry">Geometry</option>
                                                <option value="Fine Art">Fine Art</option>
                                            </select>
                                        </div>
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

                                    {/* Cover Art Upload (Optional) */}
                                    <div className="bg-white/5 border border-dashed border-white/20 p-4 rounded text-center">
                                        <label className="text-[10px] uppercase tracking-widest text-white/40 mb-2 block">Cover Art / Thumbnail (Optional)</label>

                                        {newItem.image_path && newItem.image_path !== newItem.image_url ? (
                                            <div className="mt-2 mb-4 relative aspect-square w-32 mx-auto rounded overflow-hidden border border-white/20">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={newItem.image_path} alt="Cover Preview" className="w-full h-full object-cover" />
                                                <button onClick={() => setNewItem({ ...newItem, image_path: '' })} className="absolute top-1 right-1 bg-black/50 rounded-full p-1 hover:bg-red-500/50 text-white transition-colors">
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={e => handleFileUpload(e, false, true)}
                                                    className="hidden"
                                                    id="cover-upload"
                                                />
                                                <label htmlFor="cover-upload" className="cursor-pointer flex flex-col items-center gap-2 group">
                                                    <div className="w-12 h-12 rounded-full border border-white/20 bg-black flex items-center justify-center group-hover:border-accent transition-colors">
                                                        <Upload size={16} className="text-white/40 group-hover:text-accent transition-colors" />
                                                    </div>
                                                    <span className="text-xs text-white/60 group-hover:text-white transition-colors">Upload Cover Image</span>
                                                </label>
                                            </div>
                                        )}
                                        <p className="text-[10px] text-white/30 mt-2 font-mono">JPG, PNG, WEBP (Square format recommended)</p>
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
                                        onClick={saveItem}
                                        disabled={uploading || !newItem.image_url}
                                        className={`w-full py-4 text-black font-bold uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all rounded-sm disabled:opacity-50 flex items-center justify-center gap-2 ${editingId ? 'bg-gradient-to-r from-primary to-primary-light shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-gradient-to-r from-accent to-[#8a6e35] shadow-[0_0_20px_rgba(197,160,89,0.3)]'}`}
                                    >
                                        {editingId ? <Save size={18} /> : null}
                                        {editingId ? 'Update Record' : 'Mint Audio/Video to DB'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COL: CURATOR INVENTORY */}
                        <div className="lg:col-span-2">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-serif text-white">Media Inventory (Realtime)</h2>
                                <p className="text-xs text-white/30 font-mono">SYNCED WITH SUPABASE</p>
                            </div>

                            {/* LIST */}
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {galleryItems.filter(item => item.category === 'Music' || item.category === 'Videos' || item.image_url?.includes('youtu')).map((item) => (
                                        <InventoryCard key={item.id} item={item} onEdit={() => handleEditItem(item)} onDelete={() => deleteItem(item.id)} onToggle={() => toggleVisibility(item.id, item.is_public)} editingId={editingId} />
                                    ))}
                                    {galleryItems.filter(item => item.category === 'Music' || item.category === 'Videos' || item.image_url?.includes('youtu')).length === 0 && (
                                        <div className="text-center py-20 text-white/20 font-mono">
                                            NO MEDIA FILES FOUND IN DATABASE
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

                {/* --- TAB: TICKETS INBOX --- */}
                {activeTab === 'tickets' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-[#0A0B0E] p-6 rounded border border-white/5">
                            <div>
                                <h2 className="text-xl font-serif text-white">Inbox & Transmissions</h2>
                                <p className="text-sm text-content-muted mt-1">Manage incoming communications.</p>
                            </div>
                            <div className="text-accent font-mono text-sm">
                                {tickets.filter(t => t.status === 'open').length} OPEN TICKETS
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tickets.map(ticket => (
                                <div key={ticket.id} className={`bg-[#0A0510] border ${ticket.status === 'open' ? 'border-accent/40' : 'border-white/10 opacity-50'} p-6 rounded space-y-4`}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-[10px] font-mono tracking-widest text-accent uppercase">{ticket.tag}</span>
                                            <h3 className="font-serif text-lg text-white mt-1">{ticket.name}</h3>
                                            <a href={`mailto:${ticket.email}`} className="text-xs text-blue-400 hover:underline">{ticket.email}</a>
                                        </div>
                                        <span className="text-xs text-white/40">{new Date(ticket.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-white/70 bg-white/5 p-4 rounded font-mono break-words border-l-2 border-accent/50">{ticket.message}</p>
                                    <div className="flex justify-end pt-2 border-t border-white/10">
                                        <button
                                            onClick={() => resolveTicket(ticket.id, ticket.status)}
                                            className={`text-xs uppercase tracking-widest px-4 py-2 rounded transition-colors ${ticket.status === 'open' ? 'bg-accent text-black hover:bg-accent/90' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                        >
                                            {ticket.status === 'open' ? 'Mark Resolved' : 'Reopen Ticket'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {tickets.length === 0 && (
                                <div className="col-span-1 md:col-span-2 text-center py-12 text-content-muted border border-dashed border-white/10 rounded">
                                    No incoming transmissions yet.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* --- TAB: SETTINGS --- */}
                {activeTab === 'settings' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div className="bg-[#0A0510] border-l-4 border-accent p-6 rounded-r-xl shadow-2xl relative overflow-hidden group transition-all duration-300">
                                <div className="flex justify-between items-center mb-6 relative z-10">
                                    <h2 className="text-2xl font-serif text-white flex items-center gap-2">
                                        <Wand2 size={24} className="text-accent" />
                                        Hero Image Settings
                                    </h2>
                                </div>

                                <div className="space-y-4 relative z-10">
                                    <p className="text-xs text-white/50 pb-2">Upload a transparent PNG to change the main hero image on the home page (the lion).</p>
                                    
                                    {/* DROPZONE */}
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-white/40 mb-1 block">Hero Image (PNG Transparent)</label>
                                        <div
                                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer relative ${newItem.image_url ? 'border-accent bg-accent/5' : 'border-white/10 hover:border-white/30'}`}
                                        >
                                            <input
                                                type="file"
                                                accept="image/png"
                                                onChange={handleFileUpload}
                                                disabled={uploading}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                            />

                                            <div className="flex flex-col items-center gap-2 relative z-10">
                                                {uploading ? (
                                                    <div className="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full" />
                                                ) : newItem.image_url ? (
                                                    <div className="relative w-full rounded overflow-hidden mb-2 bg-black/50 p-4">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={newItem.image_url} alt="Hero Preview" className="w-full h-auto object-contain max-h-48 drop-shadow-[0_0_20px_rgba(240,180,41,0.5)]" />
                                                    </div>
                                                ) : (
                                                    <Upload size={24} className="text-white/30" />
                                                )}

                                                <span className="text-xs text-accent placeholder:text-white/20">
                                                    {uploading ? 'Uploading to Cloud...' : newItem.image_url ? 'Click to Change Image' : 'Click or Drag PNG here'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SUBMIT */}
                                    <button
                                        onClick={saveItem}
                                        disabled={uploading || !newItem.image_url}
                                        className="w-full py-4 text-black font-bold uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all rounded-sm disabled:opacity-50 flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-[#8a6e35] shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                                    >
                                        <Save size={18} />
                                        Save Hero Image
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </main>

            {/* Image Cropper Modal - Módulo encargado de recortar imágenes antes de subirlas (Cuadradas/Redondas) */}
            {cropImageSrc && (
                <ImageCropperModal
                    imageSrc={cropImageSrc}
                    isCover={cropIsCover}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                />
            )}
        </div>
    );
}

// --- SUB-COMPONENTS ---

function InventoryCard({ item, onEdit, onDelete, onToggle, editingId }: { item: GalleryItem, onEdit: () => void, onDelete: () => void, onToggle: () => void, editingId?: string | null }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`
                group relative flex items-center gap-4 bg-[#0A0510] border rounded-lg p-2 overflow-hidden
                ${item.is_public ? 'border-white/10' : 'border-dashed border-white/10 opacity-60'}
                ${editingId === item.id ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : ''}
                hover:border-accent hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all
            `}
        >
            {/* IMAGE OR AUDIO ICON */}
            <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-black flex items-center justify-center border border-white/5">
                {item.image_url?.includes('.mp4') ? (
                    <video src={item.image_url} autoPlay loop muted className="w-full h-full object-cover" />
                ) : item.image_path && item.image_path !== item.image_url && !item.image_path.includes('youtu') ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={item.image_path}
                        alt={item.title}
                        className={`w-full h-full object-cover transition-all ${item.is_public ? 'opacity-100' : 'opacity-40 grayscale'}`}
                        onError={(e) => (e.currentTarget.src = 'https://placehold.co/100?text=?')}
                    />
                ) : item.category === 'Music' && !item.image_url?.includes('youtu') ? (
                    <div className="text-accent animate-pulse">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                    </div>
                ) : item.image_url?.includes('youtu') ? (
                    <div className="text-red-500">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            <div className="flex items-center gap-1 pr-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button
                    onClick={onEdit}
                    className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
                    title="Edit Artifact"
                >
                    <Edit2 size={16} />
                </button>
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
