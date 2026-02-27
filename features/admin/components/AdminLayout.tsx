import React from 'react';
import { 
    Shield, Users, DollarSign, Globe, LogOut, LayoutDashboard, 
    Store, Package, Activity, Sprout, BarChart, Bell
} from 'lucide-react';
import { UserProfile } from '../../../types';

interface AdminLayoutProps {
    user: UserProfile | null;
    activeTab: string;
    onTabChange: (tab: string) => void;
    onExit: () => void;
    children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ user, activeTab, onTabChange, onExit, children }) => {
    const navItems = [
        { id: 'dashboard', label: 'الرئيسية', icon: <LayoutDashboard size={20} /> },
        { id: 'users', label: 'إدارة الأعضاء', icon: <Users size={20} /> },
        { id: 'traders', label: 'إدارة التجار', icon: <Store size={20} /> },
        { id: 'products', label: 'إدارة المنتجات', icon: <Package size={20} /> },
        { id: 'transactions', label: 'العمليات المالية', icon: <DollarSign size={20} /> },
        { id: 'ai_consultations', label: 'استشارات الذكاء', icon: <Sprout size={20} /> },
        { id: 'reports', label: 'التقارير والتحليلات', icon: <BarChart size={20} /> },
        { id: 'services', label: 'إعدادات المنصة', icon: <Globe size={20} /> }
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex dir-rtl">
            {/* Sidebar */}
            <aside className="w-72 bg-slate-900 text-white flex flex-col fixed top-0 right-0 h-full z-50">
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-xl">
                            <Shield size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black tracking-tighter">سوق المناقل</h2>
                            <p className="text-[10px] text-primary-light font-bold uppercase tracking-widest">Global Admin</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto no-scrollbar">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-4">قائمة التحكم</p>
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-sm font-black ${
                                activeTab === item.id 
                                ? 'bg-primary text-white shadow-lg' 
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            {item.icon} {item.label}
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-white/10">
                    <button onClick={onExit} className="w-full flex items-center justify-center gap-2 py-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-2xl font-black text-sm">
                        الخروج <LogOut size={18} />
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 mr-72 flex flex-col min-h-screen">
                {/* Topbar */}
                <header className="bg-white h-20 px-8 flex items-center justify-between border-b border-slate-100 sticky top-0 z-40">
                    <h1 className="text-2xl font-black text-slate-900">
                        {navItems.find(i => i.id === activeTab)?.label}
                    </h1>
                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-slate-400 hover:text-primary transition-colors">
                            <Bell size={24} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
                            <div className="text-left">
                                <p className="text-sm font-black text-slate-900">{user?.fullName}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Admin</p>
                            </div>
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-500">{user?.fullName[0]}</div>
                        </div>
                    </div>
                </header>
                
                {/* Page Content */}
                <div className="flex-1 p-8 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};
