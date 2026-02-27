
import React, { useState, useEffect } from 'react';
import { Auction, Bid, UserProfile } from '../types';
import { ChevronLeft, Gavel, Timer, TrendingUp, Users, Wheat, Award, ShieldCheck, Sparkles, MessageCircle, ArrowUp } from 'lucide-react';
import { ref, push, update, onValue } from 'firebase/database';
import { db } from '../firebase';

const AuctionDetails: React.FC<{ auction: Auction, user: UserProfile | null, onBack: () => void }> = ({ auction, user, onBack }) => {
    const [bids, setBids] = useState<Bid[]>([]);
    const [currentBid, setCurrentBid] = useState(auction.currentBid);
    const [bidInput, setBidInput] = useState(currentBid + (auction.minIncrement || 10000));
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // جلب المزايدات الحية من Firebase
        const bidsRef = ref(db, `Mangal-Shop/auctions/${auction.id}/bids`);
        onValue(bidsRef, (snap) => {
            if (snap.exists()) {
                const bidsArray = Object.values(snap.val()) as Bid[];
                const sortedBids = bidsArray.sort((a, b) => b.amount - a.amount);
                setBids(sortedBids);
                if (sortedBids[0]) {
                    setCurrentBid(sortedBids[0].amount);
                    setBidInput(sortedBids[0].amount + (auction.minIncrement || 10000));
                }
            }
        });
    }, [auction.id]);

    const placeBid = async () => {
        if (!user) { alert("يرجى تسجيل الدخول للمزايدة!"); return; }
        if (bidInput <= currentBid) { alert("يجب أن تكون المزايدة أعلى من السعر الحالي!"); return; }
        
        setIsAnimating(true);
        try {
            const bidData: Bid = {
                id: Date.now().toString(),
                user: user.fullName,
                userId: user.id,
                amount: bidInput,
                time: new Date().toISOString()
            };
            
            // إضافة المزايدة للسجل
            const bidsRef = ref(db, `Mangal-Shop/auctions/${auction.id}/bids`);
            await push(bidsRef, bidData);
            
            // تحديث السعر الحالي للمزاد في قاعدة البيانات
            const auctionRef = ref(db, `Mangal-Shop/auctions/${auction.id}`);
            await update(auctionRef, {
                currentBid: bidInput,
                bidsCount: bids.length + 1
            });
        } catch (e) {
            alert("فشل إرسال المزايدة. يرجى التأكد من الاتصال.");
        } finally {
            setIsAnimating(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl animate-slide-up">
            <div className="flex items-center gap-4 mb-10">
                <button onClick={onBack} className="p-4 bg-white border border-slate-100 rounded-[24px] text-slate-400 hover:text-primary shadow-sm">
                    <ChevronLeft size={24} />
                </button>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">مزايدة حية مباشرة</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7 space-y-8">
                    <div className="relative aspect-video rounded-[56px] overflow-hidden shadow-2xl border-4 border-white">
                        <img src={auction.imageUrl} className="w-full h-full object-cover" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-10 right-10 text-white">
                             <div className="flex items-center gap-2 mb-2">
                                {auction.type === 'crop' ? <Wheat className="text-yellow-400" /> : <Award className="text-orange-400" />}
                                <span className="text-xs font-black uppercase tracking-widest opacity-80">{auction.type === 'crop' ? 'محصول نقدى' : 'مواشي'}</span>
                             </div>
                             <h1 className="text-4xl font-black">{auction.title}</h1>
                        </div>
                    </div>

                    <div className="bg-white rounded-[48px] p-10 border border-slate-50 shadow-sm">
                        <h3 className="text-xl font-black text-slate-900 mb-6">الوصف والتفاصيل</h3>
                        <p className="text-slate-600 leading-relaxed font-bold">{auction.description}</p>
                    </div>
                </div>

                <div className="lg:col-span-5 space-y-8">
                    <div className="bg-slate-900 rounded-[56px] p-10 text-white shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-[10px] text-teal-400 font-black uppercase tracking-widest mb-2">السعر الحالي في الدلالة</p>
                            <h2 className={`text-5xl font-black tracking-tighter transition-all ${isAnimating ? 'scale-110 text-teal-400' : ''}`}>
                                {currentBid.toLocaleString()} <span className="text-sm font-bold opacity-50">ج.س</span>
                            </h2>
                            <div className="mt-8 space-y-6">
                                <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                                    <div className="flex gap-4">
                                        <input 
                                            type="number" 
                                            value={bidInput}
                                            onChange={(e) => setBidInput(Number(e.target.value))}
                                            className="flex-1 bg-white/10 border border-white/10 rounded-2xl p-4 text-2xl font-black text-white outline-none"
                                        />
                                        <button onClick={placeBid} className="bg-primary text-white px-8 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl">زايد الآن</button>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-4 text-center">أقل زيادة مسموحة: {(auction.minIncrement || 10000).toLocaleString()} ج.س</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[50px] p-10 border border-slate-50 shadow-sm">
                        <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                            <TrendingUp size={22} className="text-primary" /> سجل المزايدات اللحظي
                        </h4>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
                            {bids.length > 0 ? bids.map((bid, i) => (
                                <div key={i} className={`flex items-center justify-between p-5 rounded-3xl border ${i === 0 ? 'bg-teal-50 border-teal-100 animate-pulse' : 'bg-slate-50 border-slate-100'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${i === 0 ? 'bg-primary text-white' : 'bg-white text-slate-400 shadow-sm'}`}>{bid.user[0]}</div>
                                        <div>
                                            <h5 className="font-black text-slate-800 text-sm">{bid.user}</h5>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(bid.time).toLocaleTimeString('ar-SA')}</p>
                                        </div>
                                    </div>
                                    <span className={`font-black text-lg ${i === 0 ? 'text-primary' : 'text-slate-600'}`}>{bid.amount.toLocaleString()}</span>
                                </div>
                            )) : (
                                <div className="text-center py-10 text-slate-300 font-black">لا توجد مزايدات بعد</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuctionDetails;
