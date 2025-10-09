// components/AdminPayments.tsx
import React from 'react';
import { useI18n } from '../contexts/I18nContext';

const mockPayments = [
    { id: 'pay_1', client: 'Jean Dupont', amount: '19.99€', date: '2023-10-28', status: 'Succès' },
    { id: 'pay_2', client: 'Alice Martin', amount: '9.99€', date: '2023-10-27', status: 'Succès' },
    { id: 'pay_3', client: 'Bob Smith', amount: '19.99€', date: '2023-10-26', status: 'Échoué' },
]

const AdminPayments: React.FC = () => {
    const { t } = useI18n();
    return (
        <div>
            <h1 className="page-title">{t('admin.paymentsTitle')}</h1>
            <p className="page-subheadline">
                {t('admin.paymentsDesc')}
            </p>

             <div className="table-container" style={{marginTop: '2rem'}}>
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>{t('admin.paymentsTransactionId')}</th>
                                <th>{t('admin.paymentsClient')}</th>
                                <th>{t('admin.paymentsAmount')}</th>
                                <th>{t('admin.paymentsDate')}</th>
                                <th>{t('common.status')}</th>
                            </tr>
                        </thead>
                        <tbody>
                        {mockPayments.map(p => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.client}</td>
                                    <td>{p.amount}</td>
                                    <td>{p.date}</td>
                                    <td>
                                        <span style={{
                                            padding: '0.125rem 0.5rem',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            borderRadius: '9999px',
                                            backgroundColor: p.status === 'Succès' ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
                                            color: p.status === 'Succès' ? 'var(--color-success-text)' : 'var(--color-danger-text)',
                                        }}>
                                            {p.status === 'Succès' ? t('admin.paymentStatusSuccess') : t('admin.paymentStatusFailed')}
                                        </span>
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

export default AdminPayments;