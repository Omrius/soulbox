


// components/AdminDashboard.tsx
import React from 'react';
import { useI18n } from '../contexts/I18nContext';
import { ChartBarIcon, UserGroupIcon, ShieldCheckIcon } from './icons/Icon';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="stat-card">
        <div className="stat-card-icon-wrapper">
            {icon}
        </div>
        <div>
            <p className="stat-card-title">{title}</p>
            <p className="stat-card-value" style={{fontSize: '1.5rem'}}>{value}</p>
        </div>
    </div>
);

const AdminDashboard: React.FC = () => {
    const { t } = useI18n();
    return (
        <div>
            <h1 className="page-title">{t('admin.overviewTitle')}</h1>
            <p className="page-subheadline">
                {t('admin.overviewDesc')}
            </p>

            <div className="dashboard-stats-grid">
                <StatCard title={t('admin.statUsers')} value="1,245" icon={<UserGroupIcon className="w-7 h-7"/>} />
                <StatCard title={t('admin.statRevenue')} value="12,345 €" icon={<ChartBarIcon className="w-7 h-7"/>} />
                <StatCard title={t('admin.statPendingVerifications')} value="12" icon={<ShieldCheckIcon className="w-7 h-7"/>} />
            </div>

            <div className="card" style={{marginTop: '2rem'}}>
                <h2 className="h2" style={{marginBottom: '1rem'}}>{t('admin.recentActivity')}</h2>
                 <p style={{color: 'var(--color-text-muted)'}}>{t('admin.recentActivityPlaceholder')}</p>
            </div>
        </div>
    );
};

export default AdminDashboard;