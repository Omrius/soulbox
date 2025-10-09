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
            <h1 className="page-title">{t('admin.clientsTitle')}</h1>
            <p className="page-subheadline">
                {t('admin.clientsDesc')}
            </p>

            <div className="table-container" style={{marginTop: '2rem'}}>
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>{t('common.name')}</th>
                                <th>{t('common.email')}</th>
                                <th>{t('admin.clientsPlan')}</th>
                                <th>{t('common.status')}</th>
                                <th>{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockClients.map(client => (
                                <tr key={client.id}>
                                    <td>{client.name}</td>
                                    <td>{client.email}</td>
                                    <td>{client.plan}</td>
                                    <td>
                                        <span style={{
                                            padding: '0.125rem 0.5rem',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            borderRadius: '9999px',
                                            backgroundColor: client.status === 'Actif' ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
                                            color: client.status === 'Actif' ? 'var(--color-success-text)' : 'var(--color-warning-text)',
                                        }}>
                                            {client.status === 'Actif' ? t('admin.clientStatusActive') : t('admin.clientStatusPending')}
                                        </span>
                                    </td>
                                    <td>
                                        <a href="#">{t('common.view')}</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminClientManagement;