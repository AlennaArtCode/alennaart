'use client';

type Tier = {
    level: number;
    name: string;
    xpRequired: number;
    reward: string;
};

const TIERS: Tier[] = [
    { level: 1, name: 'Wanderer', xpRequired: 0, reward: 'Access to Public Channels' },
    { level: 2, name: 'Seeker', xpRequired: 500, reward: 'Role: Seeker + Color' },
    { level: 3, name: 'Initiate', xpRequired: 1500, reward: '4K Wallpaper Pack' },
    { level: 4, name: 'Decoder', xpRequired: 3000, reward: 'Access to #lore-theories' },
    { level: 5, name: 'Guardian', xpRequired: 5000, reward: 'Allowlist: Mid-Season Boss' },
    { level: 6, name: 'Veteran', xpRequired: 7000, reward: 'Cosmetic AirDrop' },
    { level: 7, name: 'Elite', xpRequired: 8500, reward: 'Council of 12 Entry' },
    { level: 8, name: 'Legend', xpRequired: 10000, reward: '1/1 AI PFP' },
];

export default function RewardsTrack({ currentXP = 1700 }: { currentXP?: number }) {
    // Calculate progress
    const currentTierIndex = TIERS.findIndex(t => currentXP < t.xpRequired) - 1;
    const currentTier = currentTierIndex >= 0 ? TIERS[currentTierIndex] : TIERS[0];
    const nextTier = TIERS[currentTierIndex + 1] || TIERS[TIERS.length - 1];

    const xpInCurrentTier = currentXP - currentTier.xpRequired;
    const xpNeededForNext = nextTier.xpRequired - currentTier.xpRequired;
    const progressPercent = Math.min(100, Math.max(0, (xpInCurrentTier / xpNeededForNext) * 100));

    return (
        <div className="card-premium p-6">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h3 className="text-2xl font-bold font-serif text-content-primary mb-1">Season Progress</h3>
                    <p className="text-content-secondary text-sm font-sans uppercase tracking-wide">Level {currentTier.level}: <span className="text-content-primary font-medium">{currentTier.name}</span></p>
                </div>
                <div className="text-right">
                    <span className="text-3xl font-bold text-accent">{currentXP}</span>
                    <span className="text-content-muted text-sm"> / {nextTier.xpRequired} XP</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-4 bg-primary-dark rounded-full overflow-hidden mb-8 border border-primary-border relative">
                <div
                    className="h-full bg-gradient-to-r from-accent to-accent-hover transition-all duration-1000"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {/* Tiers Scroll */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {TIERS.map((tier) => {
                    const isUnlocked = currentXP >= tier.xpRequired;
                    const isNext = tier.level === nextTier.level;

                    return (
                        <div
                            key={tier.level}
                            className={`min-w-[140px] p-4 rounded-lg border flex flex-col items-center text-center gap-2 relative ${isUnlocked
                                ? 'bg-accent/10 border-accent/30'
                                : isNext
                                    ? 'bg-primary-surface border-primary-border'
                                    : 'bg-primary-dark border-primary-border opacity-50'
                                }`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${isUnlocked ? 'bg-accent text-primary-dark' : 'bg-primary-surface text-content-muted'
                                }`}>
                                {tier.level}
                            </div>
                            <span className={`text-sm font-bold ${isUnlocked ? 'text-content-primary' : 'text-content-muted'}`}>
                                {tier.name}
                            </span>
                            <span className="text-xs text-content-muted border-t border-primary-border/50 pt-2 w-full">
                                {tier.reward}
                            </span>

                            {isUnlocked && (
                                <div className="absolute top-2 right-2 w-2 h-2 bg-accent-hover rounded-full shadow-[0_0_10px_rgba(240,180,41,0.5)]" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
