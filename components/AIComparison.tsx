
import React, { useState } from 'react';
import { Product } from '../types';
import { X, Scale, Sparkles, ChevronLeft, Loader2, ArrowRightLeft, ThumbsUp } from 'lucide-react';
import { compareProductsWithAI } from '../services/geminiService';

interface AIComparisonProps {
    p1: Product;
    p2: Product;
    onClose: () => void;
}

const AIComparison: React.FC<AIComparisonProps> = ({ p1, p2, onClose }) => {
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCompare = async () => {
        setIsLoading(true);
        const advice = await compareProductsWithAI(p1, p2);
        setResult(advice);
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fade-in">
            <div className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-slide-up">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center">
                            <Scale size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900">مقارنة ذكية</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">دع "سما" تساعدك في الاختيار</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
                </div>

                <div className="p-8 flex-1 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-8 relative mb-12">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full border border-gray-100 shadow-xl text-primary">
                            <ArrowRightLeft size={20} />
                        </div>

                        {[p1, p2].map((p, i) => (
                            <div key={i} className="space-y-4">
                                <div className="aspect-square rounded-[32px] overflow-hidden border border-gray-100 shadow-sm">
                                    <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="text-center">
                                    <h3 className="font-black text-gray-900 truncate">{p.title}</h3>
                                    <p className="text-primary font-black">{p.price.toLocaleString()} ج.س</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {!result && !isLoading && (
                        <button 
                            onClick={handleCompare}
                            className="w-full py-6 bg-primary text-white rounded-3xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                        >
                            <Sparkles size={24} className="text-yellow-300" />
                            ابدأ التحليل الذكي للمقارنة
                        </button>
                    )}

                    {isLoading && (
                        <div className="py-12 text-center space-y-4 animate-pulse">
                            <Loader2 size={48} className="text-primary animate-spin mx-auto" />
                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">جاري استشارة خبير السوق...</p>
                        </div>
                    )}

                    {result && (
                        <div className="bg-emerald-50 rounded-[40px] p-8 border border-emerald-100 animate-fade-in relative overflow-hidden">
                            <div className="absolute -right-6 -bottom-6 opacity-5 text-emerald-600"><ThumbsUp size={150} /></div>
                            <h4 className="text-[10px] font-black text-emerald-600 uppercase mb-4 tracking-widest">نصيحة "سما":</h4>
                            <p className="text-emerald-900 font-medium leading-relaxed whitespace-pre-wrap relative z-10">{result}</p>
                        </div>
                    )}
                </div>
                
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-center">
                    <p className="text-[10px] text-gray-400 font-bold italic">ملاحظة: هذا التحليل يعتمد على البيانات المتوفرة في الإعلانات فقط.</p>
                </div>
            </div>
        </div>
    );
};

export default AIComparison;
