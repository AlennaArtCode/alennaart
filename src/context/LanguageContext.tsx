'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '@/i18n/translations';

interface LanguageContextProps {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (section: keyof typeof translations['EN'], key: string) => string;
    refreshTranslations: () => Promise<void>;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<Language>('EN');
    const [mounted, setMounted] = useState(false);
    const [remoteTranslations, setRemoteTranslations] = useState<any>({});

    const fetchRemoteTranslations = async () => {
        try {
            const { data, error } = await (await import('@/lib/supabase')).supabase
                .from('artworks')
                .select('title, description')
                .eq('category', 'Site Config')
                .like('title', '%Texts');

            if (error) throw error;

            const transformed: any = {};
            data?.forEach(item => {
                try {
                    // Title format: "Hero Texts" -> section key: "hero"
                    const sectionKey = item.title.replace(' Texts', '').toLowerCase();
                    transformed[sectionKey] = JSON.parse(item.description || '{}');
                } catch (e) {
                    console.error(`Error parsing translation for ${item.title}:`, e);
                }
            });
            setRemoteTranslations(transformed);
        } catch (e) {
            console.error('Failed to fetch remote translations:', e);
        }
    };

    useEffect(() => {
        // Load from localStorage if available
        const savedLang = localStorage.getItem('alenna_lang') as Language;
        if (savedLang && (savedLang === 'EN' || savedLang === 'ES')) {
            setLangState(savedLang);
        }
        setMounted(true);
        fetchRemoteTranslations();
    }, []);

    const setLang = (newLang: Language) => {
        setLangState(newLang);
        localStorage.setItem('alenna_lang', newLang);
    };

    const t = (section: keyof typeof translations['EN'], key: string): string => {
        // 1. Try remote translations first
        const remoteSection = remoteTranslations[section];
        if (remoteSection && remoteSection[lang] && remoteSection[lang][key]) {
            return remoteSection[lang][key];
        }

        // 2. Fallback to local translations
        const dictionary = translations[lang] || translations['EN'];
        const sectionData = dictionary[section] as Record<string, string>;
        return sectionData ? (sectionData[key] || key) : key;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t, refreshTranslations: fetchRemoteTranslations }}>
            <div suppressHydrationWarning>
                {mounted ? children : children}
            </div>
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
