// components/SideNav.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';
import { DashboardView } from '../types';
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
} from './icons/Icon';

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
    return (
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                onClick();
            }}
            className={`sidenav-link ${isActive ? 'active' : ''}`}
        >
            {icon}
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
        { view: DashboardView.DASHBOARD, label: t('nav.dashboard'), icon: <HomeIcon /> },
        { view: DashboardView.VAULT, label: t('nav.vault'), icon: <VaultIcon /> },
        { view: DashboardView.CHANNELS, label: t('nav.channels'), icon: <ShareIcon /> },
        { view: DashboardView.VOICE, label: t('nav.voiceClone'), icon: <VoiceWaveIcon /> },
        { view: DashboardView.TRAINING_CENTER, label: t('nav.trainingCenter'), icon: <BrainIcon /> },
        { view: DashboardView.BILLING, label: t('nav.billing'), icon: <BillingIcon /> },
        { view: DashboardView.SETTINGS, label: t('nav.settings'), icon: <SettingsIcon /> },
    ];

    const navClasses = `sidenav ${isMobileNavOpen ? 'open' : ''}`;

    return (
        <nav className={navClasses}>
            <div className="sidenav-header">
                <h1 className="sidenav-title">SoulBox</h1>
            </div>
            <div className="sidenav-links">
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
            <div className="sidenav-footer">
                <div className="sidenav-user">
                    {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt="User Avatar" className="sidenav-user-avatar" />
                    ) : (
                        <UserCircleIcon className="sidenav-user-icon"/>
                    )}
                    <div>
                        <p className="sidenav-user-name">{user?.name}</p>
                        <p className="sidenav-user-email">{user?.role === 'CLONE' ? user.email : ''}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="btn btn-danger sidenav-logout-btn"
                >
                    <LogoutIcon />
                    {t('common.logout')}
                </button>
            </div>
        </nav>
    );
};

export default SideNav;