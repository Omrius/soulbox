// components/AdminSideNav.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';
import { AdminDashboardView } from '../types';
import {
    HomeIcon,
    UserGroupIcon,
    ShieldCheckIcon,
    BillingIcon,
    SettingsIcon,
    LogoutIcon,
    UserCircleIcon
} from './icons/Icon';

interface AdminSideNavProps {
    currentView: AdminDashboardView;
    setCurrentView: (view: AdminDashboardView) => void;
    isMobileNavOpen: boolean;
    setMobileNavOpen: (isOpen: boolean) => void;
}

const NavLink: React.FC<{
    icon: React.ReactNode;
    label: string;
    view: AdminDashboardView;
    currentView: AdminDashboardView;
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

const AdminSideNav: React.FC<AdminSideNavProps> = ({ currentView, setCurrentView, isMobileNavOpen, setMobileNavOpen }) => {
    const { user, logout } = useAuth();
    const { t } = useI18n();

    const handleLinkClick = (view: AdminDashboardView) => {
        setCurrentView(view);
        setMobileNavOpen(false); // Close nav on mobile after a selection
    };

    const navItems = [
        { view: AdminDashboardView.OVERVIEW, label: t('admin.navOverview'), icon: <HomeIcon /> },
        { view: AdminDashboardView.CLIENTS, label: t('admin.navClients'), icon: <UserGroupIcon /> },
        { view: AdminDashboardView.VERIFICATIONS, label: t('admin.navVerifications'), icon: <ShieldCheckIcon /> },
        { view: AdminDashboardView.PAYMENTS, label: t('admin.navPayments'), icon: <BillingIcon /> },
        { view: AdminDashboardView.SETTINGS, label: t('common.settings'), icon: <SettingsIcon /> },
    ];

    const navClasses = `sidenav ${isMobileNavOpen ? 'open' : ''}`;

    return (
        <nav className={navClasses}>
            <div className="sidenav-header">
                <h1 className="sidenav-title">SoulBox <span style={{color: 'var(--color-danger)'}}>{t('admin.title')}</span></h1>
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
                        <p className="sidenav-user-email">{t('loginPage.adminAccess')}</p>
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

export default AdminSideNav;