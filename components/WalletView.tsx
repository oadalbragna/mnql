import React, { useState, useEffect } from 'react';
import { ChevronLeft, Wallet, ArrowUpRight, ArrowDownLeft, History, Plus, Copy, CheckCircle2, RefreshCw, CreditCard, Send, Loader2, AlertCircle } from 'lucide-react';
import { UserProfile, WalletTransaction } from '../types';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { WalletService } from '../services/walletService';

const WalletView: React.FC<{ user: UserProfile | null, onBack: () => void, onNavigate?: (v: string) => void }> = ({ user, onBack, onNavigate }) => {
    const [balance, setBalance] = useState(user?.balance || 0);
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    const [copied, setCopied] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    
    // Transfer States
    const [transferData, setTransferData] = useState({ phone: '', amount: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!user) return;
        const balanceRef = ref(db, `Mangal-Shop/users/${user.emailOrPhone}/balance`);
        onValue(balanceRef, (snap) => { if (snap.exists()) setBalance(snap.val()); });

        const transRef = ref(db, `Mangal-Shop/users/${user.emailOrPhone}/transactions`);
        onValue(transRef, (snap) => {
            if (snap.exists()) {
                const transArray = Object.values(snap.val()) as WalletTransaction[];
                setTransactions(transArray.sort((a, b) => b.timestamp - a.timestamp));
            }
        });
    }, [user]);

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !transferData.phone || !transferData.amount) return;
        
        setIsLoading(true);
        setError(null);
        
        const result = await WalletService.transfer(
            user.emailOrPhone, 
            transferData.phone, 
            parseFloat(transferData.amount)
        );

        setIsLoading(false);
        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                setIsTransferModalOpen(false);
                setSuccess(false);
                setTransferData({ phone: '', amount: '' });
            }, 2000);
        } else {
            setError(result.error || 'حدث خطأ');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-primary transition-all">
                        <ChevronLeft size={20} />
                    </button>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter">محفظتي الرقمية</h2>
                </div>
                <div className="bg-primary/5 px-4 py-2 rounded-xl flex items-center gap-3">
                    <span className="text-[10px] font-black text-primary uppercase">WL-ID: {user?.emailOrPhone}</span>
                    <button onClick={() => { navigator.clipboard.writeText(user?.emailOrPhone || ''); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                        {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} className="text-slate-400" />}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Card */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl border border-white/5">
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-2">الرصيد المتاح</p>
                            <h3 className="text-5xl font-black mb-10 tracking-tighter">{balance.toLocaleString()} <span className="text-lg opacity-50">ج.س</span></h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => onNavigate?.('payment-gateway')} className="bg-primary text-white py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-lg"><Plus size={18} /> شحن رصيد</button>
                                <button onClick={() => setIsTransferModalOpen(true)} className="bg-white/10 text-white border border-white/10 py-5 rounded-2xl font-black text-sm backdrop-blur-md hover:bg-white/20 transition-all flex items-center justify-center gap-2"><Send size={18} /> تحويل أموال</button>
                            </div>
                        </div>
                        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/20 rounded-full blur-[80px]"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-3xl border border-slate-50 shadow-sm">
                             <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center mb-4"><ArrowDownLeft size={20}/></div>
                             <p className="text-[9px] text-slate-400 font-black uppercase mb-1">إجمالي الوارد</p>
                             <p className="text-lg font-black text-slate-900">45,000</p>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-slate-50 shadow-sm">
                             <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mb-4"><ArrowUpRight size={20}/></div>
                             <p className="text-[9px] text-slate-400 font-black uppercase mb-1">إجمالي الصادر</p>
                             <p className="text-lg font-black text-slate-900">12,400</p>
                        </div>
                    </div>
                </div>

                {/* Recent History */}
                <div className="lg:col-span-4">
                    <div className="bg-white rounded-[40px] p-8 border border-slate-50 shadow-sm h-full flex flex-col">
                        <h4 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-8"><History size={20} className="text-primary" /> سجل العمليات</h4>
                        <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar max-h-[400px]">
                            {transactions.length > 0 ? transactions.map((t) => (
                                <div key={t.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-transparent hover:border-slate-100 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.type === 'credit' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                                            {t.type === 'credit' ? <ArrowDownLeft size={16}/> : <ArrowUpRight size={16}/>}
                                        </div>
                                        <div>
                                            <h5 className="font-black text-slate-800 text-[10px]">{t.title}</h5>
                                            <p className="text-[8px] text-slate-400 font-bold">{new Date(t.timestamp).toLocaleDateString('ar-SA')}</p>
                                        </div>
                                    </div>
                                    <span className={`font-black text-xs ${t.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {t.type === 'credit' ? '+' : '-'}{t.amount.toLocaleString()}
                                    </span>
                                </div>
                            )) : (
                                <div className="text-center py-10 opacity-30">
                                    <CreditCard size={32} className="mx-auto mb-2" />
                                    <p className="text-[10px] font-bold">لا توجد عمليات</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Transfer Modal */}
            {isTransferModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] w-full max-w-md p-10 animate-scale-up">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-4">
                                <Send size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">تحويل سريع</h3>
                            <p className="text-xs text-slate-400 font-bold mt-2">قم بتحويل الأموال لأي مشترك برقم هاتفه</p>
                        </div>

                        {error && <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black flex items-center gap-2 border border-red-100"><AlertCircle size={14}/> {error}</div>}
                        {success && <div className="mb-4 p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black flex items-center gap-2 border border-emerald-100"><CheckCircle2 size={14}/> تمت العملية بنجاح!</div>}

                        <form onSubmit={handleTransfer} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase px-4">رقم هاتف المستلم</label>
                                <input required type="tel" placeholder="09xxxxxxx" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold text-slate-900 shadow-inner" value={transferData.phone} onChange={e => setTransferData({...transferData, phone: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase px-4">المبلغ المراد تحويله</label>
                                <input required type="number" placeholder="0.00" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold text-slate-900 shadow-inner text-xl" value={transferData.amount} onChange={e => setTransferData({...transferData, amount: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <button type="button" onClick={() => setIsTransferModalOpen(false)} className="py-4 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all">إلغاء</button>
                                <button disabled={isLoading || success} type="submit" className="bg-slate-900 text-white py-4 rounded-2xl font-black shadow-xl flex items-center justify-center gap-2">
                                    {isLoading ? <Loader2 className="animate-spin" /> : 'تأكيد التحويل'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletView;
