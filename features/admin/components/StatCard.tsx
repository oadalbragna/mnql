
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    colorClass: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, colorClass }) => {
    return (
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-4 rounded-xl ${colorClass} bg-opacity-10 text-current`}>
                    {icon}
                </div>
                {trend && (
                    <span className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${trend.isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                        {trend.isPositive ? '+' : ''}{trend.value}% {trend.isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    </span>
                )}
            </div>
            <div className="relative z-10">
                <h3 className="text-3xl font-black text-slate-900 mb-1">{value}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
            </div>
            <div className={`absolute -left-6 -bottom-6 w-32 h-32 opacity-5 ${colorClass.split(' ')[0]} group-hover:scale-110 transition-transform`} />
        </div>
    );
};
