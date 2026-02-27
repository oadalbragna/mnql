
import React, { useState } from 'react';
import { Video, ImageIcon, Sparkles, ChevronLeft, Loader2, Download, Wand2, Smartphone, Palette, Camera, Layers } from 'lucide-react';
import { generateProductImage, generateProductVideo, generateSmartDescription } from '../services/geminiService';

const STYLES = [
    { id: 'cinematic', name: 'سينمائي', icon: <Camera size={14}/> },
    { id: 'realistic', name: 'واقعي', icon: <Sparkles size={14}/> },
    { id: '3d', name: 'رسم 3D', icon: <Layers size={14}/> },
];

const MarketingStudio: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedStyle, setSelectedStyle] = useState('realistic');
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultType, setResultType] = useState<'video' | 'image' | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [isOptimizingText, setIsOptimizingText] = useState(false);

    const handleGenerate = async (type: 'video' | 'image') => {
        if (!title) return;
        setIsGenerating(true);
        setResultType(type);
        setResultUrl(null);

        try {
            if (type === 'video') {
                const url = await generateProductVideo(`${title} in ${selectedStyle} style`, description);
                setResultUrl(url);
            } else {
                const url = await generateProductImage(`${title}, professional commercial product shot, ${selectedStyle} style, high quality`, 'all' as any);
                setResultUrl(url);
            }
        } catch (e) { console.error(e); }
        
        setIsGenerating(false);
    };

    const handleOptimizeText = async () => {
        if (!title) return;
        setIsOptimizingText(true);
        const optimized = await generateSmartDescription(title, "تسويق، محترف، السودان، المناقل، جذاب");
        setDescription(optimized);
        setIsOptimizingText(false);
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl animate-slide-up">
            <div className="flex items-center gap-6 mb-12">
                <button onClick={onBack} className="p-4 bg-white border border-slate-100 rounded-[24px] text-slate-400 hover:text-primary transition-all shadow-sm">
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">استوديو التسويق الذكي</h2>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.2em]">قوة Gemini في صناعة محتواك الإعلاني</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-5 space-y-8">
                    <div className="bg-white rounded-[48px] p-10 border border-slate-50 shadow-sm space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">عنوان المنتج</label>
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="مثال: لوري شفر، موبايل ريلمي، قمح..."
                                className="w-full bg-slate-50 border-none rounded-3xl py-5 px-8 font-black text-slate-700 focus:ring-4 focus:ring-primary/5 transition-all"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center px-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">نمط الصورة / الفيديو</label>
                                <Palette size={14} className="text-primary" />
                            </div>
                            <div className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl">
                                {STYLES.map(s => (
                                    <button 
                                        key={s.id}
                                        onClick={() => setSelectedStyle(s.id)}
                                        className={`flex-1 py-3 rounded-xl font-black text-[10px] flex items-center justify-center gap-2 transition-all ${selectedStyle === s.id ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {s.icon} {s.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center px-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الوصف الإعلاني</label>
                                <button 
                                    onClick={handleOptimizeText}
                                    disabled={isOptimizingText || !title}
                                    className="text-[10px] font-black text-primary flex items-center gap-1 hover:underline disabled:opacity-50"
                                >
                                    {isOptimizingText ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                                    تحسين النص
                                </button>
                            </div>
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                placeholder="اوصف منتجك وسما ستصيغ إعلانك..."
                                className="w-full bg-slate-50 border-none rounded-3xl py-5 px-8 font-bold text-slate-600 focus:ring-4 focus:ring-primary/5 resize-none transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => handleGenerate('image')}
                                disabled={isGenerating || !title}
                                className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-[40px] border border-slate-100 hover:border-primary/40 hover:bg-primary/5 transition-all gap-4 group disabled:opacity-50"
                            >
                                <ImageIcon size={32} className="text-primary group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-black text-slate-700">توليد صورة</span>
                            </button>
                            <button 
                                onClick={() => handleGenerate('video')}
                                disabled={isGenerating || !title}
                                className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-[40px] border border-slate-800 hover:scale-[1.02] transition-all gap-4 group disabled:opacity-50"
                            >
                                <Video size={32} className="text-teal-400 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-black text-white">توليد فيديو</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Preview Viewport */}
                <div className="lg:col-span-7">
                    <div className="bg-slate-900 rounded-[60px] h-[750px] relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.3)] border-8 border-slate-800">
                        {isGenerating ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-20 space-y-8 animate-fade-in">
                                <div className="relative">
                                    <div className="w-24 h-24 border-4 border-teal-400/20 border-t-teal-400 rounded-full animate-spin" />
                                    <Sparkles className="absolute inset-0 m-auto text-teal-400 animate-pulse" size={32} />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-black text-white">جاري المعالجة الرقمية...</h3>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">سما تستخدم ذكاء {resultType === 'video' ? 'Veo' : 'Imagen'} لإنتاج تحفتك التسويقية</p>
                                </div>
                            </div>
                        ) : resultUrl ? (
                            <div className="w-full h-full animate-fade-in">
                                {resultType === 'video' ? (
                                    <video src={resultUrl} controls autoPlay className="w-full h-full object-cover" />
                                ) : (
                                    <img src={resultUrl} className="w-full h-full object-cover" alt="Output" />
                                )}
                                <div className="absolute bottom-12 left-12 right-12 flex gap-4">
                                    <button 
                                        onClick={() => window.open(resultUrl!, '_blank')}
                                        className="flex-1 bg-white text-slate-900 py-6 rounded-3xl font-black text-sm shadow-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all"
                                    >
                                        <Download size={20} /> تحميل الإعلان الاحترافي
                                    </button>
                                    <button 
                                        onClick={() => setResultUrl(null)}
                                        className="p-6 bg-white/10 backdrop-blur-xl text-white rounded-3xl border border-white/20 hover:bg-white/20 transition-all"
                                    >
                                        <Wand2 size={24} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-center p-20 space-y-8">
                                <div className="w-32 h-32 bg-white/5 rounded-[48px] flex items-center justify-center border border-white/5 text-slate-700">
                                    <Smartphone size={64} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-slate-500">منصة العرض الذكية</h3>
                                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest leading-relaxed">أدخل بيانات المنتج على اليمين لبدء التصنيع الرقمي</p>
                                </div>
                            </div>
                        )}
                        <div className="absolute top-10 left-10 pointer-events-none opacity-5">
                            <Sparkles size={150} className="text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketingStudio;
