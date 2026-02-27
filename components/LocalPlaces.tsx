
import React, { useState, useEffect, useMemo } from 'react';
// Added Sparkles to imports
import { ChevronLeft, MapPin, Search, Navigation, ExternalLink, Loader2, Hospital, Coffee, ShoppingBag, Landmark, Compass, Phone, AlertCircle, Star, ArrowRight, Sparkles } from 'lucide-react';
import { searchNearbyPlaces } from '../services/geminiService';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { LocalPlace } from '../types';

const LocalPlaces: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [dbPlaces, setDbPlaces] = useState<LocalPlace[]>([]);
    const [query, setQuery] = useState('');
    const [aiResults, setAiResults] = useState<{ text: string, chunks: any[] } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'medical' | 'banking' | 'food' | 'shops'>('all');

    useEffect(() => {
        // جلب الدليل الرسمي من قاعدة البيانات
        const placesRef = ref(db, 'Mangal-Shop/guide/places');
        onValue(placesRef, (snap) => {
            if (snap.exists()) setDbPlaces(Object.values(snap.val()));
        });
    }, []);

    const handleAISearch = async () => {
        if (!query) return;
        setIsLoading(true);
        try {
            const data = await searchNearbyPlaces(query, 14.24, 32.99);
            setAiResults(data);
        } catch (e) { console.error(e); }
        setIsLoading(false);
    };

    const filteredPlaces = useMemo(() => {
        return dbPlaces.filter(p => 
            (activeTab === 'all' || p.category === activeTab) &&
            (p.name.toLowerCase().includes(query.toLowerCase()))
        );
    }, [dbPlaces, query, activeTab]);

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl animate-slide-up">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-8">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="p-4 bg-white border border-slate-100 rounded-[24px] text-slate-400 hover:text-primary transition-all shadow-sm">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-1">دليل المناقل</h2>
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.2em]">الخدمات الموثقة والمواقع الرسمية</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-red-50 text-red-600 px-6 py-3 rounded-full border border-red-100 font-black text-xs">
                    <AlertCircle size={18} /> طوارئ المناقل: 999
                </div>
            </div>

            <div className="bg-white rounded-[48px] p-8 border border-slate-50 shadow-sm mb-12">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 relative">
                        <input 
                            type="text" 
                            placeholder="ابحث عن: مستشفى، صيدلية، بنك، مطعم..." 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-3xl py-5 pr-14 pl-6 font-black text-slate-700 focus:ring-4 focus:ring-primary/5 transition-all shadow-inner"
                        />
                        <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    </div>
                    <button onClick={handleAISearch} className="bg-slate-900 text-white px-10 py-5 rounded-[28px] font-black text-sm hover:bg-black transition-all shadow-xl flex items-center justify-center gap-2">
                        بحث ذكي بالذكاء الاصطناعي <Compass size={18} />
                    </button>
                </div>
                
                <div className="flex gap-2 overflow-x-auto no-scrollbar mt-8">
                    {[
                        { id: 'all', label: 'الكل', icon: <Compass size={14}/> },
                        { id: 'medical', label: 'مراكز طبية', icon: <Hospital size={14}/> },
                        { id: 'banking', label: 'بنوك وصرافة', icon: <Landmark size={14}/> },
                        { id: 'food', label: 'مطاعم', icon: <Coffee size={14}/> },
                        { id: 'shops', label: 'محلات', icon: <ShoppingBag size={14}/> },
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black transition-all whitespace-nowrap border ${activeTab === tab.id ? 'bg-primary text-white border-primary shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-primary/20'}`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="py-24 text-center space-y-6">
                    <Loader2 size={48} className="text-primary animate-spin mx-auto" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest">سما تبحث في المصادر اللحظية...</p>
                </div>
            ) : aiResults ? (
                <div className="bg-blue-50/50 rounded-[56px] p-12 border border-blue-100 mb-12 animate-fade-in relative overflow-hidden">
                    <h3 className="text-2xl font-black text-blue-900 mb-8 flex items-center gap-3"><Sparkles size={24} className="text-blue-500" /> اقتراحات سما الذكية</h3>
                    <p className="text-xl text-blue-800 leading-relaxed font-bold mb-10">{aiResults.text}</p>
                    <button onClick={() => setAiResults(null)} className="text-blue-500 font-black text-xs hover:underline">إخفاء النتائج الذكية</button>
                </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPlaces.length > 0 ? filteredPlaces.map(place => (
                    <div key={place.id} className="bg-white rounded-[40px] p-8 border border-slate-50 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                        {place.isFeatured && <div className="absolute top-0 right-0 bg-primary text-white text-[8px] font-black px-4 py-1 rounded-bl-2xl uppercase">متميز</div>}
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                {place.category === 'medical' ? <Hospital size={28}/> : place.category === 'banking' ? <Landmark size={28}/> : place.category === 'food' ? <Coffee size={28}/> : <ShoppingBag size={28}/>}
                            </div>
                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star size={14} fill="currentColor" /> <span className="text-xs font-black text-slate-700">4.8</span>
                            </div>
                        </div>
                        <h4 className="text-xl font-black text-slate-900 mb-2 leading-none">{place.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase mb-8">
                             <MapPin size={12} className="text-primary" /> {place.location}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => window.open(`tel:${place.phone}`)} className="bg-slate-900 text-white py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-black transition-all">
                                <Phone size={14} /> اتصل
                            </button>
                            <button className="bg-slate-50 text-slate-600 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all">
                                <Navigation size={14} /> الموقع
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-20 text-center">
                        <Compass size={64} className="mx-auto text-slate-100 mb-4" />
                        <p className="text-slate-400 font-black">لا توجد نتائج مطابقة لبحثك في دليل المناقل.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LocalPlaces;
