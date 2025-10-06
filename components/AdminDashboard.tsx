
// components/AdminDashboard.tsx
import React from 'react';
import { useI18n } from '../contexts/I18nContext.tsx';
import { ChartBarIcon, UserGroupIcon, ShieldCheckIcon } from './icons/Icon.tsx';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md flex items-center">
        <div className="p-3 bg-brand-accent rounded-full text-white mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const AdminDashboard: React.FC = () => {
    const { t } = useI18n();
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('admin.overviewTitle')}</h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                {t('admin.overviewDesc')}
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title={t('admin.statUsers')} value="1,245" icon={<UserGroupIcon className="w-7 h-7"/>} />
                <StatCard title={t('admin.statRevenue')} value="12,345 €" icon={<ChartBarIcon className="w-7 h-7"/>} />
                <StatCard title={t('admin.statPendingVerifications')} value="12" icon={<ShieldCheckIcon className="w-7 h-7"/>} />
            </div>

            <div className="mt-8 bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('admin.recentActivity')}</h2>
                 <p className="text-gray-500 dark:text-gray-400">{t('admin.recentActivityPlaceholder')}</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
