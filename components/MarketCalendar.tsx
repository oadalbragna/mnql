
import React from 'react';
import { Calendar as CalendarIcon, MapPin, ShoppingBag, Clock, ChevronRight } from 'lucide-react';
import { MarketDay } from '../types';

const MARKET_DAYS: MarketDay[] = [
    { day: 'السبت', location: 'سوق المناقل الكبير', specialty: 'يوم السوق الرئيسي - كافة السلع' },
    { day: 'الأحد', location: 'سوق كريمة', specialty: 'المواشي والخضروات' },
    { day: 'الاثنين', location: 'سوق عبود', specialty: 'المحاصيل والزيوت' },
    { day: 'الثلاثاء', location: 'سوق المناقل الأصغر', specialty: 'الأقمشة والأواني المنزلية' },
    { day: 'الأربعاء', location: 'سوق شكابة', specialty: 'تجارة الجملة' },
];

const MarketCalendar: React.FC = () => {
    return (
        <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm overflow-hidden relative">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <CalendarIcon size={24} className="text-primary" />
                    تقويم أسواق المنطقة
                </h3>
                <span className="text-[10px] font-black text-primary animate-pulse">محدث اليوم</span>
            </div>
            
            <div className="space-y-4">
                {MARKET_DAYS.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-gray-100 group">
                        <div className="w-14 h-14 bg-primary/5 text-primary rounded-2xl flex flex-col items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                            <span className="text-[10px] font-black leading-none mb-1">{item.day}</span>
                            <Clock size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-black text-gray-900 text-sm truncate">{item.location}</h4>
                            <p className="text-[10px] text-gray-400 font-bold truncate">{item.specialty}</p>
                        </div>
                        <ChevronRight size={18} className="text-gray-200 group-hover:text-primary transition-colors" />
                    </div>
                ))}
            </div>
            
            <div className="mt-8 p-5 bg-blue-50 rounded-3xl border border-blue-100">
                <p className="text-[10px] text-blue-700 font-bold leading-relaxed">
                    * ملاحظة: تبدأ الأسواق عادة من الصباح الباكر (6 ص) وحتى الرابعة عصراً.
                </p>
            </div>
        </div>
    );
};

export default MarketCalendar;
