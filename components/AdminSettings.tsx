// components/AdminSettings.tsx
import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { addAdmin, fetchAdmins, changeAdminPassword, uploadLegalDocument, fetchLegalDocuments } from '../services/authService';
import { useI18n } from '../contexts/I18nContext';
import LanguageSwitcher from './LanguageSwitcher';
import { AdminUser, LegalDocuments, LegalDocumentType } from '../types';
import { PlusIcon, UploadCloudIcon } from './icons/Icon';

const AdminSettings: React.FC = () => {
    const { t } = useI18n();
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    // State for password change
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    // State for legal docs
    const [legalDocs, setLegalDocs] = useState<LegalDocuments>({});
    const [isUploading, setIsUploading] = useState<Partial<Record<LegalDocumentType, boolean>>>({});


    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            const [adminData, legalData] = await Promise.all([
                fetchAdmins(),
                fetchLegalDocuments()
            ]);
            setAdmins(adminData);
            setLegalDocs(legalData);
            setIsLoading(false);
        };
        loadInitialData();
    }, []);

    const handleAddAdmin = async (data: { name: string; permissions: AdminUser['permissions'] }) => {
        const newAdmin = await addAdmin(data);
        setAdmins(prevAdmins => [...prevAdmins, newAdmin]);
        setShowModal(false);
    };
    
    const handleChangePassword = async (e: FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (newPassword !== confirmPassword) {
            setPasswordError(t('admin.errorPasswordsDoNotMatch'));
            return;
        }

        setIsChangingPassword(true);
        try {
            const result = await changeAdminPassword(currentPassword, newPassword);
            setPasswordSuccess(result.message);
            // Clear fields on success
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unknown error occurred';
            setPasswordError(message);
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleFileUpload = async (docType: LegalDocumentType, e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(prev => ({ ...prev, [docType]: true }));
        try {
            const newDoc = await uploadLegalDocument(docType, file);
            setLegalDocs(prev => ({ ...prev, [docType]: newDoc }));
        } catch (error) {
            console.error(`Failed to upload ${docType}`, error);
            alert(`Error uploading file.`);
        } finally {
            setIsUploading(prev => ({ ...prev, [docType]: false }));
            // Reset file input value to allow re-uploading the same file
            e.target.value = '';
        }
    };


    const permissionLabels: { [key in AdminUser['permissions'][0]]: string } = {
        manage_users: t('admin.permissionManageUsers'),
        view_stats: t('admin.permissionViewStats'),
        manage_billing: t('admin.permissionManageBilling')
    };
    
    const legalDocTypes: { key: LegalDocumentType, label: string }[] = [
        { key: 'cgu', label: t('admin.docLabelCGU') },
        { key: 'privacy', label: t('admin.docLabelPrivacy') },
        { key: 'legal', label: t('admin.docLabelLegal') },
        { key: 'contact', label: t('admin.docLabelContact') },
    ];

    return (
        <div>
            {showModal && <AddAdminModal onSave={handleAddAdmin} onClose={() => setShowModal(false)} />}
            <h1 className="page-title">{t('admin.settingsTitle')}</h1>
            <p className="page-subheadline">
                {t('admin.settingsDesc')}
            </p>

            {/* Document Management */}
            <div className="card" style={{marginTop: '2rem', maxWidth: '42rem'}}>
                 <h2 className="h2" style={{marginBottom: '1rem'}}>{t('admin.docManagementTitle')}</h2>
                 <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                    {legalDocTypes.map(({ key, label }) => (
                        <div key={key}>
                             <label className="form-label">{label}</label>
                             <div style={{marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                                <label
                                    htmlFor={`file-upload-${key}`}
                                    className="btn btn-secondary"
                                    style={{cursor: 'pointer', position: 'relative'}}
                                >
                                    <span>{isUploading[key] ? t('admin.docUploading') : t('admin.docChangeFile')}</span>
                                    <input id={`file-upload-${key}`} type="file" className="sr-only" accept=".pdf" onChange={(e) => handleFileUpload(key, e)} disabled={isUploading[key]}/>
                                </label>
                                 {legalDocs[key] ? (
                                    <a href={legalDocs[key]?.url} target="_blank" rel="noopener noreferrer" style={{fontSize: '0.875rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                        {t('admin.docCurrentFile')}: {legalDocs[key]?.fileName}
                                    </a>
                                 ) : (
                                    <span style={{fontSize: '0.875rem', color: 'var(--color-text-muted)'}}>{t('admin.docNoFile')}</span>
                                 )}
                             </div>
                        </div>
                    ))}
                 </div>
            </div>

            {/* Password Management */}
            <div className="card" style={{marginTop: '2rem', maxWidth: '42rem'}}>
                <h2 className="h2" style={{marginBottom: '1rem'}}>{t('admin.passwordManagementTitle')}</h2>
                 <form onSubmit={handleChangePassword} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    <div>
                        <label className="form-label">{t('admin.currentPasswordLabel')}</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>
                     <div>
                        <label className="form-label">{t('admin.newPasswordLabel')}</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>
                     <div>
                        <label className="form-label">{t('admin.confirmPasswordLabel')}</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>
                    {passwordError && <p style={{fontSize: '0.875rem', color: 'var(--color-danger)'}}>{passwordError}</p>}
                    {passwordSuccess && <p style={{fontSize: '0.875rem', color: 'var(--color-success)'}}>{passwordSuccess}</p>}
                    <div>
                        <button type="submit" disabled={isChangingPassword} className="btn btn-info">
                             {isChangingPassword ? t('admin.changingPasswordButton') : t('admin.changePasswordButton')}
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="card" style={{marginTop: '2rem'}}>
                 <div className="divider" style={{paddingBottom: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                     <div>
                        <p style={{fontWeight: 500}}>Langue</p>
                        <p style={{fontSize: '0.875rem', color: 'var(--color-text-muted)'}}>Choisissez la langue d'affichage</p>
                     </div>
                     <LanguageSwitcher />
                 </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                    <h2 className="h2">{t('admin.adminManagement')}</h2>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn btn-primary"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        {t('admin.addAdmin')}
                    </button>
                </div>
                {isLoading ? <p>{t('common.loading')}</p> : (
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>{t('common.name')}</th>
                                    <th>{t('admin.permissions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.map(admin => (
                                    <tr key={admin.id}>
                                        <td>{admin.name}</td>
                                        <td>
                                            <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                                                {admin.permissions.map(perm => (
                                                    <span key={perm} style={{padding: '0.25rem 0.5rem', fontSize: '0.75rem', fontWeight: 600, borderRadius: '9999px', backgroundColor: 'var(--color-info)', color: 'white'}}>
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
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">{t('admin.modalNewAdmin')}</h2>
                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    <div>
                        <label htmlFor="name" className="form-label">{t('admin.modalFullName')}</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>
                    <div>
                        <label className="form-label">{t('admin.permissions')}</label>
                        <div style={{marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                            {allPermissions.map(perm => (
                                <div key={perm} style={{display: 'flex', alignItems: 'center'}}>
                                    <input
                                        id={perm}
                                        type="checkbox"
                                        checked={permissions.includes(perm)}
                                        onChange={() => handlePermissionChange(perm)}
                                        className="form-checkbox"
                                    />
                                    <label htmlFor={perm} style={{marginLeft: '0.75rem', fontSize: '0.875rem'}}>{permissionLabels[perm]}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="modal-footer" style={{paddingTop: '1rem'}}>
                        <button type="button" onClick={onClose} className="btn btn-secondary">{t('common.cancel')}</button>
                        <button type="submit" className="btn btn-info">{t('admin.modalCreate')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminSettings;