
import React from 'react';
import { ChevronLeft, Gavel, Timer, TrendingUp, Users, Wheat, Award } from 'lucide-react';
import { Auction } from '../types';

interface AuctionViewProps {
    onBack: () => void;
    onAuctionClick: (auction: Auction) => void;
    auctions: Auction[];
}

const AuctionView: React.FC<AuctionViewProps> = ({ onBack, onAuctionClick, auctions }) => {
    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl animate-slide-up">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-500 shadow-sm">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">الدلالة الرقمية</h2>
                        <p className="text-sm text-gray-400 font-bold uppercase">مزادات حية مدعومة بقواعد البيانات</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {auctions.length > 0 ? auctions.map(auction => (
                    <div 
                        key={auction.id} 
                        onClick={() => onAuctionClick(auction)}
                        className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden group hover:border-primary/20 transition-all cursor-pointer"
                    >
                        <div className="relative h-64 overflow-hidden">
                            <img src={auction.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-black flex items-center gap-1.5">
                                <Timer size={12} className="animate-pulse" /> مزاد نشط
                            </div>
                            <div className="absolute bottom-6 right-6 text-white">
                                <div className="flex items-center gap-2 mb-1">
                                    {auction.type === 'crop' ? <Wheat size={16} className="text-yellow-400" /> : <Award size={16} className="text-orange-400" />}
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{auction.type === 'crop' ? 'محاصيل' : 'مواشي'}</span>
                                </div>
                                <h3 className="text-xl font-black">{auction.title}</h3>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase mb-1">أعلى مزايدة حالياً</p>
                                    <p className="text-3xl font-black text-primary">{auction.currentBid.toLocaleString()} <span className="text-xs">ج.س</span></p>
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] text-gray-400 font-black uppercase mb-1">المزايدات</p>
                                    <p className="text-lg font-black text-gray-700">{auction.bidsCount}</p>
                                </div>
                            </div>
                            <button className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-sm shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2">
                                <Gavel size={18} /> ادخل المزاد الحقيقي
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-2 py-32 text-center bg-white rounded-[40px] border-4 border-dashed border-slate-50">
                        <Gavel size={64} className="mx-auto text-slate-100 mb-6" />
                        <h4 className="text-2xl font-black text-slate-300">لا توجد مزادات نشطة حالياً</h4>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuctionView;
