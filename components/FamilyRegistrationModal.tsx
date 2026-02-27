
import React, { useState, useRef } from 'react';
import { X, ChefHat, MapPin, Phone, MessageSquare, Camera, Sparkles, CheckCircle2, Loader2, Heart, Palette, Utensils, Image as ImageIcon, Trash2, Wand2 } from 'lucide-react';

interface FamilyRegistrationModalProps {
    onClose: () => void;
}

const FamilyRegistrationModal: React.FC<FamilyRegistrationModalProps> = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [specialty, setSpecialty] = useState('');
    
    // Form States
    const [familyData, setFamilyData] = useState({
        name: '',
        phone: '',
        location: '',
        description: ''
    });

    // Image Upload States
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [reviewPreview, setReviewPreview] = useState<string | null>(null);

    const logoInputRef = useRef<HTMLInputElement>(null);
    const reviewInputRef = useRef<HTMLInputElement>(null);

    const handleNext = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep(prev => prev + 1);
        }, 1500);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'logo' | 'review') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (target === 'logo') setLogoPreview(reader.result as string);
                else setReviewPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const specialties = [
        { id: 'food', label: 'أكلات بيتية', icon: <Utensils size={20}/> },
        { id: 'sweets', label: 'حلويات', icon: <ChefHat size={20}/> },
        { id: 'crafts', label: 'أعمال يدوية', icon: <Palette size={20}/> },
        { id: 'other', label: 'أخرى', icon: <Heart size={20}/> },
    ];

    return (
        <div className="fixed inset-0 z-[170] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-[56px] shadow-2xl overflow-hidden animate-slide-up border border-white/20 my-8">
                {step === 4 ? (
                    <div className="p-20 text-center space-y-8 animate-fade-in">
                        <div className="w-24 h-24 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto shadow-inner relative">
                            <CheckCircle2 size={48} />
                            <div className="absolute inset-0 rounded-full bg-orange-500/20 animate-ping"></div>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-3xl font-black text-slate-900">أهلاً بكِ في عائلتنا!</h3>
                            <p className="text-sm text-slate-500 font-bold leading-relaxed max-w-xs mx-auto">
                                تم استلام طلب انضمامك بنجاح. سيتواصل معكِ فريق "سوق المناقل" لمساعدتك في تفعيل متجرك وظهور منتجاتك للجميع.
                            </p>
                        </div>
                        <button onClick={onClose} className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black shadow-xl hover:bg-black transition-all">ابدئي رحلتكِ الآن</button>
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-orange-500 text-white rounded-[24px] flex items-center justify-center shadow-lg shadow-orange-500/20">
                                    <ChefHat size={30} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">تسجيل أسرة منتجة</h2>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">خطوة {step} من 3 • المناقل الرقمية</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-red-500 transition-all shadow-sm">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-10 flex-1">
                            {step === 1 && (
                                <div className="space-y-8 animate-fade-in">
                                    <div className="text-center">
                                        <h3 className="text-xl font-black text-slate-800 mb-2">ما هو تخصص مشروعكِ؟</h3>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">اختاري القسم الذي تبرعين فيه أكثر</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {specialties.map(s => (
                                            <button 
                                                key={s.id}
                                                onClick={() => setSpecialty(s.id)}
                                                className={`p-8 rounded-[40px] border-2 transition-all flex flex-col items-center gap-4 group ${specialty === s.id ? 'border-orange-500 bg-orange-50 shadow-xl scale-105' : 'border-slate-50 bg-slate-50 hover:bg-white hover:border-orange-200'}`}
                                            >
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${specialty === s.id ? 'bg-orange-500 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
                                                    {s.icon}
                                                </div>
                                                <span className="text-xs font-black">{s.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">اسم المشروع أو الأسرة</label>
                                        <input 
                                            type="text" 
                                            placeholder="مثال: مطبخ الجودة البيتية" 
                                            value={familyData.name}
                                            onChange={(e) => setFamilyData({...familyData, name: e.target.value})}
                                            className="w-full bg-slate-50 border-none rounded-2xl py-5 px-8 font-bold text-slate-700 focus:ring-4 focus:ring-orange-500/5 transition-all" 
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">رقم الواتساب</label>
                                            <div className="relative group">
                                                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 group-focus-within:text-orange-600 transition-colors" size={16} />
                                                <input 
                                                    type="tel" 
                                                    placeholder="09xxxxxxxx" 
                                                    value={familyData.phone}
                                                    onChange={(e) => setFamilyData({...familyData, phone: e.target.value})}
                                                    className="w-full bg-slate-50 border-none rounded-2xl py-5 pr-12 pl-6 font-bold text-slate-700 focus:ring-4 focus:ring-orange-500/5" 
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">الحي في المناقل</label>
                                            <div className="relative group">
                                                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 group-focus-within:text-orange-600 transition-colors" size={16} />
                                                <input 
                                                    type="text" 
                                                    placeholder="حي الموظفين" 
                                                    value={familyData.location}
                                                    onChange={(e) => setFamilyData({...familyData, location: e.target.value})}
                                                    className="w-full bg-slate-50 border-none rounded-2xl py-5 pr-12 pl-6 font-bold text-slate-700 focus:ring-4 focus:ring-orange-500/5" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-blue-50 rounded-[32px] border border-blue-100 flex items-center gap-4">
                                        <div className="p-3 bg-white rounded-2xl text-blue-500 shadow-sm"><Sparkles size={20}/></div>
                                        <p className="text-[10px] text-blue-700 font-bold leading-relaxed">تلميحة سما: استخدام اسم يعبر عن "النظافة" و"الجودة" يجذب زبائن أكثر في المناقل.</p>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-8 animate-fade-in">
                                    <div className="text-center">
                                        <h3 className="text-xl font-black text-slate-800 mb-2">توثيق أعمالكِ</h3>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">ارفقي صوراً تعكس جودة ما تقدمينه للزبائن</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Logo / Work Attachment */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">صورة الشعار أو العمل</label>
                                            <div 
                                                onClick={() => logoInputRef.current?.click()}
                                                className={`relative aspect-square rounded-[40px] border-4 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-4 text-center group ${logoPreview ? 'border-orange-500 bg-orange-50/20' : 'border-slate-100 bg-slate-50/50 hover:border-orange-200'}`}
                                            >
                                                {logoPreview ? (
                                                    <div className="relative w-full h-full">
                                                        <img src={logoPreview} className="w-full h-full object-cover rounded-[32px] shadow-lg" alt="Logo" />
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); setLogoPreview(null); }}
                                                            className="absolute -top-2 -left-2 bg-red-500 text-white p-2 rounded-xl shadow-xl hover:scale-110 transition-all"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-orange-500 transition-all shadow-sm mb-3">
                                                            <Camera size={32} />
                                                        </div>
                                                        <p className="text-[11px] font-black text-slate-400">صورة لمنتجك أو شعار خاص بك</p>
                                                    </>
                                                )}
                                                <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'logo')} />
                                            </div>
                                        </div>

                                        {/* Customer Review Attachment */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">صورة من تقييمات الزبائن</label>
                                            <div 
                                                onClick={() => reviewInputRef.current?.click()}
                                                className={`relative aspect-square rounded-[40px] border-4 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-4 text-center group ${reviewPreview ? 'border-orange-500 bg-orange-50/20' : 'border-slate-100 bg-slate-50/50 hover:border-orange-200'}`}
                                            >
                                                {reviewPreview ? (
                                                    <div className="relative w-full h-full">
                                                        <img src={reviewPreview} className="w-full h-full object-cover rounded-[32px] shadow-lg" alt="Review" />
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); setReviewPreview(null); }}
                                                            className="absolute -top-2 -left-2 bg-red-500 text-white p-2 rounded-xl shadow-xl hover:scale-110 transition-all"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-orange-500 transition-all shadow-sm mb-3">
                                                            <MessageSquare size={32} />
                                                        </div>
                                                        <p className="text-[11px] font-black text-slate-400">لقطة شاشة لمدح زبون لك</p>
                                                    </>
                                                )}
                                                <input ref={reviewInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'review')} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center px-4">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">صفي جودة ما تقدمينه للزبائن</label>
                                            <span className="text-[9px] font-black text-orange-400 flex items-center gap-1"><Wand2 size={10}/> سما ستراجع النص</span>
                                        </div>
                                        <textarea 
                                            rows={3} 
                                            value={familyData.description}
                                            onChange={(e) => setFamilyData({...familyData, description: e.target.value})}
                                            placeholder="نحن أسرة نتميز بصناعة المخبوزات السودانية التقليدية بأجود أنواع السمن والدقيق..." 
                                            className="w-full bg-slate-50 border-none rounded-[32px] py-6 px-8 font-bold text-slate-700 focus:ring-4 focus:ring-orange-500/5 resize-none shadow-inner" 
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center gap-6">
                            <button 
                                onClick={() => setStep(s => s - 1)}
                                disabled={step === 1}
                                className="px-10 py-5 bg-white border border-slate-200 text-slate-400 rounded-3xl font-black text-xs hover:bg-slate-100 disabled:opacity-0 transition-all shadow-sm"
                            >
                                السابق
                            </button>
                            <button 
                                onClick={step === 3 ? handleNext : () => setStep(s => s + 1)}
                                disabled={step === 1 && !specialty}
                                className="flex-1 bg-orange-600 text-white py-5 rounded-3xl font-black text-sm shadow-xl shadow-orange-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                {isLoading ? <Loader2 size={20} className="animate-spin" /> : step === 3 ? 'إرسال طلب الانضمام' : 'متابعة الخطوة التالية'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FamilyRegistrationModal;
