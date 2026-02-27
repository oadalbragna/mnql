
import React, { useState, useMemo } from 'react';
import { ChevronLeft, Wheat, Tag, Scale, TrendingUp, Sparkles, Loader2, Globe, ArrowUpRight, History, Search, Plus, Info, TrendingDown, MapPin, MousePointer2 } from 'lucide-react';
import { getAgriDeepDive } from '../services/geminiService';
import GroundingSources from './GroundingSources';
import AddCropOfferModal from './AddCropOfferModal';
import { CropPrice, UserProfile } from '../types';
import FormattedText from './FormattedText';

interface AgriMarketViewProps {
    onBack: () => void;
    crops: CropPrice[];
    user: UserProfile | null;
}

const AgriMarketView: React.FC<AgriMarketViewProps> = ({ onBack, crops, user }) => {
    const [deepDive, setDeepDive] = useState<{text: string, sources: any[]} | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddOfferOpen, setIsAddOfferOpen] = useState(false);

    const handleDeepDive = async () => {
        setIsLoading(true);
        const result = await getAgriDeepDive();
        setDeepDive(result);
        setIsLoading(false);
    };

    const filteredCrops = useMemo(() => {
        return crops.filter(c => 
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            c.location.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [crops, searchQuery]);

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl animate-slide-up">
            {isAddOfferOpen && <AddCropOfferModal user={user} onClose={() => setIsAddOfferOpen(false)} />}

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-8">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="p-4 bg-white border border-slate-100 rounded-[24px] text-slate-400 hover:text-emerald-600 transition-all shadow-sm">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-1">بورصة المحاصيل</h2>
                        <div className="flex items-center gap-2">
                             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                             <p className="text-sm text-emerald-600 font-black uppercase tracking-[0.2em]">الأسعار المباشرة لمزارع الجزيرة</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-72">
                        <input 
                            type="text" 
                            placeholder="ابحث عن محصول..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-slate-100 rounded-2xl py-4 pr-12 pl-6 font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all shadow-sm"
                        />
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    </div>
                </div>
            </div>

            <div className="mb-12">
                {!deepDive && !isLoading ? (
                    <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-[48px] p-12 text-white relative overflow-hidden shadow-2xl group cursor-pointer" onClick={handleDeepDive}>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="flex items-center gap-8">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[32px] flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                                    <Sparkles size={36} className="text-teal-200" />
                                </div>
                                <div className="max-w-md text-right">
                                    <h3 className="text-3xl font-black mb-2">مساعد التداول الذكي</h3>
                                    <p className="text-teal-50 font-medium leading-relaxed">تحليل مباشر لأسعار البورصة العالمية وتأثيرها على سوق المناقل اليوم.</p>
                                </div>
                            </div>
                            <button className="bg-white text-emerald-900 px-10 py-5 rounded-[24px] font-black text-sm shadow-xl flex items-center gap-2 group-hover:bg-teal-50 transition-colors">
                                تشغيل التحليل العميق <Globe size={18} />
                            </button>
                        </div>
                    </div>
                ) : isLoading ? (
                    <div className="bg-white rounded-[48px] p-16 border-4 border-dashed border-emerald-100 text-center">
                        <Loader2 size={64} className="text-emerald-600 animate-spin mx-auto" />
                        <p className="text-xl font-black text-slate-900 mt-4">سما تدرس تقلبات السوق العالمية...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-[48px] p-12 border border-slate-100 shadow-sm animate-fade-in">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                <Sparkles size={24} className="text-emerald-600"/> توصية سما لتجارة اليوم
                            </h3>
                            <button onClick={() => setDeepDive(null)} className="text-xs font-black text-slate-400">إغلاق</button>
                        </div>
                        <FormattedText text={deepDive?.text || ''} className="text-lg text-slate-700 mb-8" />
                        <GroundingSources sources={deepDive?.sources || []} />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {filteredCrops.length > 0 ? filteredCrops.map(crop => (
                    <div key={crop.id} className="bg-white rounded-[40px] p-8 border border-slate-50 shadow-sm hover:shadow-xl transition-all group overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                <Wheat size={28} />
                            </div>
                            <div className="text-left">
                                <div className={`flex items-center gap-1 text-[10px] font-black mb-1 ${crop.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {crop.trend === 'up' ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                                </div>
                                <p className="text-2xl font-black text-slate-900 tracking-tighter">{crop.price.toLocaleString()} <span className="text-[8px] text-slate-400">ج.س / {crop.unit}</span></p>
                            </div>
                        </div>
                        <h4 className="text-lg font-black text-slate-800 mb-4 truncate">{crop.name}</h4>
                        <div className="space-y-3 mb-6">
                             <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold"><MapPin size={14} className="text-emerald-600" /> {crop.location}</div>
                        </div>
                        <button onClick={() => alert(`طلب شراء لـ ${crop.name} تم إرساله لمكتب البورصة`)} className="w-full py-4 bg-slate-50 rounded-2xl text-[10px] font-black text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all flex items-center justify-center gap-2 uppercase">
                            <MousePointer2 size={14} /> طلب شراء
                        </button>
                    </div>
                )) : (
                    <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-slate-50">
                        <Wheat size={48} className="mx-auto text-slate-100 mb-4" />
                        <p className="text-slate-400 font-black">لا توجد محاصيل معروضة حالياً.</p>
                    </div>
                )}
            </div>

            <div className="bg-slate-900 rounded-[64px] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                    <div className="text-center lg:text-right flex-1">
                        <h3 className="text-4xl md:text-5xl font-black mb-6 leading-tight">عقود التوريد <br/><span className="text-emerald-400">للمنتجين الكبار</span></h3>
                        <p className="text-lg opacity-60 font-medium leading-relaxed mb-10 max-w-2xl">اعرض محصولك الآن لتصل إليك عروض من شركات المطاحن والزيوت مباشرة وبدون وسيط عبر قاعدة بياناتنا الموثقة.</p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                            <button onClick={() => setIsAddOfferOpen(true)} className="bg-emerald-500 text-white px-12 py-5 rounded-3xl font-black text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-3">
                                <Plus size={20} /> إضافة عرض محصول جديد
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgriMarketView;
