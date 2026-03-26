'use client';

import { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

import { AURUM_GENESIS } from '@/app/nfts/constants';
import { HeroSection } from '@/components/nfts/HeroSection';
import { TimelineSection } from '@/components/nfts/TimelineSection';
import { UtilitySection } from '@/components/nfts/UtilitySection';
import { CollectionSection } from '@/components/nfts/CollectionSection';
import { NFTDetailModal } from '@/components/nfts/NFTDetailModal';

type GalleryItem = {
    id: string;
    title: string;
    category: string;
    rarity: string;
    image_url: string;
    image_path?: string;
    description?: string;
    created_at?: string;
};

export default function NFTsPage() {
    const [vaultNfts, setVaultNfts] = useState<GalleryItem[]>([]);
    const [loadingVault, setLoadingVault] = useState(true);
    const [selectedCard, setSelectedCard] = useState<typeof AURUM_GENESIS[0] | null>(null);

    const storyRef = useRef(null);
    const collectionRef = useRef(null);
    const storyInView = useInView(storyRef, { once: true, margin: '-80px' });
    const collectionInView = useInView(collectionRef, { once: true, margin: '-80px' });

    useEffect(() => {
        const fetchNFTs = async () => {
            const { data, error } = await supabase
                .from('artworks')
                .select('*')
                .in('category', ['Season Pass', 'Weekly Chapter', '1/1 Edition', 'DELUXE NFT', 'NFT Collection', 'NFT'])
                .eq('is_public', true)
                .order('created_at', { ascending: false });

            if (!error && data) setVaultNfts(data);
            setLoadingVault(false);
        };
        fetchNFTs();
    }, []);

    return (
        <main className="min-h-screen relative overflow-hidden bg-[#0A0510] text-content-primary">
            {/* BACKGROUND */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="orb-glow w-[900px] h-[900px] bg-accent-mystic/15 top-[-20%] right-[-15%]" />
                <div className="orb-glow w-[700px] h-[700px] bg-[#C5A059]/8 bottom-[-10%] left-[-10%]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0510]/60 to-[#0A0510]" />
            </div>

            <div className="relative z-10">
                <HeroSection onOpenModal={setSelectedCard} />

                <div ref={storyRef}>
                    <TimelineSection isInView={storyInView} />
                    <UtilitySection isInView={storyInView} />
                </div>

                <div ref={collectionRef}>
                    <CollectionSection onOpenModal={setSelectedCard} isInView={collectionInView} />
                </div>

                {/* VAULT (DB-driven) */}
                {(!loadingVault && vaultNfts.length > 0) && (
                    <section className="max-w-7xl mx-auto px-6 py-12 space-y-12">
                        <div className="flex items-center gap-6">
                            <h2 className="text-3xl font-serif font-bold text-white tracking-widest uppercase">Vault Collection</h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {vaultNfts.map((nft) => {
                                const img = nft.image_url && nft.image_url.trim() !== '' ? nft.image_url : (nft.image_path || 'https://placehold.co/400?text=No+Image');
                                return (
                                    <div key={nft.id} className="glass-panel rounded-xl overflow-hidden group cursor-pointer hover:border-accent/30 transition-all border border-white/5 flex flex-col">
                                        <div className="relative h-64 overflow-hidden bg-black/50">
                                            {img.includes('.mp4') ? (
                                                <video src={img} autoPlay loop muted playsInline className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
                                            ) : (
                                                <Image src={img} alt={nft.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                                            )}
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="text-xl font-serif font-bold text-white group-hover:text-accent transition-colors mb-2">{nft.title}</h3>
                                            <p className="text-sm text-content-muted font-light leading-relaxed flex-1">
                                                {nft.description || `Un artefacto raro de la colección ${nft.category}.`}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* CLOSING CTA */}
                <section className="max-w-7xl mx-auto px-6 py-24 text-center">
                    <div className="relative py-24 space-y-8 rounded-3xl overflow-hidden border border-accent/10">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#C5A059]/5 to-transparent" />
                        <h2 className="text-4xl md:text-5xl font-bold font-serif text-white">¿Listo para ser parte <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#e8c97a]">del origen?</span></h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto relative z-10">
                            <input type="email" placeholder="tu@email.com" className="bg-white/5 border border-white/20 rounded px-4 py-3 outline-none focus:border-accent text-white" />
                            <button className="bg-accent text-black px-6 py-3 font-bold uppercase text-xs tracking-widest rounded">Notifícame</button>
                        </div>
                    </div>
                </section>
            </div>

            {selectedCard && <NFTDetailModal piece={selectedCard} onClose={() => setSelectedCard(null)} />}
        </main>
    );
}
