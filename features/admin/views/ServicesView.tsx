
import React from 'react';
import { Globe, Settings2 } from 'lucide-react';

export const ServicesView: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in py-16 text-center">
            <Globe size={64} className="mx-auto text-blue-200 mb-6" />
            <h3 className="text-3xl font-black text-slate-900 mb-2">إدارة الخدمات الديناميكية</h3>
            <p className="text-slate-500 font-bold max-w-md mx-auto">
                هذه الواجهة قيد التطوير. قريباً ستتمكن من إضافة، تعديل، أو إخفاء الخدمات التي تظهر في الصفحة الرئيسية للمستخدمين مباشرة من هنا بدون الحاجة لتعديل الكود.
            </p>
            <div className="mt-12 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm max-w-xl mx-auto flex items-center justify-center gap-4 text-slate-400">
                <Settings2 className="animate-spin-slow" size={24} />
                <span className="font-black text-sm uppercase tracking-widest">تحت الصيانة المعمارية</span>
            </div>
        </div>
    );
};