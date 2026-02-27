
import React from 'react';
import { Product } from '../types';
import { ChevronLeft, Edit3, Trash2, Eye, TrendingUp, Sparkles, Package, Star } from 'lucide-react';

interface ManageListingsProps {
    products: Product[];
    onDelete: (id: string) => void;
    onBack: () => void;
}

const ManageListings: React.FC<ManageListingsProps> = ({ products, onDelete, onBack }) => {
    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl animate-slide-up">
            <div className="flex items-center gap-6 mb-12">
                <button onClick={onBack} className="p-4 bg-white border border-slate-100 rounded-[24px] text-slate-400 hover:text-primary transition-all shadow-sm">
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">إدارة إعلاناتي</h2>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">لديك {products.length} إعلانات نشطة في السوق</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {products.length > 0 ? products.map(p => (
                    <div key={p.id} className="bg-white rounded-[40px] p-8 border border-slate-50 shadow-sm flex flex-col md:flex-row gap-10 hover:shadow-2xl transition-all group overflow-hidden relative">
                        <div className="w-full md:w-56 h-48 rounded-[32px] overflow-hidden shrink-0 shadow-inner relative">
                            <img src={p.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md p-2 rounded-xl text-primary shadow-lg border border-white/20">
                                <Package size={16} />
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-black text-slate-900 text-2xl mb-1">{p.title}</h3>
                                        <p className="text-3xl font-black text-primary tracking-tighter">{p.price.toLocaleString()} <span className="text-xs">ج.س</span></p>
                                    </div>
                                    <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">بانتظار المراجعة</div>
                                </div>
                                <div className="flex flex-wrap gap-8 text-[11px] text-slate-400 font-black uppercase tracking-[0.1em] border-t border-slate-50 pt-6 mt-2">
                                    <span className="flex items-center gap-2"><Eye size={16} className="text-primary"/> {p.views + 240} مشاهدة</span>
                                    <span className="flex items-center gap-2"><Star size={16} className="text-primary"/> {p.likes + 15} إعجاب</span>
                                    <span className="flex items-center gap-2 text-emerald-600 bg-emerald-50/50 px-3 py-1 rounded-lg"><TrendingUp size={16}/> أداء عالٍ جداً</span>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-8">
                                <button className="flex-1 bg-slate-900 text-white py-5 rounded-3xl font-black text-xs flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl">
                                    <Edit3 size={18} /> تعديل الإعلان
                                </button>
                                <button className="flex-1 bg-white text-slate-700 border border-slate-100 py-5 rounded-3xl font-black text-xs flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-sm">
                                    <Sparkles size={18} className="text-blue-500" /> طلب ترويج ذكي
                                </button>
                                <button onClick={() => onDelete(p.id)} className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-100">
                                    <Trash2 size={24} />
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="py-32 text-center bg-white rounded-[60px] border-4 border-dashed border-slate-50">
                        <Package size={64} className="mx-auto text-slate-200 mb-6" />
                        <h4 className="text-2xl font-black text-slate-400">قائمة إعلاناتك فارغة</h4>
                        <p className="text-slate-300 font-bold mt-2">ابدأ بعرض بضاعتك في سوق المناقل الآن</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageListings;
