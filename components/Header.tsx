// components/Header.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useI18n } from '../contexts/I18nContext.tsx';
import { MenuIcon, UserCircleIcon } from './icons/Icon.tsx';

interface HeaderProps {
    onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const { user } = useAuth();
    const { t } = useI18n();
    
    return (
        <header className="header">
            {/* Mobile Menu Button */}
            <button onClick={onMenuClick} className="header-menu-btn">
                <MenuIcon className="h-6 w-6" />
            </button>

            {/* Title (optional, can be dynamic) */}
            <div className="hidden md:block">
                 <h1 className="header-title">{t('header.dashboardTitle')}</h1>
            </div>

            {/* User Profile Section */}
            <div className="header-user">
                <span className="header-user-name">{user?.name}</span>
                {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="User Avatar" className="header-user-avatar" />
                ) : (
                    <UserCircleIcon className="header-user-icon" />
                )}
            </div>
        </header>
    );
};