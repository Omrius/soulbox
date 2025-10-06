// components/AdminDashboardLayout.tsx
import React, { useState } from 'react';
import { AdminDashboardView } from '../types.ts';
import AdminSideNav from './AdminSideNav.tsx';
import { Header } from './Header.tsx';
import AdminDashboard from './AdminDashboard.tsx';
import AdminClientManagement from './AdminClientManagement.tsx';
import AdminVerificationQueue from './AdminVerificationQueue.tsx';
import AdminPayments from './AdminPayments.tsx';
import AdminSettings from './AdminSettings.tsx';

const NavOverlay: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={onClick}
        aria-hidden="true"
    ></div>
);


const AdminDashboardLayout: React.FC = () => {
    const [currentView, setCurrentView] = useState<AdminDashboardView>(AdminDashboardView.OVERVIEW);
    const [isMobileNavOpen, setMobileNavOpen] = useState(false);
    
    const renderView = () => {
        switch (currentView) {
            case AdminDashboardView.OVERVIEW:
                return <AdminDashboard />;
            case AdminDashboardView.CLIENTS:
                return <AdminClientManagement />;
            case AdminDashboardView.VERIFICATIONS:
                return <AdminVerificationQueue />;
            case AdminDashboardView.PAYMENTS:
                return <AdminPayments />;
            case AdminDashboardView.SETTINGS:
                return <AdminSettings />;
            default:
                return <AdminDashboard />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-brand-dark">
            {isMobileNavOpen && <NavOverlay onClick={() => setMobileNavOpen(false)} />}
            <AdminSideNav 
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

export default AdminDashboardLayout;
