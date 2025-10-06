
// components/DigitalVault.tsx
import React, { useState, useEffect } from 'react';
import { fetchSealedItems, createSealedItem, generateInspiration } from '../services/geminiService.ts';
import { useI18n } from '../contexts/I18nContext.tsx';
import { SealedItem, Guardian } from '../types.ts';
import { PlusIcon, SparklesIcon, LockIcon, FileTextIcon, UsersIcon, ShieldCheckIcon } from './icons/Icon.tsx';

const DigitalVault: React.FC = () => {
    const [items, setItems] = useState<SealedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
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

    if (isLoading) {
        return <div>{t('vault.loading')}</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('vault.title')}</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                        {t('vault.subheadline')}
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center bg-brand-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    {t('vault.addItem')}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => (
                    <div key={item.id} className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center">
                                {item.metadata.type === 'message' ? <FileTextIcon className="w-8 h-8 text-brand-accent" /> : <LockIcon className="w-8 h-8 text-brand-accent" />}
                                <h2 className="text-xl font-semibold ml-3 text-gray-900 dark:text-white">{item.title}</h2>
                            </div>
                            <span className="text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full">{t('vault.sealed')}</span>
                        </div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">{item.description}</p>
                        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                                <UsersIcon className="w-5 h-5 mr-2"/>
                                <span>{t('vault.guardiansAssigned', { count: item.guardians.length })}</span>
                            </div>
                             <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <ShieldCheckIcon className="w-5 h-5 mr-2"/>
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
    const { t } = useI18n();
    
    const handleGenerate = async () => {
        if (!topic) return;
        setIsGenerating(true);
        const inspiration = await generateInspiration(topic);
        setPayload(inspiration);
        setIsGenerating(false);
    }
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock data for guardians and shards
        const mockData = {
            title,
            payload,
            payload_type: 'text',
            shards_required: 2,
            guardians: [{id: 'g_4'}, {id: 'g_5'}]
        };
        onSave(mockData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-brand-secondary p-8 rounded-lg max-w-lg w-full shadow-2xl">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t('vault.modalTitle')}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('vault.modalTitlePlaceholder')}</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 rounded bg-gray-100 dark:bg-brand-tertiary dark:text-white" required/>
                    </div>
                    <div className="mb-4 p-4 border rounded-lg border-gray-200 dark:border-gray-600">
                         <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('vault.modalInspiration')}</p>
                         <div className="flex gap-2">
                             <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder={t('vault.modalTopicPlaceholder')} className="w-full p-2 rounded bg-gray-100 dark:bg-brand-tertiary dark:text-white"/>
                             <button type="button" onClick={handleGenerate} disabled={isGenerating || !topic} className="flex items-center bg-brand-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50">
                                <SparklesIcon className="w-5 h-5 mr-2" />
                                {isGenerating ? t('vault.modalGenerating') : t('vault.modalGenerate')}
                            </button>
                         </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('vault.modalContentLabel')}</label>
                        <textarea value={payload} onChange={e => setPayload(e.target.value)} rows={6} className="w-full p-2 rounded bg-gray-100 dark:bg-brand-tertiary dark:text-white" required></textarea>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="text-gray-600 dark:text-gray-400">{t('common.cancel')}</button>
                        <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600">{t('vault.modalSealButton')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DigitalVault;
