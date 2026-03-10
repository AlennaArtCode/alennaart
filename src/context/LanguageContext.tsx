'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '@/i18n/translations';

interface LanguageContextProps {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (section: keyof typeof translations['EN'], key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<Language>('EN');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Load from localStorage if available
        const savedLang = localStorage.getItem('alenna_lang') as Language;
        if (savedLang && (savedLang === 'EN' || savedLang === 'ES')) {
            setLangState(savedLang);
        }
        setMounted(true);
    }, []);

    const setLang = (newLang: Language) => {
        setLangState(newLang);
        localStorage.setItem('alenna_lang', newLang);
    };

    const t = (section: keyof typeof translations['EN'], key: string): string => {
        const dictionary = translations[lang] || translations['EN'];
        const sectionData = dictionary[section] as Record<string, string>;
        return sectionData ? (sectionData[key] || key) : key;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
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
