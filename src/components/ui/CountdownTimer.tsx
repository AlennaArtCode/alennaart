'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
    targetDate: string; // ISO string
    onComplete?: () => void;
}

export default function CountdownTimer({ targetDate, onComplete }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                if (onComplete) onComplete();
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft(); // Run immediately

        return () => clearInterval(timer);
    }, [targetDate, onComplete]);

    return (
        <div className="flex gap-2 text-center">
            <div className="bg-primary-surface px-3 py-2 rounded border border-primary-border">
                <span className="block text-xl font-bold font-mono text-content-primary">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="text-xs text-content-muted uppercase">Days</span>
            </div>
            <div className="bg-primary-surface px-3 py-2 rounded border border-primary-border">
                <span className="block text-xl font-bold font-mono text-content-primary">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-xs text-content-muted uppercase">Hrs</span>
            </div>
            <div className="bg-primary-surface px-3 py-2 rounded border border-primary-border">
                <span className="block text-xl font-bold font-mono text-content-primary">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-xs text-content-muted uppercase">Min</span>
            </div>
            <div className="bg-primary-surface px-3 py-2 rounded border border-primary-border">
                <span className="block text-xl font-bold font-mono text-content-primary">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-xs text-content-muted uppercase">Sec</span>
            </div>
        </div>
    );
}
