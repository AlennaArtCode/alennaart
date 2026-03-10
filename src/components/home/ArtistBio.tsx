import { useLanguage } from '@/context/LanguageContext';

export default function ArtistBio() {
    const { t } = useLanguage();
    return (
        <section className="py-24 bg-primary text-center md:text-left px-6">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
                {/* Avatar / Image */}
                <div className="md:w-1/3">
                    <div className="w-64 h-64 grayscale hover:grayscale-0 transition-all duration-700 rounded-full overflow-hidden mx-auto border-2 border-primary-border">
                        {/* Placeholder for Artist Image */}
                        <div className="w-full h-full bg-primary-surface flex items-center justify-center text-content-muted">
                            Artist Photo
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="md:w-2/3 space-y-6">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-content-primary to-content-secondary bg-clip-text text-transparent">{t('artist', 'title')}</h2>
                    <div className="space-y-4 text-content-secondary text-lg leading-relaxed">
                        <p>
                            {t('artist', 'p1_1')} <strong>{t('artist', 'p1_2')}</strong>{t('artist', 'p1_3')}
                        </p>
                        <p>
                            {t('artist', 'p2')}
                        </p>
                    </div>

                    <button className="text-content-primary border-b border-accent hover:text-accent hover:border-accent transition-colors pb-1">
                        {t('artist', 'read_manifesto')}
                    </button>
                </div>
            </div>
        </section>
    );
}
