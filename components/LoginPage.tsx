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
                <form onSubmit={handleCloneLogin}>
                    <input type="email" placeholder={t('loginPage.emailPlaceholder')} value={email} onChange={e => setEmail(e.target.value)} required className="form-input"/>
                    <input type="password" placeholder={t('loginPage.passwordPlaceholder')} value={password} onChange={e => setPassword(e.target.value)} required className="form-input"/>
                    <button type="submit" disabled={isLoading} className="btn btn-primary w-full">{isLoading ? t('common.loading') : t('loginPage.loginButton')}</button>
                    <div style={{textAlign: 'center', fontSize: '0.875rem'}}>
                        <button type="button" onClick={() => { setCloneForm('forgotPassword'); setError(''); setForgotPasswordMessage(''); }} style={{fontWeight: 600, color: 'var(--brand-accent)', background: 'none', border: 'none', cursor: 'pointer'}}>{t('loginPage.forgotPassword')}</button>
                    </div>
                    <p style={{textAlign: 'center', fontSize: '0.875rem'}}>{t('loginPage.noAccount')} <button type="button" onClick={() => setCloneForm('register')} style={{fontWeight: 600, color: 'var(--brand-accent)', background: 'none', border: 'none', cursor: 'pointer'}}>{t('loginPage.register')}</button></p>
                    <div className="form-divider"><div className="form-divider-line"></div><div className="form-divider-text"><span>{t('common.or')}</span></div></div>
                    <button type="button" onClick={signInWithGoogle} disabled={isLoading} className="login-google-btn"><GoogleIcon/>{t('loginPage.googleLogin')}</button>
                </form>
            )}
            {cloneForm === 'register' && (
                <form onSubmit={handleRegister}>
                    <input type="text" placeholder={t('loginPage.fullNamePlaceholder')} value={name} onChange={e => setName(e.target.value)} required className="form-input"/>
                    <input type="email" placeholder={t('loginPage.emailPlaceholder')} value={email} onChange={e => setEmail(e.target.value)} required className="form-input"/>
                    <input type="password" placeholder={t('loginPage.passwordPlaceholder')} value={password} onChange={e => setPassword(e.target.value)} required className="form-input"/>
                    <button type="submit" disabled={isLoading} className="btn btn-primary w-full">{isLoading ? t('common.loading') : t('loginPage.createAccountButton')}</button>
                    <p style={{textAlign: 'center', fontSize: '0.875rem'}}>{t('loginPage.haveAccount')} <button type="button" onClick={() => setCloneForm('login')} style={{fontWeight: 600, color: 'var(--brand-accent)', background: 'none', border: 'none', cursor: 'pointer'}}>{t('loginPage.loginButton')}</button></p>
                </form>
            )}
            {cloneForm === 'verify' && (
                <form onSubmit={handleVerifyCode}>
                    <p style={{textAlign: 'center'}}>{t('loginPage.verificationMessage', { message: verificationMessage })}</p>
                    <input type="text" placeholder={t('loginPage.verificationCodePlaceholder')} value={code} onChange={e => setCode(e.target.value)} required className="form-input"/>
                    <button type="submit" disabled={isLoading} className="btn btn-primary w-full">{isLoading ? t('common.loading') : t('loginPage.verifyAndLoginButton')}</button>
                </form>
            )}
            {cloneForm === 'forgotPassword' && (
                <form onSubmit={handleForgotPassword}>
                    <h3 style={{fontSize: '1.125rem', fontWeight: 600, textAlign: 'center'}}>{t('loginPage.resetPasswordTitle')}</h3>
                    <p style={{textAlign: 'center', fontSize: '0.875rem'}}>{t('loginPage.resetPasswordInstructions')}</p>
                    <input type="email" placeholder={t('loginPage.emailPlaceholder')} value={email} onChange={e => setEmail(e.target.value)} required className="form-input"/>
                    {forgotPasswordMessage && <p style={{color: 'var(--color-success-text)', fontSize: '0.875rem', textAlign: 'center', backgroundColor: 'var(--color-success-bg)', padding: '0.75rem', borderRadius: 'var(--rounded-lg)'}}>{forgotPasswordMessage}</p>}
                    <button type="submit" disabled={isLoading} className="btn btn-primary w-full">{isLoading ? t('common.loading') : t('loginPage.sendInstructionsButton')}</button>
                    <p style={{textAlign: 'center', fontSize: '0.875rem'}}><button type="button" onClick={() => setCloneForm('login')} style={{fontWeight: 600, color: 'var(--brand-accent)', background: 'none', border: 'none', cursor: 'pointer'}}>{t('loginPage.backToLogin')}</button></p>
                </form>
            )}
        </>
    );
    
    const renderConsulteurForm = () => (
        <>
            {procheStep === 1 ? (
                <form onSubmit={handleProcheIdentity}>
                    <input type="text" placeholder={t('loginPage.procheFullNamePlaceholder')} value={procheName} onChange={e => setProcheName(e.target.value)} required className="form-input"/>
                    <input type="tel" placeholder={t('loginPage.prochePhonePlaceholder')} value={phone} onChange={e => setPhone(e.target.value)} required className="form-input"/>
                    <button type="submit" disabled={isLoading} className="btn btn-primary w-full">{isLoading ? t('common.loading') : t('loginPage.continueButton')}</button>
                </form>
            ) : (
                <form onSubmit={handleProcheToken}>
                    <p style={{textAlign: 'center'}}>{t('loginPage.procheTokenPrompt')}</p>
                    <input type="text" placeholder={t('loginPage.procheTokenPlaceholder')} value={token} onChange={e => setToken(e.target.value)} required className="form-input"/>
                    <button type="submit" disabled={isLoading} className="btn btn-primary w-full">{isLoading ? t('common.loading') : t('loginPage.procheAccessButton')}</button>
                </form>
            )}
        </>
    );
    
    const renderAdminForm = () => (
        <form onSubmit={handleAdminLogin}>
            <input type="email" placeholder={t('loginPage.adminEmailPlaceholder')} value={adminEmail} onChange={e => setAdminEmail(e.target.value)} required className="form-input"/>
            <input type="password" placeholder={t('loginPage.adminPasswordPlaceholder')} value={adminPassword} onChange={e => setAdminPassword(e.target.value)} required className="form-input"/>
            <button type="submit" disabled={isLoading} className="btn btn-danger w-full">{isLoading ? t('common.loading') : t('loginPage.adminLoginButton')}</button>
        </form>
    );
    
    const TabButton: React.FC<{view: View, title: string, description: string, icon: React.ReactNode}> = ({view, title, description, icon}) => (
        <button
            onClick={() => handleViewChange(view)}
            className={`login-tab ${activeView === view ? 'active' : ''}`}
        >
            {icon}
            <h3 className="login-tab-title">{title}</h3>
            <p className="login-tab-desc">{description}</p>
        </button>
    );

    return (
        <div className="login-page">
            {backgroundImages.map((img, index) => (
                <div
                    key={index}
                    className="login-bg"
                    style={{ 
                        backgroundImage: `url(${img})`,
                        opacity: index === currentBgIndex ? 1 : 0,
                    }}
                />
            ))}
            <div className="login-overlay"></div>
            
             <LanguageSwitcher style={{position: 'absolute', top: '1rem', right: '1rem', zIndex: 30}} />
            
            <div className="login-content">
                <a 
                  href="/"
                  className="login-title"
                >
                    SoulBox
                </a>
                
                <div 
                    className={`login-box-wrapper ${isLoginVisible ? 'visible' : 'hidden'}`}
                >
                     {error && <p className="error-box" style={{marginBottom: '1rem'}} role="alert">{error}</p>}

                    <div className="login-box">
                        {activeView !== 'admin' && (
                            <div className="login-tabs">
                                <TabButton view="clone" title={t('loginPage.creatorSpace')} description={t('loginPage.creatorDesc')} icon={<UserCircleIcon />} />
                                <TabButton view="consulteur" title={t('loginPage.procheSpace')} description={t('loginPage.procheDesc')} icon={<UsersIcon />} />
                            </div>
                        )}
                        {activeView === 'admin' && (
                             <div className="login-tab active" style={{width: '100%'}}>
                                <ShieldCheckIcon style={{color: 'var(--color-danger)'}}/>
                                <h3 className="login-tab-title">{t('loginPage.adminAccess')}</h3>
                                <p className="login-tab-desc">{t('loginPage.adminDesc')}</p>
                            </div>
                        )}
                        
                        <div className="login-form-area">
                            {(activeView === 'clone' && renderCloneForm()) ||
                             (activeView === 'consulteur' && renderConsulteurForm()) ||
                             (activeView === 'admin' && renderAdminForm())}
                        </div>
                    </div>
                    
                    <div className="login-admin-footer">
                        <button onClick={() => handleViewChange('admin')}>
                            {t('loginPage.adminAccess')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;