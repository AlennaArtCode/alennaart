'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import WalletGatedButton from '@/components/auth/WalletGatedButton';

export default function Navbar() {
    const [lang, setLang] = useState<'EN' | 'ES'>('EN');
    const pathname = usePathname();

    if (pathname === '/executive') {
        return null;
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-primary/60 border-b border-white/5 supports-[backdrop-filter]:bg-primary/30">
            <div className="max-w-7xl mx-auto px-6 h-20 grid grid-cols-2 md:grid-cols-3 items-center">
                {/* Logo - Left */}
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-baseline gap-2 group">
                        <span className="text-4xl font-script text-accent bg-clip-text text-transparent bg-gradient-to-r from-accent via-white to-accent pr-1">
                            Alenna
                        </span>
                        <span className="text-[10px] tracking-[0.4em] font-sans font-bold text-white/80 group-hover:text-white transition-colors">
                            ART
                        </span>
                    </Link>
                </div>

                {/* Desktop Nav - Center */}
                <div className="hidden md:flex items-center justify-center gap-8">
                    <Link href="/universe" className="text-xs font-bold uppercase tracking-widest text-content-secondary hover:text-content-primary transition-colors">
                        Projects
                    </Link>
                    <Link href="/nfts" className="text-xs font-bold uppercase tracking-widest text-content-secondary hover:text-content-primary transition-colors">
                        NFTs
                    </Link>
                    <Link href="/music" className="text-xs font-bold uppercase tracking-widest text-content-secondary hover:text-content-primary transition-colors">
                        Music
                    </Link>
                    <Link href="/#collection" className="text-xs font-bold uppercase tracking-widest text-content-secondary hover:text-content-primary transition-colors">
                        Portfolio
                    </Link>
                    <Link href="/#roadmap" className="hidden lg:block text-xs font-bold uppercase tracking-widest text-content-secondary hover:text-content-primary transition-colors">
                        Roadmap
                    </Link>
                    <Link href="/contact" className="text-xs font-bold uppercase tracking-widest text-content-secondary hover:text-content-primary transition-colors">
                        Contact
                    </Link>
                </div>

                {/* Actions - Right */}
                <div className="flex items-center justify-end gap-6">
                    {/* Language Switcher */}
                    <button
                        onClick={() => setLang(lang === 'EN' ? 'ES' : 'EN')}
                        className="text-xs font-bold text-content-muted hover:text-content-primary transition-colors tracking-widest"
                    >
                        <span className={lang === 'EN' ? 'text-content-primary' : ''}>EN</span>
                        <span className="mx-1">|</span>
                        <span className={lang === 'ES' ? 'text-content-primary' : ''}>ES</span>
                    </button>

                    {/* Connect Button */}
                    <div className="hidden sm:block">
                        <WalletGatedButton onClick={() => { }} className="btn-primary text-xs py-2 px-6 !rounded-md">
                            Connect
                        </WalletGatedButton>


                    </div>
                </div>
            </div>
        </nav>
    );
}
