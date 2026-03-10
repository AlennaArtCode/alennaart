import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function InnerCircle() {
    const { t } = useLanguage();
    return (
        <section className="py-24 relative overflow-hidden text-center">

            <div className="relative z-10">
                <span className="text-content-secondary uppercase tracking-widest text-sm font-bold font-sans mb-4 block">{t('community', 'badge')}</span>
                <h2 className="text-4xl md:text-6xl font-bold mb-8 text-content-primary">{t('community', 'title')}</h2>
                <p className="text-xl text-content-secondary mb-10 leading-relaxed">
                    {t('community', 'desc')}
                </p>

                <div className="flex justify-center gap-4">
                    <Link
                        href="https://discord.gg/placeholder" // Replace with real link
                        target='_blank'
                        className="flex items-center gap-2 bg-accent-mystic hover:bg-accent-mystic/80 text-white px-8 py-3 rounded-full font-bold transition-colors"
                    >
                        {t('community', 'join')}
                    </Link>
                </div>
            </div>
        </section>
    );
}
