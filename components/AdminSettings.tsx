
import React, { useState, useEffect } from 'react';
import { addAdmin, fetchAdmins } from '../services/authService.ts';
import { useI18n } from '../contexts/I18nContext.tsx';
import LanguageSwitcher from './LanguageSwitcher.tsx';
import { AdminUser } from '../types.ts';
import { PlusIcon } from './icons/Icon.tsx';

const AdminSettings: React.FC = () => {
    const { t } = useI18n();
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const loadAdmins = async () => {
            setIsLoading(true);
            const adminData = await fetchAdmins();
            setAdmins(adminData);
            setIsLoading(false);
        };
        loadAdmins();
    }, []);

    const handleAddAdmin = async (data: { name: string; permissions: AdminUser['permissions'] }) => {
        const newAdmin = await addAdmin(data);
        setAdmins(prevAdmins => [...prevAdmins, newAdmin]);
        setShowModal(false);
    };

    const permissionLabels: { [key in AdminUser['permissions'][0]]: string } = {
        manage_users: t('admin.permissionManageUsers'),
        view_stats: t('admin.permissionViewStats'),
        manage_billing: t('admin.permissionManageBilling')
    };

    return (
        <div>
            {showModal && <AddAdminModal onSave={handleAddAdmin} onClose={() => setShowModal(false)} />}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('admin.settingsTitle')}</h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                {t('admin.settingsDesc')}
            </p>
            <div className="mt-8 bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-sm">
                 <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('admin.generalSettings')}</h2>
                 <p className="text-gray-500 dark:text-gray-400">{t('admin.generalSettingsPlaceholder')}</p>
            </div>

            <div className="mt-8 bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-sm">
                 <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6 flex items-center justify-between">
                     <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">Langue</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Choisissez la langue d'affichage</p>
                     </div>
                     <LanguageSwitcher />
                 </div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('admin.adminManagement')}</h2>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center bg-brand-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        {t('admin.addAdmin')}
                    </button>
                </div>
                {isLoading ? <p>{t('common.loading')}</p> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-brand-tertiary">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('common.name')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.permissions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {admins.map(admin => (
                                    <tr key={admin.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{admin.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex flex-wrap gap-2">
                                                {admin.permissions.map(perm => (
                                                    <span key={perm} className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                        {permissionLabels[perm]}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};


const AddAdminModal: React.FC<{
    onSave: (data: { name: string; permissions: AdminUser['permissions'] }) => void;
    onClose: () => void;
}> = ({ onSave, onClose }) => {
    const { t } = useI18n();
    const [name, setName] = useState('');
    const [permissions, setPermissions] = useState<AdminUser['permissions']>([]);

    const allPermissions: AdminUser['permissions'] = ['manage_users', 'view_stats', 'manage_billing'];
    const permissionLabels: { [key in AdminUser['permissions'][0]]: string } = {
        manage_users: t('admin.permissionManageUsers'),
        view_stats: t('admin.permissionViewStats'),
        manage_billing: t('admin.permissionManageBilling')
    };

    const handlePermissionChange = (permission: AdminUser['permissions'][0]) => {
        setPermissions(prev =>
            prev.includes(permission)
                ? prev.filter(p => p !== permission)
                : [...prev, permission]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && permissions.length > 0) {
            onSave({ name, permissions });
        } else {
            alert(t('admin.modalAddAdminError'));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-brand-secondary p-8 rounded-lg max-w-lg w-full shadow-2xl">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t('admin.modalNewAdmin')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.modalFullName')}</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="mt-1 w-full p-2 rounded bg-gray-100 dark:bg-brand-tertiary dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.permissions')}</label>
                        <div className="mt-2 space-y-2">
                            {allPermissions.map(perm => (
                                <div key={perm} className="flex items-center">
                                    <input
                                        id={perm}
                                        type="checkbox"
                                        checked={permissions.includes(perm)}
                                        onChange={() => handlePermissionChange(perm)}
                                        className="h-4 w-4 rounded border-gray-300 text-brand-accent focus:ring-brand-accent"
                                    />
                                    <label htmlFor={perm} className="ml-3 text-sm text-gray-700 dark:text-gray-300">{permissionLabels[perm]}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="text-gray-600 dark:text-gray-400">{t('common.cancel')}</button>
                        <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600">{t('admin.modalCreate')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminSettings;
