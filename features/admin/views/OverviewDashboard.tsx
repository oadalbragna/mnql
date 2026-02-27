import React, { useState, useEffect } from 'react';
import { Users, Store, Package, DollarSign, RefreshCw } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { UserProfile, Product, Order } from '../../../types';
import { db } from '../../../firebase';
import { ref, get } from 'firebase/database';
import { AuthService } from '../../../services/authService';
import { FirebaseService } from '../../../services/firebaseService';

export const OverviewDashboard: React.FC = () => {
    const [stats, setStats] = useState({ users: 0, traders: 0, products: 0, revenue: 0 });
    const [isLoading, setIsLoading] = useState(false);

    const loadStats = async () => {
        setIsLoading(true);
        try {
            const [usersList, productsList, transactions] = await Promise.all([
                AuthService.getAllUsers(),
                FirebaseService.getProductsOnce(),
                FirebaseService.getTransactionsOnce()
            ]);

            setStats({
                users: usersList.length,
                traders: usersList.filter(u => u.role === 'trader').length,
                products: productsList.length,
                revenue: transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0)
            });
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    // Mock data for charts
    const revenueData = [
        { name: 'يناير', revenue: 4000 },
        { name: 'فبراير', revenue: 3000 },
        { name: 'مارس', revenue: 2000 },
        { name: 'أبريل', revenue: 2780 },
        { name: 'مايو', revenue: 1890 },
        { name: 'يونيو', revenue: 2390 },
        { name: 'يوليو', revenue: 3490 },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-end">
                <button 
                    onClick={loadStats} 
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black text-slate-500 hover:text-primary transition-all"
                >
                    <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> تحديث البيانات
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="إجمالي الأعضاء" value={stats.users} icon={<Users size={24} />} colorClass="text-blue-500 bg-blue-500" trend={{value: 12, isPositive: true}} />
                <StatCard title="التجار المعتمدين" value={stats.traders} icon={<Store size={24} />} colorClass="text-purple-500 bg-purple-500" trend={{value: 5, isPositive: true}} />
                <StatCard title="المنتجات النشطة" value={stats.products} icon={<Package size={24} />} colorClass="text-orange-500 bg-orange-500" trend={{value: 2, isPositive: false}} />
                <StatCard title="حجم التداول المالي" value={`${stats.revenue.toLocaleString()} ج.س`} icon={<DollarSign size={24} />} colorClass="text-emerald-500 bg-emerald-500" trend={{value: 18, isPositive: true}} />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-black text-slate-900 mb-6">النمو المالي (آخر 6 أشهر)</h3>
                    <div className="h-[300px] w-full" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0F766E" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#0F766E" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                                <YAxis tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
                                <Area type="monotone" dataKey="revenue" stroke="#0F766E" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
                    <h3 className="text-lg font-black mb-6">حالة السيرفر</h3>
                    <div className="space-y-6 relative z-10">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400 font-bold uppercase">قاعدة البيانات</span>
                            <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">متصلة</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400 font-bold uppercase">زمن الاستجابة</span>
                            <span className="text-[10px] font-black text-emerald-400">42ms</span>
                        </div>
                        <div className="pt-6 border-t border-white/5">
                            <p className="text-[10px] text-slate-500 font-bold mb-2 uppercase">استهلاك الموارد</p>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="w-[30%] h-full bg-primary"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
