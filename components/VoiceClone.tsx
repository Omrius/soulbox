// components/VoiceClone.tsx
import React from 'react';
import { useI18n } from '../contexts/I18nContext';
import { WarningIcon } from './icons/Icon';

const VoiceClone: React.FC = () => {
    const { t } = useI18n();

    return (
        <div>
            <h1 className="page-title">{t('voiceClone.title')}</h1>
            <p className="page-subheadline">
                {t('voiceClone.subheadline')}
            </p>

            <div className="card" style={{marginTop: '2rem', textAlign: 'center'}}>
                <WarningIcon className="w-12 h-12 mx-auto text-yellow-500" style={{margin: '0 auto', width: '3rem', height: '3rem', color: 'var(--color-warning)'}} />
                <h2 className="h2" style={{marginTop: '1rem'}}>{t('voiceClone.maintenanceTitle')}</h2>
                <p style={{marginTop: '0.5rem', color: 'var(--color-text-muted)'}}>
                    {t('voiceClone.maintenanceDesc')}
                </p>
            </div>
        </div>
    );
};

export default VoiceClone;