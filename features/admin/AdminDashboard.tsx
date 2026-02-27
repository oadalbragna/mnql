import React, { useState } from 'react';
import { AdminLayout } from './components/AdminLayout';
import { UserProfile } from '../../types';
import { OverviewDashboard } from './views/OverviewDashboard';
import { UsersManagement } from './views/UsersManagement';
import { ProductsManagement } from './views/ProductsManagement';
import { TransactionsManagement } from './views/TransactionsManagement';
import { AIConsultationsManagement } from './views/AIConsultationsManagement';

interface AdminDashboardProps {
    user: UserProfile | null;
    onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onBack }) => {
    const [activeTab, setActiveTab] = useState('dashboard');

    if (!user || user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 text-center p-6">
                <div>
                    <h2 className="text-3xl font-black text-red-500 mb-2">Access Denied</h2>
                    <p className="text-slate-500 font-bold mb-6">هذه الصفحة مخصصة للإدارة العليا فقط.</p>
                    <button onClick={onBack} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black">العودة للرئيسية</button>
                </div>
            </div>
        );
    }

    const renderView = () => {
        switch (activeTab) {
            case 'dashboard': return <OverviewDashboard />;
            case 'users': return <UsersManagement />;
            case 'traders': return <UsersManagement />; // In a full prod app, this would filter users by 'trader'
            case 'products': return <ProductsManagement />;
            case 'transactions': return <TransactionsManagement />;
            case 'ai_consultations': return <AIConsultationsManagement />;
            case 'reports': return <div className="p-12 text-center bg-white rounded-[40px] border border-slate-100 font-black text-slate-400">جاري بناء محرك التقارير المتقدم...</div>;
            case 'services': return <div className="p-12 text-center bg-white rounded-[40px] border border-slate-100 font-black text-slate-400">جاري بناء نظام الإدارة الديناميكي للخدمات...</div>;
            default: return <OverviewDashboard />;
        }
    };

    return (
        <AdminLayout user={user} activeTab={activeTab} onTabChange={setActiveTab} onExit={onBack}>
            {renderView()}
        </AdminLayout>
    );
};

export default AdminDashboard;
