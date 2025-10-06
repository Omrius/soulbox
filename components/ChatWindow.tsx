
// components/ChatWindow.tsx
import React, { useState, useEffect, useRef } from 'react';
import { TrainingData } from '../types.ts';
import { chatWithClone } from '../services/geminiService.ts';
import { useI18n } from '../contexts/I18nContext.tsx';
import { SendIcon } from './icons/Icon.tsx';
import { UserCircleIcon } from './icons/Icon.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';


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
            <button onClick={onBack} className="mb-4 text-blue-500 hover:underline">
                &larr; {t('chatWindow.back')}
            </button>
            <div className="bg-white dark:bg-brand-secondary rounded-lg shadow-md max-w-2xl mx-auto">
                <div className="p-4 border-b dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('chatWindow.title')}</h2>
                </div>
                <div className="h-96 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                             {msg.sender === 'clone' && <UserCircleIcon className="w-8 h-8 text-brand-accent flex-shrink-0" />}
                            <div className={`p-3 rounded-lg max-w-md ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-brand-tertiary text-gray-800 dark:text-gray-200'}`}>
                                <p style={{whiteSpace: "pre-wrap"}}>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-3">
                             <UserCircleIcon className="w-8 h-8 text-brand-accent flex-shrink-0" />
                            <div className="p-3 rounded-lg bg-gray-200 dark:bg-brand-tertiary text-gray-800 dark:text-gray-200">
                                <p>...</p>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t dark:border-gray-700 flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                        placeholder={t('chatWindow.placeholder')}
                        className="flex-grow p-2 rounded-lg bg-gray-100 dark:bg-brand-tertiary dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading} className="ml-3 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50">
                        <SendIcon className="w-5 h-5"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
