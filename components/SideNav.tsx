// components/SideNav.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useI18n } from '../contexts/I18nContext.tsx';
import { DashboardView } from '../types.ts';
import {
    HomeIcon,
    VaultIcon,
    ShareIcon,
    VoiceWaveIcon,
    BrainIcon,
    BillingIcon,
    SettingsIcon,
    LogoutIcon,
    UserCircleIcon
} from './icons/Icon.tsx';

interface SideNavProps {
    currentView: DashboardView;
    setCurrentView: (view: DashboardView) => void;
    isMobileNavOpen: boolean;
    setMobileNavOpen: (isOpen: boolean) => void;
}

const NavLink: React.FC<{
    icon: React.ReactNode;
    label: string;
    view: DashboardView;
    currentView: DashboardView;
    onClick: () => void;
}> = ({ icon, label, view, currentView, onClick }) => {
    const isActive = currentView === view;
    const baseClasses = "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200";
    const activeClasses = "bg-brand-accent text-white";
    const inactiveClasses = "text-gray-400 hover:bg-brand-tertiary hover:text-white";
    return (
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                onClick();
            }}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        >
            <span className="mr-3">{icon}</span>
            {label}
        </a>
    );
};

const SideNav: React.FC<SideNavProps> = ({ currentView, setCurrentView, isMobileNavOpen, setMobileNavOpen }) => {
    const { user, logout } = useAuth();
    const { t } = useI18n();

    const handleLinkClick = (view: DashboardView) => {
        setCurrentView(view);
        setMobileNavOpen(false); // Close nav on mobile after a selection
    };

    const navItems = [
        { view: DashboardView.DASHBOARD, label: t('nav.dashboard'), icon: <HomeIcon className="w-6 h-6" /> },
        { view: DashboardView.VAULT, label: t('nav.vault'), icon: <VaultIcon className="w-6 h-6" /> },
        { view: DashboardView.CHANNELS, label: t('nav.channels'), icon: <ShareIcon className="w-6 h-6" /> },
        { view: DashboardView.VOICE, label: t('nav.voiceClone'), icon: <VoiceWaveIcon className="w-6 h-6" /> },
        { view: DashboardView.TRAINING_CENTER, label: t('nav.trainingCenter'), icon: <BrainIcon className="w-6 h-6" /> },
        { view: DashboardView.BILLING, label: t('nav.billing'), icon: <BillingIcon className="w-6 h-6" /> },
        { view: DashboardView.SETTINGS, label: t('nav.settings'), icon: <SettingsIcon className="w-6 h-6" /> },
    ];

    const navClasses = `
        fixed inset-y-0 left-0 z-50 w-64 bg-brand-secondary text-white transform
        transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}
    `;

    return (
        <nav className={navClasses}>
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-center h-20 border-b border-brand-tertiary">
                    <h1 className="text-2xl font-bold text-white">SoulBox</h1>
                </div>
                <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map(item => (
                        <NavLink
                            key={item.view}
                            icon={item.icon}
                            label={item.label}
                            view={item.view}
                            currentView={currentView}
                            onClick={() => handleLinkClick(item.view)}
                        />
                    ))}
                </div>
                <div className="p-4 border-t border-brand-tertiary">
                    <div className="flex items-center mb-4">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt="User Avatar" className="w-10 h-10 mr-3 rounded-full object-cover" />
                        ) : (
                            <UserCircleIcon className="w-10 h-10 mr-3 text-gray-400"/>
                        )}
                        <div>
                            <p className="font-semibold text-white">{user?.name}</p>
                            <p className="text-xs text-gray-400">{user?.role === 'CLONE' ? user.email : ''}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 transition-colors duration-200"
                    >
                        <LogoutIcon className="w-5 h-5 mr-2" />
                        {t('common.logout')}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default SideNav;