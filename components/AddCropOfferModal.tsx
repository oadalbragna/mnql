
import React, { useState } from 'react';
import { X, Wheat, MapPin, Scale, Phone, Info, CheckCircle2, Loader2, Sparkles, AlertCircle, Calendar, Tag, ShieldCheck, ArrowRight, Gavel, BarChart3 } from 'lucide-react';
import { ref, push, serverTimestamp } from 'firebase/database';
import { db } from '../firebase';
import { UserProfile } from '../types';

interface AddCropOfferModalProps {
    onClose: () => void;
    user: UserProfile | null;
}

const AddCropOfferModal: React.FC<AddCropOfferModalProps> = ({ onClose, user }) => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [cropData, setCropData] = useState({
        type: 'ذرة طابت',
        quantity: '',
        unit: 'جوال',
        location: user?.location || '',
        price: '',
        quality: '',
        isContract: false
    });

    const handlePublish = async () => {
        if (!cropData.quantity || !cropData.location) {
            alert("يرجى إكمال البيانات الأساسية للمحصول");
            return;
        }

        setIsLoading(true);
        try {
            const cropPriceRef = ref(db, 'Mangal-Shop/crops/prices');
            const newCropOffer = {
                id: `crop_${Date.now()}`,
                name: cropData.type,
                price: Number(cropData.price) || 0,
                unit: cropData.unit,
                trend: 'stable',
                location: cropData.location,
                lastUpdate: new Date().toISOString(),
                // تفاصيل إضافية مخزنة في قاعدة البيانات
                meta: {
                    quantity: cropData.quantity,
                    quality: cropData.quality,
                    isContract: cropData.isContract,
                    sellerId: user?.id || 'guest',
                    sellerName: user?.fullName || 'منتج محلي',
                    timestamp: serverTimestamp()
                }
            };

            await push(cropPriceRef, newCropOffer);
            setStep(3); // الانتقال لصفحة النجاح
        } catch (error) {
            alert("حدث خطأ أثناء الاتصال ببورصة المحاصيل. يرجى المحاولة لاحقاً.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleNext = () => {
        if (step === 1) {
            if (!cropData.quantity || !cropData.location) {
                alert("يرجى إكمال البيانات الأساسية للمحصول");
                return;
            }
            setStep(2);
        } else if (step === 2) {
            handlePublish();
        }
    };

    return (
        <div className="fixed inset-0 z-[180] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xl animate-fade-in overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-[60px] shadow-[0_50px_120px_rgba(0,0,0,0.3)] overflow-hidden animate-slide-up border border-white/20 my-8">
                {step === 3 ? (
                    <div className="p-16 md:p-24 text-center space-y-10 animate-fade-in bg-gradient-to-b from-white to-emerald-50/30">
                        <div className="w-28 h-28 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner relative">
                            <CheckCircle2 size={56} />
                            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-4xl font-black text-slate-900 tracking-tight">تم نشر عرضك في البورصة!</h3>
                            <p className="text-base text-slate-500 font-bold leading-relaxed max-w-sm mx-auto">
                                إعلانك متاح الآن لكبار التجار والشركات في المناقل. ستصلك إشعارات وتنبيهات فور وجود عروض شراء جادة.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <button onClick={onClose} className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3">
                                متابعة البورصة <ArrowRight size={20} className="rotate-180" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/80 backdrop-blur-md">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-emerald-600 text-white rounded-[28px] flex items-center justify-center shadow-2xl shadow-emerald-600/20 group hover:rotate-12 transition-transform">
                                    <Wheat size={36} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">إضافة عرض محصول</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">بورصة المناقل الذكية • خطوة {step} من 2</p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-300 hover:text-red-500 transition-all shadow-sm">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-10 md:p-14 space-y-10 max-h-[60vh] overflow-y-auto no-scrollbar">
                            {step === 1 ? (
                                <div className="space-y-8 animate-fade-in">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">نوع المحصول النقدي</label>
                                        <div className="relative group">
                                            <Tag className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-400 group-focus-within:text-emerald-600" size={20} />
                                            <select 
                                                value={cropData.type}
                                                onChange={(e) => setCropData({...cropData, type: e.target.value})}
                                                className="w-full bg-slate-50 border-none rounded-3xl py-6 pr-14 pl-8 font-black text-slate-700 focus:ring-4 focus:ring-emerald-500/5 transition-all appearance-none cursor-pointer text-lg shadow-inner"
                                            >
                                                <option>ذرة طابت (إنتاج محلي)</option>
                                                <option>فول سوداني (خام - صادر)</option>
                                                <option>سمسم أبيض (نخب أول)</option>
                                                <option>قمح (مشروع الجزيرة)</option>
                                                <option>كبكبي (إنتاج شتوي)</option>
                                                <option>عدسية (نخب ممتاز)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">الكمية الإجمالية</label>
                                            <div className="relative group">
                                                <Scale className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-400" size={20} />
                                                <input 
                                                    type="number" 
                                                    placeholder="100" 
                                                    value={cropData.quantity}
                                                    onChange={(e) => setCropData({...cropData, quantity: e.target.value})}
                                                    className="w-full bg-slate-50 border-none rounded-3xl py-6 pr-14 font-black text-slate-700 focus:ring-4 focus:ring-emerald-500/5 shadow-inner text-lg" 
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">الوحدة</label>
                                            <select 
                                                value={cropData.unit}
                                                onChange={(e) => setCropData({...cropData, unit: e.target.value})}
                                                className="w-full bg-slate-50 border-none rounded-3xl py-6 px-8 font-black text-slate-700 focus:ring-4 focus:ring-emerald-500/5 shadow-inner text-lg"
                                            >
                                                <option>جوال</option>
                                                <option>أردب</option>
                                                <option>قنطار</option>
                                                <option>طن متري</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">الموقع ومقر التخزين</label>
                                        <div className="relative group">
                                            <MapPin className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-400" size={20} />
                                            <input 
                                                type="text" 
                                                placeholder="مثال: مخازن الشوال، السوق الشعبي، المناقل" 
                                                value={cropData.location}
                                                onChange={(e) => setCropData({...cropData, location: e.target.value})}
                                                className="w-full bg-slate-50 border-none rounded-3xl py-6 pr-14 font-black text-slate-700 focus:ring-4 focus:ring-emerald-500/5 shadow-inner text-lg" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8 animate-fade-in">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <button 
                                            onClick={() => setCropData({...cropData, isContract: false})}
                                            className={`p-8 rounded-[40px] border-2 text-right transition-all flex flex-col gap-4 group ${!cropData.isContract ? 'border-emerald-600 bg-emerald-50/50 shadow-xl scale-105' : 'border-slate-100 bg-slate-50 hover:bg-white'}`}
                                        >
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${!cropData.isContract ? 'bg-emerald-600 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
                                                <Gavel size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-900">بيع مباشر / مزاد</h4>
                                                <p className="text-[10px] text-slate-400 font-bold leading-relaxed">للكيات الصغيرة والمتوسطة المتاحة فوراً.</p>
                                            </div>
                                        </button>
                                        <button 
                                            onClick={() => setCropData({...cropData, isContract: true})}
                                            className={`p-8 rounded-[40px] border-2 text-right transition-all flex flex-col gap-4 group ${cropData.isContract ? 'border-blue-600 bg-blue-50/50 shadow-xl scale-105' : 'border-slate-100 bg-slate-50 hover:bg-white'}`}
                                        >
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${cropData.isContract ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
                                                <ShieldCheck size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-900">عقد توريد / صادر</h4>
                                                <p className="text-[10px] text-slate-400 font-bold leading-relaxed">للمنتجين الكبار والتعاقدات مع الشركات.</p>
                                            </div>
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">السعر المطلوب للجوال (اختياري)</label>
                                        <div className="relative group">
                                            <BarChart3 className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-400" size={20} />
                                            <input 
                                                type="number" 
                                                placeholder="اتركه فارغاً لترك السعر للسوق" 
                                                value={cropData.price}
                                                onChange={(e) => setCropData({...cropData, price: e.target.value})}
                                                className="w-full bg-slate-50 border-none rounded-3xl py-6 pr-14 pl-12 font-black text-slate-700 focus:ring-4 focus:ring-emerald-500/5 shadow-inner text-lg" 
                                            />
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300">ج.س</span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-8 bg-blue-50/50 rounded-[40px] border border-blue-100 flex items-start gap-6 relative overflow-hidden group">
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm shrink-0 group-hover:rotate-12 transition-transform">
                                            <ShieldCheck size={28} />
                                        </div>
                                        <div className="space-y-1">
                                            <h5 className="font-black text-blue-900 text-sm">تنبيه الموثوقية</h5>
                                            <p className="text-[11px] text-blue-700 font-medium leading-relaxed opacity-80">بمجرد نشر العرض، سيظهر في شبكة أسعار البورصة لجميع التجار والشركات المعتمدة في "سوق المناقل".</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-between items-center gap-8 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                            <button 
                                onClick={() => setStep(s => s - 1)}
                                disabled={step === 1}
                                className="px-12 py-6 bg-white border border-slate-200 text-slate-400 rounded-[28px] font-black text-sm hover:bg-slate-100 disabled:opacity-0 transition-all shadow-sm"
                            >
                                الخطوة السابقة
                            </button>
                            <button 
                                onClick={handleNext}
                                disabled={isLoading}
                                className="flex-1 bg-emerald-600 text-white py-6 rounded-[28px] font-black text-base shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group"
                            >
                                {isLoading ? <Loader2 size={24} className="animate-spin" /> : step === 2 ? <>نشر العرض في البورصة <Sparkles size={20} className="text-yellow-300" /></> : <>متابعة البيانات <ArrowRight size={20} className="rotate-180 group-hover:-translate-x-1 transition-transform" /></>}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddCropOfferModal;
