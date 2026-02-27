
import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2, Search, BrainCircuit, ShieldCheck, TrendingUp, MapPin } from 'lucide-react';
import { searchMarketContext } from '../services/geminiService';
import GroundingSources from './GroundingSources';

interface SearchOverlayProps {
    query: string;
    onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ query, onClose }) => {
    const [result, setResult] = useState<string>('');
    const [sources, setSources] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => setUserLocation({ lat: 14.24, lng: 32.99 }) // Default to Manaqil
            );
        } else {
            setUserLocation({ lat: 14.24, lng: 32.99 });
        }
    }, []);

    const performAISearch = async () => {
        setIsLoading(true);
        try {
            const data = await searchMarketContext(
                query, 
                userLocation?.lat, 
                userLocation?.lng
            );
            setResult(data.text);
            setSources(data.sources);
        } catch (e) {
            setResult("حدث خطأ أثناء محاولة جلب البيانات الحية.");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (query && userLocation) performAISearch();
    }, [query, userLocation]);

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-fade-in">
            <div className="bg-white w-full max-w-4xl rounded-[50px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up border border-white/20">
                {/* Header */}
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-primary text-white rounded-3xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <BrainCircuit size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 leading-none mb-1">بحث سما الذكي</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <MapPin size={10} className="text-emerald-500" />
                                تدعيم النتائج ببيانات الخرائط (Maps Grounding)
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-red-500 transition-all shadow-sm">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-10 no-scrollbar">
                    <div className="mb-10">
                        <div className="flex items-center gap-3 text-slate-400 mb-6 px-2">
                            <Search size={16} />
                            <span className="text-sm font-bold italic">نتائج البحث عن: "{query}"</span>
                        </div>

                        {isLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                                <div className="relative">
                                    <Loader2 size={64} className="text-primary animate-spin" />
                                    <Sparkles size={24} className="text-teal-400 absolute -top-2 -right-2 animate-pulse" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-slate-900">جاري مسح المناقل...</h3>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">سما تبحث في الخرائط والمصادر الحية لتقديم أفضل إجابة</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                <div className="bg-slate-50 rounded-[40px] p-10 border border-slate-100 shadow-inner relative overflow-hidden group">
                                    <TrendingUp className="absolute -left-10 -bottom-10 text-primary opacity-5 group-hover:scale-110 transition-transform duration-[2s]" size={200} />
                                    <div className="relative z-10">
                                        <p className="text-lg text-slate-700 leading-relaxed font-bold whitespace-pre-wrap">
                                            {result}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">المصادر والأماكن المذكورة</h4>
                                    <GroundingSources sources={sources} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
                    <div className="flex items-center gap-3 text-emerald-600">
                        <ShieldCheck size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">بيانات مدعومة بخرائط جوجل الرسمية</span>
                    </div>
                    <button onClick={onClose} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs shadow-xl hover:bg-black transition-all">
                        إغلاق نافذة البحث
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchOverlay;
