'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    // Ultra-precise physics (damping high to stop quickly, like a mechanical instrument)
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    const springConfig = { damping: 40, stiffness: 800, mass: 0.5 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const handleMouseDown = () => setIsClicked(true);
        const handleMouseUp = () => setIsClicked(false);

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isClickable =
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a') ||
                target.classList.contains('cursor-pointer') ||
                window.getComputedStyle(target).cursor === 'pointer';

            setIsHovering(!!isClickable);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [mouseX, mouseY]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            {/* The Elegant Light - Soft Gold Aura (Screen Blend for Additive Light) */}
            <motion.div
                style={{ x, y, translateX: '-50%', translateY: '-50%' }}
                className="absolute w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(197,160,89,0.15)_0%,transparent_60%)] blur-[50px] mix-blend-screen"
                animate={{
                    scale: isHovering ? 1.5 : 1,
                    opacity: isHovering ? 0.6 : 0.4
                }}
                transition={{ duration: 0.5 }}
            />

            <motion.div
                style={{ x, y, translateX: '-50%', translateY: '-50%' }}
                className="absolute flex items-center justify-center mix-blend-difference"
            >
                {/* The "Divine Architect" Crosshair */}
                <motion.div
                    className="relative flex items-center justify-center"
                    animate={{
                        rotate: 0,
                        scale: isClicked ? 0.8 : (isHovering ? 1.5 : 1),
                    }}
                    transition={{
                        rotate: { duration: 0.4, ease: [0.32, 0.72, 0, 1] },
                        scale: { duration: 0.1 }
                    }}
                >
                    {/* Vertical Line - Reduced size for precision */}
                    <div className="absolute w-[1px] h-3 bg-[#C5A059]" />
                    {/* Horizontal Line */}
                    <div className="absolute w-3 h-[1px] bg-[#C5A059]" />

                    {/* Center Dot (The Pivot) - White for contrast against the gold lines */}
                    <div className="absolute w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_2px_white]" />
                </motion.div>

                {/* Optional: Expanding Ring on Click */}
                {isClicked && (
                    <motion.div
                        className="absolute w-8 h-8 border border-[#C5A059] rounded-full opacity-50"
                        initial={{ scale: 0.5, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    />
                )}
            </motion.div>
        </div>
    );
}
