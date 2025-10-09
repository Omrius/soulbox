// components/Channels.tsx
import React, { useState, useEffect } from 'react';
import { Beneficiary, Guardian } from '../types';
import { useI18n } from '../contexts/I18nContext';
import { 
    fetchBeneficiaries, addBeneficiary, deleteBeneficiary, sendToken,
    fetchGuardians, addGuardian, updateGuardian, deleteGuardian as deleteGuardianService 
} from '../services/authService';
import { PlusIcon, TrashIcon, EnvelopeIcon, DevicePhoneMobileIcon, ClipboardIcon, PencilIcon } from './icons/Icon';


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
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">
                    {isEditing ? t('channels.guardianModalTitleEdit') : t('channels.guardianModalTitleAdd')}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="modal-form-group">
                        <input name="name" placeholder={t('channels.guardianModalName')} value={name} onChange={e => setName(e.target.value)} className="form-input" required />
                    </div>
                     <div className="modal-form-group">
                        <input type="email" name="email" placeholder={t('common.email')} value={email} onChange={e => setEmail(e.target.value)} className="form-input" required />
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn btn-secondary">{t('common.cancel')}</button>
                        <button type="submit" className="btn btn-info">
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
             <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem'}}>
                 <button
                    onClick={() => openModal()}
                    className="btn btn-primary"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    {t('channels.addGuardian')}
                </button>
             </div>
             {isLoading ? <p>{t('channels.loading')}</p> : (
                <div className="table-container">
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>{t('channels.tableHeaderName')}</th>
                                    <th>{t('channels.tableHeaderEmail')}</th>
                                    <th>{t('channels.tableHeaderActions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                            {guardians.map(g => (
                                    <tr key={g.id}>
                                        <td>{g.name}</td>
                                        <td>{g.email}</td>
                                        <td>
                                            <div className="table-action-buttons">
                                                <button onClick={() => openModal(g)} className="edit-btn" title={t('common.edit')}><PencilIcon className="w-5 h-5"/></button>
                                                <button onClick={() => handleDeleteGuardian(g.id)} className="delete-btn" title={t('channels.delete')}><TrashIcon className="w-5 h-5"/></button>
                                            </div>
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
            <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem'}}>
                 <button
                    onClick={() => setShowAddModal(true)}
                    className="btn btn-primary"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    {t('channels.addBeneficiary')}
                </button>
            </div>
            {isLoading ? <p>{t('channels.loading')}</p> : (
                <div className="table-container">
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>{t('channels.tableHeaderName')}</th>
                                    <th>{t('channels.tableHeaderContact')}</th>
                                    <th>{t('channels.tableHeaderToken')}</th>
                                    <th>{t('channels.tableHeaderActions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {beneficiaries.map(b => (
                                    <tr key={b.id}>
                                        <td>{b.firstName} {b.lastName}</td>
                                        <td>{b.email}<br/>{b.phone}</td>
                                        <td>
                                            <div style={{display: 'flex', alignItems: 'center'}}>
                                                <span>{b.secretToken}</span>
                                                <button onClick={() => navigator.clipboard.writeText(b.secretToken)} style={{marginLeft: '0.5rem', background: 'none', border: 'none', cursor: 'pointer'}}>
                                                    <ClipboardIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="table-action-buttons">
                                                <button onClick={() => handleSendToken(b.id, 'email')} className="email-btn" title={t('channels.sendByEmail')}><EnvelopeIcon className="w-5 h-5"/></button>
                                                <button onClick={() => handleSendToken(b.id, 'sms')} className="sms-btn" title={t('channels.sendBySms')}><DevicePhoneMobileIcon className="w-5 h-5"/></button>
                                                <button onClick={() => handleDeleteBeneficiary(b.id)} className="delete-btn" title={t('channels.delete')}><TrashIcon className="w-5 h-5"/></button>
                                            </div>
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
        
    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">{t('channels.title')}</h1>
                    <p className="page-subheadline">
                        {t('channels.subheadline')}
                    </p>
                </div>
            </div>
            
            <div className="tabs">
                <button className={`tab-button ${activeTab === 'beneficiaries' ? 'active' : ''}`} onClick={() => setActiveTab('beneficiaries')}>
                    {t('channels.beneficiariesTab')}
                </button>
                <button className={`tab-button ${activeTab === 'guardians' ? 'active' : ''}`} onClick={() => setActiveTab('guardians')}>
                    {t('channels.guardiansTab')}
                </button>
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
         <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">{t('channels.modalTitle')}</h2>
                <form onSubmit={handleSubmit}>
                   <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem'}}>
                     <input name="firstName" placeholder={t('channels.modalFirstName')} onChange={handleChange} className="form-input" required/>
                     <input name="lastName" placeholder={t('channels.modalLastName')} onChange={handleChange} className="form-input" required/>
                   </div>
                   <div style={{marginTop: '1rem'}}>
                       <input type="email" name="email" placeholder={t('common.email')} onChange={handleChange} className="form-input" required/>
                   </div>
                   <div style={{marginTop: '1rem'}}>
                       <input name="phone" placeholder={t('channels.modalPhone')} onChange={handleChange} className="form-input" required/>
                   </div>
                   <div style={{marginTop: '1rem'}}>
                       <input name="idNumber" placeholder={t('channels.modalIdNumber')} onChange={handleChange} className="form-input"/>
                   </div>
                   <div style={{marginTop: '1rem'}}>
                       <input name="relationship" placeholder={t('channels.modalRelationship')} onChange={handleChange} className="form-input"/>
                   </div>
                   <div style={{marginTop: '1rem'}}>
                       <input name="secretQuestion" placeholder={t('channels.modalSecretQuestion')} onChange={handleChange} className="form-input"/>
                   </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn btn-secondary">{t('common.cancel')}</button>
                        <button type="submit" className="btn btn-info">{t('channels.modalAddButton')}</button>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default Channels;