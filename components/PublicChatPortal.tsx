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
        { view: ProcheDashboardView.CHAT, label: t('procheDashboard.navChat'), icon: <MessageIcon /> },
        { view: ProcheDashboardView.VAULT, label: t('procheDashboard.navVault'), icon: <LockIcon /> },
        { view: ProcheDashboardView.CONTRIBUTE, label: t('procheDashboard.navContribute'), icon: <UploadCloudIcon /> },
        { view: ProcheDashboardView.SETTINGS, label: t('procheDashboard.navSettings'), icon: <SettingsIcon /> },
        { view: ProcheDashboardView.PRIVACY, label: t('procheDashboard.navPrivacy'), icon: <ShieldCheckIcon /> },
    ];
    
    const handleLinkClick = (view: ProcheDashboardView) => {
        setCurrentView(view);
        setMobileNavOpen(false); // Close nav on mobile after a selection
    };

    const navClasses = `sidenav ${isMobileNavOpen ? 'open' : ''}`;

    return (
        <nav className={navClasses}>
            <div className="sidenav-header">
                <h1 className="sidenav-title">SoulBox</h1>
            </div>
            <div className="sidenav-links">
                {navItems.map(item => (
                    <button
                        key={item.view}
                        onClick={() => handleLinkClick(item.view)}
                        className={`sidenav-link ${currentView === item.view ? 'active' : ''}`}
                    >
                        {item.icon}
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
        <div className="chat-window proche-chat-container">
            <div className="chat-header">
                <h2 className="h2">{t('procheDashboard.chatWith', { name: consulteurUser.cloneName })}</h2>
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.sender}`}>
                        {msg.sender === 'clone' && <UserCircleIcon className="chat-message-avatar" />}
                        <div className={`chat-bubble ${msg.sender}`}>
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="chat-message clone">
                        <UserCircleIcon className="chat-message-avatar" />
                        <div className="chat-bubble clone"><p>...</p></div>
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
                    placeholder={t('procheDashboard.chatPlaceholder', { name: consulteurUser.cloneName })}
                    className="chat-input form-input"
                    disabled={isLoading}
                />
                <button onClick={handleSend} disabled={isLoading} className="chat-send-btn">
                    <SendIcon/>
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
            <div className="card verification-card">
                <LockIcon />
                <h2 className="h2">{t('procheDashboard.vaultTitle')}</h2>
                <p>{t('procheDashboard.vaultDescription')}</p>
                <form onSubmit={handleVerification}>
                    <input type="text" name="fullName" placeholder={t('loginPage.fullNamePlaceholder')} onChange={handleInputChange} required className="form-input" />
                    <input type="text" name="idNumber" placeholder={t('channels.modalIdNumber')} onChange={handleInputChange} required className="form-input" />
                    <input type="text" name="secretToken" placeholder={t('loginPage.procheTokenPlaceholder')} onChange={handleInputChange} required className="form-input" />
                    {error && <p style={{color: 'var(--color-danger)', fontSize: '0.875rem'}}>{error}</p>}
                    <button type="submit" disabled={isLoading} className="btn btn-primary w-full">
                        {isLoading ? t('procheDashboard.vaultVerifying') : t('procheDashboard.vaultUnlock')}
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div>
            <h1 className="page-title">{t('procheDashboard.vaultContentTitle')}</h1>
            <p className="page-subheadline">{t('procheDashboard.vaultContentDesc', { name: consulteurUser.cloneName })}</p>
            <div className="vault-grid" style={{marginTop: '2rem'}}>
                {sealedItems.map(item => (
                    <div key={item.id} className="card">
                        <h2 className="h2">{item.title}</h2>
                        <p style={{marginTop: '0.5rem', color: 'var(--color-text-muted)'}}>{item.description}</p>
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
            <h1 className="page-title">{t('procheDashboard.contributeTitle')}</h1>
            <p className="page-subheadline">{t('procheDashboard.contributeDesc')}</p>
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
            <h1 className="page-title">{t('procheDashboard.settingsTitle')}</h1>
            <p className="page-subheadline">
                {t('procheDashboard.settingsDesc')}
            </p>

            <div className="card info-card">
                <div className="info-group">
                    <div className="info-item">
                        <label className="info-label">{t('procheDashboard.settingsFirstName')}</label>
                        <p className="info-value">{consulteurUser.firstName}</p>
                    </div>
                    <div className="info-item">
                        <label className="info-label">{t('procheDashboard.settingsLastName')}</label>
                        <p className="info-value">{consulteurUser.lastName}</p>
                    </div>
                    <div className="info-item">
                        <label className="info-label">{t('common.email')}</label>
                        <p className="info-value">{consulteurUser.email}</p>
                    </div>
                    <div className="info-item">
                        <label className="info-label">{t('procheDashboard.settingsPhone')}</label>
                        <p className="info-value">{consulteurUser.phone}</p>
                    </div>
                </div>
            </div>

            <div className="privacy-notice">
                <div className="icon-wrapper">
                    <ShieldCheckIcon />
                </div>
                <div className="content">
                    <h3>{t('procheDashboard.privacyNoticeTitle')}</h3>
                    <p>
                        {t('procheDashboard.privacyNoticeBody', { name: consulteurUser.cloneName })}
                    </p>
                </div>
            </div>
        </div>
    );
};
const ProchePrivacy: React.FC = () => {
    const { t } = useI18n();
    return (
        <div>
            <h1 className="page-title">{t('procheDashboard.privacyTitle')}</h1>
            <p className="page-subheadline">{t('procheDashboard.privacyDesc')}</p>
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
        <div className="proche-dashboard">
            {isMobileNavOpen && <div className="nav-overlay" onClick={() => setMobileNavOpen(false)}></div>}
            <ProcheSideNav 
                currentView={currentView} 
                setCurrentView={setCurrentView}
                isMobileNavOpen={isMobileNavOpen}
                setMobileNavOpen={setMobileNavOpen}
            />
            <div className="dashboard-content-wrapper">
                <header className="proche-header">
                    <div>
                        <button onClick={() => setMobileNavOpen(true)} className="header-menu-btn" style={{marginRight: '1rem'}}>
                            <MenuIcon className="h-6 w-6" />
                        </button>
                        <p className="connected-as hidden sm:block">
                            {t('procheDashboard.headerConnectedAs', { name: consulteurUser.name, '1': (text: string) => <strong>{text}</strong> })}
                        </p>
                    </div>
                    <button onClick={logout} className="btn btn-danger">
                        <LogoutIcon className="w-5 h-5 sm:mr-2" />
                        <span className="hidden sm:block">{t('procheDashboard.headerQuit')}</span>
                    </button>
                </header>
                <main className="proche-main">
                    {renderView()}
                </main>
            </div>
        </div>
    );
};

export default ProcheDashboard;