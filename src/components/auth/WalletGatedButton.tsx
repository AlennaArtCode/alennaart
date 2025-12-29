'use client';

import { useState } from 'react';
// import { useWallet } from '@/hooks/useWallet'; // To be implemented

interface WalletGatedButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
    requiredPolicyId?: string; // Optional: Require a specific NFT to click
}

export default function WalletGatedButton({
    children,
    onClick,
    className = "",
    requiredPolicyId
}: WalletGatedButtonProps) {
    // Mock wallet state for now
    const [isConnected, setIsConnected] = useState(false);

    const handleConnect = () => {
        // Logic to open wallet modal would go here
        const mockConnect = confirm("Simular conexión de wallet?");
        if (mockConnect) setIsConnected(true);
    };

    const handleClick = () => {
        if (!isConnected) {
            handleConnect();
            return;
        }

        // Future: Check for requiredPolicyId here

        onClick();
    };

    if (!isConnected) {
        return (
            <button
                onClick={handleConnect}
                className={`bg-accent hover:bg-accent-light text-primary-dark font-bold py-2 px-4 rounded transition-colors ${className}`}
            >
                Conectar Billetera
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            className={`bg-white text-black hover:bg-zinc-200 font-bold py-2 px-4 rounded transition-colors ${className}`}
        >
            {children}
        </button>
    );
}
