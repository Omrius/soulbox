
// components/AdminPayments.tsx
import React from 'react';
import { useI18n } from '../contexts/I18nContext.tsx';

const mockPayments = [
    { id: 'pay_1', client: 'Jean Dupont', amount: '19.99€', date: '2023-10-28', status: 'Succès' },
    { id: 'pay_2', client: 'Alice Martin', amount: '9.99€', date: '2023-10-27', status: 'Succès' },
    { id: 'pay_3', client: 'Bob Smith', amount: '19.99€', date: '2023-10-26', status: 'Échoué' },
]

const AdminPayments: React.FC = () => {
    const { t } = useI18n();
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('admin.paymentsTitle')}</h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                {t('admin.paymentsDesc')}
            </p>

             <div className="mt-8 bg-white dark:bg-brand-secondary shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-brand-tertiary">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.paymentsTransactionId')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.paymentsClient')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.paymentsAmount')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.paymentsDate')}</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('common.status')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                       {mockPayments.map(p => (
                            <tr key={p.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{p.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{p.client}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{p.amount}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{p.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.status === 'Succès' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {p.status === 'Succès' ? t('admin.paymentStatusSuccess') : t('admin.paymentStatusFailed')}
                                    </span>
                                </td>
                            </tr>
                       ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPayments;
