
import React, { useState, useEffect } from 'react';
import { ChevronLeft, TrendingUp, TrendingDown, DollarSign, Wheat, Activity, RefreshCw, ExternalLink, Sparkles, Globe, LineChart, PieChart, Map as MapIcon, Link as LinkIcon } from 'lucide-react';
import { fetchMarketNews, getMarketTrends } from '../services/geminiService';
import GroundingSources from './GroundingSources';

const MarketInsights: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [report, setReport] = useState<{content: string, sources: any[]} | null>(null);
    const [trends, setTrends] = useState<{text: string, sources: any[]} | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [news, trendData] = await Promise.all([
                fetchMarketNews(),
                getMarketTrends()
            ]);
            setReport({content: news.content, sources: news.sources});
            setTrends(trendData);
        } catch (e) { console.error(e); }
        setIsLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl animate-slide-up">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-8">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="p-4 bg-white border border-slate-100 rounded-[24px] text-slate-400 hover:text-primary transition-all shadow-sm">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-1">نبض السوق</h2>
                        <p className="text-sm text-slate-400 font-black uppercase tracking-[0.3em]">البيانات اللحظية والتوقعات الاقتصادية</p>
                    </div>
                </div>
                <button onClick={loadData} disabled={isLoading} className="w-16 h-16 bg-primary text-white rounded-[24px] shadow-2xl shadow-primary/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-500">
                    <RefreshCw size={28} className={isLoading ? 'animate-spin' : ''} />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                    {/* Main AI Analysis */}
                    <div className="bg-slate-900 rounded-[56px] p-12 text-white relative overflow-hidden shadow-2xl border border-white/5 group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-4 bg-primary/20 rounded-[28px] text-teal-300 border border-white/10">
                                    <Sparkles size={28} />
                                </div>
                                <h3 className="text-3xl font-black">تحليل الاتجاهات (سما AI)</h3>
                            </div>
                            {isLoading ? (
                                <div className="space-y-6 animate-pulse">
                                    <div className="h-4 bg-white/10 rounded-full w-3/4"></div>
                                    <div className="h-4 bg-white/10 rounded-full w-1/2"></div>
                                    <div className="h-32 bg-white/5 rounded-[40px] w-full"></div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-xl text-slate-300 leading-relaxed font-bold whitespace-pre-wrap mb-10">{trends?.text}</p>
                                    <GroundingSources sources={trends?.sources || []} />
                                </>
                            )}
                        </div>
                        <LineChart className="absolute -left-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform duration-1000" size={300} />
                    </div>

                    {/* Regional Comparison */}
                    <div className="bg-white rounded-[56px] p-12 border border-slate-50 shadow-sm relative overflow-hidden group">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-4 bg-primary/5 text-primary rounded-[28px] group-hover:rotate-6 transition-transform">
                                <MapIcon size={28} />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900">مقارنة الأسواق الإقليمية</h3>
                        </div>
                        <div className="space-y-6">
                            {[
                                { city: 'سوق المناقل', status: 'نشط', volume: '100%', trend: 'up' },
                                { city: 'سوق مدني', status: 'مستقر', volume: '85%', trend: 'stable' },
                                { city: 'سوق سنار', status: 'هدوء', volume: '60%', trend: 'down' },
                            ].map((market, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] border border-slate-100/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-3 h-3 rounded-full bg-primary" />
                                        <span className="font-black text-slate-800">{market.city}</span>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{market.status}</span>
                                        <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: market.volume }} />
                                        </div>
                                        {market.trend === 'up' ? <TrendingUp size={16} className="text-emerald-500" /> : <TrendingDown size={16} className="text-red-500" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 flex items-center gap-3 p-6 bg-blue-50 rounded-[32px] text-[10px] font-black text-blue-600 uppercase tracking-widest">
                            <Activity size={18} className="animate-pulse" /> التحديث القادم بعد 12 ساعة
                        </div>
                    </div>
                </div>

                {/* Economic Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-gradient-to-br from-[#0F766E] to-[#115E59] rounded-[50px] p-10 text-white shadow-2xl relative overflow-hidden group">
                        <h4 className="text-xl font-black mb-10 flex items-center gap-3">
                            <DollarSign size={24} className="text-teal-300" /> 
                            أسعار العملات
                        </h4>
                        <div className="space-y-8">
                            {[ 
                                {l:'دولار أمريكي', v:'1,250', c:'+1.2%', up: true}, 
                                {l:'ريال سعودي', v:'335', c:'+0.4%', up: true}, 
                                {l:'درهم إماراتي', v:'340', c:'-0.1%', up: false}
                            ].map((r, i) => (
                                <div key={i} className="flex justify-between items-center group cursor-pointer">
                                    <div className="space-y-1">
                                        <span className="font-black text-teal-100 group-hover:text-white transition-colors">{r.l}</span>
                                        <div className={`text-[9px] font-black flex items-center gap-1 ${r.up ? 'text-teal-400' : 'text-red-400'}`}>
                                            {r.up ? <TrendingUp size={10}/> : <TrendingDown size={10}/>} {r.c}
                                        </div>
                                    </div>
                                    <span className="text-2xl font-black tracking-tighter">{r.v} <span className="text-[10px] opacity-60">ج.س</span></span>
                                </div>
                            ))}
                        </div>
                        <PieChart className="absolute -left-10 -bottom-10 opacity-5 group-hover:rotate-12 transition-transform duration-1000" size={200} />
                    </div>

                    <div className="bg-white rounded-[50px] p-10 border border-slate-50 shadow-sm">
                         <h4 className="font-black text-slate-900 text-lg mb-8 flex items-center gap-3">
                            <Wheat size={24} className="text-primary" /> 
                            بورصة المحاصيل (اليوم)
                         </h4>
                         <div className="space-y-6">
                            {[
                                { n: 'فول سوداني', p: '12,500' },
                                { n: 'سمسم أبيض', p: '24,000' },
                                { n: 'ذرة طابت', p: '45,000' },
                            ].map((c, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-slate-600">{c.n}</span>
                                    <span className="text-lg font-black text-slate-900">{c.p} <span className="text-[8px] text-slate-400">ج.س</span></span>
                                </div>
                            ))}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketInsights;
