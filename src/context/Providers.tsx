'use client';

import React from 'react';
// import { WalletProvider } from './WalletContext'; // Descomentaremos luego
import { LanguageProvider } from '@/context/LanguageContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <LanguageProvider>
            {/* <WalletProvider> */}
            <>
                {children}
            </>
            {/* </WalletProvider> */}
        </LanguageProvider>
    );
}
