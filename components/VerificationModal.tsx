
import React, { useState } from 'react';
import { X, ShieldCheck, Camera, FileText, CheckCircle, Loader2 } from 'lucide-react';

const VerificationModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const handleNext = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep(prev => prev + 1);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-slide-up">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                            <ShieldCheck size={24} />
                        </div>
                        <h2 className="text-xl font-black text-gray-900">توثيق الحساب</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-10 space-y-8">
                    {step === 1 && (
                        <div className="space-y-6 text-center animate-fade-in">
                            <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText size={40} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-gray-900">لماذا أوثق حسابي؟</h3>
                                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                                    التوثيق يزيد من ثقة المشترين في إعلاناتك، ويمنحك أولوية في الظهور بشارة زرقاء مميزة.
                                </p>
                            </div>
                            <button onClick={handleNext} className="w-full bg-primary text-white py-5 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                                ابدأ التوثيق الآن
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in">
                            <h3 className="text-lg font-black text-gray-900 text-center">ارفع صورة الهوية</h3>
                            <div className="w-full aspect-video rounded-3xl border-4 border-dashed border-gray-100 bg-gray-50 flex flex-col items-center justify-center text-gray-400 group hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer">
                                <Camera size={48} className="mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold">اضغط للتصوير أو الرفع</span>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">المطلوب:</p>
                                <ul className="text-xs text-gray-600 font-medium space-y-1 list-disc list-inside px-4">
                                    <li>صورة واضحة للوجه والظهر</li>
                                    <li>أن تكون جميع البيانات مقروءة</li>
                                    <li>ألا تكون الصورة مهتزة</li>
                                </ul>
                            </div>
                            <button onClick={handleNext} disabled={isLoading} className="w-full bg-primary text-white py-5 rounded-2xl font-black shadow-xl flex items-center justify-center gap-2">
                                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "تحميل ومتابعة"}
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 text-center animate-fade-in">
                            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle size={40} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900">تم استلام طلبك!</h3>
                                <p className="text-sm text-gray-500 mt-2">
                                    جاري مراجعة بياناتك من قبل فريق سوق المناقل. ستصلك شارة التوثيق خلال 24 ساعة.
                                </p>
                            </div>
                            <button onClick={onClose} className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black shadow-xl">
                                حسناً، شكراً لك
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerificationModal;
