
import React from 'react';
import { Product } from '../types';
import { ChevronLeft, Heart, ShoppingBag, LayoutGrid } from 'lucide-react';
import ProductCard from './ProductCard';

interface FavoritesViewProps {
    products: Product[];
    favorites: Set<string>;
    onBack: () => void;
    onProductClick: (p: Product) => void;
    onToggleFavorite: (id: string) => void;
}

const FavoritesView: React.FC<FavoritesViewProps> = ({ products, favorites, onBack, onProductClick, onToggleFavorite }) => {
    const favProducts = products.filter(p => favorites.has(p.id));

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl animate-slide-up">
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-500 shadow-sm">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">المفضلة</h2>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">لديك {favProducts.length} عناصر محفوظة</p>
                    </div>
                </div>
            </div>

            {favProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {favProducts.map(p => (
                        <ProductCard 
                            key={p.id} 
                            product={p} 
                            onClick={onProductClick} 
                            isFavorite={true} 
                            onToggleFavorite={(e) => { e.stopPropagation(); onToggleFavorite(p.id); }} 
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-[50px] p-24 text-center border border-gray-100 shadow-sm flex flex-col items-center">
                    <div className="w-24 h-24 bg-red-50 text-red-200 rounded-full flex items-center justify-center mb-6">
                        <Heart size={48} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">قائمة المفضلة فارغة</h3>
                    <p className="text-gray-400 font-medium mb-10">استكشف السوق وأضف السلع التي تنال إعجابك هنا للرجوع إليها لاحقاً.</p>
                    <button onClick={onBack} className="bg-primary text-white px-12 py-5 rounded-2xl font-black shadow-xl shadow-primary/20 flex items-center gap-3 hover:scale-105 transition-all">
                        <ShoppingBag size={24} /> تصفح السوق الآن
                    </button>
                </div>
            )}
        </div>
    );
};

export default FavoritesView;
