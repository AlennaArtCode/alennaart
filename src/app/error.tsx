'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0510] text-white p-4 text-center">
            <h2 className="text-2xl font-serif font-bold text-accent-ruby mb-4">System Malfunction</h2>
            <p className="text-content-secondary mb-8 max-w-md">
                An anomaly has been detected in the Alennaverse.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={reset}
                    className="px-6 py-2 bg-accent text-primary-dark font-bold rounded hover:bg-accent-hover transition-colors"
                >
                    Reboot System
                </button>
            </div>
        </div>
    );
}
