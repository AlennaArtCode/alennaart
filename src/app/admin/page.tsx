'use client';

import React, { useState, useEffect } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Edit2, Eye, EyeOff, GripVertical, Plus } from 'lucide-react'; // Assuming lucide-react is available or I'll use SVG

// --- TYPES ---
type GalleryItem = {
    id: number | string;
    title: string;
    category: string;
    rarity: string;
    image: string;
    description?: string;
    isPublic: boolean;
};

// --- CONFIG ---
const ADMIN_USER = "kaiser";
const ADMIN_PASS = "exemplaria2025";

const INITIAL_DATA: GalleryItem[] = [
    { id: 1, title: "KAISER", category: "Trinity", rarity: "Legendary", image: "/art/lion-transparent.png", isPublic: true },
    { id: 2, title: "LEGATUS", category: "Trinity", rarity: "Legendary", image: "/art/lion-transparent.png", description: "Face placeholder", isPublic: true }, // Using valid paths
    { id: 3, title: "AEGIS", category: "Geometry", rarity: "Epic", image: "/art/geometry_sample_2.jpg", isPublic: false }
];

export default function AdminPanel() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Data State
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(INITIAL_DATA);

    // Form State
    const [newItem, setNewItem] = useState<Partial<GalleryItem>>({
        title: '', category: 'Geometry', rarity: 'Common', image: '', isPublic: false
    });
    const [isDragActive, setIsDragActive] = useState(false);

    // --- EFFECT: LOAD DATA ---
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedData = localStorage.getItem('exemplaria_gallery');
            if (savedData) setGalleryItems(JSON.parse(savedData));

            const isLogged = localStorage.getItem('admin_logged');
            if (isLogged === 'true') setIsAuthenticated(true);
        }
    }, []);

    // --- EFFECT: SAVE DATA ---
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('exemplaria_gallery', JSON.stringify(galleryItems));
        }
    }, [galleryItems]);

    // --- ACTIONS ---
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === ADMIN_USER && password === ADMIN_PASS) {
            setIsAuthenticated(true);
            localStorage.setItem('admin_logged', 'true');
        } else {
            alert("Acceso Denegado");
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('admin_logged');
    };

    const addItem = () => {
        if (!newItem.title || !newItem.image) return alert("Faltan datos");
        const itemToAdd: GalleryItem = {
            id: Date.now(),
            title: newItem.title!,
            category: newItem.category || 'Geometry',
            rarity: newItem.rarity || 'Common',
            image: newItem.image!,
            isPublic: newItem.isPublic || false,
            description: newItem.description || ''
        };
        // Add to TOP of list usually, but for reorderable maybe bottom? Let's add top.
        setGalleryItems([itemToAdd, ...galleryItems]);
        setNewItem({ title: '', category: 'Geometry', rarity: 'Common', image: '', isPublic: false });
    };

    const deleteItem = (id: number | string) => {
        if (confirm("¿Eliminar obra de la colección?")) {
            setGalleryItems(galleryItems.filter(item => item.id !== id));
        }
    };

    const toggleVisibility = (id: number | string) => {
        setGalleryItems(galleryItems.map(item =>
            item.id === id ? { ...item, isPublic: !item.isPublic } : item
        ));
    };

    // --- STATS CALC ---
    const stats = {
        total: galleryItems.length,
        legendary: galleryItems.filter(i => i.rarity === 'Legendary').length,
        drafts: galleryItems.filter(i => !i.isPublic).length,
        value: galleryItems.length * 0.5 + " ETH" // Fake val calculation
    };

    // If not logged in
    if (!isAuthenticated) return <LoginScreen username={username} setUsername={setUsername} password={password} setPassword={setPassword} handleLogin={handleLogin} />;

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans pb-20">
            {/* TOP BAR */}
            <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-accent rounded-full animate-pulse shadow-[0_0_10px_#C5A059]" />
                    <h1 className="font-serif text-xl tracking-widest text-accent">EXEMPLARIA <span className="text-xs font-sans text-white/50 tracking-normal">ADMIN SUITE</span></h1>
                </div>
                <button onClick={handleLogout} className="text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                    Logout
                </button>
            </header>

            <main className="max-w-7xl mx-auto px-6 pt-10">

                {/* 1. STATS DASHBOARD */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    <StatCard label="Total Assets" value={stats.total} />
                    <StatCard label="Legendary" value={stats.legendary} color="text-[#FFD700]" />
                    <StatCard label="Vault (Hidden)" value={stats.drafts} color="text-red-400" />
                    <StatCard label="Est. Value" value={stats.value} color="text-accent" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* LEFT COL: CREATION STUDIO */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-[#0A0510] border-l-4 border-accent p-6 rounded-r-xl shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Plus size={100} className="text-accent" />
                            </div>

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

                                {/* DROPZONE (SIMULATED) */}
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-white/40 mb-1 block">Asset Source</label>
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-text ${newItem.image ? 'border-accent bg-accent/5' : 'border-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            {newItem.image ? (
                                                <div className="relative w-full aspect-video rounded overflow-hidden mb-2">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={newItem.image} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <Upload size={24} className="text-white/30" />
                                            )}

                                            <input
                                                value={newItem.image}
                                                onChange={e => setNewItem({ ...newItem, image: e.target.value })}
                                                className="w-full bg-transparent text-center text-xs text-accent placeholder:text-white/20 outline-none"
                                                placeholder="Paste Image URL here..."
                                            />
                                            <p className="text-[10px] text-white/30">Supports Drag & Drop (Simulated)</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Visibility Toggle */}
                                <div className="flex items-center justify-between bg-white/5 p-3 rounded">
                                    <span className="text-sm text-white/70">Public Visibility</span>
                                    <button
                                        onClick={() => setNewItem({ ...newItem, isPublic: !newItem.isPublic })}
                                        className={`w-10 h-5 rounded-full relative transition-colors ${newItem.isPublic ? 'bg-accent' : 'bg-white/20'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 bg-black rounded-full transition-transform ${newItem.isPublic ? 'left-6' : 'left-1'}`} />
                                    </button>
                                </div>

                                {/* SUBMIT */}
                                <button
                                    onClick={addItem}
                                    className="w-full py-4 bg-gradient-to-r from-accent to-[#8a6e35] text-black font-bold uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(197,160,89,0.3)] rounded-sm"
                                >
                                    Initialize Asset
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COL: CURATOR INVENTORY */}
                    <div className="lg:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-serif text-white">Curator Grid</h2>
                            <p className="text-xs text-white/30 font-mono">DRAG TO REORDER</p>
                        </div>

                        {/* REORDERABLE LIST */}
                        <Reorder.Group axis="y" values={galleryItems} onReorder={setGalleryItems} className="space-y-4">
                            <AnimatePresence>
                                {galleryItems.map((item) => (
                                    <Reorder.Item key={item.id} value={item}>
                                        <InventoryCard item={item} onDelete={deleteItem} onToggle={toggleVisibility} />
                                    </Reorder.Item>
                                ))}
                            </AnimatePresence>
                        </Reorder.Group>
                    </div>
                </div>

            </main>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function InventoryCard({ item, onDelete, onToggle }: { item: GalleryItem, onDelete: (id: any) => void, onToggle: (id: any) => void }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`
                group relative flex items-center gap-4 bg-[#0A0510] border rounded-lg p-2 overflow-hidden
                ${item.isPublic ? 'border-white/10' : 'border-dashed border-white/10 opacity-60'}
                hover:border-accent hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all
            `}
        >
            {/* DRAG HANDLE */}
            <div className="cursor-grab active:cursor-grabbing p-2 text-white/20 hover:text-white transition-colors">
                <GripIcon />
            </div>

            {/* IMAGE */}
            <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/100?text=?')}
                />
            </div>

            {/* INFO */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h4 className="text-white font-serif text-lg leading-none truncate">{item.title}</h4>
                    {!item.isPublic && <span className="text-[9px] bg-red-900/50 text-red-300 px-1 rounded border border-red-500/20">VAULTED</span>}
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
                    onClick={() => onToggle(item.id)}
                    className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
                    title={item.isPublic ? "Hide (Vault)" : "Show (Publish)"}
                >
                    {item.isPublic ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 hover:bg-red-900/30 rounded-full text-white/50 hover:text-red-400 transition-colors"
                >
                    <TrashIcon />
                </button>
            </div>

        </motion.div>
    );
}

function StatCard({ label, value, color = "text-white" }: { label: string, value: string | number, color?: string }) {
    return (
        <div className="bg-[#0A0510] border border-white/5 p-4 rounded-lg">
            <p className="text-[10px] uppercase tracking-widest text-white/40">{label}</p>
            <p className={`text-3xl font-serif mt-1 ${color}`}>{value}</p>
        </div>
    );
}

function LoginScreen({ username, setUsername, password, setPassword, handleLogin }: any) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a1005] via-black to-black opacity-50" />

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-10">
                    <h1 className="font-serif text-4xl text-accent mb-2">ACCESS CONTROL</h1>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/40">Exemplaria Neural Interface</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6 bg-white/5 backdrop-blur-xl p-8 rounded-xl border border-white/10">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-accent">Identity</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full bg-[#050505] border border-white/10 rounded p-3 text-white focus:border-accent outline-none transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-accent">Passcode</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-[#050505] border border-white/10 rounded p-3 text-white focus:border-accent outline-none transition-colors"
                        />
                    </div>
                    <button type="submit" className="w-full py-4 mt-4 bg-accent text-primary-dark font-bold uppercase tracking-widest hover:bg-white transition-colors">
                        Authenticate
                    </button>
                </form>
            </div>
        </div>
    );
}

// Simple icons to avoid external dep mismatch if lucide is removed, but usually Lucide is standard in shadcn/modern stacks.
// If lucide fails, we can replace with SVG. 
const GripIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" /></svg>;
const TrashIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>;
