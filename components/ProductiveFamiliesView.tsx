
import React, { useState, useEffect } from 'react';
import { ChefHat, Search, Filter, Plus, ChevronLeft, ShieldCheck, Clock, Star, Utensils, Palette, Heart, CheckCircle2, Loader2, MessageCircle } from 'lucide-react';
import { Product, UserProfile, FamilyStatus } from '../types';
import { ref, push, onValue, update } from 'firebase/database';
import { db } from '../firebase';
import ProductCard from './ProductCard';

interface ProductiveFamiliesViewProps {
    onBack: () => void;
    user: UserProfile | null;
    onProductClick: (p: Product) => void;
}

const ProductiveFamiliesView: React.FC<ProductiveFamiliesViewProps> = ({ onBack, user, onProductClick }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isApplying, setIsApplying] = useState(false);
    const [familyForm, setFamilyForm] = useState({ name: '', specialty: 'food', phone: '' });
    const [requestStatus, setRequestStatus] = useState<FamilyStatus>(user?.familyStatus || 'none');

    useEffect(() => {
        const productsRef = ref(db, 'Mangal-Shop/products');
        onValue(productsRef, (snap) => {
            if (snap.exists()) {
                const all = Object.values(snap.val()) as Product[];
                setProducts(all.filter(p => p.categoryId === 'home_made'));
            }
        });
    }, []);

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return alert("يرجى تسجيل الدخول أولاً");
        
        setIsApplying(true);
        try {
            const requestRef = ref(db, `Mangal-Shop/family_requests/${user.id}`);
            await update(requestRef, {
                userId: user.id,
                familyName: familyForm.name,
                specialty: familyForm.specialty,
                phone: familyForm.phone,
                status: 'pending',
                timestamp: Date.now()
            });
            // تحديث حالة المستخدم محلياً في قاعدة البيانات
            await update(ref(db, `Mangal-Shop/users/${user.id}`), { familyStatus: 'pending' });
            setRequestStatus('pending');
            alert("تم إرسال طلبك للإدارة. سيتم الرد خلال 24 ساعة.");
        } catch (e) {
            alert("خطأ في الاتصال.");
        }
        setIsApplying(false);
    };

    const filtered = products.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl animate-slide-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-8">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="p-4 bg-white border border-slate-100 rounded-[24px] text-slate-400 hover:text-orange-500 transition-all shadow-sm">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-1">منصة الأسر المنتجة</h2>
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.2em]">أصالة الصناعة اليدوية من بيوت المناقل</p>
                    </div>
                </div>
                
                {requestStatus === 'approved' ? (
                    <div className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-full border border-emerald-100 font-black text-xs flex items-center gap-2">
                        <CheckCircle2 size={18} /> أسرة معتمدة
                    </div>
                ) : requestStatus === 'pending' ? (
                    <div className="bg-amber-50 text-amber-600 px-6 py-3 rounded-full border border-amber-100 font-black text-xs flex items-center gap-2">
                        <Clock size={18} className="animate-spin-slow" /> طلبك قيد المراجعة
                    </div>
                ) : (
                    <button onClick={() => setIsApplying(true)} className="bg-orange-500 text-white px-8 py-4 rounded-[24px] font-black text-xs shadow-xl shadow-orange-500/20 hover:scale-105 transition-all flex items-center gap-2">
                        <Plus size={18} /> انضمي كأسرة منتجة
                    </button>
                )}
            </div>

            {/* Application Modal */}
            {isApplying && requestStatus === 'none' && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-white w-full max-w-md rounded-[48px] shadow-2xl overflow-hidden p-10 space-y-8">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6"><ChefHat size={40}/></div>
                            <h3 className="text-2xl font-black text-slate-900">سجلي مشروعكِ المنزلي</h3>
                            <p className="text-xs text-slate-400 font-bold mt-2">انضمي لمئات الأسر في المناقل وابدئي بالبيع</p>
                        </div>
                        <form onSubmit={handleApply} className="space-y-4">
                            <input required type="text" placeholder="اسم المشروع (مثلاً: مطبخ البركة)" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold" value={familyForm.name} onChange={e => setFamilyForm({...familyForm, name: e.target.value})} />
                            <select className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold appearance-none" value={familyForm.specialty} onChange={e => setFamilyForm({...familyForm, specialty: e.target.value})}>
                                <option value="food">أكلات وحلويات</option>
                                <option value="crafts">أعمال يدوية وخياطة</option>
                                <option value="beauty">بخور وعطور</option>
                            </select>
                            <input required type="tel" placeholder="رقم التواصل واتساب" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold" value={familyForm.phone} onChange={e => setFamilyForm({...familyForm, phone: e.target.value})} />
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsApplying(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black">إلغاء</button>
                                <button type="submit" className="flex-[2] py-4 bg-orange-500 text-white rounded-2xl font-black shadow-lg">تقديم الطلب</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-sm space-y-8">
                        <div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-4">بحث سريع</h4>
                            <div className="relative">
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                <input type="text" placeholder="ماذا تشتهين اليوم؟" className="w-full bg-slate-50 border-none rounded-2xl py-3 pr-10 text-xs font-bold" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-4">التصنيفات</h4>
                             {[
                                { id: 'food', label: 'مأكولات', icon: <Utensils size={14}/> },
                                { id: 'sweets', label: 'حلويات', icon: <Star size={14}/> },
                                { id: 'crafts', label: 'أعمال يدوية', icon: <Palette size={14}/> },
                                { id: 'henna', label: 'بخور وحناء', icon: <Heart size={14}/> },
                             ].map(cat => (
                                 <button key={cat.id} className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-orange-50 transition-all group">
                                     <div className="flex items-center gap-3">
                                         <div className="text-orange-400 group-hover:scale-110 transition-transform">{cat.icon}</div>
                                         <span className="text-xs font-bold text-slate-600">{cat.label}</span>
                                     </div>
                                 </button>
                             ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[40px] text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <h4 className="text-xl font-black mb-4 leading-tight">ادعمي <br/>منتجات بلدك</h4>
                            <p className="text-[10px] opacity-60 font-bold leading-relaxed mb-6">كل عملية شراء من أسرة منتجة تساهم في نمو اقتصاد المناقل المحلي.</p>
                            <button className="flex items-center gap-2 text-orange-400 text-[10px] font-black uppercase tracking-widest hover:underline">مشاهدة قصص النجاح <MessageCircle size={14}/></button>
                        </div>
                        <ChefHat size={150} className="absolute -left-10 -bottom-10 opacity-5 group-hover:rotate-12 transition-transform duration-1000" />
                    </div>
                </div>

                <div className="lg:col-span-9">
                    {filtered.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {filtered.map(p => (
                                <ProductCard key={p.id} product={p} onClick={onProductClick} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-32 text-center bg-white rounded-[56px] border-4 border-dashed border-slate-50">
                            <ChefHat size={64} className="mx-auto text-slate-100 mb-6" />
                            <h3 className="text-2xl font-black text-slate-300 uppercase tracking-widest">لا توجد منتجات حالياً</h3>
                            <p className="text-slate-400 font-bold mt-2">كوني أول من يضيف لمسته هنا!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductiveFamiliesView;
