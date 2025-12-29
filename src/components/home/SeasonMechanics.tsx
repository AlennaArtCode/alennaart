export default function SeasonMechanics() {
    const timeline = [
        { week: '1-3', title: 'The Awakening', desc: 'Weekly episodic drops.', highlight: false },
        { week: '4', title: 'MID-SEASON BOSS', desc: '1/1 Edition. High Rarity.', highlight: true },
        { week: '5-7', title: 'The Expansion', desc: 'New characters & lore.', highlight: false },
        { week: '8', title: 'SEASON FINALE', desc: 'Rewards distribution.', highlight: true },
    ];

    return (
        <section className="py-24 text-center relative z-10">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-3xl md:text-5xl font-bold mb-16 tracking-tight">8 Weeks of Evolution</h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-primary-border -z-10 -translate-y-12" />

                    {timeline.map((item, index) => (
                        <div key={index} className="flex flex-col items-center group">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 mb-6 bg-primary-dark z-10 transition-transform group-hover:scale-110 ${item.highlight
                                ? 'bg-accent border-accent text-primary-dark shadow-[0_0_15px_rgba(240,180,41,0.6)] scale-110 z-10'
                                : 'bg-primary-surface border-primary-border text-content-muted opacity-60'}`}>
                                <span className="font-bold text-xl">W{item.week}</span>
                            </div>
                            <h3 className={`text-xl font-bold mb-2 ${item.highlight ? 'text-accent' : 'text-content-primary'}`}>{item.title}</h3>
                            <p className="text-content-muted text-sm max-w-[200px]">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
