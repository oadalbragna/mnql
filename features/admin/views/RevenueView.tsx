
import React from 'react';
import { DollarSign, ArrowUpRight, TrendingUp } from 'lucide-react';

export const RevenueView: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in text-center py-16 bg-white rounded-[40px] border border-slate-100 shadow-sm">
            <DollarSign size={64} className="mx-auto text-emerald-500 mb-6" />
            <h3 className="text-3xl font-black text-slate-900 mb-2">إحصائيات الأرباح والعمولات</h3>
            <p className="text-slate-400 font-bold max-w-sm mx-auto">يعرض هذا القسم إجمالي عمولات المنصة (10%) المقتطعة تلقائياً من عمليات البيع المكتملة.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16 px-6">
                <div className="p-8 bg-slate-900 rounded-[32px] border border-slate-800 text-white shadow-xl relative overflow-hidden group">
                    <p className="text-[10px] font-black text-emerald-400 uppercase mb-2">إجمالي العمولات المتراكمة</p>
                    <p className="text-4xl font-black">128,450 <span className="text-sm opacity-50">ج.س</span></p>
                    <TrendingUp className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 group-hover:scale-110 transition-transform" />
                </div>
                <div className="p-8 bg-emerald-50 rounded-[32px] border border-emerald-100 text-emerald-900">
                    <p className="text-[10px] font-black text-emerald-600 uppercase mb-2">عمليات بيع ناجحة</p>
                    <p className="text-4xl font-black">1,240 <span className="text-sm opacity-50">عملية</span></p>
                </div>
                <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 text-slate-900">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">أرباح اليوم (تقديري)</p>
                    <p className="text-4xl font-black">4,200 <span className="text-sm opacity-50">ج.س</span></p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto mt-12 px-6 text-right">
                <h4 className="text-lg font-black text-slate-900 mb-4 border-b pb-4">آخر عمليات الاقتطاع (Commissions)</h4>
                <div className="space-y-3">
                    {[1,2,3].map(i => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><ArrowUpRight size={18}/></div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">عمولة مبيعات (طلب #{1000 + i})</p>
                                    <p className="text-[10px] text-slate-400 font-black">منذ {i * 2} ساعة</p>
                                </div>
                            </div>
                            <span className="font-black text-emerald-600">+{(150 * i).toLocaleString()} ج.س</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};