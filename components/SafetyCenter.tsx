
import React, { useState } from 'react';
import { ChevronLeft, ShieldCheck, ShieldAlert, Users, PhoneCall, AlertTriangle, CheckCircle2, Info, ArrowRight, MessageSquare, Camera, Send, Search } from 'lucide-react';

const SafetyCenter: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [showReportForm, setShowReportForm] = useState(false);
    const [reportStatus, setReportStatus] = useState<'idle' | 'sending' | 'done'>('idle');

    const handleSendReport = (e: React.FormEvent) => {
        e.preventDefault();
        setReportStatus('sending');
        setTimeout(() => setReportStatus('done'), 1500);
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl animate-slide-up">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="p-4 bg-white border border-slate-100 rounded-[24px] text-slate-400 hover:text-primary shadow-sm transition-all">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">مركز الأمان</h2>
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">تداول بثقة وأمان في سوق المناقل</p>
                    </div>
                </div>
                <button onClick={() => setShowReportForm(true)} className="bg-red-500 text-white px-8 py-4 rounded-full font-black text-xs shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all flex items-center gap-2">
                    <AlertTriangle size={18} /> تبليغ عن احتيال
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                <div className="lg:col-span-8 space-y-8">
                    {/* Main Banner */}
                    <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-[56px] p-12 text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10 max-w-xl">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-white/10">
                                <ShieldAlert size={14} className="text-yellow-400" /> تنبيه أمان هام
                            </div>
                            <h3 className="text-4xl font-black mb-6 leading-tight">احذر من طلبات <br/>الدفع المسبق!</h3>
                            <p className="text-lg opacity-80 leading-relaxed font-medium mb-10">
                                إدارة سوق المناقل لا تطلب أبداً تحويل أموال مقابل خدمات التوثيق أو الرسوم عبر الهاتف. لا تقم بتحويل عربون قبل معاينة السلعة وجهاً لوجه.
                            </p>
                            <div className="flex gap-4">
                                <button className="bg-white text-red-600 px-8 py-4 rounded-2xl font-black text-xs shadow-xl hover:scale-105 transition-all">تعرف على المزيد</button>
                            </div>
                        </div>
                        <ShieldAlert size={350} className="absolute -left-20 -bottom-20 text-white/10 rotate-12" />
                    </div>

                    {/* Interactive Safety Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { title: 'البائع الموثق', desc: 'شارة الصح الزرقاء تعني أننا تحققنا من هوية البائع ومقره السكني في المناقل.', icon: <CheckCircle2 size={32}/>, color: 'text-emerald-500 bg-emerald-50' },
                            { title: 'المعاينة أولاً', desc: 'قابل البائع دائماً في مكان عام مثل (موقف ود مدني) أو (السوق الكبير) لمعاينة البضاعة.', icon: <Users size={32}/>, color: 'text-blue-500 bg-blue-50' },
                            { title: 'الرسائل الرسمية', desc: 'تواصل دائماً عبر التطبيق أو أرقام الهواتف الرسمية الموضحة في الإعلان فقط.', icon: <MessageSquare size={32}/>, color: 'text-orange-500 bg-orange-50' },
                            { title: 'حماية البيانات', desc: 'لا تشارك رمز التأكيد (OTP) الخاص بتطبيق بنكك أو فوري مع أي شخص يدعي أنه موظف دعم.', icon: <ShieldCheck size={32}/>, color: 'text-purple-500 bg-purple-50' }
                        ].map((tip, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-sm hover:shadow-xl transition-all group">
                                <div className={`w-16 h-16 ${tip.color} rounded-[24px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    {tip.icon}
                                </div>
                                <h4 className="text-xl font-black text-slate-900 mb-2">{tip.title}</h4>
                                <p className="text-sm text-slate-500 font-bold leading-relaxed">{tip.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white rounded-[48px] p-10 border border-slate-50 shadow-sm">
                        <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                            <PhoneCall size={24} className="text-primary" /> خطوط الطوارئ
                        </h4>
                        <div className="space-y-4">
                            {[
                                { name: 'دعم سوق المناقل', phone: '24912345678', type: 'واتساب' },
                                { name: 'شرطة المناقل', phone: '999', type: 'طوارئ' },
                                { name: 'الإسعاف المركزي', phone: '333', type: 'طوارئ' }
                            ].map((call, i) => (
                                <button key={i} onClick={() => window.open(`tel:${call.phone}`)} className="w-full flex items-center justify-between p-5 bg-slate-50 rounded-[28px] hover:bg-primary hover:text-white transition-all group">
                                    <div className="text-right">
                                        <p className="text-sm font-black mb-1">{call.name}</p>
                                        <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest">{call.type}</p>
                                    </div>
                                    <div className="w-10 h-10 bg-white text-primary rounded-xl flex items-center justify-center shadow-sm group-hover:bg-white/20 group-hover:text-white transition-all">
                                        <PhoneCall size={18} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[48px] p-10 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <h4 className="text-xl font-black mb-4">اختبار الأمان</h4>
                            <p className="text-xs opacity-60 font-bold leading-relaxed mb-8">اختبر معلوماتك في حماية نفسك من الاحتيال واحصل على شارة "مستخدم واعٍ".</p>
                            <button className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs shadow-xl">ابدأ الاختبار</button>
                        </div>
                        <Search size={150} className="absolute -left-10 -bottom-10 opacity-5 rotate-12 group-hover:scale-110 transition-transform" />
                    </div>
                </div>
            </div>

            {/* Report Modal */}
            {showReportForm && (
                <div className="fixed inset-0 z-[160] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-white w-full max-w-lg rounded-[50px] overflow-hidden shadow-2xl animate-slide-up border border-white/20">
                        {reportStatus === 'done' ? (
                            <div className="p-16 text-center space-y-8">
                                <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                    <CheckCircle2 size={48} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-slate-900">تم استلام البلاغ</h3>
                                    <p className="text-sm text-slate-500 font-bold leading-relaxed">شكراً لتعاونك. سيقوم فريق الأمان بمراجعة تفاصيل البلاغ والتعامل مع الحساب المشبوه فوراً.</p>
                                </div>
                                <button onClick={() => {setShowReportForm(false); setReportStatus('idle');}} className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black shadow-xl">العودة للرئيسية</button>
                            </div>
                        ) : (
                            <div className="p-10">
                                <div className="flex justify-between items-center mb-10">
                                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3"><AlertTriangle className="text-red-500" /> تقديم بلاغ</h3>
                                    <button onClick={() => setShowReportForm(false)} className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-red-500 transition-colors"><ArrowRight size={20}/></button>
                                </div>
                                <form onSubmit={handleSendReport} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">رابط الإعلان أو اسم البائع</label>
                                        <input required type="text" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold text-slate-700 focus:ring-4 focus:ring-red-500/5 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">وصف المشكلة</label>
                                        <textarea required rows={4} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold text-slate-700 focus:ring-4 focus:ring-red-500/5 transition-all resize-none" placeholder="اشرح ما حدث بالتفصيل..."></textarea>
                                    </div>
                                    <div className="flex gap-4 p-4 bg-red-50 rounded-3xl border border-red-100 items-start">
                                        <Info size={18} className="text-red-500 shrink-0" />
                                        <p className="text-[10px] text-red-600 font-bold leading-relaxed">تنبيه: تقديم بلاغات كاذبة قد يؤدي إلى حظر حسابك نهائياً من المنصة.</p>
                                    </div>
                                    <button disabled={reportStatus === 'sending'} type="submit" className="w-full py-5 bg-red-500 text-white rounded-3xl font-black shadow-xl shadow-red-500/20 flex items-center justify-center gap-3">
                                        {reportStatus === 'sending' ? <span className="animate-pulse">جاري الإرسال...</span> : <>إرسال البلاغ <Send size={18}/></>}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SafetyCenter;
