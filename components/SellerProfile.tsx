
import React from 'react';
import { Product } from '../types';
import { ChevronLeft, BadgeCheck, MapPin, Phone, MessageCircle, Star, Info, Share2, Store, Heart, MessageSquare } from 'lucide-react';
import ProductCard from './ProductCard';

interface SellerProfileProps {
    sellerName: string;
    products: Product[];
    onBack: () => void;
    onProductClick: (product: Product) => void;
}

const REVIEWS = [
    { id: '1', user: 'إبراهيم حسن', rating: 5, comment: 'تاجر صادق وبضاعته ممتازة جداً، أنصح بالتعامل معه.', date: 'قبل أسبوع' },
    { id: '2', user: 'زينب عثمان', rating: 4, comment: 'تعامل راقي وسرعة في الرد على الاستفسارات.', date: 'قبل شهر' },
];

const SellerProfile: React.FC<SellerProfileProps> = ({ sellerName, products, onBack, onProductClick }) => {
    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl animate-slide-up">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-primary transition-all shadow-sm">
                    <ChevronLeft size={24} />
                </button>
                <h2 className="text-xl font-black text-gray-900">ملف البائع</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* Sidebar Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm text-center sticky top-28">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-primary mx-auto mb-4 border-4 border-white shadow-xl relative">
                            <Store size={40} />
                            <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1.5 rounded-full border-2 border-white">
                                <BadgeCheck size={16} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-1">{sellerName}</h3>
                        <div className="flex justify-center gap-1 text-yellow-400 mb-4">
                            {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                        </div>
                        <p className="text-xs text-gray-400 font-bold leading-relaxed mb-8 px-4">تاجر موثوق في سوق المناقل، متخصص في تجارة السلع الاستهلاكية والأجهزة.</p>
                        
                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-right">
                                <MapPin size={18} className="text-primary" />
                                <span className="text-sm font-bold text-gray-700">المناقل - السوق الكبير</span>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-right">
                                <Info size={18} className="text-primary" />
                                <span className="text-sm font-bold text-gray-700">عضو منذ 2022</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 bg-primary text-white py-4 rounded-2xl font-black text-xs shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                                <Phone size={14} /> اتصال
                            </button>
                            <button className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:scale-105 transition-all">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-12">
                    {/* Products Grid */}
                    <div>
                        <div className="flex justify-between items-center mb-10">
                            <h4 className="text-2xl font-black text-gray-900 tracking-tight">إعلانات {sellerName}</h4>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{products.length} إعلان نشط</span>
                        </div>
                        
                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {products.map(p => (
                                    <ProductCard key={p.id} product={p} onClick={onProductClick} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[40px] p-20 text-center border border-gray-100 shadow-sm">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-4">
                                    <Store size={40} />
                                </div>
                                <h5 className="text-lg font-black text-gray-400">لا توجد إعلانات نشطة حالياً</h5>
                            </div>
                        )}
                    </div>

                    {/* Reviews Section */}
                    <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-10">
                            <h4 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                <MessageSquare size={24} className="text-primary" />
                                آراء المشترين
                            </h4>
                            <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-2xl font-black text-xs">
                                <Star size={14} fill="currentColor" /> 4.9 تقييم عام
                            </div>
                        </div>

                        <div className="space-y-6">
                            {REVIEWS.map(review => (
                                <div key={review.id} className="p-8 bg-slate-50 rounded-[32px] border border-gray-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h5 className="font-black text-gray-900">{review.user}</h5>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase">{review.date}</span>
                                        </div>
                                        <div className="flex gap-1 text-yellow-400">
                                            {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed font-medium italic">"{review.comment}"</p>
                                </div>
                            ))}
                        </div>
                        
                        <button className="w-full mt-8 py-5 border-2 border-dashed border-gray-200 text-gray-400 rounded-[28px] font-black text-xs hover:border-primary/40 hover:text-primary transition-all">
                            أضف تقييمك لهذا التاجر
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerProfile;
