import React, { useState, useEffect } from 'react';
import { ChevronLeft, Camera, Sprout, Loader2, AlertCircle, CheckCircle2, ExternalLink, History, Info, Wheat, Sparkles, Activity, Link as LinkIcon, Upload, Globe } from 'lucide-react';
import { diagnoseCropIssue } from '../services/geminiService';
import { AgriDiagnosis, UserProfile } from '../types';
import { ref, push, onValue } from 'firebase/database';
import { db } from '../firebase';
import { useAppContext } from '../core/context/AppContext';
import { TelegramService } from '../services/telegramService';
import SmartMedia from './SmartMedia';

const AgriAI: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { user } = useAppContext();
    const [image, setImage] = useState<string | null>(null);
    const [isDiagnosing, setIsDiagnosing] = useState(false);
    const [diagnosis, setDiagnosis] = useState<any>(null);
    const [history, setHistory] = useState<AgriDiagnosis[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        if (!user) return;
        const historyRef = ref(db, `Mangal-Shop/agri_diagnoses/${user.emailOrPhone}`);
        onValue(historyRef, (snap) => {
            if (snap.exists()) {
                const data = Object.values(snap.val()) as AgriDiagnosis[];
                setHistory(data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
            }
        });
    }, [user]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsDiagnosing(true);
            const fileId = await TelegramService.uploadFile(file);
            if (fileId) {
                setImage(fileId);
                handleDiagnose(fileId);
            } else {
                alert("فشل رفع الصورة إلى الجسر.");
                setIsDiagnosing(false);
            }
        }
    };

    const handleDiagnose = async (imgFileId: string) => {
        setIsDiagnosing(true);
        try {
            // ملاحظة: نحتاج لتحويل الـ fileId لرابط حقيقي مؤقت لبرمجية Gemini للتحليل
            const realUrl = await TelegramService.getRealTelegramUrl(imgFileId);
            if (!realUrl) throw new Error("Could not get real URL");

            const result = await diagnoseCropIssue(realUrl);
            const diagData: AgriDiagnosis = {
                ...result,
                imageUrl: imgFileId,
                timestamp: new Date().toISOString(),
                userId: user?.emailOrPhone || 'guest'
            };
            setDiagnosis(diagData);
            
            if (user && user.emailOrPhone !== 'guest') {
                const historyRef = ref(db, `Mangal-Shop/agri_diagnoses/${user.emailOrPhone}`);
                await push(historyRef, diagData);
            }
        } catch (e) {
            console.error(e);
            alert("حدث خطأ أثناء التشخيص.");
        } finally {
            setIsDiagnosing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-primary transition-all">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tighter">طبيب المحاصيل الذكي</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">تحليل فوري للمشكلات الزراعية</p>
                    </div>
                </div>
                {user && (
                    <button onClick={() => setShowHistory(!showHistory)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black flex items-center gap-2 transition-all ${showHistory ? 'bg-primary text-white shadow-lg' : 'bg-white border border-slate-100 text-slate-600'}`}>
                        <History size={16}/> {showHistory ? 'إغلاق السجل' : 'سجل التشخيصات'}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {showHistory ? (
                    <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
                        {history.map((h, i) => (
                            <div key={i} className="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col gap-4 group hover:shadow-xl transition-all">
                                <SmartMedia fileId={h.imageUrl} className="w-full h-32 rounded-2xl object-cover" />
                                <div>
                                    <h4 className="font-black text-slate-900 text-sm line-clamp-1">{h.issue}</h4>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase">{new Date(h.timestamp).toLocaleDateString('ar-SA')}</p>
                                </div>
                                <button onClick={() => {setDiagnosis(h); setShowHistory(false);}} className="w-full py-2.5 bg-slate-50 text-primary rounded-xl font-black text-[10px] hover:bg-primary hover:text-white transition-all">عرض النتائج</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="lg:col-span-5 space-y-6">
                            <div className={`relative aspect-square rounded-[40px] border-4 border-dashed transition-all duration-500 overflow-hidden flex flex-col items-center justify-center p-8 text-center group ${image ? 'border-primary shadow-2xl' : 'border-slate-100 bg-white'}`}>
                                {image ? (
                                    <SmartMedia fileId={image} className="absolute inset-0 w-full h-full object-cover" alt="Crop" />
                                ) : (
                                    <div className="space-y-4">
                                        <div className="w-16 h-16 bg-primary/5 text-primary rounded-[24px] flex items-center justify-center mx-auto"><Camera size={32} /></div>
                                        <p className="text-lg font-black text-slate-900">التقط صورة للإصابة</p>
                                        <p className="text-[9px] text-slate-400 font-bold">يفضل أن تكون الصورة قريبة وواضحة</p>
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                        </div>

                        <div className="lg:col-span-7 space-y-6">
                            {isDiagnosing ? (
                                <div className="h-full bg-white rounded-[40px] p-12 flex flex-col items-center justify-center text-center space-y-6 border border-slate-50">
                                    <Loader2 size={48} className="text-primary animate-spin" />
                                    <p className="text-lg font-black text-slate-900">جاري تحليل الأنسجة والنبات...</p>
                                </div>
                            ) : diagnosis ? (
                                <div className="bg-white rounded-[40px] border border-slate-50 shadow-sm overflow-hidden animate-fade-in h-full">
                                    <div className={`p-6 text-white flex items-center gap-4 ${diagnosis.urgency === 'high' ? 'bg-red-500' : 'bg-emerald-500'} shadow-lg`}>
                                        <AlertCircle size={24} />
                                        <div>
                                            <h3 className="text-xl font-black leading-none mb-1">تقرير التشخيص</h3>
                                            <p className="text-[8px] font-black uppercase opacity-80">تحليل الذكاء الاصطناعي - جوجل Gemini</p>
                                        </div>
                                    </div>
                                    <div className="p-8 space-y-8">
                                        <div>
                                            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">المشكلة المكتشفة</h4>
                                            <p className="text-2xl font-black text-slate-900">{diagnosis.issue}</p>
                                        </div>
                                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                            <h4 className="text-[9px] font-black text-primary uppercase mb-3 tracking-widest">توصيات العلاج</h4>
                                            <p className="text-xs text-slate-700 leading-relaxed font-bold">{diagnosis.remedy}</p>
                                        </div>
                                        {diagnosis.sources && diagnosis.sources.length > 0 && (
                                            <div className="space-y-2">
                                                <h4 className="text-[9px] font-black text-slate-400 uppercase mb-3">المصادر المرجعية</h4>
                                                {diagnosis.sources.map((s: any, i: number) => (
                                                    <a key={i} href={s.uri} target="_blank" className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-primary transition-all">
                                                        <span className="text-[10px] font-bold text-slate-600 truncate">{s.title}</span>
                                                        <ExternalLink size={12} className="text-slate-200" />
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-[40px] border-4 border-dashed border-slate-50 p-12 text-center h-full flex flex-col items-center justify-center">
                                    <Sprout size={40} className="text-slate-100 mb-4" />
                                    <h3 className="text-lg font-black text-slate-300">بانتظار صورة للمحصول للبدء</h3>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AgriAI;
