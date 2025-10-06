

// components/Dashboard.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useI18n } from '../contexts/I18nContext.tsx';
import { CloneUser } from '../types.ts';
import { LockIcon, VoiceIcon, BrainIcon } from './icons/Icon.tsx';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md flex items-center">
        <div className="p-3 bg-brand-accent rounded-full text-white mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const { t } = useI18n();
    const cloneUser = user as CloneUser;

    const NextStep = ({ children }: { children: React.ReactNode }) => (
        <span className="font-semibold text-brand-accent">{children}</span>
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('dashboard.welcome', { name: cloneUser.name })}</h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                {t('dashboard.subheadline')}
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title={t('dashboard.currentPlan')} value={cloneUser.plan} icon={<BrainIcon className="w-6 h-6"/>} />
                <StatCard title={t('dashboard.vaultStatus')} value={t('dashboard.vaultStatusValue')} icon={<LockIcon className="w-6 h-6"/>} />
                <StatCard title={t('dashboard.voiceCloneStatus')} value={t('dashboard.voiceCloneStatusValue')} icon={<VoiceIcon className="w-6 h-6"/>} />
            </div>

            <div className="mt-8 bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('dashboard.nextSteps')}</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
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