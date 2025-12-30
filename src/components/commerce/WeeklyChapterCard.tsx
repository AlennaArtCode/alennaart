'use client';

import CountdownTimer from '@/components/ui/CountdownTimer';
import WalletGatedButton from '@/components/auth/WalletGatedButton';
import Image from 'next/image';

interface WeeklyChapterProps {
    chapterNumber: number;
    title: string;
    image: string;
    dropDate: string; // ISO String
}

export default function WeeklyChapterCard({ chapterNumber, title, image, dropDate }: WeeklyChapterProps) {
    const isHolder = false; // MOCK: Retrieve from context later
    const price = isHolder ? 199 : 249;
    const isLive = new Date() > new Date(dropDate);

    const handleBuy = () => {
        alert(`Buying Chapter ${chapterNumber} for ${price} ADA`);
    };

    return (
        <div className="card-premium flex flex-col md:flex-row overflow-hidden">
            <div className="relative md:w-1/2 h-64 md:h-auto">
                <Image src={image} alt={title} fill className="object-cover" />
                <div className="absolute top-4 left-4 bg-primary-dark/80 backdrop-blur text-content-primary text-xs px-2 py-1 rounded">
                    Week {chapterNumber}
                </div>
            </div>

            <div className="p-6 md:w-1/2 flex flex-col justify-center">
                <h3 className="text-3xl font-serif font-bold mb-3 italic">{title}</h3>

                {!isLive ? (
                    <div className="mb-6">
                        <p className="text-content-muted text-sm mb-2">Dropping In:</p>
                        <CountdownTimer targetDate={dropDate} />
                    </div>
                ) : (
                    <div className="mb-6">
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-3xl font-bold">{price} ADA</span>
                            {isHolder && <span className="text-content-muted line-through text-sm">249 ADA</span>}
                        </div>
                        {isHolder ? (
                            <span className="text-green-400 text-xs flex items-center gap-1">
                                ● Holder Discount Applied
                            </span>
                        ) : (
                            <span className="text-content-muted text-xs">
                                Holders pay 199 ADA
                            </span>
                        )}
                    </div>
                )}

                <div className="mt-auto">
                    {isLive ? (
                        <WalletGatedButton onClick={handleBuy} className="btn-primary w-full">
                            Collect Chapter
                        </WalletGatedButton>
                    ) : (
                        <button disabled className="w-full bg-primary-dark text-content-muted py-3 rounded cursor-not-allowed">
                            Coming Soon
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
