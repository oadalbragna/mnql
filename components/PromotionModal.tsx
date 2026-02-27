
import React, { useState } from 'react';
import { X, Zap, Crown, Flame, Sparkles, ShieldCheck, Wallet, ChevronLeft, CheckCircle2 } from 'lucide-react';

interface PromotionModalProps {
    productTitle: string;
    onClose: () => void;
    onConfirm: (packageId: string) => void;
}

const PACKAGES = [
    { id: 'daily', name: 'الباقة اليومية', price: 1500, duration: '24 ساعة', desc: 'ظهور في أعلى النتائج وضمان 500 مشاهدة إضافية.', icon: <Zap className="text-yellow-500" /> },
    { id: 'weekly', name: 'الباقة الأسبوعية', price: 7500, duration: '7 أيام', desc: 'عرض في "نخبة العروض" بالصفحة الرئيسية وشارة ذهبية.', icon: <Crown className="text-primary" />, popular: true },
    { id: 'boost', name: 'باقة الانفجار', price: 12000, duration: '3 أيام', desc: 'ترويج مكثف عبر "سما" وإرسال تنبيهات للمهتمين.', icon: <Flame className="text-orange-500" /> },
];

const PromotionModal: React.FC<PromotionModalProps> = ({ productTitle, onClose, onConfirm }) => {
    const [selected, setSelected] = useState('weekly');
    const [step, setStep] = useState(1);

    return (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-[50px] overflow-hidden shadow-2xl animate-slide-up border border-white/20">
                {step === 1 ? (
                    <div className="p-10 space-y-8">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 text-primary rounded-2xl"><Sparkles size={24}/></div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900">تمييز الإعلان</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{productTitle}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><X size={24}/></button>
                        </div>

                        <div className="space-y-4">
                            {PACKAGES.map((pkg) => (
                                <button 
                                    key={pkg.id}
                                    onClick={() => setSelected(pkg.id)}
                                    className={`w-full p-6 rounded-[32px] border-2 text-right transition-all flex items-center justify-between group ${selected === pkg.id ? 'border-primary bg-primary/5 shadow-lg' : 'border-slate-50 bg-slate-50 hover:bg-white hover:border-slate-100'}`}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            {pkg.icon}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-black text-slate-900">{pkg.name}</h4>
                                                {pkg.popular && <span className="px-2 py-0.5 bg-primary text-white text-[8px] font-black rounded-full uppercase">الأكثر طلباً</span>}
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-bold leading-none">{pkg.duration} • {pkg.desc}</p>
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-lg font-black text-primary tracking-tighter">{pkg.price.toLocaleString()}</p>
                                        <p className="text-[8px] text-slate-400 font-black uppercase">ج.س</p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="bg-slate-900 rounded-[32px] p-6 text-white flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Wallet size={20} className="text-teal-400" />
                                <div className="text-right">
                                    <p className="text-[8px] opacity-50 font-black uppercase">رصيدك الحالي</p>
                                    <p className="font-black">745,000 ج.س</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setStep(2)}
                                className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-xs shadow-xl hover:scale-105 transition-all"
                            >
                                تفعيل الترويج
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-20 text-center space-y-8 animate-fade-in">
                        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner relative">
                            <CheckCircle2 size={48} />
                            <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping"></div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900">تم الترويج بنجاح!</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                إعلانك الآن يتصدر قائمة البحث وسيظهر في قسم "نخبة العروض" للمشترين في المناقل.
                            </p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black shadow-xl"
                        >
                            العودة لمتجري
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PromotionModal;
