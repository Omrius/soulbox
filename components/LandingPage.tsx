
// components/LandingPage.tsx
import React from 'react';
import { useI18n } from '../contexts/I18nContext.tsx';
import LanguageSwitcher from './LanguageSwitcher.tsx';
import { LockIcon, MessageIcon, VoiceIcon } from './icons/Icon.tsx';

interface LandingPageProps {
    onLoginClick: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-white dark:bg-brand-secondary p-8 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
        <div className="mx-auto bg-brand-accent text-white w-16 h-16 rounded-full flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
    const { t } = useI18n();

    return (
        <div className="bg-gray-100 dark:bg-brand-dark min-h-screen text-gray-800 dark:text-gray-200">
            {/* Header */}
            <header className="py-4 px-8 flex justify-between items-center bg-white dark:bg-brand-secondary shadow-md">
                <h1 className="text-3xl font-bold text-brand-accent">{t('landing.title')}</h1>
                <div className="flex items-center space-x-4">
                    <LanguageSwitcher />
                    <button
                        onClick={onLoginClick}
                        className="bg-brand-accent text-white font-bold py-2 px-6 rounded-full hover:bg-opacity-90 transition-all"
                    >
                        {t('landing.login')}
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <main className="container mx-auto px-6 py-24 text-center">
                <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
                    {t('landing.headline')}
                </h2>
                <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    {t('landing.subheadline')}
                </p>
                <button
                    onClick={onLoginClick}
                    className="mt-10 bg-brand-accent text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-opacity-90 transition-all shadow-lg"
                >
                    {t('landing.cta')}
                </button>
            </main>

            {/* Features Section */}
            <section className="bg-white dark:bg-brand-secondary py-20">
                <div className="container mx-auto px-6">
                    <h3 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">{t('landing.howItWorks')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <FeatureCard
                            icon={<MessageIcon className="w-8 h-8"/>}
                            title={t('landing.feature1Title')}
                            description={t('landing.feature1Desc')}
                        />
                        <FeatureCard
                            icon={<LockIcon className="w-8 h-8" />}
                            title={t('landing.feature2Title')}
                            description={t('landing.feature2Desc')}
                        />
                         <FeatureCard
                            icon={<VoiceIcon className="w-8 h-8" />}
                            title={t('landing.feature3Title')}
                            description={t('landing.feature3Desc')}
                        />
                    </div>
                </div>
            </section>
            
            {/* Footer */}
            <footer className="py-8 text-center text-gray-500 dark:text-gray-400">
                <p>{t('landing.footer', { year: new Date().getFullYear() })}</p>
            </footer>
        </div>
    );
};

export default LandingPage;
