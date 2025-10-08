// components/Channels.tsx
import React, { useState, useEffect } from 'react';
import { Beneficiary, Guardian } from '../types.ts';
import { useI18n } from '../contexts/I18nContext.tsx';
import { 
    fetchBeneficiaries, addBeneficiary, deleteBeneficiary, sendToken,
    fetchGuardians, addGuardian, updateGuardian, deleteGuardian as deleteGuardianService 
} from '../services/authService.ts';
import { PlusIcon, TrashIcon, EnvelopeIcon, DevicePhoneMobileIcon, ClipboardIcon, PencilIcon } from './icons/Icon.tsx';


// --- Guardian Modal (Add/Edit) ---
const GuardianModal: React.FC<{ guardian?: Guardian | null; onSave: (data: any) => void; onClose: () => void }> = ({ guardian, onSave, onClose }) => {
    const { t } = useI18n();
    const [name, setName] = useState(guardian?.name || '');
    const [email, setEmail] = useState(guardian?.email || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: guardian?.id, name, email });
    };

    const isEditing = !!guardian;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-brand-secondary p-8 rounded-lg max-w-lg w-full shadow-2xl">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    {isEditing ? t('channels.guardianModalTitleEdit') : t('channels.guardianModalTitleAdd')}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="name" placeholder={t('channels.guardianModalName')} value={name} onChange={e => setName(e.target.value)} className="w-full p-2 rounded bg-gray-100 dark:bg-brand-tertiary dark:text-white" required />
                    <input type="email" name="email" placeholder={t('common.email')} value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 rounded bg-gray-100 dark:bg-brand-tertiary dark:text-white" required />
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="text-gray-600 dark:text-gray-400">{t('common.cancel')}</button>
                        <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600">
                            {isEditing ? t('channels.guardianModalSaveButton') : t('channels.guardianModalAddButton')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- Guardian Management View ---
const GuardianManagement: React.FC = () => {
    const [guardians, setGuardians] = useState<Guardian[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingGuardian, setEditingGuardian] = useState<Guardian | null>(null);
    const { t } = useI18n();

    useEffect(() => {
        loadGuardians();
    }, []);

    const loadGuardians = async () => {
        setIsLoading(true);
        const data = await fetchGuardians();
        setGuardians(data);
        setIsLoading(false);
    };

    const handleSaveGuardian = async (data: { id?: string; name: string; email: string }) => {
        if (data.id) { // Editing
            await updateGuardian(data.id, { name: data.name, email: data.email });
        } else { // Adding
            await addGuardian({ name: data.name, email: data.email });
        }
        closeModal();
        loadGuardians();
    };
    
    const handleDeleteGuardian = async (id: string) => {
        if (window.confirm(t('channels.confirmGuardianDelete'))) {
            await deleteGuardianService(id);
            setGuardians(guardians.filter(g => g.id !== id));
        }
    };

    const openModal = (guardian: Guardian | null = null) => {
        setEditingGuardian(guardian);
        setShowModal(true);
    };

    const closeModal = () => {
        setEditingGuardian(null);
        setShowModal(false);
    };

    return (
        <div>
             <div className="flex justify-end mb-4">
                 <button
                    onClick={() => openModal()}
                    className="flex items-center bg-brand-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    {t('channels.addGuardian')}
                </button>
             </div>
             {isLoading ? <p>{t('channels.loading')}</p> : (
                <div className="bg-white dark:bg-brand-secondary shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-brand-tertiary">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('channels.tableHeaderName')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('channels.tableHeaderEmail')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('channels.tableHeaderActions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {guardians.map(g => (
                                    <tr key={g.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{g.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{g.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                            <button onClick={() => openModal(g)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" title={t('common.edit')}><PencilIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleDeleteGuardian(g.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title={t('channels.delete')}><TrashIcon className="w-5 h-5"/></button>
                                        </td>
                                    </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {showModal && <GuardianModal guardian={editingGuardian} onSave={handleSaveGuardian} onClose={closeModal}/>}
        </div>
    );
};


// --- Beneficiary Management View ---
const BeneficiaryManagement: React.FC = () => {
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const { t } = useI18n();

    useEffect(() => {
        loadBeneficiaries();
    }, []);

    const loadBeneficiaries = async () => {
        setIsLoading(true);
        const data = await fetchBeneficiaries();
        setBeneficiaries(data);
        setIsLoading(false);
    };
    
    const handleAddBeneficiary = async (data: Omit<Beneficiary, 'id' | 'secretToken'>) => {
        await addBeneficiary(data);
        loadBeneficiaries(); // Reload to get the new one with its generated token
        setShowAddModal(false);
    };
    
    const handleDeleteBeneficiary = async (id: string) => {
        if (window.confirm(t('channels.confirmDelete'))) {
            await deleteBeneficiary(id);
            setBeneficiaries(beneficiaries.filter(b => b.id !== id));
        }
    };
    
    const handleSendToken = async (id: string, method: 'sms' | 'email') => {
        try {
            await sendToken(id, method);
            alert(t('channels.tokenSentSuccess'));
        } catch (error) {
            alert(t('channels.tokenSentError'));
        }
    };

     return (
        <div>
            <div className="flex justify-end mb-4">
                 <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center bg-brand-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    {t('channels.addBeneficiary')}
                </button>
            </div>
            {isLoading ? <p>{t('channels.loading')}</p> : (
                <div className="bg-white dark:bg-brand-secondary shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-brand-tertiary">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('channels.tableHeaderName')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('channels.tableHeaderContact')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('channels.tableHeaderToken')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('channels.tableHeaderActions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {beneficiaries.map(b => (
                                    <tr key={b.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{b.firstName} {b.lastName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{b.email}<br/>{b.phone}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center">
                                                <span>{b.secretToken}</span>
                                                <button onClick={() => navigator.clipboard.writeText(b.secretToken)} className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                                    <ClipboardIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button onClick={() => handleSendToken(b.id, 'email')} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" title={t('channels.sendByEmail')}><EnvelopeIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleSendToken(b.id, 'sms')} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300" title={t('channels.sendBySms')}><DevicePhoneMobileIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleDeleteBeneficiary(b.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title={t('channels.delete')}><TrashIcon className="w-5 h-5"/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {showAddModal && <AddBeneficiaryModal onSave={handleAddBeneficiary} onClose={() => setShowAddModal(false)}/>}
        </div>
    );
};


// --- Main Channels Component ---
const Channels: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'beneficiaries' | 'guardians'>('beneficiaries');
    const { t } = useI18n();

    const tabClasses = (isActive: boolean) => 
        `px-4 py-2 text-sm font-medium rounded-md focus:outline-none ${
            isActive 
            ? 'bg-brand-accent text-white' 
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-brand-tertiary'
        }`;
        
    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('channels.title')}</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                        {t('channels.subheadline')}
                    </p>
                </div>
            </div>
            
            <div className="mb-6">
                <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                    <button className={tabClasses(activeTab === 'beneficiaries')} onClick={() => setActiveTab('beneficiaries')}>
                        {t('channels.beneficiariesTab')}
                    </button>
                    <button className={tabClasses(activeTab === 'guardians')} onClick={() => setActiveTab('guardians')}>
                        {t('channels.guardiansTab')}
                    </button>
                </div>
            </div>

            {activeTab === 'beneficiaries' ? <BeneficiaryManagement /> : <GuardianManagement />}
        </div>
    );
};

const AddBeneficiaryModal: React.FC<{onSave: (data: any) => void, onClose: () => void}> = ({onSave, onClose}) => {
    const { t } = useI18n();
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '', idNumber: '', relationship: '', secretQuestion: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    }

    return (
         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-brand-secondary p-8 rounded-lg max-w-lg w-full shadow-2xl max-h-full overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t('channels.modalTitle')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <input name="firstName" placeholder={t('channels.modalFirstName')} onChange={handleChange} className="p-2 rounded bg-gray-100 dark:bg-brand-tertiary dark:text-white" required/>
                     <input name="lastName" placeholder={t('channels.modalLastName')} onChange={handleChange} className="p-2 rounded bg-gray-100 dark:bg-brand-tertiary dark:text-white" required/>
                   </div>
                   <input type="email" name="email" placeholder={t('common.email')} onChange={handleChange} className="w-full p-2 rounded bg-gray-100 dark:bg-brand-tertiary dark:text-white" required/>
                   <input name="phone" placeholder={t('channels.modalPhone')} onChange={handleChange} className="w-full p-2 rounded bg-gray-100 dark:bg-brand-tertiary dark:text-white" required/>
                   <input name="idNumber" placeholder={t('channels.modalIdNumber')} onChange={handleChange} className="w-full p-2 rounded bg-gray-100 dark:bg-brand-tertiary dark:text-white"/>
                   <input name="relationship" placeholder={t('channels.modalRelationship')} onChange={handleChange} className="w-full p-2 rounded bg-gray-100 dark:bg-brand-tertiary dark:text-white"/>
                   <input name="secretQuestion" placeholder={t('channels.modalSecretQuestion')} onChange={handleChange} className="w-full p-2 rounded bg-gray-100 dark:bg-brand-tertiary dark:text-white"/>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="text-gray-600 dark:text-gray-400">{t('common.cancel')}</button>
                        <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600">{t('channels.modalAddButton')}</button>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default Channels;