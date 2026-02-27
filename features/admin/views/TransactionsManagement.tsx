
import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowUpRight, ArrowDownLeft, Search, Download } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { WalletTransaction } from '../../../types';
import { db } from '../../../firebase';
import { ref, onValue } from 'firebase/database';

export const TransactionsManagement: React.FC = () => {
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const transRef = ref(db, 'Mangal-Shop/transactions');
        onValue(transRef, (snap) => {
            if (snap.exists()) {
                const data = Object.values(snap.val()) as WalletTransaction[];
                setTransactions(data.sort((a, b) => b.timestamp - a.timestamp));
            }
        });
    }, []);

    const filteredTransactions = transactions.filter(t => t.id.includes(search) || t.title.includes(search));

    const columns = [
        { key: 'id', label: 'رقم العملية (ID)', render: (val: string) => <span className="text-xs font-black text-slate-500 uppercase">{val.substring(0, 8)}...</span> },
        {
            key: 'type', label: 'النوع', render: (val: string, t: WalletTransaction) => (
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg w-max text-[9px] font-black uppercase ${
                    val === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                }`}>
                    {val === 'credit' ? <ArrowDownLeft size={12}/> : <ArrowUpRight size={12}/>}
                    {val === 'credit' ? 'إيداع / استلام' : 'سحب / تحويل'}
                </div>
            )
        },
        { key: 'title', label: 'التفاصيل', render: (val: string) => <span className="font-bold text-sm text-slate-700">{val}</span> },
        { 
            key: 'amount', label: 'المبلغ', render: (val: number, t: WalletTransaction) => (
                <span className={`font-black text-sm ${t.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {t.type === 'credit' ? '+' : '-'}{val.toLocaleString()} ج.س
                </span>
            )
        },
        { key: 'timestamp', label: 'التاريخ', render: (val: number) => <span className="text-xs text-slate-400 font-bold">{new Date(val).toLocaleString('ar-SA')}</span> },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex gap-4 bg-white p-4 rounded-[28px] shadow-sm border border-slate-100">
                <div className="flex-1 relative">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text" placeholder="البحث برقم العملية أو التفاصيل..." 
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pr-12 pl-6 font-bold text-slate-700 focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                </div>
                <button className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs flex items-center gap-2 shadow-xl hover:bg-black transition-all">
                    <Download size={16}/> تصدير CSV
                </button>
            </div>

            <DataTable columns={columns} data={filteredTransactions} emptyMessage="لا توجد عمليات مالية مسجلة" />
        </div>
    );
};
