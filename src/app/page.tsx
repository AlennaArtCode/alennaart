'use client';

import { useEffect, useState } from 'react';
import Hero from '@/components/home/Hero';
import InnerCircle from '@/components/home/InnerCircle';
import ArtistBio from '@/components/home/ArtistBio';
import Codex from '@/components/home/Codex';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';

type Artwork = {
  id: string;
  title: string;
  category: string;
  rarity: string;
  image_url: string;
  image_path?: string;
  description?: string;
  created_at: string;
};

export default function Home() {
  const { t } = useLanguage();
  const [featuredItem, setFeaturedItem] = useState<Artwork | null>(null);
  const [recentDrops, setRecentDrops] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeContent = async () => {
      // 1. Fetch latest public item as featured
      const { data: featuredData } = await supabase
        .from('artworks')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (featuredData && featuredData.length > 0) {
        setFeaturedItem(featuredData[0]);
      }

      // 2. Fetch the next 2 recent items to showcase below
      const { data: recentData } = await supabase
        .from('artworks')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .range(1, 2); // Get 2nd and 3rd newest

      if (recentData) {
        setRecentDrops(recentData);
      }

      setLoading(false);
    };

    fetchHomeContent();
  }, []);

  return (
    <main className="min-h-screen bg-primary text-content-primary selection:bg-accent selection:text-primary-dark relative">

      {/* GLOBAL FIXED BACKGROUND - The Aurora */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[#0A0510]" />
        <div className="orb-glow w-[800px] h-[800px] bg-accent-mystic/20 top-[-20%] left-[-10%]" />
        <div className="orb-glow w-[600px] h-[600px] bg-accent-neon/10 bottom-[-10%] right-[-10%] animate-float-delayed" />
        <div className="orb-glow w-[500px] h-[500px] bg-accent/10 top-[40%] left-[30%]" style={{ animationDuration: '25s' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/50 to-primary" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      </div>

      {/* CONTENT LAYERS */}
      <div className="relative z-10">

        {/* 1. Hero Section (The Hook) */}
        <Hero />

        {/* 2. dynamic Highlights Section */}
        {!loading && featuredItem && (
          <section className="py-24 px-6 md:py-32">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">

              {/* Text Info (Left) */}
              <div className="space-y-6 md:w-1/2">
                <div className="inline-block border border-accent/20 px-4 py-1 rounded-full bg-white/5 backdrop-blur-sm mb-2">
                  <span className="text-[10px] tracking-widest text-accent font-mono uppercase">
                    LATEST CREATOR DROP // {featuredItem.category}
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold font-serif leading-tight">
                  {featuredItem.title}
                </h2>
                <p className="text-lg text-content-secondary font-light">
                  {featuredItem.description || "The newest masterpiece entering the archives. Witness the evolution of digital artistry."}
                </p>

                <div className="pt-4">
                  <Link href={featuredItem.category === 'Music' ? '/music' : '/nfts'}>
                    <button className="bg-white text-black font-bold uppercase text-xs tracking-widest py-4 px-8 rounded hover:bg-zinc-200 transition-colors shadow-lg hover:scale-[1.02]">
                      EXPLORE ASSET
                    </button>
                  </Link>
                </div>
              </div>

              {/* Dynamic Preview Card (Right) */}
              <div className="md:w-1/2 w-full mt-8 md:mt-0">
                <div className="glass-panel p-2 rounded-2xl border border-accent/30 shadow-[0_0_50px_rgba(197,160,89,0.15)] group relative transform hover:-translate-y-2 transition-all duration-700">
                  <div className="absolute -inset-4 bg-accent/20 blur-2xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  <div className="relative aspect-square md:aspect-video rounded-xl overflow-hidden bg-black/60 flex items-center justify-center">
                    {featuredItem.image_url?.includes('.mp4') ? (
                      <video
                        src={featuredItem.image_url}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    ) : (
                      <Image
                        src={(featuredItem.image_path || featuredItem.image_url || '').match(/\.(mp3|wav|ogg)$/i) ? 'https://placehold.co/800x600?text=Audio+File' : ((featuredItem.image_path || featuredItem.image_url).trim() !== '' ? (featuredItem.image_path || featuredItem.image_url) : 'https://placehold.co/800x600?text=No+Image')}
                        alt={featuredItem.title}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      />
                    )}

                    {featuredItem.category === 'Music' && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-16 h-16 bg-black/50 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-white">
                          <Play className="opacity-80 translate-x-1" size={24} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* 3. Recent Organic Gallery (Optional based on data) */}
        {!loading && recentDrops.length > 0 && (
          <section className="py-24 px-6 border-t border-white/5 bg-gradient-to-b from-transparent to-[#0A0510]/50">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-end mb-12">
                <h2 className="text-3xl font-bold font-serif">Recent Archives</h2>
                <Link href="/universe" className="text-accent hover:text-white transition-colors text-xs font-bold tracking-widest uppercase">
                  View Data Log &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {recentDrops.map((drop) => {
                  const isVideo = drop.image_url?.includes('.mp4');

                  return (
                    <div key={drop.id} className="relative glass-panel rounded-2xl overflow-hidden group hover:border-accent/40 transition-colors flex flex-col h-full border border-white/5">
                      <div className="relative h-64 overflow-hidden bg-black flex items-center justify-center">
                        {isVideo ? (
                          <video src={drop.image_url} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105" />
                        ) : (
                          <Image src={(drop.image_path || drop.image_url || '').match(/\.(mp3|wav|ogg)$/i) ? 'https://placehold.co/400x400?text=Audio+File' : ((drop.image_path || drop.image_url || '').trim() !== '' ? (drop.image_path || drop.image_url) : 'https://placehold.co/400x400?text=No+Image')} alt={drop.title} fill className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                        )}
                        <div className="absolute top-4 left-4 z-10">
                          <span className="bg-black/60 backdrop-blur-md text-white/80 font-mono text-[10px] px-3 py-1 rounded border border-white/10 uppercase tracking-widest">
                            {drop.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-8 flex-1 flex flex-col justify-center">
                        <h3 className="text-2xl font-serif font-bold text-white mb-2 group-hover:text-accent transition-colors">{drop.title}</h3>
                        <p className="text-sm text-content-muted font-light line-clamp-2 leading-relaxed">
                          {drop.description || `An exclusive ${drop.category.toLowerCase()} asset recently synchronized into the mainframe.`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Empty State / Loading State (Graceful fallback) */}
        {!loading && !featuredItem && (
          <div className="py-32 text-center">
            <span className="text-white/20 font-mono text-sm tracking-widest uppercase animate-pulse">
              Connecting Mainframe... Awaiting Original Content...
            </span>
          </div>
        )}

        {/* 4. Community */}
        <InnerCircle />

        {/* 5. Artist */}
        <ArtistBio />

        {/* 6. The Codex (Manifesto) */}
        <Codex />

      </div>
    </main>
  );
}
