
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
    const [cloningError, setCloningError] = useState<string | null>(null);
    const [speechError, setSpeechError] = useState<string | null>(null);


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
        setCloningError(null);
        try {
            const newCloneId = await addVoiceClone(audioBlobs);
            setCloneId(newCloneId);
            localStorage.setItem('voiceCloneId', newCloneId);
            alert(t('voiceClone.successMessage'));
            setAudioBlobs([]); // Clear samples after successful clone
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            setCloningError(t('voiceClone.errorMessage', { error: errorMessage }));
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
        setSpeechError(null);
        try {
            const url = await textToSpeech(ttsText, cloneId);
            setAudioUrl(url);
        } catch (error) {
             const errorMessage = error instanceof Error ? error.message : 'Unknown error';
             setSpeechError(t('voiceClone.speechError', { error: errorMessage }));
        } finally {
            setIsGeneratingSpeech(false);
        }
    };

    return (
        <div>
            <h1 className="page-title">{t('voiceClone.title')}</h1>
            <p className="page-subheadline">
                {t('voiceClone.subheadline')}
            </p>

            {!cloneId ? (
                 <div className="card" style={{marginTop: '2rem'}}>
                    <h2 style={{fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem'}}>{t('voiceClone.step1Title')}</h2>
                    <p style={{marginBottom: '1rem'}}>{t('voiceClone.step1Desc')}</p>
                    
                    <div className="voice-clone-recorder">
                        <button
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`recorder-btn ${isRecording ? 'recording' : 'stopped'}`}
                        >
                            {isRecording ? <StopIcon /> : <MicrophoneIcon />}
                        </button>
                        <p className="recorder-status-text">{isRecording ? t('voiceClone.stopRecording') : t('voiceClone.startRecording')}</p>
                    </div>

                    <div style={{marginTop: '1.5rem'}}>
                        <h3 style={{fontWeight: 600}}>{t('voiceClone.samplesRecorded', { count: audioBlobs.length })}</h3>
                        <ul className="sample-list">
                            {audioBlobs.map((blob, index) => (
                                <li key={index} className="sample-list-item">
                                    <p>{t('voiceClone.sample', { index: index + 1 })}</p>
                                    <audio src={URL.createObjectURL(blob)} controls />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="divider">
                         <h2 style={{fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem'}}>{t('voiceClone.step2Title')}</h2>
                         
                         {cloningError ? (
                            <div className="error-box">
                                <p>{cloningError}</p>
                                <button
                                    onClick={handleCreateClone}
                                    disabled={isCloning}
                                    className="btn btn-danger"
                                >
                                    {isCloning ? t('common.loading') : t('voiceClone.retryButton')}
                                </button>
                            </div>
                         ) : (
                            <button
                                onClick={handleCreateClone}
                                disabled={isCloning || audioBlobs.length === 0}
                                className="btn btn-info"
                                style={{padding: '0.75rem 1.5rem'}}
                            >
                               {isCloning ? t('voiceClone.creatingButton') : t('voiceClone.createButton')}
                            </button>
                         )}
                    </div>
                </div>
            ) : (
                <div className="card" style={{marginTop: '2rem'}}>
                    <h2 style={{fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem'}}>{t('voiceClone.testTitle')}</h2>
                    <p style={{marginBottom: '0.5rem'}}>
                        {t('voiceClone.testReady', { cloneId, '1': (text: string) => <code style={{fontSize: '0.75rem', backgroundColor: 'var(--color-bg-input)', padding: '0.25rem', borderRadius: 'var(--rounded-sm)'}}>{text}</code> })}
                    </p>
                    <p style={{marginBottom: '1rem'}}>{t('voiceClone.testInstructions')}</p>
                    
                    <textarea 
                        value={ttsText}
                        onChange={(e) => setTtsText(e.target.value)}
                        rows={4}
                        className="form-textarea"
                    />

                    <button
                        onClick={handleGenerateSpeech}
                        disabled={isGeneratingSpeech}
                        className="btn btn-success"
                        style={{marginTop: '1rem'}}
                    >
                        {isGeneratingSpeech ? t('voiceClone.generatingSpeechButton') : t('voiceClone.generateSpeechButton')}
                    </button>
                    
                    {speechError && (
                         <div className="error-box-inline">
                            <p style={{marginBottom: 0}}>{speechError}</p>
                            <button
                                onClick={handleGenerateSpeech}
                                className="btn btn-danger"
                                style={{fontSize: '0.875rem', padding: '0.25rem 0.75rem'}}
                            >
                                {t('voiceClone.retryButton')}
                            </button>
                        </div>
                    )}

                    {audioUrl && !speechError && (
                        <div style={{marginTop: '1rem'}}>
                            <audio src={audioUrl} controls autoPlay />
                        </div>
                    )}
                    
                    <div style={{marginTop: '1.5rem'}}>
                        <button onClick={() => { localStorage.removeItem('voiceCloneId'); setCloneId(null); }} style={{fontSize: '0.875rem', color: 'var(--color-danger)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer'}}>
                            {t('voiceClone.deleteAndRestart')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VoiceClone;