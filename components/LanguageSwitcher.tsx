

// components/LanguageSwitcher.tsx
import React from 'react';
import { useI18n } from '../contexts/I18nContext.tsx';

// Fix: Add style prop to allow inline styling.
const LanguageSwitcher: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => {
    const { language, changeLanguage } = useI18n();

    return (
        <div className={`language-switcher ${className || ''}`} style={style}>
            <button
                onClick={() => changeLanguage('fr')}
                className={language === 'fr' ? 'active' : ''}
            >
                FR
            </button>
            <button
                onClick={() => changeLanguage('en')}
                className={language === 'en' ? 'active' : ''}
            >
                EN
            </button>
        </div>
    );
};

export default LanguageSwitcher;