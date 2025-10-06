
// components/LanguageSwitcher.tsx
import React from 'react';
import { useI18n } from '../contexts/I18nContext.tsx';

const LanguageSwitcher: React.FC<{ className?: string }> = ({ className }) => {
    const { language, changeLanguage } = useI18n();

    const baseClasses = "px-3 py-1 rounded-md transition-colors text-xs font-semibold";
    const activeClasses = "bg-brand-accent text-white";
    const inactiveClasses = "bg-brand-tertiary/50 text-gray-300 hover:bg-brand-tertiary";


    return (
        <div className={`flex items-center space-x-1 rounded-lg p-1 bg-brand-secondary/50 ${className}`}>
            <button
                onClick={() => changeLanguage('fr')}
                className={`${baseClasses} ${language === 'fr' ? activeClasses : inactiveClasses}`}
            >
                FR
            </button>
            <button
                onClick={() => changeLanguage('en')}
                className={`${baseClasses} ${language === 'en' ? activeClasses : inactiveClasses}`}
            >
                EN
            </button>
        </div>
    );
};

export default LanguageSwitcher;
