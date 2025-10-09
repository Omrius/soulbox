// components/TrainingCenter.tsx
import React, { useState, useEffect } from 'react';
import { TrainingData, TrainingDocument, DashboardView, PersonalityQuizQuestion, CustomKnowledge } from '../types';
import { 
    fetchTrainingData, 
    saveTrainingData,
    fetchTrainingDocuments,
    uploadTrainingDocument,
    deleteTrainingDocument,
    saveTrainingToDrive
} from '../services/geminiService';
import { chatWithClone } from '../services/aiService'; // UPDATED
import { useI18n } from '../contexts/I18nContext';
import ChatWindow from './ChatWindow';
import { UploadCloudIcon, TrashIcon, PlusIcon } from './icons/Icon';
import { useAuth } from '../contexts/AuthContext';
import { CloneUser } from '../types';

// We need the default questions to differentiate them from custom ones.
const defaultQuestionIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [newKnowledgeText, setNewKnowledgeText] = useState('');


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
    
    const handleQuizChange = (id: number, field: 'question' | 'answer', value: string) => {
        if (trainingData) {
            const updatedQuiz = trainingData.personalityQuiz.map(q => 
                q.id === id ? {...q, [field]: value} : q
            );
            handleDataChange('personalityQuiz', updatedQuiz);
        }
    };

    const handleAddCustomQuestion = () => {
        if (trainingData) {
            const newQuestion: PersonalityQuizQuestion = {
                id: Date.now(), // Use timestamp for a unique temporary ID
                question: '',
                answer: ''
            };
            const updatedQuiz = [...trainingData.personalityQuiz, newQuestion];
            handleDataChange('personalityQuiz', updatedQuiz);
        }
    };

    const handleRemoveCustomQuestion = (id: number) => {
        if (trainingData) {
            const updatedQuiz = trainingData.personalityQuiz.filter(q => q.id !== id);
            handleDataChange('personalityQuiz', updatedQuiz);
        }
    };

    const handleAddCustomKnowledgeItem = () => {
        if (trainingData && newKnowledgeText.trim()) {
            const newItem: CustomKnowledge = {
                id: Date.now(),
                text: newKnowledgeText.trim(),
            };
            handleDataChange('customKnowledge', [...trainingData.customKnowledge, newItem]);
            setNewKnowledgeText('');
        }
    };

    const handleRemoveCustomKnowledgeItem = (id: number) => {
        if (trainingData) {
            const updatedKnowledge = trainingData.customKnowledge.filter(item => item.id !== id);
            handleDataChange('customKnowledge', updatedKnowledge);
        }
    };


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
    
    const attemptUpload = async (file: File) => {
        if (!trainingData) return;
        setIsUploading(true);
        setUploadError(null);
        try {
            const newDoc = await uploadTrainingDocument(file);
            setDocuments(prev => [...prev, newDoc]);
            setFileToUpload(null); // Clear file on success
        } catch (error) {
            const message = error instanceof Error ? error.message : "Upload failed";
            setUploadError(message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileToUpload(file);
            await attemptUpload(file);
        }
        // Reset file input to allow re-selecting the same file if needed
        e.target.value = '';
    };

    const handleRetryUpload = () => {
        if (fileToUpload) {
            attemptUpload(fileToUpload);
        }
    };
    
    const handleDeleteDoc = async (docId: string) => {
        await deleteTrainingDocument(docId);
        setDocuments(prev => prev.filter(d => d.id !== docId));
    }

    if (isLoading) return <p>{t('trainingCenter.loading')}</p>;
    if (!trainingData || !user) return <p>{t('trainingCenter.loadingError')}</p>;
    
    if (isTesting) {
        return <ChatWindow context={trainingData} onBack={() => setIsTesting(false)} />;
    }
    
    const defaultQuestions = trainingData.personalityQuiz.filter(q => defaultQuestionIds.includes(q.id));
    const customQuestions = trainingData.personalityQuiz.filter(q => !defaultQuestionIds.includes(q.id));

    return (
        <div>
            <h1 className="page-title">{t('trainingCenter.title')}</h1>
            <p className="page-subheadline">
                {t('trainingCenter.subheadline')}
            </p>

            <div className="training-grid">
                <div className="training-main-col">
                     {/* Personality Quiz */}
                    <div className="card">
                        <h2 className="h2" style={{marginBottom: '1rem'}}>{t('trainingCenter.personalityQuiz')}</h2>
                         <p style={{marginBottom: '1.5rem', color: 'var(--color-text-muted)'}}>{t('trainingCenter.quizDesc')}</p>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                            {defaultQuestions.map(q => (
                                <div key={q.id}>
                                    <label className="form-label" style={{fontSize: '0.875rem'}}>{q.question}</label>
                                    <textarea
                                        rows={2}
                                        value={q.answer}
                                        onChange={(e) => handleQuizChange(q.id, 'answer', e.target.value)}
                                        className="form-textarea"
                                    />
                                </div>
                            ))}
                        </div>
                        
                        <div className="divider" style={{marginTop: '1.5rem', paddingTop: '1.5rem'}}>
                             <h3 className="h3" style={{marginBottom: '1rem'}}>{t('trainingCenter.customQuestionsTitle')}</h3>
                             <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                                {customQuestions.map(q => (
                                    <div key={q.id} className="custom-question-box">
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                                            <label className="form-label" style={{fontSize: '0.875rem'}}>{t('trainingCenter.customQuestionLabel')}</label>
                                            <button onClick={() => handleRemoveCustomQuestion(q.id)} style={{color: 'var(--color-danger)', background: 'none', border: 'none', cursor: 'pointer'}}>
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder={t('trainingCenter.customQuestionPlaceholder')}
                                            value={q.question}
                                            onChange={(e) => handleQuizChange(q.id, 'question', e.target.value)}
                                            className="form-input"
                                            style={{marginBottom: '0.5rem'}}
                                        />
                                         <textarea
                                            rows={2}
                                            placeholder={t('trainingCenter.customAnswerPlaceholder')}
                                            value={q.answer}
                                            onChange={(e) => handleQuizChange(q.id, 'answer', e.target.value)}
                                            className="form-textarea"
                                        />
                                    </div>
                                ))}
                             </div>
                             <button onClick={handleAddCustomQuestion} style={{marginTop: '1rem', display: 'flex', alignItems: 'center', fontSize: '0.875rem', fontWeight: 500, color: 'var(--brand-accent)', background: 'none', border: 'none', cursor: 'pointer'}}>
                                <PlusIcon className="w-4 h-4 mr-2" />
                                {t('trainingCenter.addQuestion')}
                             </button>
                        </div>
                    </div>
                </div>

                <div className="training-side-col">
                    {/* Knowledge Docs */}
                    <div className="card">
                         <h2 className="h2" style={{marginBottom: '1rem'}}>{t('trainingCenter.knowledgeDocs')}</h2>
                         <div className="upload-box">
                            <UploadCloudIcon className="upload-box-icon"/>
                            <label htmlFor="file-upload" className="upload-label">
                                <span>{isUploading ? t('trainingCenter.uploading') : t('trainingCenter.uploadFile')}</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileUpload} disabled={isUploading}/>
                            </label>
                            <p className="upload-hint">{t('trainingCenter.fileTypes')}</p>
                         </div>
                         {uploadError && (
                             <div className="error-box-inline">
                                <p style={{margin: 0}}>{uploadError}</p>
                                <button
                                    onClick={handleRetryUpload}
                                    disabled={isUploading}
                                    className="btn btn-danger"
                                    style={{fontSize: '0.875rem', padding: '0.25rem 0.75rem'}}
                                >
                                    {isUploading ? t('common.loading') : t('trainingCenter.retryButton')}
                                </button>
                            </div>
                         )}
                         <ul className="doc-list">
                            {documents.map(doc => (
                                <li key={doc.id} className="doc-list-item">
                                    <span>{doc.name}</span>
                                    <button onClick={() => handleDeleteDoc(doc.id)}><TrashIcon className="trash-icon"/></button>
                                </li>
                            ))}
                         </ul>
                    </div>
                    {/* NEW: Custom Knowledge */}
                    <div className="card">
                        <h2 className="h2" style={{marginBottom: '1rem'}}>{t('trainingCenter.customKnowledgeTitle')}</h2>
                        <p style={{marginBottom: '1.5rem', color: 'var(--color-text-muted)'}}>{t('trainingCenter.customKnowledgeDesc')}</p>
                        
                        <div className="doc-list" style={{marginBottom: '1rem', maxHeight: '10rem', overflowY: 'auto'}}>
                            {trainingData.customKnowledge.map(item => (
                                <li key={item.id} className="doc-list-item">
                                    <span style={{whiteSpace: 'normal', flex: 1, paddingRight: '0.5rem'}}>{item.text}</span>
                                    <button onClick={() => handleRemoveCustomKnowledgeItem(item.id)}>
                                        <TrashIcon className="trash-icon"/>
                                    </button>
                                </li>
                            ))}
                            {trainingData.customKnowledge.length === 0 && (
                                <p style={{fontSize: '0.875rem', color: 'var(--color-text-muted)', textAlign: 'center'}}>{t('trainingCenter.noCustomKnowledge')}</p>
                            )}
                        </div>
                        
                        <div>
                            <textarea
                                rows={3}
                                value={newKnowledgeText}
                                onChange={(e) => setNewKnowledgeText(e.target.value)}
                                placeholder={t('trainingCenter.customKnowledgePlaceholder')}
                                className="form-textarea"
                                style={{marginBottom: '0.5rem'}}
                            />
                            <button 
                                onClick={handleAddCustomKnowledgeItem} 
                                disabled={!newKnowledgeText.trim()}
                                className="btn btn-secondary"
                                style={{width: '100%'}}
                            >
                                <PlusIcon className="w-4 h-4 mr-2" />
                                {t('trainingCenter.addKnowledge')}
                            </button>
                        </div>
                    </div>
                    {/* Actions */}
                    <div className="card">
                        <h2 className="h2" style={{marginBottom: '1rem'}}>{t('trainingCenter.actions')}</h2>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                            <button onClick={handleSave} disabled={isSaving} className="btn btn-info w-full" style={{padding: '0.75rem 0'}}>
                                {isSaving ? t('trainingCenter.savingButton') : t('trainingCenter.saveButton')}
                            </button>
                            <button onClick={() => setIsTesting(true)} className="btn btn-success w-full" style={{padding: '0.75rem 0'}}>
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