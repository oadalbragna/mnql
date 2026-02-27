
import React, { useState, useEffect } from 'react';
import { Users, ShoppingBag, DollarSign, Activity, TrendingUp, Package } from 'lucide-react';
import { UserProfile, Product, Order } from '../../../types';
import { db } from '../../../firebase';
import { ref, onValue } from 'firebase/database';

export const OverviewView: React.FC<{ users: UserProfile[] }> = ({ users }) => {
    const [productsCount, setProductsCount] = useState(0);
    const [ordersCount, setOrdersCount] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);

    useEffect(() => {
        const prodRef = ref(db, 'Mangal-Shop/products');
        onValue(prodRef, (snap) => setProductsCount(snap.exists() ? Object.keys(snap.val()).length : 0));

        const orderRef = ref(db, 'Mangal-Shop/orders');
        onValue(orderRef, (snap) => {
            if (snap.exists()) {
                const orders = Object.values(snap.val()) as Order[];
                setOrdersCount(orders.length);
                const revenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.totalPrice, 0);
                setTotalRevenue(revenue);
            }
        });
    }, []);

    const stats = [
        { label: 'إجمالي الأعضاء', value: users.length, icon: <Users size={24} />, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
        { label: 'المنتجات المعروضة', value: productsCount, icon: <Package size={24} />, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
        { label: 'إجمالي الطلبات', value: ordersCount, icon: <ShoppingBag size={24} />, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
        { label: 'حجم التداول العام', value: `${totalRevenue.toLocaleString()} ج.س`, icon: <DollarSign size={24} />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' }
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className={`p-4 rounded-2xl ${s.bg} ${s.color} ${s.border} border`}>
                                {s.icon}
                            </div>
                            <span className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                                +12% <TrendingUp size={10} />
                            </span>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black text-slate-900 mb-1">{s.value}</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                        </div>
                        <Activity className={`absolute -left-6 -bottom-6 w-32 h-32 opacity-5 ${s.color} group-hover:scale-110 transition-transform`} />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center">
                     <BarChart3 size={64} className="text-slate-100 mb-4" />
                     <h4 className="text-xl font-black text-slate-400">الرسم البياني للمبيعات</h4>
                     <p className="text-sm font-bold text-slate-300 mt-2">سيتم تفعيل الرسوم البيانية التفاعلية في التحديث القادم.</p>
                </div>
                <div className="bg-slate-900 rounded-[40px] p-8 border border-slate-800 shadow-xl text-white">
                    <h4 className="text-lg font-black mb-6 flex items-center gap-2"><Activity size={20} className="text-primary"/> نشاط النظام</h4>
                    <div className="space-y-4">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="flex gap-4 items-start pb-4 border-b border-white/5 last:border-0">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                                <div>
                                    <p className="text-sm font-bold text-slate-200">مستخدم جديد قام بالتسجيل كتاجر</p>
                                    <p className="text-[10px] text-slate-500 font-black uppercase mt-1">منذ {i * 15} دقيقة</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};