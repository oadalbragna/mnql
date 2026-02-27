
import React, { useState } from 'react';
import { X, Quote, ArrowRight, ArrowLeft, Star, Heart, TrendingUp, Sparkles } from 'lucide-react';

interface SuccessStoriesModalProps {
    onClose: () => void;
}

const STORIES = [
    {
        id: '1',
        name: 'أم سلمة للحلويات',
        title: 'من مطبخ صغير إلى أكبر مورد للأفراح في المناقل',
        image: 'https://picsum.photos/800/800?random=100',
        content: 'بدأت بمجرد صينية بسبوسة وزعتها على الجيران، واليوم بفضل الله ثم سوق المناقل، أصبح لدي فريق من 4 بنات يساعدنني في تلبية طلبيات الولاية كاملة. التطبيق سهل علي الوصول للزبائن وتنظيم المواعيد.',
        stats: '200+ طلب شهري',
        badge: 'قصة ملهمة'
    },
    {
        id: '2',
        name: 'مشغل نون للخياطة',
        title: 'إعادة إحياء الثوب السوداني بلمسة عصرية',
        image: 'https://picsum.photos/800/800?random=101',
        content: 'كان حلمي أن يرتدي أهل المناقل من إنتاجي. عرضت أعمالي في قسم الأسر المنتجة، وانبهرت من سرعة انتشار صوري. الآن نقوم بالشحن حتى لمدني والخرطوم.',
        stats: '1500 متابع محلي',
        badge: 'تميز حرفي'
    },
    {
        id: '3',
        name: 'منتجات القرية للأجبان',
        title: 'الطعم البلدي الأصيل لكل بيوت المناقل',
        image: 'https://picsum.photos/800/800?random=102',
        content: 'جبنة المناقل معروفة بجودتها، لكن كان ينقصنا التسويق. سوق المناقل الرقمي عرف الناس بموقعنا في قرية شكابة وصار الناس يقصدوننا بالاسم.',
        stats: 'تقييم 5 نجوم',
        badge: 'جودة بيئية'
    }
];

const SuccessStoriesModal: React.FC<SuccessStoriesModalProps> = ({ onClose }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const story = STORIES[activeIndex];

    const next = () => setActiveIndex(i => (i + 1) % STORIES.length);
    const prev = () => setActiveIndex(i => (i - 1 + STORIES.length) % STORIES.length);

    return (
        <div className="fixed inset-0 z-[170] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xl animate-fade-in overflow-y-auto">
            <div className="bg-white w-full max-w-5xl rounded-[64px] shadow-2xl overflow-hidden animate-slide-up flex flex-col md:flex-row relative my-8">
                <button onClick={onClose} className="absolute top-8 right-8 z-20 p-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl text-white hover:bg-white hover:text-slate-900 transition-all shadow-xl">
                    <X size={24} />
                </button>

                {/* Left: Visuals */}
                <div className="md:w-5/12 h-80 md:h-auto relative overflow-hidden group">
                    <img src={story.image} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt={story.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
                    <div className="absolute bottom-10 left-10 right-10">
                        <div className="inline-flex items-center gap-2 bg-orange-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white mb-4 shadow-lg">
                            <Sparkles size={14} /> {story.badge}
                        </div>
                        <h3 className="text-3xl font-black text-white leading-tight mb-2">{story.name}</h3>
                        <p className="text-sm text-white/70 font-bold">{story.stats}</p>
                    </div>
                </div>

                {/* Right: Narrative */}
                <div className="flex-1 p-12 md:p-20 flex flex-col justify-between space-y-12">
                    <div className="space-y-10">
                        <div className="w-16 h-16 bg-orange-50 rounded-3xl flex items-center justify-center text-orange-500 shadow-inner">
                            <Quote size={32} />
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">{story.title}</h2>
                            <p className="text-xl text-slate-500 leading-relaxed font-medium italic">"{story.content}"</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-12 border-t border-slate-100">
                        <div className="flex gap-4">
                            <button onClick={prev} className="w-14 h-14 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                <ArrowRight size={24} />
                            </button>
                            <button onClick={next} className="w-14 h-14 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                <ArrowLeft size={24} />
                            </button>
                        </div>
                        <div className="flex gap-2">
                            {STORIES.map((_, i) => (
                                <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === activeIndex ? 'w-10 bg-orange-500' : 'w-2 bg-slate-200'}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessStoriesModal;
