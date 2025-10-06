
// components/VoiceClone.tsx
import React, { useState, useRef, useEffect } from 'react';
import { uploadVoiceSample } from '../services/geminiService.ts'; // This is a mock
import { addVoiceClone, textToSpeech } from '../services/elevenLabsService.ts'; // This is the real one
import { useI18n } from '../contexts/I18nContext.tsx';
import { MicrophoneIcon, TrashIcon } from './icons/Icon.tsx';

// A simple play icon
const PlayIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
);

// A simple stop icon
const StopIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z"/></svg>
);


const VoiceClone: React.FC = () => {
    const { t } = useI18n();
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlobs, setAudioBlobs] = useState<Blob[]>([]);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [isCloning, setIsCloning] = useState(false);
    const [cloneId, setCloneId] = useState<string | null>(localStorage.getItem('voiceCloneId'));
    const [ttsText, setTtsText] = useState("Bonjour, c'est votre clone vocal. Je suis prêt.");
    const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            recorder.ondataavailable = (e) => {
                chunksRef.current.push(e.data);
            };
            recorder.onstop = () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlobs(prev => [...prev, audioBlob]);
                chunksRef.current = [];
            };
            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert(t('voiceClone.micError'));
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            // Stop all media tracks to turn off the recording indicator
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            setMediaRecorder(null);
        }
    };
    
    const handleCreateClone = async () => {
        if (audioBlobs.length === 0) {
            alert(t('voiceClone.noSampleError'));
            return;
        }
        setIsCloning(true);
        try {
            const newCloneId = await addVoiceClone(audioBlobs);
            setCloneId(newCloneId);
            localStorage.setItem('voiceCloneId', newCloneId);
            alert(t('voiceClone.successMessage'));
            setAudioBlobs([]); // Clear samples after successful clone
        } catch (error) {
            console.error(error);
            alert(t('voiceClone.errorMessage', { error: error instanceof Error ? error.message : 'Unknown error' }));
        } finally {
            setIsCloning(false);
        }
    };
    
    const handleGenerateSpeech = async () => {
        if (!cloneId) {
            alert("Aucun clone vocal n'a été créé ou sélectionné.");
            return;
        }
        setIsGeneratingSpeech(true);
        setAudioUrl(null);
        try {
            const url = await textToSpeech(ttsText, cloneId);
            setAudioUrl(url);
        } catch (error) {
             alert(t('voiceClone.speechError', { error: error instanceof Error ? error.message : 'Unknown error' }));
        } finally {
            setIsGeneratingSpeech(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('voiceClone.title')}</h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                {t('voiceClone.subheadline')}
            </p>

            {!cloneId ? (
                 <div className="mt-8 bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('voiceClone.step1Title')}</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-400">{t('voiceClone.step1Desc')}</p>
                    
                    <div className="flex items-center gap-4">
                        <button
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`p-4 rounded-full transition-colors ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                        >
                            {isRecording ? <StopIcon className="w-8 h-8 text-white" /> : <MicrophoneIcon className="w-8 h-8 text-white" />}
                        </button>
                        <p className="font-medium text-gray-700 dark:text-gray-300">{isRecording ? t('voiceClone.stopRecording') : t('voiceClone.startRecording')}</p>
                    </div>

                    <div className="mt-6">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">{t('voiceClone.samplesRecorded', { count: audioBlobs.length })}</h3>
                        <ul className="mt-2 space-y-2">
                            {audioBlobs.map((blob, index) => (
                                <li key={index} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-brand-tertiary rounded">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{t('voiceClone.sample', { index: index + 1 })}</p>
                                    <audio src={URL.createObjectURL(blob)} controls className="h-8" />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-8 border-t pt-6 border-gray-200 dark:border-gray-700">
                         <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('voiceClone.step2Title')}</h2>
                         <button
                            onClick={handleCreateClone}
                            disabled={isCloning || audioBlobs.length === 0}
                            className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                         >
                            {isCloning ? t('voiceClone.creatingButton') : t('voiceClone.createButton')}
                         </button>
                    </div>
                </div>
            ) : (
                <div className="mt-8 bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('voiceClone.testTitle')}</h2>
                    <p className="mb-2 text-gray-600 dark:text-gray-400">{t('voiceClone.testReady', { cloneId, '1': (text) => <code className="text-xs bg-gray-100 dark:bg-brand-tertiary p-1 rounded">{text}</code> })}</p>
                    <p className="mb-4 text-gray-600 dark:text-gray-400">{t('voiceClone.testInstructions')}</p>
                    
                    <textarea 
                        value={ttsText}
                        onChange={(e) => setTtsText(e.target.value)}
                        rows={4}
                        className="w-full p-2 rounded bg-gray-100 dark:bg-brand-tertiary dark:text-white"
                    />

                    <button
                        onClick={handleGenerateSpeech}
                        disabled={isGeneratingSpeech}
                        className="mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                        {isGeneratingSpeech ? t('voiceClone.generatingSpeechButton') : t('voiceClone.generateSpeechButton')}
                    </button>
                    
                    {audioUrl && (
                        <div className="mt-4">
                            <audio src={audioUrl} controls autoPlay />
                        </div>
                    )}
                    
                    <div className="mt-6">
                        <button onClick={() => { localStorage.removeItem('voiceCloneId'); setCloneId(null); }} className="text-sm text-red-500 hover:underline">
                            {t('voiceClone.deleteAndRestart')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VoiceClone;
