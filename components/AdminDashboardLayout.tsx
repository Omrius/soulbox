// components/AdminDashboardLayout.tsx
import React, { useState } from 'react';
import { AdminDashboardView } from '../types';
import AdminSideNav from './AdminSideNav';
import { Header } from './Header';
import AdminDashboard from './AdminDashboard';
import AdminClientManagement from './AdminClientManagement';
import AdminVerificationQueue from './AdminVerificationQueue';
import AdminPayments from './AdminPayments';
import AdminSettings from './AdminSettings';

const NavOverlay: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <div 
        className="nav-overlay"
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
        <div className="dashboard-layout">
            {isMobileNavOpen && <NavOverlay onClick={() => setMobileNavOpen(false)} />}
            <AdminSideNav 
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

export default AdminDashboardLayout;