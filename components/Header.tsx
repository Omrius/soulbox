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
        <header className="flex items-center justify-between p-4 bg-white dark:bg-brand-secondary border-b dark:border-brand-tertiary shadow-sm">
            {/* Mobile Menu Button */}
            <button onClick={onMenuClick} className="text-gray-500 dark:text-gray-300 md:hidden">
                <MenuIcon className="h-6 w-6" />
            </button>

            {/* Title (optional, can be dynamic) */}
            <div className="hidden md:block">
                 <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{t('header.dashboardTitle')}</h1>
            </div>

            {/* User Profile Section */}
            <div className="flex items-center">
                <span className="text-gray-800 dark:text-white mr-3 font-medium hidden sm:block">{user?.name}</span>
                {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="User Avatar" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                )}
            </div>
        </header>
    );
};