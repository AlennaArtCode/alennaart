'use client';

import { useState } from 'react';
import WalletGatedButton from '@/components/auth/WalletGatedButton';

export default function SeasonPassCard() {
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
                            Genesis
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="block text-2xl font-bold font-mono text-accent-hover">99 ADA</span>
                        <span className="text-xs text-content-muted">Fixed Price</span>
                    </div>
                </div>

                <div className="mb-6 flex-grow">
                    <h3 className="text-2xl font-bold text-content-primary mb-2">Genesis Access</h3>
                    <ul className="space-y-2 text-sm text-content-secondary">
                        <li className="flex items-center gap-2">
                            <span className="text-accent">✦</span> 20% Off on Weekly Chapters
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-accent">✦</span> Exclusive Week 4 & 8 Drops
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-accent">✦</span> 24h Early Access
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-accent">✦</span> Max 1 Per Wallet
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
                        <span>{mintedCount} / {totalSupply} Minted</span>
                        <span>Limit Reached: {mintedCount >= totalSupply ? 'Yes' : 'No'}</span>
                    </div>

                    <WalletGatedButton
                        onClick={handleMint}
                        className="w-full bg-accent hover:bg-accent-hover text-primary-dark py-3 font-bold"
                    >
                        {isMinting ? 'Minting...' : 'Mint Season Pass'}
                    </WalletGatedButton>
                </div>
            </div>
        </div>
    );
}
