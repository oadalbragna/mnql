
import React from 'react';
import { Product } from '../types';
import { MapPin, Heart, ShoppingBag, Share2 } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    onClick: (product: Product) => void;
    isFavorite?: boolean;
    onToggleFavorite?: (e: React.MouseEvent) => void;
    onAddToCart?: (e: React.MouseEvent) => void;
}

import SmartMedia from './SmartMedia';

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, isFavorite, onToggleFavorite, onAddToCart }) => {
    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (navigator.share) {
            navigator.share({
                title: product.title,
                text: `شاهد هذا العرض المتميز في سوق المناقل: ${product.title}`,
                url: window.location.href,
            }).catch(() => {});
        } else {
            alert("رابط السلعة تم نسخه للمشاركة");
        }
    };

    return (
        <div 
            onClick={() => onClick(product)}
            className="bg-white rounded-[32px] border border-slate-100 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col h-full shadow-sm group"
        >
            <div className="relative aspect-[4/3] w-full bg-slate-50 overflow-hidden">
                <SmartMedia 
                    fileId={product.imageUrl} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
                    {product.isPromoted && (
                        <span className="bg-yellow-400 text-yellow-900 text-[9px] font-black px-2.5 py-1 rounded-full shadow-lg uppercase tracking-tighter">
                            لقطة
                        </span>
                    )}
                    <div className="flex gap-2 pointer-events-auto">
                        <button 
                            onClick={handleShare}
                            className="p-2 rounded-xl bg-white/90 backdrop-blur-md shadow-lg text-slate-400 hover:text-primary transition-all"
                        >
                            <Share2 size={16} />
                        </button>
                        <button 
                            onClick={onToggleFavorite}
                            className={`p-2 rounded-xl bg-white/90 backdrop-blur-md shadow-lg transition-all active:scale-90 ${isFavorite ? 'text-red-500' : 'text-slate-300 hover:text-red-400'}`}
                        >
                            <Heart size={16} className={isFavorite ? "fill-current" : ""} />
                        </button>
                    </div>
                </div>
                
                <div className="absolute bottom-3 right-3 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[9px] font-bold border border-white/10 flex items-center gap-1.5 pointer-events-none">
                    <MapPin size={10} className="text-primary-light" />
                    <span className="truncate max-w-[80px]">{(product.location || '').split('-')[0]}</span>
                </div>
            </div>

            <div className="p-4 md:p-5 flex flex-col flex-1">
                <h3 className="font-bold text-slate-800 text-sm md:text-base leading-tight line-clamp-1 group-hover:text-primary transition-colors mb-2">
                    {product.title}
                </h3>
                
                <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">السعر</p>
                        <div className="font-black text-lg md:text-xl text-primary leading-none">
                            {(product.price || 0).toLocaleString()} <span className="text-[10px] text-slate-400">ج.س</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={onAddToCart}
                        className="w-10 h-10 md:w-12 md:h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-90"
                    >
                        <ShoppingBag size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
