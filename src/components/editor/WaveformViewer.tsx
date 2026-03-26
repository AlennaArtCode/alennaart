'use client';

import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

export default function WaveformViewer({ url, onMount, isPlaying, volume }: { url: string; onMount: (ws: any) => void; isPlaying: boolean; volume: number }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const wavesurferRef = useRef<WaveSurfer | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ws = WaveSurfer.create({
            container: containerRef.current,
            waveColor: 'rgba(0, 240, 255, 0.4)',  // Cyan neon
            progressColor: 'rgba(157, 0, 255, 0.8)', // Purple neon
            cursorColor: '#ffffff',
            barWidth: 2,
            barGap: 1,
            barRadius: 2,
            height: 100,
            normalize: true,
        });

        ws.load(url);
        wavesurferRef.current = ws;
        onMount(ws);

        return () => {
            ws.destroy();
        };
    }, [url]);

    // Handle external play/pause sync if needed, though usually ws handles itself
    // Or we handle it via the parent ref (which is what we do in page.tsx)

    return (
        <div className="w-full relative">
            <div ref={containerRef} className="w-full h-[100px]" />
        </div>
    );
}
