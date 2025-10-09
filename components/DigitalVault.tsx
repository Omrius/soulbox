// components/DigitalVault.tsx
import React, { useState, useEffect } from 'react';
import { fetchSealedItems, createSealedItem, generateInspiration } from '../services/geminiService';
import { useI18n } from '../contexts/I18nContext';
import { SealedItem, Guardian } from '../types';
import { PlusIcon, SparklesIcon, LockIcon, FileTextIcon, UsersIcon, ShieldCheckIcon } from './icons/Icon';
import { fetchGuardians } from '../services/authService';

type SortOrder = 'newest' | 'oldest';

const DigitalVault: React.FC = () => {
    const [items, setItems] = useState<SealedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
    const { t } = useI18n();

    useEffect(() => {
        const loadItems = async () => {
            setIsLoading(true);
            const fetchedItems = await fetchSealedItems();
            setItems(fetchedItems);
            setIsLoading(false);
        };
        loadItems();
    }, []);

    const handleAddItem = async (itemData: any) => {
        const newItem = await createSealedItem(itemData);
        setItems(prevItems => [...prevItems, newItem]);
        setShowModal(false);
    };

    const sortedItems = [...items].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    if (isLoading) {
        return <div>{t('vault.loading')}</div>;
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">{t('vault.title')}</h1>
                    <p className="page-subheadline">
                        {t('vault.subheadline')}
                    </p>
                </div>
                <div className="page-header-actions">
                    <div>
                        <label htmlFor="sort-order" className="sr-only">{t('vault.sortBy')}</label>
                        <select
                            id="sort-order"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                            className="form-select"
                        >
                            <option value="newest">{t('vault.sortNewest')}</option>
                            <option value="oldest">{t('vault.sortOldest')}</option>
                        </select>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn btn-primary"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        {t('vault.addItem')}
                    </button>
                </div>
            </div>

            <div className="vault-grid">
                {sortedItems.map(item => (
                    <div key={item.id} className="card vault-item">
                        <div className="vault-item-header">
                            <div className="vault-item-title-wrapper">
                                {item.metadata.type === 'message' ? <FileTextIcon className="vault-item-icon" /> : <LockIcon className="vault-item-icon" />}
                                <h2 className="vault-item-title">{item.title}</h2>
                            </div>
                            <span className="vault-item-status">{t('vault.sealed')}</span>
                        </div>
                        <p className="vault-item-description">{item.description}</p>
                        <div className="vault-item-footer">
                            <div className="vault-item-meta">
                                <UsersIcon/>
                                <span>{t('vault.guardiansAssigned', { count: item.guardians.length })}</span>
                            </div>
                             <div className="vault-item-meta">
                                <ShieldCheckIcon/>
                                <span>{t('vault.shardsRequired', { count: item.shards_required })}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {showModal && <AddItemModal onClose={() => setShowModal(false)} onSave={handleAddItem} />}
        </div>
    );
};

const AddItemModal: React.FC<{ onClose: () => void; onSave: (data: any) => void }> = ({ onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [payload, setPayload] = useState('');
    const [topic, setTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [allGuardians, setAllGuardians] = useState<Guardian[]>([]);
    const [selectedGuardians, setSelectedGuardians] = useState<string[]>([]); // Array of guardian IDs
    const { t } = useI18n();

    useEffect(() => {
        const loadGuardians = async () => {
            const guardians = await fetchGuardians();
            setAllGuardians(guardians);
        };
        loadGuardians();
    }, []);
    
    const handleGenerate = async () => {
        if (!topic) return;
        setIsGenerating(true);
        const inspiration = await generateInspiration(topic);
        setPayload(inspiration);
        setIsGenerating(false);
    };

    const handleGuardianToggle = (guardianId: string) => {
        setSelectedGuardians(prev => 
            prev.includes(guardianId) 
            ? prev.filter(id => id !== guardianId)
            : [...prev, guardianId]
        );
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const mockData = {
            title,
            payload,
            payload_type: 'text',
            shards_required: 2,
            guardians: selectedGuardians.map(id => ({ id }))
        };
        onSave(mockData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">{t('vault.modalTitle')}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="modal-form-group">
                        <label className="form-label">{t('vault.modalTitlePlaceholder')}</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="form-input" required/>
                    </div>
                    <div className="modal-inspiration-box">
                         <p>{t('vault.modalInspiration')}</p>
                         <div className="flex-group">
                             <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder={t('vault.modalTopicPlaceholder')} className="form-input"/>
                             <button type="button" onClick={handleGenerate} disabled={isGenerating || !topic} className="btn btn-primary">
                                <SparklesIcon className="w-5 h-5 mr-2" />
                                {isGenerating ? t('vault.modalGenerating') : t('vault.modalGenerate')}
                            </button>
                         </div>
                    </div>
                    <div className="modal-form-group">
                        <label className="form-label">{t('vault.modalContentLabel')}</label>
                        <textarea value={payload} onChange={e => setPayload(e.target.value)} rows={6} className="form-textarea" required></textarea>
                    </div>
                     <div className="modal-form-group">
                        <label className="form-label">{t('vault.modalGuardiansLabel')}</label>
                        <div className="modal-guardian-list">
                            {allGuardians.length > 0 ? allGuardians.map(g => (
                                <div key={g.id} className="modal-guardian-item">
                                    <input 
                                        type="checkbox" 
                                        id={`guardian-${g.id}`} 
                                        checked={selectedGuardians.includes(g.id)}
                                        onChange={() => handleGuardianToggle(g.id)}
                                        className="form-checkbox"
                                    />
                                    <label htmlFor={`guardian-${g.id}`}>{g.name} <span>({g.email})</span></label>
                                </div>
                            )) : <p className="text-sm text-gray-500 p-1">{t('vault.modalNoGuardians')}</p>}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 px-1">{t('vault.modalGuardiansDesc')}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn btn-secondary">{t('common.cancel')}</button>
                        <button type="submit" className="btn btn-info">{t('vault.modalSealButton')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DigitalVault;