
import React, { useState } from 'react';
import { ChevronLeft, ShieldCheck, Wallet, ArrowRight, Smartphone, Lock, CreditCard, Landmark, CheckCircle, Loader2 } from 'lucide-react';

const PaymentGateway: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [step, setStep] = useState(1);
    const [selectedMethod, setSelectedMethod] = useState<'bankak' | 'fawry' | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handlePayment = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep(3);
        }, 2000);
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl animate-slide-up">
            <div className="flex items-center gap-4 mb-10">
                <button onClick={onBack} className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-500 shadow-sm">
                    <ChevronLeft size={24} />
                </button>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">بوابة الدفع الرقمية</h2>
            </div>

            <div className="bg-white rounded-[60px] shadow-2xl overflow-hidden border border-slate-50">
                {step === 1 && (
                    <div className="p-12 space-y-10 animate-fade-in">
                        <div className="text-center">
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">اختر وسيلة الدفع</p>
                            <h3 className="text-2xl font-black text-slate-900">كيف تود شحن محفظتك؟</h3>
                        </div>

                        <div className="space-y-4">
                            <button 
                                onClick={() => setSelectedMethod('bankak')}
                                className={`w-full p-8 rounded-[40px] border-2 transition-all flex items-center justify-between group ${selectedMethod === 'bankak' ? 'border-primary bg-primary/5' : 'border-slate-50 bg-slate-50 hover:bg-white hover:border-slate-100'}`}
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-xs">B</div>
                                    </div>
                                    <div className="text-right">
                                        <h4 className="text-lg font-black text-slate-900">تطبيق بنكك (BOK)</h4>
                                        <p className="text-xs text-slate-400 font-bold">الدفع المباشر عبر بنك الخرطوم</p>
                                    </div>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 ${selectedMethod === 'bankak' ? 'border-primary bg-primary' : 'border-slate-300'}`}></div>
                            </button>

                            <button 
                                onClick={() => setSelectedMethod('fawry')}
                                className={`w-full p-8 rounded-[40px] border-2 transition-all flex items-center justify-between group ${selectedMethod === 'fawry' ? 'border-teal-500 bg-teal-50/50' : 'border-slate-50 bg-slate-50 hover:bg-white hover:border-slate-100'}`}
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                        <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-black text-xs">F</div>
                                    </div>
                                    <div className="text-right">
                                        <h4 className="text-lg font-black text-slate-900">تطبيق فوري (Fawry)</h4>
                                        <p className="text-xs text-slate-400 font-bold">الدفع عبر بنك فيصل الإسلامي</p>
                                    </div>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 ${selectedMethod === 'fawry' ? 'border-teal-500 bg-teal-500' : 'border-slate-300'}`}></div>
                            </button>
                        </div>

                        <button 
                            disabled={!selectedMethod}
                            onClick={() => setStep(2)}
                            className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black shadow-xl disabled:opacity-50 disabled:grayscale transition-all hover:bg-black flex items-center justify-center gap-3"
                        >
                            متابعة الدفع <ArrowRight size={20} className="rotate-180" />
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="p-12 space-y-10 animate-fade-in">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setStep(1)} className="p-3 bg-slate-50 rounded-2xl text-slate-400"><ArrowRight size={20} /></button>
                            <h3 className="text-xl font-black text-slate-900">تأكيد البيانات</h3>
                        </div>

                        <div className="p-8 bg-slate-900 rounded-[48px] text-white relative overflow-hidden">
                            <div className="relative z-10 space-y-6">
                                <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest">المبلغ المطلوب</p>
                                <h2 className="text-5xl font-black">50,000 <span className="text-sm opacity-60">ج.س</span></h2>
                                <div className="flex items-center gap-3 text-xs opacity-60">
                                    <Lock size={14} /> مشفر وآمن عبر {selectedMethod === 'bankak' ? 'BOK' : 'Fawry'}
                                </div>
                            </div>
                            <Smartphone className="absolute -left-10 -bottom-10 opacity-10" size={200} />
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 px-4">رقم الموبايل المرتبط بالحساب</label>
                                <input type="tel" placeholder="09xxxxxxx" className="w-full bg-slate-50 border-none rounded-3xl py-5 px-8 font-black text-slate-700 focus:ring-4 focus:ring-primary/5" />
                            </div>
                        </div>

                        <button 
                            onClick={handlePayment}
                            disabled={isLoading}
                            className="w-full bg-primary text-white py-6 rounded-[32px] font-black shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] transition-all"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={24} /> : <>تأكيد العملية الآن <ShieldCheck size={20}/></>}
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="p-20 text-center space-y-10 animate-fade-in">
                        <div className="w-32 h-32 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner relative">
                            <CheckCircle size={64} />
                            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-slate-900 mb-2">تم الشحن بنجاح!</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                تمت إضافة <b>50,000 ج.س</b> إلى محفظتك في سوق المناقل. يمكنك الآن البدء في التسوق والاشتراك في المميزات.
                            </p>
                        </div>
                        <button 
                            onClick={onBack}
                            className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black shadow-xl"
                        >
                            العودة للمحفظة
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-12 flex items-center justify-center gap-4 text-slate-300">
                <ShieldCheck size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">نظام دفع موثق ومعتمد</span>
            </div>
        </div>
    );
};

export default PaymentGateway;
