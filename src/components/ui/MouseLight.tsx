'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function MouseLight() {
    const [isMobile, setIsMobile] = useState(false);

    // Smooth spring physics for lag-free movement
    const springConfig = { damping: 25, stiffness: 700 };
    const x = useSpring(0, springConfig);
    const y = useSpring(0, springConfig);

    useEffect(() => {
        // Disable on mobile to prevent performance issues / touch weirdness
        const checkMobile = () => {
            setIsMobile(window.matchMedia('(max-width: 768px)').matches);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        const handleMouseMove = (e: MouseEvent) => {
            if (isMobile) return;
            x.set(e.clientX);
            y.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', checkMobile);
        };
    }, [x, y, isMobile]);

    if (isMobile) return null;

    return (
        <motion.div
            style={{ x, y }}
            className="fixed top-0 left-0 w-[600px] h-[600px] pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 mix-blend-soft-light"
        >
            {/* The Light Source */}
            <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0)_60%)] blur-2xl" />

            {/* Secondary Glow for Depth */}
            <div className="absolute inset-20 rounded-full bg-[radial-gradient(circle,rgba(240,180,41,0.05)_0%,transparent_50%)] blur-xl" />
        </motion.div>
    );
}
