import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, MapPin, Calendar, Phone, MessageCircle, Heart, Store, 
  ChevronRight, ShieldCheck, TrendingUp, ShoppingCart, 
  Share2, ArrowRight, CheckCircle, Star, UserCircle2,
  Gavel, Timer, Send, MessageSquare, AlertCircle, Loader2
} from 'lucide-react';
import { Product, Review, ChatThread } from '../types';
import FormattedText from './FormattedText';
import { FirebaseService } from '../services/firebaseService';
import { useAppContext } from '../core/context/AppContext';
import ProductCard from './ProductCard';
import SmartMedia from './SmartMedia';

interface ProductLandingPageProps {
    product: Product;
    onClose: () => void;
    isFavorite: boolean;
    onToggleFavorite: () => void;
    onAddToCart: (p: Product) => void;
    onSellerClick: (name: string) => void;
}

const ProductLandingPage: React.FC<ProductLandingPageProps> = ({ 
    product, onClose, isFavorite, onToggleFavorite, onAddToCart, onSellerClick
}) => {
    const { user, products: allProducts, toggleFavorite } = useAppContext();
    const [activeImage, setActiveImage] = useState(0);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];

    useEffect(() => {
        if (product.id) {
            FirebaseService.incrementProductViews(product.id);
        }
    }, [product.id]);

    const similarProducts = useMemo(() => {
        return allProducts
            .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
            .slice(0, 4);
    }, [allProducts, product]);

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return alert("يرجى تسجيل الدخول للتقييم");
        
        setIsSubmitting(true);
        const review: Review = {
            id: '',
            userId: user.emailOrPhone,
            userName: user.fullName,
            rating: newReview.rating,
            comment: newReview.comment,
            timestamp: new Date().toISOString()
        };

        await FirebaseService.addProductReview(product.id, review);
        setIsSubmitting(false);
        setShowReviewForm(false);
        setNewReview({ rating: 5, comment: '' });
    };

    const handleStartChat = async () => {
        if (!user) return alert("يرجى تسجيل الدخول للمراسلة");
        if (user.emailOrPhone === product.sellerPhone) return alert("لا يمكنك مراسلة نفسك!");

        const threadId = [user.emailOrPhone, product.sellerPhone].sort().join('_');
        const threadInfo: ChatThread = {
            id: threadId,
            participants: [user.emailOrPhone, product.sellerPhone],
            participantNames: {
                [user.emailOrPhone]: user.fullName,
                [product.sellerPhone]: product.sellerName
            },
            lastMessage: `استفسار عن: ${product.title}`,
            lastTimestamp: Date.now(),
            productId: product.id,
            productTitle: product.title
        };

        await FirebaseService.sendMessage(threadId, {
            senderId: user.emailOrPhone,
            text: `مرحباً، أود الاستفسار عن منتجك: ${product.title}`
        }, threadInfo);

        alert("تم بدء المحادثة بنجاح، يمكنك متابعة الرسائل من قسم الرسائل.");
    };

    return (
        <div className="fixed inset-0 z-[200] bg-white overflow-y-auto animate-fade-in no-scrollbar">
            {/* Header */}
            <div className="sticky top-0 z-[210] bg-white/90 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400"><ArrowRight size={24} /></button>
                    <h2 className="text-lg font-black text-slate-900 truncate max-w-[200px]">{product.title}</h2>
                </div>
                <div className="flex gap-2">
                    <button onClick={onToggleFavorite} className={`p-2.5 rounded-xl transition-all ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'}`}>
                        <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                    </button>
                </div>
            </div>

            <div className="container mx-auto max-w-6xl p-6 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
                    {/* Media */}
                    <div className="space-y-4">
                        <div className="relative aspect-square rounded-[32px] overflow-hidden bg-slate-100 shadow-xl border border-slate-100">
                            <SmartMedia fileId={images[activeImage]} className="w-full h-full object-cover" />
                            {product.isAuction && (
                                <div className="absolute bottom-4 left-4 right-4 bg-orange-500 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg">
                                    <div className="flex items-center gap-2 font-black text-xs"><Timer size={18}/> مزاد جاري</div>
                                    <div className="text-left font-black text-lg">{(product.currentBid || product.price).toLocaleString()} <span className="text-[10px] opacity-60">ج.س</span></div>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
                            {images.map((id, i) => (
                                <button key={i} onClick={() => setActiveImage(i)} className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${activeImage === i ? 'border-primary' : 'border-transparent opacity-60'}`}>
                                    <SmartMedia fileId={id} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-between py-2">
                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-1.5 border border-emerald-100"><CheckCircle size={12} /> فحص ومعاينة</span>
                                <span className="bg-primary/5 text-primary px-3 py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-1.5 border border-primary/10"><TrendingUp size={12} /> الأكثر طلباً</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">{product.title}</h1>
                            <div className="text-4xl font-black text-primary">{product.price.toLocaleString()} <span className="text-sm opacity-50">ج.س</span></div>
                            <div className="flex items-center gap-6 text-slate-500 font-bold text-sm">
                                <div className="flex items-center gap-2"><MapPin size={18} className="text-primary"/> {product.location}</div>
                                <div className="flex items-center gap-2"><Store size={18} className="text-primary"/> {product.sellerName}</div>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase mb-3">الوصف</h4>
                                <FormattedText text={product.description} className="text-sm text-slate-600 leading-relaxed font-bold" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 pt-8 border-t border-slate-100">
                            <button onClick={() => onAddToCart(product)} className="w-full bg-primary text-white py-5 rounded-2xl font-black shadow-xl flex items-center justify-center gap-3"><ShoppingCart size={20}/> شراء السلعة</button>
                            <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => window.open(`tel:${product.sellerPhone}`)} className="bg-slate-900 text-white py-5 rounded-2xl font-black shadow-xl flex items-center justify-center"><Phone size={20}/></button>
                                <button onClick={() => window.open(`https://wa.me/${product.sellerPhone}`)} className="bg-emerald-500 text-white py-5 rounded-2xl font-black shadow-xl flex items-center justify-center"><MessageCircle size={20}/></button>
                                <button onClick={handleStartChat} className="bg-blue-600 text-white py-5 rounded-2xl font-black shadow-xl flex items-center justify-center"><MessageSquare size={20}/></button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="space-y-8 mb-20">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3"><Star size={24} className="text-amber-400 fill-current" /> آراء المشترين</h3>
                        <button onClick={() => setShowReviewForm(!showReviewForm)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-[10px]">أضف تقييمك</button>
                    </div>

                    {showReviewForm && (
                        <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-200 animate-slide-up mb-8">
                            <h4 className="font-black text-sm mb-4">ما رأيك في هذا المنتج؟</h4>
                            <form onSubmit={handleReviewSubmit} className="space-y-4">
                                <div className="flex gap-2">
                                    {[1,2,3,4,5].map(s => (
                                        <button key={s} type="button" onClick={() => setNewReview({...newReview, rating: s})} className={`p-2 rounded-lg transition-all ${newReview.rating >= s ? 'text-amber-400' : 'text-slate-300'}`}><Star size={24} fill={newReview.rating >= s ? "currentColor" : "none"}/></button>
                                    ))}
                                </div>
                                <textarea required value={newReview.comment} onChange={e => setNewReview({...newReview, comment: e.target.value})} placeholder="اكتب رأيك هنا بكل صراحة..." className="w-full bg-white border-none rounded-2xl p-4 font-bold text-sm shadow-inner min-h-[100px]" />
                                <button disabled={isSubmitting} type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-black text-[10px] shadow-lg flex items-center gap-2">
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : <>نشر التقييم <Send size={14}/></>}
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {product.reviews && Object.values(product.reviews).length > 0 ? Object.values(product.reviews).map((r: any) => (
                            <div key={r.id} className="bg-white p-6 rounded-3xl border border-slate-50 shadow-sm space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400"><UserCircle2 size={24}/></div>
                                        <div>
                                            <h5 className="font-black text-slate-900 text-sm">{r.userName}</h5>
                                            <div className="flex gap-0.5 text-amber-400">
                                                {[...Array(r.rating)].map((_, i) => <Star key={i} size={10} fill="currentColor"/>)}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[8px] text-slate-400 font-bold uppercase">{new Date(r.timestamp).toLocaleDateString()}</span>
                                </div>
                                <p className="text-slate-600 font-bold text-xs leading-relaxed italic">"{r.comment}"</p>
                                
                                {r.reply && (
                                    <div className="bg-primary/5 p-4 rounded-2xl border-r-4 border-primary">
                                        <p className="text-[9px] font-black text-primary uppercase mb-1 flex items-center gap-1"><MessageSquare size={10}/> رد التاجر</p>
                                        <p className="text-[11px] text-slate-700 font-bold leading-relaxed">{r.reply.text}</p>
                                    </div>
                                )}
                            </div>
                        )) : (
                            <div className="col-span-full py-16 text-center border-4 border-dashed border-slate-50 rounded-[40px]">
                                <p className="text-slate-300 font-black text-sm">كن أول من يقيّم هذا المنتج</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Similar Products */}
                {similarProducts.length > 0 && (
                    <div className="space-y-8">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">منتجات مشابهة قد تعجبك</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {similarProducts.map(p => (
                                <ProductCard 
                                    key={p.id} 
                                    product={p} 
                                    onClick={() => { onClose(); /* Re-open with new product logic if needed */ }} 
                                    isFavorite={false} 
                                    onToggleFavorite={() => toggleFavorite(p.id)}
                                    onAddToCart={() => onAddToCart(p)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductLandingPage;
