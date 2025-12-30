export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0510]">
            <div className="relative flex flex-col items-center gap-4">
                {/* Orbs Animation */}
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-t-2 border-accent rounded-full animate-spin" style={{ animationDuration: '1s' }} />
                    <div className="absolute inset-2 border-r-2 border-accent-neon rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                </div>

                <span className="text-accent font-mono text-xs tracking-[0.3em] uppercase animate-pulse">
                    Loading System...
                </span>
            </div>
        </div>
    );
}
