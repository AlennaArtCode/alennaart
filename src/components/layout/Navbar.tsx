'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import WalletGatedButton from '@/components/auth/WalletGatedButton';
import { useLanguage } from '@/context/LanguageContext';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const { lang, setLang, t } = useLanguage();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    if (pathname === '/executive') {
        return null;
    }

    const navLinks = [
        { href: '/universe', label: t('nav', 'projects') },
        { href: '/nfts', label: t('nav', 'nfts') },
        { href: '/music', label: t('nav', 'music') },
        { href: '/contact', label: t('nav', 'contact') },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-primary/60 border-b border-white/5 supports-[backdrop-filter]:bg-primary/30">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo - Left */}
                <Link href="/" className="flex items-baseline gap-2 group">
                    <span className="text-4xl font-script text-accent bg-clip-text text-transparent bg-gradient-to-r from-accent via-white to-accent pr-1">
                        Alenna
                    </span>
                    <span className="text-[10px] tracking-[0.4em] font-sans font-bold text-white/80 group-hover:text-white transition-colors">
                        ART
                    </span>
                </Link>

                {/* Desktop Nav - Center */}
                <div className="hidden md:flex items-center justify-center gap-8">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.href} 
                            href={link.href} 
                            className="text-xs font-bold uppercase tracking-widest text-content-secondary hover:text-content-primary transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Actions - Right */}
                <div className="flex items-center gap-6">
                    {/* Language Switcher */}
                    <button
                        onClick={() => setLang(lang === 'EN' ? 'ES' : 'EN')}
                        className="hidden sm:block text-xs font-bold text-content-muted hover:text-content-primary transition-colors tracking-widest"
                    >
                        <span className={lang === 'EN' ? 'text-content-primary' : ''}>EN</span>
                        <span className="mx-1">|</span>
                        <span className={lang === 'ES' ? 'text-content-primary' : ''}>ES</span>
                    </button>

                    {/* Connect Button */}
                    <div className="hidden sm:block">
                        <WalletGatedButton onClick={() => { }} className="btn-primary text-xs py-2 px-6 !rounded-md">
                            {t('nav', 'connect')}
                        </WalletGatedButton>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-content-primary hover:text-accent transition-colors"
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-primary/95 backdrop-blur-2xl border-b border-white/5 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-serif font-medium tracking-[0.1em] text-content-primary hover:text-accent transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            
                            <div className="pt-4 flex flex-col gap-6 border-t border-white/5">
                                <button
                                    onClick={() => {
                                        setLang(lang === 'EN' ? 'ES' : 'EN');
                                        setIsOpen(false);
                                    }}
                                    className="text-sm font-bold text-content-secondary hover:text-content-primary transition-colors tracking-widest w-fit"
                                >
                                    LANGUAGE: {lang}
                                </button>
                                
                                <WalletGatedButton 
                                    onClick={() => setIsOpen(false)} 
                                    className="btn-primary w-full text-xs py-4 !rounded-md"
                                >
                                    {t('nav', 'connect')}
                                </WalletGatedButton>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
