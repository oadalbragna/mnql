
import React, { useState } from 'react';
import { Product, CategoryId } from '../types';
import { 
    X, MapPin, Calendar, Phone, MessageCircle, Heart, Store, 
    ChevronRight, ChevronLeft, ShieldCheck, TrendingUp, Video, 
    Loader2, Fuel, Settings, Box, Maximize2, Layers, ShoppingCart, 
    Plus, Monitor, Sun, ZoomIn, Info, Palette
} from 'lucide-react';
import { generateProductVideo } from '../services/geminiService';

interface ProductDetailsModalProps {
    product: Product;
    onClose: () => void;
    isFavorite: boolean;
    onToggleFavorite: (e: React.MouseEvent) => void;
    onSellerClick: (sellerName: string) => void;
    onAddToCart?: (product: Product) => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose, isFavorite, onToggleFavorite, onSellerClick, onAddToCart }) => {
    const [currentImgIndex, setCurrentImgIndex] = useState(0);
    const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(product.videoUrl || null);
    
    // Simulation States
    const [isSimulating, setIsSimulating] = useState(false);
    const [brightness, setBrightness] = useState(100);
    const [scale, setScale] = useState(100);

    const galleryImages = (product.images && product.images.length > 0) 
        ? product.images 
        : [product.imageUrl, `https://picsum.photos/800/600?random=${product.id}1`, `https://picsum.photos/800/600?random=${product.id}2`].filter(Boolean);

    const handleWhatsApp = () => {
        window.open(`https://wa.me/${product.sellerPhone}?text=مرحباً، بخصوص إعلانك في سوق المناقل: ${product.title}`, '_blank');
    };

    const handleCall = () => {
        window.open(`tel:${product.sellerPhone}`, '_self');
    };

    const handleGeneratePromoVideo = async () => {
        setIsGeneratingVideo(true);
        const url = await generateProductVideo(product.title, product.description);
        if (url) setVideoUrl(url);
        setIsGeneratingVideo(false);
    };

    const isCarpet = product.categoryId === CategoryId.CARPETS;

    const renderAttributeGrid = () => {
        if (!product.attributes && !product.carpetMetadata) return null;

        const attrItems = [];
        if (product.categoryId === CategoryId.CARS && product.attributes) {
            if (product.attributes.fuelType) attrItems.push({ label: 'الوقود', val: product.attributes.fuelType, icon: <Fuel size={18}/> });
            if (product.attributes.transmission) attrItems.push({ label: 'ناقل الحركة', val: product.attributes.transmission, icon: <Settings size={18}/> });
        } else if (product.categoryId === CategoryId.REAL_ESTATE && product.attributes) {
            if (product.attributes.propertyType) attrItems.push({ label: 'نوع العقار', val: product.attributes.propertyType, icon: <Store size={18}/> });
            if (product.attributes.space) attrItems.push({ label: 'المساحة', val: product.attributes.space, icon: <Maximize2 size={18}/> });
        } else if (isCarpet && product.carpetMetadata) {
            attrItems.push({ label: 'المنشأ', val: product.carpetMetadata.origin, icon: <Palette size={18}/> });
            attrItems.push({ label: 'المادة', val: product.carpetMetadata.material, icon: <Info size={18}/> });
            attrItems.push({ label: 'الكثافة', val: product.carpetMetadata.density, icon: <Layers size={18}/> });
        }

        if (attrItems.length === 0) return null;

        return (
            <div className="space-y-4">
                <h3 className="text-xl font-black text-gray-900">المواصفات الفنية</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {attrItems.map((item, i) => (
                        <div key={i} className="bg-slate-50 p-5 rounded-[28px] border border-slate-100 flex items-center gap-4 group hover:bg-white hover:shadow-lg transition-all">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                            <div>
                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{item.label}</p>
                                <p className="text-xs font-black text-gray-800">{item.val}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md pointer-events-auto" onClick={onClose} />

            <div className="bg-white w-full md:max-w-4xl md:rounded-[40px] rounded-t-[40px] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col pointer-events-auto animate-in slide-in-from-bottom duration-500">
                
                {/* Media Section / Simulation View */}
                <div className="relative h-[45vh] md:h-[550px] bg-gray-900 shrink-0 group overflow-hidden">
                    {isSimulating ? (
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200')] bg-cover bg-center flex items-center justify-center">
                            <div className="absolute inset-0 bg-black/20"></div>
                            <img 
                                src={product.imageUrl} 
                                alt="Simulation"
                                className="shadow-2xl transition-all duration-300"
                                style={{ 
                                    filter: `brightness(${brightness}%)`,
                                    transform: `scale(${scale / 100}) perspective(1000px) rotateX(45deg)`,
                                    maxWidth: '80%'
                                }}
                            />
                            
                            {/* Simulation Controls Overlay */}
                            <div className="absolute bottom-8 left-8 right-8 flex flex-col gap-4 z-20">
                                <div className="bg-black/40 backdrop-blur-xl p-6 rounded-[32px] border border-white/10 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <Sun size={20} className="text-yellow-400" />
                                        <input 
                                            type="range" min="50" max="150" value={brightness} 
                                            onChange={(e) => setBrightness(Number(e.target.value))}
                                            className="flex-1 accent-primary"
                                        />
                                        <span className="text-white text-[10px] font-black w-8">إضاءة</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <ZoomIn size={20} className="text-blue-400" />
                                        <input 
                                            type="range" min="50" max="150" value={scale} 
                                            onChange={(e) => setScale(Number(e.target.value))}
                                            className="flex-1 accent-primary"
                                        />
                                        <span className="text-white text-[10px] font-black w-8">المقاس</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsSimulating(false)}
                                    className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-xs shadow-xl"
                                >
                                    الخروج من المحاكي
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {videoUrl ? (
                                <video src={videoUrl} controls autoPlay className="w-full h-full object-contain" />
                            ) : (
                                <img src={galleryImages[currentImgIndex]} alt={product.title} className="w-full h-full object-contain" />
                            )}
                            
                            {!videoUrl && galleryImages.length > 1 && (
                                <>
                                    <button 
                                        onClick={() => setCurrentImgIndex(prev => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                    <button 
                                        onClick={() => setCurrentImgIndex(prev => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                </>
                            )}
                        </>
                    )}

                    <div className="absolute top-6 left-6 flex gap-2">
                        {isCarpet && !isSimulating && (
                            <button 
                                onClick={() => setIsSimulating(true)}
                                className="bg-primary text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 font-black text-xs shadow-xl hover:scale-105 transition-all"
                            >
                                <Monitor size={16} /> محاكاة في الغرفة
                            </button>
                        )}
                        <button 
                            onClick={handleGeneratePromoVideo}
                            disabled={isGeneratingVideo}
                            className="bg-white/95 backdrop-blur-md text-primary px-4 py-2.5 rounded-2xl flex items-center gap-2 font-black text-xs shadow-xl hover:scale-105 transition-all disabled:opacity-50"
                        >
                            {isGeneratingVideo ? <Loader2 size={16} className="animate-spin" /> : <Video size={16} />}
                            {isGeneratingVideo ? 'جاري الصنع...' : 'فيديو ترويجي (AI)'}
                        </button>
                    </div>

                    <button onClick={onClose} className="absolute top-6 right-6 bg-black/20 hover:bg-black/40 text-white p-3 rounded-2xl backdrop-blur-md transition-all"><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 scrollbar-hide">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-primary font-bold text-sm">
                                <TrendingUp size={16} />
                                <span>شوهد {product.views + 120} مرة هذا الأسبوع</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900">{product.title}</h2>
                            <div className="text-3xl font-black text-primary flex items-baseline gap-2">
                                {product.price.toLocaleString()} 
                                <span className="text-sm text-gray-400 font-bold">ج.س</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={onToggleFavorite}
                                className={`p-4 rounded-2xl border transition-all ${isFavorite ? 'bg-red-50 border-red-100 text-red-500 scale-110 shadow-lg' : 'bg-white border-gray-100 text-gray-400'}`}
                            >
                                <Heart size={24} className={isFavorite ? "fill-current" : ""} />
                            </button>
                            <button onClick={() => onAddToCart?.(product)} className="p-4 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 hover:scale-110 transition-all active:scale-95">
                                <ShoppingCart size={24} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100 flex items-center gap-3">
                            <MapPin className="text-primary" size={20} />
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold">الموقع</p>
                                <p className="text-sm font-bold">{product.location.split('-')[0]}</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100 flex items-center gap-3">
                            <Calendar className="text-primary" size={20} />
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold">تاريخ النشر</p>
                                <p className="text-sm font-bold">منذ يومين</p>
                            </div>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100 flex items-center gap-3">
                            <ShieldCheck className="text-emerald-600" size={20} />
                            <div>
                                <p className="text-[10px] text-emerald-600 font-bold">الحالة</p>
                                <p className="text-sm font-bold text-emerald-700">موثوق</p>
                            </div>
                        </div>
                    </div>

                    {renderAttributeGrid()}

                    <div className="space-y-4">
                        <h3 className="text-xl font-black text-gray-900">وصف المنتج</h3>
                        <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                            {product.description}
                        </p>
                    </div>

                    <div className="pt-8 border-t border-gray-100">
                        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm border-2 border-white">
                                    <Store size={32} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold mb-1">صاحب الإعلان</p>
                                    <h4 className="font-black text-gray-900 text-lg">{product.sellerName}</h4>
                                    <div className="flex items-center gap-1 text-[10px] text-blue-500 font-bold">
                                        <ShieldCheck size={12} /> بائع موثق
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => onSellerClick(product.sellerName)} className="bg-white px-6 py-3 rounded-xl text-primary font-bold text-sm border border-primary/10">
                                زيارة المتجر
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-gray-100 bg-white/80 backdrop-blur-md grid grid-cols-2 gap-4 shrink-0">
                    <button onClick={handleWhatsApp} className="flex items-center justify-center gap-3 bg-[#25D366] text-white py-5 rounded-[24px] font-black shadow-xl active:scale-95 transition-all">
                        <MessageCircle size={22} /> واتساب
                    </button>
                    <button onClick={handleCall} className="flex items-center justify-center gap-3 bg-primary text-white py-5 rounded-[24px] font-black shadow-xl active:scale-95 transition-all">
                        <Phone size={22} /> اتصال مباشر
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsModal;
