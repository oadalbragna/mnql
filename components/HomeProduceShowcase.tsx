
import React, { useState, useMemo } from 'react';
import { ChefHat, ShoppingBag, Star, ChevronLeft, Heart, Search, Filter, Sparkles, Utensils, Gift, Palette, Clock, CheckCircle, Store, Flame, Coffee, PartyPopper, Users } from 'lucide-react';
import { Product, CategoryId } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import FamilyRegistrationModal from './FamilyRegistrationModal';
import SuccessStoriesModal from './SuccessStoriesModal';

const HOME_CATEGORIES = [
    { id: 'all', label: 'الكل', icon: <Store size={18}/> },
    { id: 'food', label: 'أكلات بيتية', icon: <Utensils size={18}/>, color: 'text-orange-500 bg-orange-50' },
    { id: 'sweets', label: 'حلويات', icon: <Flame size={18}/>, color: 'text-amber-500 bg-amber-50' },
    { id: 'crafts', label: 'أعمال يدوية', icon: <Palette size={18}/>, color: 'text-emerald-500 bg-emerald-50' },
    { id: 'gifts', label: 'هدايا', icon: <Gift size={18}/>, color: 'text-pink-500 bg-pink-50' },
    { id: 'drinks', label: 'مشروبات بلدية', icon: <Coffee size={18}/>, color: 'text-blue-500 bg-blue-50' },
];

const HomeProduceShowcase: React.FC<{ onBack: () => void, onProductClick: (p: Product) => void }> = ({ onBack, onProductClick }) => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isStoriesOpen, setIsStoriesOpen] = useState(false);

    const homeMadeProducts = useMemo(() => {
        return MOCK_PRODUCTS.filter(p => {
            const isHome = p.categoryId === CategoryId.HOME_MADE || 
                           p.title.includes('منزلي') || 
                           p.title.includes('بلدي') || 
                           p.title.includes('بيتي');
            
            const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
            
            if (activeTab === 'all') return isHome && matchesSearch;
            // More specific filtering based on keywords in title for categories
            const keywords: Record<string, string[]> = {
                food: ['أكلة', 'وجبة', 'طبيخ', 'غداء'],
                sweets: ['حلا', 'بسبوسة', 'تورتة', 'كيك'],
                crafts: ['صنع', 'يدوي', 'خياطة', 'نحت'],
                gifts: ['هدية', 'تغليف', 'بوكس'],
                drinks: ['عصير', 'شربات', 'قهوة']
            };
            const currentKeywords = keywords[activeTab] || [];
            const matchesCategory = currentKeywords.some(k => p.title.includes(k));
            
            return isHome && matchesSearch && (activeTab === 'all' || matchesCategory); 
        });
    }, [activeTab, searchQuery]);

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl animate-slide-up">
            {isRegisterOpen && <FamilyRegistrationModal onClose={() => setIsRegisterOpen(false)} />}
            {isStoriesOpen && <SuccessStoriesModal onClose={() => setIsStoriesOpen(false)} />}

            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-8">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="p-4 bg-white border border-orange-100 rounded-[24px] text-orange-500 hover:text-orange-700 transition-all shadow-sm hover:shadow-md">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-2">معرض الأسر المنتجة</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                            <p className="text-sm text-orange-600 font-black uppercase tracking-[0.2em]">بأيدي أهل المناقل • جودة بيتية</p>
                        </div>
                    </div>
                </div>
                
                <div className="relative w-full md:w-80 group">
                    <input 
                        type="text" 
                        placeholder="ابحث عن أكلة أو منتج معين..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-orange-100 rounded-3xl py-4 px-12 font-bold text-slate-700 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-200 outline-none transition-all shadow-sm"
                    />
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-300" size={18} />
                </div>
            </div>

            {/* Success Highlight Banner */}
            <div className="mb-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-[48px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl group">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-right">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-white/10">
                            <PartyPopper size={14} className="text-yellow-300" /> بائع الشهر المتميز
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black mb-4">مطبخ "أم سلمة" للحلويات</h3>
                        <p className="text-lg opacity-90 leading-relaxed font-medium mb-8">أكثر من 200 طلبية ناجحة هذا الشهر في المناقل. جربوا "البسبوسة بالقشطة" الشهيرة الآن!</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <button onClick={() => setIsStoriesOpen(true)} className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-black text-xs shadow-xl hover:scale-105 transition-all">مشاهدة قصة نجاحها</button>
                            <div className="flex items-center gap-2 text-sm font-black text-amber-100">
                                <CheckCircle size={18} /> بائع موثق منذ 2021
                            </div>
                        </div>
                    </div>
                    <div className="w-48 h-48 md:w-64 md:h-64 bg-white/10 rounded-[40px] border border-white/20 flex items-center justify-center backdrop-blur-sm group-hover:rotate-3 transition-transform duration-700">
                        <ChefHat size={120} className="text-white/80" />
                    </div>
                </div>
                <Sparkles className="absolute -left-10 -bottom-10 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-1000" size={300} />
            </div>

            {/* Category Filter Tabs */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-6 mb-12">
                {HOME_CATEGORIES.map((cat) => (
                    <button 
                        key={cat.id} 
                        onClick={() => setActiveTab(cat.id)}
                        className={`flex items-center gap-3 px-8 py-4 rounded-[28px] text-sm font-black whitespace-nowrap transition-all border ${activeTab === cat.id ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-105' : 'bg-white border-orange-50 text-slate-500 hover:border-orange-200'}`}
                    >
                        {cat.icon}
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Grid of Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {homeMadeProducts.length > 0 ? (
                    homeMadeProducts.map((p, i) => (
                        <div 
                            key={p.id} 
                            onClick={() => onProductClick(p)}
                            className="group bg-white rounded-[40px] border border-orange-50/60 hover:border-orange-200 transition-all duration-500 cursor-pointer overflow-hidden hover:shadow-[0_40px_80px_rgba(249,115,22,0.12)] hover:-translate-y-2 flex flex-col h-full"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img 
                                    src={p.imageUrl} 
                                    alt={p.title} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out" 
                                />
                                <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
                                    <div className="flex flex-col gap-2">
                                        <div className="bg-orange-500/95 backdrop-blur-md text-white px-4 py-2 rounded-2xl flex items-center gap-2 text-[9px] font-black shadow-xl border border-white/20 uppercase tracking-tighter">
                                            <Sparkles size={12} className="text-yellow-300" />
                                            شغل نظيف
                                        </div>
                                        <div className="bg-white/95 backdrop-blur-md text-orange-600 px-4 py-2 rounded-2xl flex items-center gap-2 text-[9px] font-black shadow-md border border-orange-100 uppercase tracking-tighter">
                                            <Clock size={12} />
                                            جاهز خلال ساعتين
                                        </div>
                                    </div>
                                    <button className="p-3.5 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:text-red-500 hover:bg-white transition-all border border-white/30">
                                        <Heart size={18} />
                                    </button>
                                </div>
                                <div className="absolute bottom-5 right-5 left-5">
                                    <div className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-2xl text-white font-black text-[10px] border border-white/10 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Store size={14} className="text-orange-400" />
                                            {p.sellerName}
                                        </div>
                                        <div className="flex items-center gap-1 text-yellow-400">
                                            <Star size={10} fill="currentColor" /> 4.9
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-8 flex flex-col flex-1">
                                <h3 className="font-black text-slate-900 text-xl mb-4 leading-snug line-clamp-2 group-hover:text-orange-500 transition-colors">{p.title}</h3>
                                
                                <div className="mt-auto flex justify-between items-center">
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-3xl font-black text-orange-600 tracking-tighter">{p.price.toLocaleString()}</span>
                                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">ج.س</span>
                                    </div>
                                    <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all shadow-inner">
                                        <ShoppingBag size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-32 text-center bg-white rounded-[56px] border-4 border-dashed border-orange-50 flex flex-col items-center">
                        <div className="w-24 h-24 bg-orange-50 text-orange-200 rounded-full flex items-center justify-center mb-6">
                            <Search size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-400">لم نجد منتجات بهذا الاسم</h3>
                        <p className="text-slate-300 font-bold mt-2">جرب البحث بكلمات أبسط مثل "بسبوسة" أو "بخور"</p>
                        <button onClick={() => setSearchQuery('')} className="mt-8 text-orange-500 font-black text-sm hover:underline">عرض جميع المنتجات المنزلية</button>
                    </div>
                )}
            </div>

            {/* Join CTA */}
            <div className="mt-24 bg-slate-900 rounded-[64px] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
                    <div className="max-w-2xl text-center lg:text-right">
                        <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">ابدئي مشروعك المنزلي <br/><span className="text-orange-400">مع سوق المناقل</span></h2>
                        <p className="text-lg opacity-60 font-medium leading-relaxed mb-10">ندعم أكثر من 150 أسرة منتجة في أحياء المناقل المختلفة. انضمي إلينا واعرضي منتجاتك مجاناً وبدون أي عمولة على المبيعات لزيادة دخل أسرتكِ.</p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                            <button 
                                onClick={() => setIsRegisterOpen(true)}
                                className="bg-orange-500 text-white px-12 py-5 rounded-3xl font-black text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-3"
                            >
                                <Users size={20}/>
                                سجلي كأسرة منتجة
                            </button>
                            <button 
                                onClick={() => setIsStoriesOpen(true)}
                                className="bg-white/10 text-white border border-white/20 px-12 py-5 rounded-3xl font-black text-sm hover:bg-white/20 transition-all flex items-center gap-3"
                            >
                                <Sparkles size={20}/>
                                مشاهدة قصص النجاح
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 shrink-0">
                        <div className="space-y-4 translate-y-8">
                            <div className="w-32 h-32 bg-orange-500 rounded-[40px] shadow-2xl flex items-center justify-center hover:rotate-6 transition-transform"><Utensils size={40}/></div>
                            <div className="w-32 h-32 bg-slate-800 rounded-[40px] flex items-center justify-center border border-white/5"><Heart size={40} className="text-pink-400"/></div>
                        </div>
                        <div className="space-y-4">
                            <div className="w-32 h-32 bg-slate-800 rounded-[40px] flex items-center justify-center border border-white/5"><Star size={40} className="text-amber-400"/></div>
                            <div className="w-32 h-32 bg-emerald-500 rounded-[40px] shadow-2xl flex items-center justify-center hover:-rotate-6 transition-transform"><Palette size={40}/></div>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
            </div>
        </div>
    );
};

export default HomeProduceShowcase;
