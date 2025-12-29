import Link from 'next/link';

export default function InnerCircle() {
    return (
        <section className="py-24 relative overflow-hidden text-center">

            <div className="relative z-10">
                <span className="text-content-secondary uppercase tracking-widest text-sm font-bold font-sans mb-4 block">Community</span>
                <h2 className="text-4xl md:text-6xl font-bold mb-8 text-content-primary">Complete the System</h2>
                <p className="text-xl text-content-secondary mb-10 leading-relaxed">
                    Holders don’t just watch; they govern. Holding the Season Pass grants you access to <strong>The Citadel</strong>—our private Discord sector for governance, voting rights on future lore, and surprise airdrops.
                </p>

                <div className="flex justify-center gap-4">
                    <Link
                        href="https://discord.gg/placeholder" // Replace with real link
                        target='_blank'
                        className="flex items-center gap-2 bg-accent-mystic hover:bg-accent-mystic/80 text-white px-8 py-3 rounded-full font-bold transition-colors"
                    >
                        Join The Citadel
                    </Link>
                </div>
            </div>
        </section>
    );
}
