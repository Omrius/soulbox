

import React, { useState, useEffect } from 'react';
// Fix: Add .tsx extension to imports
import SideNav from './SideNav.tsx';
import { Header } from './Header.tsx';
import { CloneUser, DashboardView } from '../types.ts';
import Dashboard from './Dashboard.tsx';
import DigitalVault from './DigitalVault.tsx';
import Channels from './Channels.tsx';
import VoiceClone from './VoiceClone.tsx';
import TrainingCenter from './TrainingCenter.tsx';
import PricingTiers from './PricingTiers.tsx';
import Settings from './Settings.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useI18n } from '../contexts/I18nContext.tsx';
import { GoogleIcon } from './icons/Icon.tsx';

const NavOverlay: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <div 
        className="nav-overlay"
        onClick={onClick}
        aria-hidden="true"
    ></div>
);

const DriveConnectModal: React.FC<{ onClose: () => void; onConnect: () => Promise<void> }> = ({ onClose, onConnect }) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const { t } = useI18n();

    const handleConnect = async () => {
        setIsConnecting(true);
        await onConnect();
        // The modal will be closed by the parent component's effect
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{textAlign: 'center'}}>
                <h2 className="modal-title">{t('driveModal.title')}</h2>
                <p style={{marginBottom: '1.5rem'}}>
                    {t('driveModal.description')}
                </p>
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    <button
                        onClick={handleConnect}
                        disabled={isConnecting}
                        className="btn btn-info w-full"
                    >
                        <GoogleIcon className="w-6 h-6 mr-3" />
                        {isConnecting ? t('driveModal.connectingButton') : t('driveModal.connectButton')}
                    </button>
                    <button onClick={onClose} style={{background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.875rem'}}>
                        {t('driveModal.remindLater')}
                    </button>
                </div>
            </div>
        </div>
    );
};


const DashboardLayout: React.FC = () => {
    const [currentView, setCurrentView] = useState<DashboardView>(DashboardView.DASHBOARD);
    const [isMobileNavOpen, setMobileNavOpen] = useState(false);
    const [showDriveModal, setShowDriveModal] = useState(false);
    const { user, connectGoogleDrive } = useAuth();
    const cloneUser = user as CloneUser;

    useEffect(() => {
        // Show the modal only once if the user is not connected
        if (cloneUser && !cloneUser.googleDriveConnected) {
             // Use a timeout to avoid showing the modal immediately on page load
             const timer = setTimeout(() => {
                setShowDriveModal(true);
             }, 1500);
             return () => clearTimeout(timer);
        } else {
            setShowDriveModal(false);
        }
    }, [cloneUser]);

    const handleConnectDrive = async () => {
        await connectGoogleDrive();
        setShowDriveModal(false); // Close modal on success
    };


    const renderView = () => {
        switch (currentView) {
            case DashboardView.DASHBOARD:
                return <Dashboard />;
            case DashboardView.VAULT:
                return <DigitalVault />;
            case DashboardView.CHANNELS:
                return <Channels />;
            case DashboardView.VOICE:
                return <VoiceClone />;
            case DashboardView.TRAINING_CENTER:
                return <TrainingCenter setCurrentView={setCurrentView} />;
            case DashboardView.BILLING:
                return <PricingTiers />;
            case DashboardView.SETTINGS:
                return <Settings />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="dashboard-layout">
            {showDriveModal && <DriveConnectModal onClose={() => setShowDriveModal(false)} onConnect={handleConnectDrive} />}
            {isMobileNavOpen && <NavOverlay onClick={() => setMobileNavOpen(false)} />}
            <SideNav 
                currentView={currentView} 
                setCurrentView={setCurrentView} 
                isMobileNavOpen={isMobileNavOpen}
                setMobileNavOpen={setMobileNavOpen}
            />
            <div className="dashboard-content-wrapper">
                <Header onMenuClick={() => setMobileNavOpen(true)} />
                <main className="dashboard-main">
                    <div className="dashboard-main-content">
                        {renderView()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;