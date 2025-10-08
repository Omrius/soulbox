// components/Settings.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useI18n } from '../contexts/I18nContext.tsx';
import LanguageSwitcher from './LanguageSwitcher.tsx';
import { CloneUser } from '../types.ts';
import { saveTrainingToDrive } from '../services/geminiService.ts';

const Settings: React.FC = () => {
    const { user, updateUser, connectGoogleDrive } = useAuth();
    const { t } = useI18n();
    const cloneUser = user as CloneUser;
    
    const [name, setName] = useState(cloneUser.name);
    const [email, setEmail] = useState(cloneUser.email);
    const [isSaving, setIsSaving] = useState(false);
    
    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => { // Simulate API call
            updateUser({...cloneUser, name, email });
            setIsSaving(false);
            alert(t('settings.saveSuccess'));
        }, 1000);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('settings.title')}</h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                {t('settings.subheadline')}
            </p>

            <div className="mt-8 max-w-2xl">
                <div className="bg-white dark:bg-brand-secondary shadow-md rounded-lg p-8">
                    <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">{t('settings.profile')}</h2>
                    <form onSubmit={handleSaveChanges}>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('settings.fullName')}</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 rounded bg-gray-100 dark:bg-brand-tertiary dark:text-white"/>
                        </div>
                         <div className="mb-6">
                            <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('common.email')}</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 rounded bg-gray-100 dark:bg-brand-tertiary dark:text-white"/>
                        </div>
                        <button type="submit" disabled={isSaving} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                            {isSaving ? t('settings.saving') : t('settings.saveChanges')}
                        </button>
                    </form>
                </div>

                <div className="bg-white dark:bg-brand-secondary shadow-md rounded-lg p-8 mt-8">
                     <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">{t('settings.integrations')}</h2>
                     <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                         <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">{t('settings.googleDrive')}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.googleDriveDesc')}</p>
                         </div>
                         <button 
                            onClick={connectGoogleDrive}
                            disabled={cloneUser.googleDriveConnected}
                            className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed self-start sm:self-auto"
                         >
                            {cloneUser.googleDriveConnected ? t('settings.connected') : t('settings.connect')}
                         </button>
                     </div>
                     <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                         <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">Langue</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Choisissez la langue d'affichage</p>
                         </div>
                         <div className="self-start sm:self-auto">
                            <LanguageSwitcher />
                         </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;