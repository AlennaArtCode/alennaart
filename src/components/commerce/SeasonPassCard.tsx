'use client';

import { useState } from 'react';
import WalletGatedButton from '@/components/auth/WalletGatedButton';
import { useLanguage } from '@/context/LanguageContext';

export default function SeasonPassCard() {
    const { t } = useLanguage();
    const [isMinting, setIsMinting] = useState(false);
    const totalSupply = 120;
    const mintedCount = 42; // Mock data, replace with real on-chain count

    const handleMint = async () => {
        setIsMinting(true);
        try {
            // Logic to mint Season Pass using Lucid
            console.log("Minting Season Pass...");
            await new Promise(resolve => setTimeout(resolve, 2000)); // Mock delay
            alert("Season Pass Minted! (Simulation)");
        } catch (error) {
            console.error("Minting failed", error);
        } finally {
            setIsMinting(false);
        }
    };

    return (
        <div className="card-premium p-6 relative overflow-hidden group">
            {/* Decorative Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary opacity-50" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-pulse" />

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-accent text-primary-dark">
                            {t('season_pass', 'badge')}
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="block text-2xl font-bold font-mono text-accent-hover">99 ADA</span>
                        <span className="text-xs text-content-muted">{t('season_pass', 'fixed')}</span>
                    </div>
                </div>

                <div className="mb-6 flex-grow">
                    <h3 className="text-2xl font-bold text-content-primary mb-2">{t('season_pass', 'title')}</h3>
                    <ul className="space-y-2 text-sm text-content-secondary">
                        <li className="flex items-center gap-2">
                            <span className="text-accent">✦</span> {t('season_pass', 'li1')}
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-accent">✦</span> {t('season_pass', 'li2')}
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-accent">✦</span> {t('season_pass', 'li3')}
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-accent">✦</span> {t('season_pass', 'li4')}
                        </li>
                    </ul>
                </div>

                <div className="space-y-3">
                    <div className="w-full bg-primary-dark h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-accent h-full transition-all duration-1000 ease-out"
                            style={{ width: `${(mintedCount / totalSupply) * 100}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-content-muted mb-2">
                        <span>{mintedCount} / {totalSupply} {t('season_pass', 'minted')}</span>
                        <span>{t('season_pass', 'limit')} {mintedCount >= totalSupply ? t('season_pass', 'yes') : t('season_pass', 'no')}</span>
                    </div>

                    <WalletGatedButton
                        onClick={handleMint}
                        className="w-full bg-accent hover:bg-accent-hover text-primary-dark py-3 font-bold"
                    >
                        {isMinting ? t('season_pass', 'minting') : t('season_pass', 'mint')}
                    </WalletGatedButton>
                </div>
            </div>
        </div>
    );
}
