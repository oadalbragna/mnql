
import React, { useState, useEffect } from 'react';
import { Package, Eye, EyeOff, Search, Star, Trash2 } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { ConfirmModal } from '../components/ConfirmModal';
import { Product } from '../../../types';
import { db } from '../../../firebase';
import { ref, onValue, update, remove } from 'firebase/database';

export const ProductsManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [targetProduct, setTargetProduct] = useState<Product | null>(null);

    useEffect(() => {
        const prodRef = ref(db, 'Mangal-Shop/products');
        onValue(prodRef, (snap) => {
            if (snap.exists()) {
                const data = Object.values(snap.val()) as Product[];
                setProducts(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            } else {
                setProducts([]);
            }
        });
    }, []);

    const toggleFeatured = async (product: Product) => {
        await update(ref(db, `Mangal-Shop/products/${product.id}`), { isPromoted: !product.isPromoted });
    };

    const confirmDelete = (product: Product) => {
        setTargetProduct(product);
        setIsModalOpen(true);
    };

    const executeDelete = async () => {
        if (targetProduct) {
            await remove(ref(db, `Mangal-Shop/products/${targetProduct.id}`));
            setIsModalOpen(false);
        }
    };

    const filteredProducts = products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.sellerName.includes(search));

    const columns = [
        {
            key: 'product', label: 'المنتج', render: (_: any, p: Product) => (
                <div className="flex items-center gap-3">
                    <img src={p.imageUrl} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="text-right">
                        <p className="font-black text-slate-800 text-sm truncate max-w-[200px]">{p.title}</p>
                        <p className="text-[10px] text-primary font-black mt-0.5">{p.price.toLocaleString()} ج.س</p>
                    </div>
                </div>
            )
        },
        { key: 'sellerName', label: 'التاجر', render: (val: string) => <span className="font-bold text-xs">{val}</span> },
        {
            key: 'views', label: 'المشاهدات', render: (val: number) => (
                <span className="flex items-center gap-1 font-black text-slate-600"><Eye size={14}/> {val || 0}</span>
            )
        },
        {
            key: 'status', label: 'التمييز', render: (_: any, p: Product) => (
                <button 
                    onClick={() => toggleFeatured(p)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase flex items-center gap-1 transition-all ${
                        p.isPromoted ? 'bg-amber-100 text-amber-600 border border-amber-200' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                >
                    <Star size={12} fill={p.isPromoted ? "currentColor" : "none"} />
                    {p.isPromoted ? 'مميز' : 'عادي'}
                </button>
            )
        },
        {
            key: 'actions', label: 'إجراءات', render: (_: any, p: Product) => (
                <button onClick={() => confirmDelete(p)} className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all">
                    <Trash2 size={16}/>
                </button>
            )
        }
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex gap-4 bg-white p-4 rounded-[28px] shadow-sm border border-slate-100">
                <div className="flex-1 relative">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text" placeholder="البحث عن منتج..." 
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pr-12 pl-6 font-bold text-slate-700 shadow-inner focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                </div>
            </div>

            <DataTable columns={columns} data={filteredProducts} emptyMessage="لا توجد منتجات مطابقة" />

            <ConfirmModal 
                isOpen={isModalOpen}
                title="حذف منتج مخالف"
                message={`سيتم حذف المنتج "${targetProduct?.title}" نهائياً من قاعدة البيانات.`}
                onConfirm={executeDelete}
                onCancel={() => setIsModalOpen(false)}
                isDestructive={true}
                confirmText="تأكيد الحذف"
            />
        </div>
    );
};
