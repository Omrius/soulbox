
// components/TrainingCenter.tsx
import React, { useState, useEffect } from 'react';
import { TrainingData, TrainingDocument, DashboardView } from '../types.ts';
import { fetchTrainingData, saveTrainingData, fetchTrainingDocuments, uploadTrainingDocument, deleteTrainingDocument, chatWithClone, saveTrainingToDrive } from '../services/geminiService.ts';
import { useI18n } from '../contexts/I18nContext.tsx';
import ChatWindow from './ChatWindow.tsx';
import { UploadCloudIcon, TrashIcon } from './icons/Icon.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { CloneUser } from '../types.ts';

const TrainingCenter: React.FC<{ setCurrentView: (view: DashboardView) => void }> = ({ setCurrentView }) => {
    const { user } = useAuth();
    const { t } = useI18n();
    const cloneUser = user as CloneUser;
    const [trainingData, setTrainingData] = useState<TrainingData | null>(null);
    const [documents, setDocuments] = useState<TrainingDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isTesting, setIsTesting] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (!user) return; // Guard against null user
            setIsLoading(true);
            // Fetch data for the currently logged-in user
            const [data, docs] = await Promise.all([fetchTrainingData(user.id), fetchTrainingDocuments()]);
            setTrainingData(data);
            setDocuments(docs);
            setIsLoading(false);
        };
        loadData();
    }, [user]); // Depend on user object

    const handleDataChange = (field: keyof TrainingData, value: any) => {
        if (trainingData) {
            setTrainingData({ ...trainingData, [field]: value });
        }
    };
    
    const handleQuizChange = (id: number, answer: string) => {
        if (trainingData) {
            const updatedQuiz = trainingData.personalityQuiz.map(q => q.id === id ? {...q, answer} : q);
            handleDataChange('personalityQuiz', updatedQuiz);
        }
    }

    const handleSave = async () => {
        if (!trainingData || !user) return;
        setIsSaving(true);
        await saveTrainingData(user.id, trainingData);
        if(cloneUser.googleDriveConnected) {
             await saveTrainingToDrive(trainingData);
             alert(t('trainingCenter.saveSuccessDrive'));
        } else {
            alert(t('trainingCenter.saveSuccessLocal'));
        }
        setIsSaving(false);
    };
    
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !trainingData) return;
        setIsUploading(true);
        const newDoc = await uploadTrainingDocument(file);
        setDocuments(prev => [...prev, newDoc]);
        setIsUploading(false);
    }
    
    const handleDeleteDoc = async (docId: string) => {
        await deleteTrainingDocument(docId);
        setDocuments(prev => prev.filter(d => d.id !== docId));
    }

    if (isLoading) return <p>{t('trainingCenter.loading')}</p>;
    if (!trainingData || !user) return <p>{t('trainingCenter.loadingError')}</p>;
    
    if (isTesting) {
        return <ChatWindow context={trainingData} onBack={() => setIsTesting(false)} />;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('trainingCenter.title')}</h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                {t('trainingCenter.subheadline')}
            </p>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                     {/* Personality Quiz */}
                    <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('trainingCenter.personalityQuiz')}</h2>
                         <p className="mb-6 text-gray-600 dark:text-gray-400">{t('trainingCenter.quizDesc')}</p>
                        <div className="space-y-4">
                            {trainingData.personalityQuiz.map(q => (
                                <div key={q.id}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{q.question}</label>
                                    <textarea
                                        rows={2}
                                        value={q.answer}
                                        onChange={(e) => handleQuizChange(q.id, e.target.value)}
                                        className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-brand-tertiary border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 dark:text-white"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* General Traits */}
                    <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md">
                         <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('trainingCenter.knowledgeDocs')}</h2>
                         <div className="p-4 border-2 border-dashed rounded-lg text-center">
                            <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400"/>
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-brand-secondary rounded-md font-medium text-brand-accent hover:text-opacity-80">
                                <span>{t('trainingCenter.uploadFile')}</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileUpload}/>
                            </label>
                            <p className="text-xs text-gray-500">{t('trainingCenter.fileTypes')}</p>
                         </div>
                         {isUploading && <p className="text-sm mt-2">{t('trainingCenter.uploading')}</p>}
                         <ul className="mt-4 space-y-2">
                            {documents.map(doc => (
                                <li key={doc.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 dark:bg-brand-tertiary rounded">
                                    <span className="truncate text-gray-700 dark:text-gray-300">{doc.name}</span>
                                    <button onClick={() => handleDeleteDoc(doc.id)}><TrashIcon className="w-4 h-4 text-red-500 hover:text-red-700"/></button>
                                </li>
                            ))}
                         </ul>
                    </div>
                    {/* Actions */}
                    <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('trainingCenter.actions')}</h2>
                        <div className="space-y-4">
                            <button onClick={handleSave} disabled={isSaving} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                                {isSaving ? t('trainingCenter.savingButton') : t('trainingCenter.saveButton')}
                            </button>
                            <button onClick={() => setIsTesting(true)} className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600">
                                {t('trainingCenter.testButton')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainingCenter;
