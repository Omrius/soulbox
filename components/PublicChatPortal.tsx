// Renamed from PublicChatPortal.tsx to ProcheDashboard.tsx
import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useI18n } from '../contexts/I18nContext.tsx';
import { ConsulteurUser, ProcheDashboardView, SealedItem, UnlockAttempt } from '../types.ts';
import { chatWithPublicClone, fetchSealedItems } from '../services/geminiService.ts';
import { verifySecretAccess } from '../services/authService.ts';
import { SendIcon, UserCircleIcon, LockIcon, MessageIcon, ShieldCheckIcon, SettingsIcon, UploadCloudIcon, LogoutIcon, MenuIcon } from './icons/Icon.tsx';


// --- Sub-Component: Side Navigation ---
interface ProcheSideNavProps {
    currentView: ProcheDashboardView;
    setCurrentView: (view: ProcheDashboardView) => void;
    isMobileNavOpen: boolean;
    setMobileNavOpen: (isOpen: boolean) => void;
}

const ProcheSideNav: React.FC<ProcheSideNavProps> = ({ currentView, setCurrentView, isMobileNavOpen, setMobileNavOpen }) => {
    const { t } = useI18n();
    const navItems = [
        { view: ProcheDashboardView.CHAT, label: t('procheDashboard.navChat'), icon: <MessageIcon className="w-6 h-6" /> },
        { view: ProcheDashboardView.VAULT, label: t('procheDashboard.navVault'), icon: <LockIcon className="w-6 h-6" /> },
        { view: ProcheDashboardView.CONTRIBUTE, label: t('procheDashboard.navContribute'), icon: <UploadCloudIcon className="w-6 h-6" /> },
        { view: ProcheDashboardView.SETTINGS, label: t('procheDashboard.navSettings'), icon: <SettingsIcon className="w-6 h-6" /> },
        { view: ProcheDashboardView.PRIVACY, label: t('procheDashboard.navPrivacy'), icon: <ShieldCheckIcon className="w-6 h-6" /> },
    ];
    
    const handleLinkClick = (view: ProcheDashboardView) => {
        setCurrentView(view);
        setMobileNavOpen(false); // Close nav on mobile after a selection
    };

    const navClasses = `
        fixed inset-y-0 left-0 z-50 w-64 bg-brand-secondary text-white transform
        transition-transform duration-300 ease-in-out flex flex-col
        md:relative md:translate-x-0
        ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}
    `;

    return (
        <nav className={navClasses}>
            <h1 className="text-2xl font-bold text-white text-center py-6">SoulBox</h1>
            <div className="flex-1 space-y-2 p-4">
                {navItems.map(item => (
                    <button
                        key={item.view}
                        onClick={() => handleLinkClick(item.view)}
                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${currentView === item.view ? 'bg-brand-accent text-white' : 'text-gray-400 hover:bg-brand-tertiary hover:text-white'}`}
                    >
                        <span className="mr-3">{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </div>
        </nav>
    );
};


// --- Sub-Component: Chat View ---
interface Message { sender: 'user' | 'clone'; text: string; }
const ProcheChat: React.FC = () => {
    const { user } = useAuth();
    const { t } = useI18n();
    const consulteurUser = user as ConsulteurUser;
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages([{ sender: 'clone', text: t('procheDashboard.chatWelcome', { name: consulteurUser.cloneName }) }]);
    }, [consulteurUser.cloneName, t]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    
    const handleSend = async () => {
        if (!input.trim() || !consulteurUser.cloneId) return;
        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        const cloneResponse = await chatWithPublicClone(input, consulteurUser.cloneId);
        const cloneMessage: Message = { sender: 'clone', text: cloneResponse };
        setMessages(prev => [...prev, cloneMessage]);
        setIsLoading(false);
    };

    return (
        <div className="bg-white dark:bg-brand-secondary rounded-lg shadow-md flex-1 flex flex-col max-w-4xl mx-auto w-full h-full">
            <div className="p-4 border-b dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('procheDashboard.chatWith', { name: consulteurUser.cloneName })}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'clone' && <UserCircleIcon className="w-8 h-8 text-brand-accent flex-shrink-0" />}
                        <div className={`p-3 rounded-lg max-w-xs sm:max-w-sm md:max-w-md ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-brand-tertiary text-gray-800 dark:text-gray-200'}`}>
                            <p style={{whiteSpace: "pre-wrap"}}>{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3">
                        <UserCircleIcon className="w-8 h-8 text-brand-accent flex-shrink-0" />
                        <div className="p-3 rounded-lg bg-gray-200 dark:bg-brand-tertiary text-gray-800 dark:text-gray-200"><p>...</p></div>
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
                    placeholder={t('procheDashboard.chatPlaceholder', { name: consulteurUser.cloneName })}
                    className="flex-grow p-2 rounded-lg bg-gray-100 dark:bg-brand-tertiary dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    disabled={isLoading}
                />
                <button onClick={handleSend} disabled={isLoading} className="ml-3 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 flex-shrink-0">
                    <SendIcon className="w-5 h-5"/>
                </button>
            </div>
        </div>
    );
};


// --- Sub-Component: Digital Vault View with Verification ---
const ProcheVault: React.FC = () => {
    const { user } = useAuth();
    const { t } = useI18n();
    const consulteurUser = user as ConsulteurUser;
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [sealedItems, setSealedItems] = useState<SealedItem[]>([]);
    const [unlockAttempt, setUnlockAttempt] = useState<UnlockAttempt>({ fullName: '', idNumber: '', secretToken: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUnlockAttempt({ ...unlockAttempt, [e.target.name]: e.target.value });
    };

    const handleVerification = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        const result = await verifySecretAccess(unlockAttempt, consulteurUser.beneficiaryId);
        if (result.success) {
            const items = await fetchSealedItems();
            setSealedItems(items);
            setIsVerified(true);
        } else {
            setError(result.message);
        }
        setIsLoading(false);
    };

    if (!isVerified) {
        return (
            <div className="max-w-md mx-auto mt-10 bg-white dark:bg-brand-secondary p-8 rounded-lg shadow-xl">
                <LockIcon className="w-16 h-16 mx-auto text-brand-accent"/>
                <h2 className="text-2xl font-bold text-center mt-4 text-gray-900 dark:text-white">{t('procheDashboard.vaultTitle')}</h2>
                <p className="text-center mt-2 text-gray-600 dark:text-gray-400">{t('procheDashboard.vaultDescription')}</p>
                <form onSubmit={handleVerification} className="mt-6 space-y-4">
                    <input type="text" name="fullName" placeholder={t('loginPage.fullNamePlaceholder')} onChange={handleInputChange} required className="w-full p-3 rounded bg-gray-100 dark:bg-brand-tertiary dark:text-white" />
                    <input type="text" name="idNumber" placeholder={t('channels.modalIdNumber')} onChange={handleInputChange} required className="w-full p-3 rounded bg-gray-100 dark:bg-brand-tertiary dark:text-white" />
                    <input type="text" name="secretToken" placeholder={t('loginPage.procheTokenPlaceholder')} onChange={handleInputChange} required className="w-full p-3 rounded bg-gray-100 dark:bg-brand-tertiary dark:text-white" />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50">
                        {isLoading ? t('procheDashboard.vaultVerifying') : t('procheDashboard.vaultUnlock')}
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('procheDashboard.vaultContentTitle')}</h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{t('procheDashboard.vaultContentDesc', { name: consulteurUser.cloneName })}</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sealedItems.map(item => (
                    <div key={item.id} className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Placeholder Sub-Components ---
const ProcheContribution: React.FC = () => {
    const { t } = useI18n();
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('procheDashboard.contributeTitle')}</h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{t('procheDashboard.contributeDesc')}</p>
        </div>
    );
};
const ProcheSettings: React.FC = () => {
    const { user } = useAuth();
    const { t } = useI18n();
    const consulteurUser = user as ConsulteurUser;

    if (!consulteurUser || !consulteurUser.firstName) {
        return <div>{t('common.loading')}</div>
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('procheDashboard.settingsTitle')}</h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                {t('procheDashboard.settingsDesc')}
            </p>

            <div className="mt-8 max-w-lg bg-white dark:bg-brand-secondary p-8 rounded-lg shadow-md">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('procheDashboard.settingsFirstName')}</label>
                        <p className="text-lg text-gray-900 dark:text-white">{consulteurUser.firstName}</p>
                    </div>
                     <div className="border-t border-gray-200 dark:border-gray-700"></div>
                    <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('procheDashboard.settingsLastName')}</label>
                        <p className="text-lg text-gray-900 dark:text-white">{consulteurUser.lastName}</p>
                    </div>
                     <div className="border-t border-gray-200 dark:border-gray-700"></div>
                    <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('common.email')}</label>
                        <p className="text-lg text-gray-900 dark:text-white">{consulteurUser.email}</p>
                    </div>
                     <div className="border-t border-gray-200 dark:border-gray-700"></div>
                    <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('procheDashboard.settingsPhone')}</label>
                        <p className="text-lg text-gray-900 dark:text-white">{consulteurUser.phone}</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 max-w-lg bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <ShieldCheckIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200">{t('procheDashboard.privacyNoticeTitle')}</h3>
                        <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                            <p>
                                {t('procheDashboard.privacyNoticeBody', { name: consulteurUser.cloneName })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
const ProchePrivacy: React.FC = () => {
    const { t } = useI18n();
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('procheDashboard.privacyTitle')}</h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{t('procheDashboard.privacyDesc')}</p>
        </div>
    );
};


// --- Main Dashboard Component ---
const ProcheDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const { t } = useI18n();
    const consulteurUser = user as ConsulteurUser;
    const [currentView, setCurrentView] = useState<ProcheDashboardView>(ProcheDashboardView.CHAT);
    const [isMobileNavOpen, setMobileNavOpen] = useState(false);

    const renderView = () => {
        switch (currentView) {
            case ProcheDashboardView.CHAT: return <ProcheChat />;
            case ProcheDashboardView.VAULT: return <ProcheVault />;
            case ProcheDashboardView.CONTRIBUTE: return <ProcheContribution />;
            case ProcheDashboardView.SETTINGS: return <ProcheSettings />;
            case ProcheDashboardView.PRIVACY: return <ProchePrivacy />;
            default: return <ProcheChat />;
        }
    };

    return (
        <div className="h-screen w-screen flex bg-gray-100 dark:bg-brand-dark overflow-hidden">
            {isMobileNavOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setMobileNavOpen(false)}></div>}
            <ProcheSideNav 
                currentView={currentView} 
                setCurrentView={setCurrentView}
                isMobileNavOpen={isMobileNavOpen}
                setMobileNavOpen={setMobileNavOpen}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="p-4 bg-white dark:bg-brand-secondary shadow-md flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center">
                        <button onClick={() => setMobileNavOpen(true)} className="text-gray-500 dark:text-gray-300 md:hidden mr-4">
                            <MenuIcon className="h-6 w-6" />
                        </button>
                        <p className="text-gray-800 dark:text-white hidden sm:block">
                            {t('procheDashboard.headerConnectedAs', { name: consulteurUser.name, '1': (text) => <strong>{text}</strong> })}
                        </p>
                    </div>
                    <button onClick={logout} className="flex items-center bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700">
                        <LogoutIcon className="w-5 h-5 sm:mr-2" />
                        <span className="hidden sm:block">{t('procheDashboard.headerQuit')}</span>
                    </button>
                </header>
                <main className="flex-1 p-4 md:p-8 overflow-y-auto flex flex-col">
                    {renderView()}
                </main>
            </div>
        </div>
    );
};

export default ProcheDashboard;