
import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Wheat, Activity } from 'lucide-react';

const LiveTicker: React.FC = () => {
    const newsItems = [
        { label: 'دولار أمريكي', value: '1,250', up: true },
        { label: 'ريال سعودي', value: '335', up: false },
        { label: 'فول سوداني', value: '450k', up: true },
        { label: 'سمسم أبيض', value: '680k', up: true },
        { label: 'درهم إماراتي', value: '340', up: true },
        { label: 'ذهب عيار 21', value: '72,000', up: false },
    ];

    return (
        <div className="bg-slate-900 text-white overflow-hidden py-3 border-b border-white/5">
            <div className="flex animate-[ticker_30s_linear_infinite] whitespace-nowrap gap-12 items-center min-w-full">
                {/* Repeat items twice for infinite scroll effect */}
                {[...newsItems, ...newsItems].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.label}</span>
                        <span className="text-sm font-black text-white">{item.value}</span>
                        {item.up ? (
                            <TrendingUp size={14} className="text-emerald-400" />
                        ) : (
                            <TrendingDown size={14} className="text-red-400" />
                        )}
                        <div className="w-1.5 h-1.5 bg-white/10 rounded-full mx-4"></div>
                    </div>
                ))}
            </div>
            <style>{`
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(50%); }
                }
            `}</style>
        </div>
    );
};

export default LiveTicker;
