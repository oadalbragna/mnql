
import React from 'react';
import { ChevronLeft, ShieldCheck, MapPin, Search, Bot, MessageSquare, Zap, LucideIcon } from 'lucide-react';

interface GuideStep {
    title: string;
    desc: string;
    icon: LucideIcon;
    color: string;
}

const VisitorGuide: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const steps: GuideStep[] = [
        { title: 'ابحث عما تريد', desc: 'استخدم شريط البحث الذكي أو تصفح الأقسام للعثور على أفضل الصفقات في المناقل.', icon: Search, color: 'bg-blue-50 text-blue-500' },
        { title: 'تحدث مع سما', icon: Bot, desc: 'سما مساعدتك الذكية، اسألها عن الأسعار، أو اطلب منها جلب أخبار السوق لحظة بلحظة.', color: 'bg-emerald-50 text-emerald-500' },
        { title: 'تواصل بأمان', icon: MessageSquare, desc: 'تواصل مع البائعين عبر الواتساب أو المكالمات المباشرة، وتأكد من المعاينة قبل الشراء.', color: 'bg-orange-50 text-orange-500' },
        { title: 'نشر إعلاناتك', icon: Zap, desc: 'هل لديك شيء للبيع؟ بضغطة زر يمكنك إضافة إعلانك والوصول لآلاف المشترين.', color: 'bg-purple-50 text-purple-500' }
    ];

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl animate-slide-up">
            <div className="flex items-center gap-4 mb-12">
                <button onClick={onBack} className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-500">
                    <ChevronLeft size={24} />
                </button>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">دليل المستخدم الجديد</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {steps.map((step, i) => {
                    const StepIcon = step.icon;
                    return (
                        <div key={i} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-md transition-all flex gap-6">
                            <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center shrink-0 ${step.color}`}>
                                <StepIcon size={32} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-gray-900 mb-2">{step.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">{step.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-primary rounded-[50px] p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10">
                    <h3 className="text-3xl font-black mb-6 flex items-center gap-3">
                        <ShieldCheck size={32} className="text-yellow-400" />
                        نصائح الأمان في سوقنا
                    </h3>
                    <ul className="space-y-4">
                        {[
                            'قابل البائع دائماً في مكان عام ومعروف (مثل السوق الكبير).',
                            'لا تقم بتحويل مبالغ مالية قبل معاينة المنتج واستلامه.',
                            'تأكد من وجود شارة "بائع موثق" في ملف التاجر لمزيد من الأمان.',
                            'في حال وجود أي مشكلة، تواصل فوراً مع إدارة سوق المناقل.'
                        ].map((tip, i) => (
                            <li key={i} className="flex gap-3 text-sm font-bold opacity-90 leading-relaxed">
                                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full shrink-0 mt-2"></span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                    <button onClick={onBack} className="mt-10 bg-white text-primary px-10 py-4 rounded-[24px] font-black hover:scale-105 transition-all">ابدأ التصفح الآن</button>
                </div>
                <div className="absolute -left-20 -bottom-20 text-white/10 rotate-12 scale-150">
                    <ShieldCheck size={400} />
                </div>
            </div>
        </div>
    );
};

export default VisitorGuide;
