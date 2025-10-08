// components/LoginPage.tsx
import React, { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useI18n } from '../contexts/I18nContext.tsx';
import LanguageSwitcher from './LanguageSwitcher.tsx';
import { CloneUser } from '../types.ts';
import { GoogleIcon, UserCircleIcon, UsersIcon, ShieldCheckIcon } from './icons/Icon.tsx';

type View = 'clone' | 'consulteur' | 'admin';
type CloneForm = 'login' | 'register' | 'verify' | 'forgotPassword';

const backgroundImages = [
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2611&auto=format&fit=crop', // Nebula
    'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=2693&auto=format&fit=crop', // Galaxy
    'https://images.unsplash.com/photo-1531306728370-e436253907de?q=80&w=2574&auto=format&fit=crop', // Stars
    'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=2670&auto=format&fit=crop' // Earth from space
];

const LoginPage: React.FC<{ initialView: View }> = ({ initialView }) => {
    const [activeView, setActiveView] = useState<View>(initialView);
    const { loginAsClone, registerWithEmail, verifyEmailCode, forgotPassword, signInWithGoogle, verifyProcheIdentity, verifyProcheToken, loginAsAdmin } = useAuth();
    const { t } = useI18n();
    
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoginVisible, setIsLoginVisible] = useState(false);
    const [currentBgIndex, setCurrentBgIndex] = useState(0);

    // --- Clone States ---
    const [cloneForm, setCloneForm] = useState<CloneForm>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [userToVerify, setUserToVerify] = useState<CloneUser | null>(null);
    const [verificationMessage, setVerificationMessage] = useState('');
    const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');

    // --- Consulteur States ---
    const [procheName, setProcheName] = useState('');
    const [phone, setPhone] = useState('');
    const [token, setToken] = useState('');
    const [procheStep, setProcheStep] = useState(1);
    
    // --- Admin States ---
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');

    useEffect(() => {
        // Since this component is only mounted when it should be visible,
        // we trigger the animation shortly after mount.
        const timer = setTimeout(() => {
            setIsLoginVisible(true);
        }, 100); // A small delay ensures the transition is applied.
        
        return () => clearTimeout(timer);
    }, []);
    
    const changeBackground = () => {
        setCurrentBgIndex(prevIndex => (prevIndex + 1) % backgroundImages.length);
    };

    const handleViewChange = (view: View) => {
        if (view !== activeView) {
            changeBackground();
        }
        setActiveView(view);
        setError('');
    };

    const handleGenericError = (err: unknown) => {
        const message = err instanceof Error ? err.message : 'An error occurred';
        if (message === 'Invalid credentials') {
            setError(t('loginPage.errorInvalidCredentials'));
        } else if (message === 'Code de vérification invalide.') {
            setError(t('loginPage.errorInvalidCode'));
        }
        else {
            setError(t('loginPage.errorUnknown'));
        }
    };

    const handleCloneLogin = async (e: FormEvent) => {
        e.preventDefault(); setIsLoading(true); setError('');
        try { await loginAsClone(email, password); } 
        catch (err) { handleGenericError(err); } 
        finally { setIsLoading(false); }
    };
    
    const handleRegister = async (e: FormEvent) => {
        e.preventDefault(); setIsLoading(true); setError('');
        try {
            const { user, message } = await registerWithEmail(name, email, password);
            setUserToVerify(user); setVerificationMessage(message); setCloneForm('verify');
        } catch (err) { handleGenericError(err); } 
        finally { setIsLoading(false); }
    };
    
    const handleVerifyCode = async (e: FormEvent) => {
        e.preventDefault(); if (!userToVerify) return; setIsLoading(true); setError('');
        try { await verifyEmailCode(userToVerify, code); } 
        catch (err) { handleGenericError(err); } 
        finally { setIsLoading(false); }
    };
    
    const handleForgotPassword = async (e: FormEvent) => {
        e.preventDefault(); setIsLoading(true); setError(''); setForgotPasswordMessage('');
        try {
            await forgotPassword(email);
            setForgotPasswordMessage(t('loginPage.forgotPasswordSuccess', { email }));
        } catch (err) { handleGenericError(err); }
        finally { setIsLoading(false); }
    };
    
    const handleProcheIdentity = async (e: FormEvent) => {
        e.preventDefault(); setIsLoading(true); setError('');
        try {
            const result = await verifyProcheIdentity(procheName, phone);
            if (result.success) setProcheStep(2);
            else setError(result.message);
        } catch(err) { handleGenericError(err); } 
        finally { setIsLoading(false); }
    }
    
    const handleProcheToken = async (e: FormEvent) => {
        e.preventDefault(); setIsLoading(true); setError('');
        try { await verifyProcheToken(token); } 
        catch(err) { handleGenericError(err); } 
        finally { setIsLoading(false); }
    }
    
    const handleAdminLogin = async (e: FormEvent) => {
        e.preventDefault(); setIsLoading(true); setError('');
        try { await loginAsAdmin(adminEmail, adminPassword); } 
        catch(err) { handleGenericError(err); } 
        finally { setIsLoading(false); }
    }

    const renderCloneForm = () => (
        <>
            {cloneForm === 'login' && (
                <form onSubmit={handleCloneLogin} className="space-y-4">
                    <input type="email" placeholder={t('loginPage.emailPlaceholder')} value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent"/>
                    <input type="password" placeholder={t('loginPage.passwordPlaceholder')} value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent"/>
                    <button type="submit" disabled={isLoading} className="w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50">{isLoading ? t('common.loading') : t('loginPage.loginButton')}</button>
                    <div className="text-center text-sm">
                        <button type="button" onClick={() => { setCloneForm('forgotPassword'); setError(''); setForgotPasswordMessage(''); }} className="font-semibold text-brand-accent hover:underline">{t('loginPage.forgotPassword')}</button>
                    </div>
                    <p className="text-center text-sm">{t('loginPage.noAccount')} <button type="button" onClick={() => setCloneForm('register')} className="font-semibold text-brand-accent hover:underline">{t('loginPage.register')}</button></p>
                    <div className="relative my-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-gray-600"></div></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-brand-secondary text-gray-500 dark:text-gray-400">{t('common.or')}</span></div></div>
                    <button type="button" onClick={signInWithGoogle} disabled={isLoading} className="w-full flex items-center justify-center bg-white dark:bg-gray-800 text-gray-700 dark:text-white font-semibold py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"><GoogleIcon className="w-6 h-6 mr-3"/>{t('loginPage.googleLogin')}</button>
                </form>
            )}
            {cloneForm === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4">
                    <input type="text" placeholder={t('loginPage.fullNamePlaceholder')} value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent"/>
                    <input type="email" placeholder={t('loginPage.emailPlaceholder')} value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent"/>
                    <input type="password" placeholder={t('loginPage.passwordPlaceholder')} value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent"/>
                    <button type="submit" disabled={isLoading} className="w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50">{isLoading ? t('common.loading') : t('loginPage.createAccountButton')}</button>
                    <p className="text-center text-sm">{t('loginPage.haveAccount')} <button type="button" onClick={() => setCloneForm('login')} className="font-semibold text-brand-accent hover:underline">{t('loginPage.loginButton')}</button></p>
                </form>
            )}
            {cloneForm === 'verify' && (
                <form onSubmit={handleVerifyCode} className="space-y-4">
                    <p className="text-center text-gray-700 dark:text-gray-300">{t('loginPage.verificationMessage', { message: verificationMessage })}</p>
                    <input type="text" placeholder={t('loginPage.verificationCodePlaceholder')} value={code} onChange={e => setCode(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent"/>
                    <button type="submit" disabled={isLoading} className="w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50">{isLoading ? t('common.loading') : t('loginPage.verifyAndLoginButton')}</button>
                </form>
            )}
            {cloneForm === 'forgotPassword' && (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                    <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-200">{t('loginPage.resetPasswordTitle')}</h3>
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">{t('loginPage.resetPasswordInstructions')}</p>
                    <input type="email" placeholder={t('loginPage.emailPlaceholder')} value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent"/>
                    {forgotPasswordMessage && <p className="text-green-600 text-sm text-center bg-green-100 dark:bg-green-900/50 p-3 rounded-lg">{forgotPasswordMessage}</p>}
                    <button type="submit" disabled={isLoading} className="w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50">{isLoading ? t('common.loading') : t('loginPage.sendInstructionsButton')}</button>
                    <p className="text-center text-sm"><button type="button" onClick={() => setCloneForm('login')} className="font-semibold text-brand-accent hover:underline">{t('loginPage.backToLogin')}</button></p>
                </form>
            )}
        </>
    );
    
    const renderConsulteurForm = () => (
        <>
            {procheStep === 1 ? (
                <form onSubmit={handleProcheIdentity} className="space-y-4">
                    <input type="text" placeholder={t('loginPage.procheFullNamePlaceholder')} value={procheName} onChange={e => setProcheName(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent"/>
                    <input type="tel" placeholder={t('loginPage.prochePhonePlaceholder')} value={phone} onChange={e => setPhone(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent"/>
                    <button type="submit" disabled={isLoading} className="w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50">{isLoading ? t('common.loading') : t('loginPage.continueButton')}</button>
                </form>
            ) : (
                <form onSubmit={handleProcheToken} className="space-y-4">
                    <p className="text-center text-gray-700 dark:text-gray-300">{t('loginPage.procheTokenPrompt')}</p>
                    <input type="text" placeholder={t('loginPage.procheTokenPlaceholder')} value={token} onChange={e => setToken(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent"/>
                    <button type="submit" disabled={isLoading} className="w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50">{isLoading ? t('common.loading') : t('loginPage.procheAccessButton')}</button>
                </form>
            )}
        </>
    );
    
    const renderAdminForm = () => (
        <form onSubmit={handleAdminLogin} className="space-y-4">
            <input type="email" placeholder={t('loginPage.adminEmailPlaceholder')} value={adminEmail} onChange={e => setAdminEmail(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"/>
            <input type="password" placeholder={t('loginPage.adminPasswordPlaceholder')} value={adminPassword} onChange={e => setAdminPassword(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"/>
            <button type="submit" disabled={isLoading} className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">{isLoading ? t('common.loading') : t('loginPage.adminLoginButton')}</button>
        </form>
    );
    
    const TabButton: React.FC<{view: View, title: string, description: string, icon: React.ReactNode}> = ({view, title, description, icon}) => (
        <button
            onClick={() => handleViewChange(view)}
            className={`w-1/2 p-4 text-center transition-colors duration-300 ${activeView === view ? 'bg-white dark:bg-brand-secondary' : 'bg-gray-100/50 dark:bg-brand-secondary/50 hover:bg-gray-200/50 dark:hover:bg-brand-tertiary/50'}`}
        >
            <div className={`mx-auto mb-2 ${activeView === view ? 'text-brand-accent' : 'text-gray-400'}`}>{icon}</div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        </button>
    );

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden relative text-white">
            {/* Dynamic Background */}
            {backgroundImages.map((img, index) => (
                <div
                    key={index}
                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                    style={{ 
                        backgroundImage: `url(${img})`,
                        opacity: index === currentBgIndex ? 1 : 0,
                        zIndex: 1
                    }}
                />
            ))}
            <div className="absolute inset-0 bg-black/50 z-10"></div>
            
             <LanguageSwitcher className="absolute top-4 right-4 z-30" />
            
            <div className="relative z-20 flex flex-col items-center justify-center h-full w-full">
                <a 
                  href="/"
                  className="text-6xl font-bold text-white mb-8 drop-shadow-lg cursor-pointer transition-transform hover:scale-105"
                >
                    SoulBox
                </a>
                
                <div 
                    className={`
                        w-full max-w-md transition-all duration-700 ease-in-out
                        ${isLoginVisible ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
                    `}
                >
                     {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 w-full text-center" role="alert">{error}</p>}

                    <div className="bg-white dark:bg-brand-secondary rounded-xl shadow-2xl overflow-hidden">
                        {/* Tabs */}
                        {activeView !== 'admin' && (
                            <div className="flex">
                                <TabButton view="clone" title={t('loginPage.creatorSpace')} description={t('loginPage.creatorDesc')} icon={<UserCircleIcon className="w-8 h-8 mx-auto"/>} />
                                <TabButton view="consulteur" title={t('loginPage.procheSpace')} description={t('loginPage.procheDesc')} icon={<UsersIcon className="w-8 h-8 mx-auto"/>} />
                            </div>
                        )}
                        {activeView === 'admin' && (
                             <div className="p-4 text-center bg-gray-100/50 dark:bg-brand-secondary/50">
                                <ShieldCheckIcon className="w-8 h-8 mx-auto text-red-500"/>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{t('loginPage.adminAccess')}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{t('loginPage.adminDesc')}</p>
                            </div>
                        )}
                        
                        {/* Form Area */}
                        <div className="p-8">
                            {activeView === 'clone' && renderCloneForm()}
                            {activeView === 'consulteur' && renderConsulteurForm()}
                            {activeView === 'admin' && renderAdminForm()}
                        </div>
                    </div>
                    
                    {/* Discreet Admin Button */}
                    <div className="text-center mt-4">
                        <button 
                            onClick={() => handleViewChange('admin')} 
                            className="text-xs text-gray-300 hover:text-white hover:underline transition-colors"
                        >
                            {t('loginPage.adminAccess')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;