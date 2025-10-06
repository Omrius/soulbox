
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
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-brand-secondary p-8 rounded-lg max-w-md w-full text-center shadow-2xl">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t('driveModal.title')}</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                    {t('driveModal.description')}
                </p>
                <div className="space-y-4">
                    <button
                        onClick={handleConnect}
                        disabled={isConnecting}
                        className="w-full flex items-center justify-center bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                        <GoogleIcon className="w-6 h-6 mr-3" />
                        {isConnecting ? t('driveModal.connectingButton') : t('driveModal.connectButton')}
                    </button>
                    <button onClick={onClose} className="w-full text-sm text-gray-500 dark:text-gray-400 hover:underline">
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
        <div className="flex h-screen bg-gray-100 dark:bg-brand-dark">
            {showDriveModal && <DriveConnectModal onClose={() => setShowDriveModal(false)} onConnect={handleConnectDrive} />}
            {isMobileNavOpen && <NavOverlay onClick={() => setMobileNavOpen(false)} />}
            <SideNav 
                currentView={currentView} 
                setCurrentView={setCurrentView} 
                isMobileNavOpen={isMobileNavOpen}
                setMobileNavOpen={setMobileNavOpen}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onMenuClick={() => setMobileNavOpen(true)} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-brand-dark">
                    <div className="container mx-auto px-6 py-8">
                        {renderView()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
