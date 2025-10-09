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
            <h1 className="page-title">{t('settings.title')}</h1>
            <p className="page-subheadline">
                {t('settings.subheadline')}
            </p>

            <div style={{marginTop: '2rem', maxWidth: '42rem'}}>
                <div className="card">
                    <h2 className="h2" style={{marginBottom: '1.5rem'}}>{t('settings.profile')}</h2>
                    <form onSubmit={handleSaveChanges}>
                        <div style={{marginBottom: '1rem'}}>
                            <label className="form-label">{t('settings.fullName')}</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="form-input"/>
                        </div>
                         <div style={{marginBottom: '1.5rem'}}>
                            <label className="form-label">{t('common.email')}</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input"/>
                        </div>
                        <button type="submit" disabled={isSaving} className="btn btn-info">
                            {isSaving ? t('settings.saving') : t('settings.saveChanges')}
                        </button>
                    </form>
                </div>

                <div className="card" style={{marginTop: '2rem'}}>
                     <h2 className="h2" style={{marginBottom: '1.5rem'}}>{t('settings.integrations')}</h2>
                     <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem'}}>
                         <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <div>
                                <p style={{fontWeight: 500}}>{t('settings.googleDrive')}</p>
                                <p style={{fontSize: '0.875rem', color: 'var(--color-text-muted)'}}>{t('settings.googleDriveDesc')}</p>
                            </div>
                            <button 
                                onClick={connectGoogleDrive}
                                disabled={cloneUser.googleDriveConnected}
                                className="btn btn-success"
                            >
                                {cloneUser.googleDriveConnected ? t('settings.connected') : t('settings.connect')}
                            </button>
                         </div>
                     </div>
                     <div className="divider" style={{paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                         <div>
                            <p style={{fontWeight: 500}}>Langue</p>
                            <p style={{fontSize: '0.875rem', color: 'var(--color-text-muted)'}}>Choisissez la langue d'affichage</p>
                         </div>
                         <div>
                            <LanguageSwitcher />
                         </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;