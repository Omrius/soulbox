// components/ChatWindow.tsx
import React, { useState, useEffect, useRef } from 'react';
import { TrainingData } from '../types';
import { chatWithClone } from '../services/geminiService';
import { useI18n } from '../contexts/I18nContext';
import { SendIcon } from './icons/Icon';
import { UserCircleIcon } from './icons/Icon';
import { useAuth } from '../contexts/AuthContext';


interface Message {
    sender: 'user' | 'clone';
    text: string;
}

interface ChatWindowProps {
    context: TrainingData;
    onBack: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ context, onBack }) => {
    const { user } = useAuth();
    const { t } = useI18n();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);
    
    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const cloneResponse = await chatWithClone(input, context);

        const cloneMessage: Message = { sender: 'clone', text: cloneResponse };
        setMessages(prev => [...prev, cloneMessage]);
        setIsLoading(false);
    };

    return (
        <div>
            <button onClick={onBack} style={{marginBottom: '1rem', color: 'var(--color-info)'}}>
                &larr; {t('chatWindow.back')}
            </button>
            <div className="chat-window">
                <div className="chat-header">
                    <h2 className="h2">{t('chatWindow.title')}</h2>
                </div>
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.sender === 'user' ? 'user' : 'clone'}`}>
                             {msg.sender === 'clone' && <UserCircleIcon className="chat-message-avatar" />}
                            <div className={`chat-bubble ${msg.sender === 'user' ? 'user' : 'clone'}`}>
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="chat-message clone">
                             <UserCircleIcon className="chat-message-avatar" />
                            <div className="chat-bubble clone">
                                <p>...</p>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="chat-input-area">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                        placeholder={t('chatWindow.placeholder')}
                        className="chat-input form-input"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading} className="chat-send-btn">
                        <SendIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;