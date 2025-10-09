


// components/Dashboard.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';
import { CloneUser } from '../types';
import { VaultIcon, VoiceWaveIcon, BrainIcon } from './icons/Icon';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="stat-card">
        <div className="stat-card-icon-wrapper">
            {icon}
        </div>
        <div>
            <p className="stat-card-title">{title}</p>
            <p className="stat-card-value">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const { t } = useI18n();
    const cloneUser = user as CloneUser;

    // FIX: The `children` prop is made optional to prevent crashes if a translation string is malformed.
    const NextStep = ({ children }: { children?: React.ReactNode }) => (
        <span className="next-step-link">{children}</span>
    );

    const renderStep = (key: string) => {
        const text = t(key); // Get the raw string with tags
        if (typeof text !== 'string' || !text.includes('<1>')) {
            return text;
        }
        const parts = text.split(/<1>|<\/1>/);
        // The split will result in [before, content, after]
        return <>{parts[0]}<NextStep>{parts[1]}</NextStep>{parts[2] || ''}</>;
    };

    return (
        <div>
            <h1 className="dashboard-welcome">{t('dashboard.welcome', { name: cloneUser.name })}</h1>
            <p className="dashboard-subheadline">
                {t('dashboard.subheadline')}
            </p>

            <div className="dashboard-stats-grid">
                <StatCard title={t('dashboard.currentPlan')} value={cloneUser.plan} icon={<BrainIcon className="w-6 h-6"/>} />
                <StatCard title={t('dashboard.vaultStatus')} value={t('dashboard.vaultStatusValue')} icon={<VaultIcon className="w-6 h-6"/>} />
                <StatCard title={t('dashboard.voiceCloneStatus')} value={t('dashboard.voiceCloneStatusValue')} icon={<VoiceWaveIcon className="w-6 h-6"/>} />
            </div>

            <div className="card dashboard-next-steps">
                <h2 className="h2">{t('dashboard.nextSteps')}</h2>
                <ul className="dashboard-next-steps-list">
                    {/* FIX: The t() function's component interpolation is not working correctly.
                        This was causing a TypeScript error and a visual bug (text not styled).
                        The fix is to get the raw translation string and manually insert the component. */}
                    <li>{renderStep('dashboard.step1')}</li>
                    <li>{renderStep('dashboard.step2')}</li>
                    <li>{renderStep('dashboard.step3')}</li>
                    <li>{renderStep('dashboard.step4')}</li>
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;