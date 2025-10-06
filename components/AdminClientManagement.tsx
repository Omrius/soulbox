
// components/AdminClientManagement.tsx
import React from 'react';
import { useI18n } from '../contexts/I18nContext.tsx';

// Mock data for demonstration
const mockClients = [
    { id: 'clone_user_123', name: 'Jean Dupont', email: 'user@example.com', plan: 'Premium', status: 'Actif' },
    { id: 'google_user_789', name: 'Utilisateur Google', email: 'google.user@example.com', plan: 'Premium', status: 'Actif' },
    { id: 'new_user_1', name: 'Alice Martin', email: 'alice.m@example.com', plan: 'Standard', status: 'En attente de vérification' },
];

const AdminClientManagement: React.FC = () => {
    const { t } = useI18n();
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('admin.clientsTitle')}</h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                {t('admin.clientsDesc')}
            </p>

            <div className="mt-8 bg-white dark:bg-brand-secondary shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-brand-tertiary">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('common.name')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('common.email')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.clientsPlan')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('common.status')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {mockClients.map(client => (
                            <tr key={client.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{client.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{client.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{client.plan}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${client.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {client.status === 'Actif' ? t('admin.clientStatusActive') : t('admin.clientStatusPending')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <a href="#" className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">{t('common.view')}</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminClientManagement;
