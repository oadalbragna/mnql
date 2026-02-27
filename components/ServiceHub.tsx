
import React from 'react';
import { Sprout, Gavel, Truck, Compass, Video, Wheat, Wallet, Users, ShieldCheck, Heart, CloudLightning, Database } from 'lucide-react';

interface ServiceHubProps {
    onNavigate: (view: string) => void;
}

const ServiceHub: React.FC<ServiceHubProps> = ({ onNavigate }) => {
    const services = [
        { id: 'agri-market', title: 'بورصة المحاصيل', icon: <Wheat size={28} />, bg: 'bg-emerald-50', color: 'text-emerald-600' },
        { id: 'marketing-studio', title: 'استوديو التسويق', icon: <Video size={28} />, bg: 'bg-purple-50', color: 'text-purple-600' },
        { id: 'agri-ai', title: 'طبيب المحاصيل', icon: <Sprout size={28} />, bg: 'bg-green-50', color: 'text-green-600' },
        { id: 'auction', title: 'الدلالة الرقمية', icon: <Gavel size={28} />, bg: 'bg-orange-50', color: 'text-orange-600' },
        { id: 'logistics', title: 'خدمات التوصيل', icon: <Truck size={28} />, bg: 'bg-blue-50', color: 'text-blue-600' },
        { id: 'places', title: 'دليل المناقل', icon: <Compass size={28} />, bg: 'bg-teal-50', color: 'text-teal-600' },
        { id: 'wallet', title: 'محفظتي المالية', icon: <Wallet size={28} />, bg: 'bg-indigo-50', color: 'text-indigo-600' },
        { id: 'community', title: 'ملتقى المجتمع', icon: <Users size={28} />, bg: 'bg-pink-50', color: 'text-pink-600' },
    ];

    return (
        <div className="container mx-auto px-4 py-8 pb-32 animate-fade-in max-w-5xl">
            <div className="mb-12 text-center md:text-right">
                <h2 className="text-3xl font-black text-slate-900 mb-2">مركز الخدمات</h2>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">حلول رقمية متكاملة لخدمتك في المناقل</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {services.map((s) => (
                    <button 
                        key={s.id}
                        onClick={() => onNavigate(s.id)}
                        className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm active:scale-95 hover:shadow-xl hover:border-primary/10 transition-all flex flex-col items-center justify-center text-center gap-4 h-44 group"
                    >
                        <div className={`w-16 h-16 ${s.bg} ${s.color} rounded-[24px] flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                            {s.icon}
                        </div>
                        <span className="font-black text-slate-800 text-sm md:text-base leading-tight">{s.title}</span>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                <button 
                    onClick={() => onNavigate('telegram-bridge')}
                    className="p-8 bg-slate-900 rounded-[48px] border border-white/10 flex items-center justify-between gap-6 group hover:shadow-2xl transition-all"
                >
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-blue-500/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-blue-400 shadow-lg group-hover:rotate-12 transition-transform">
                            <Database size={32} />
                        </div>
                        <div className="text-right">
                            <h4 className="font-black text-white text-xl leading-none">تخزين سحابي</h4>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">جسر تيليجرام الآمن</p>
                        </div>
                    </div>
                </button>

                <button 
                    onClick={() => onNavigate('safety')}
                    className="p-8 bg-white rounded-[48px] border border-slate-100 flex items-center justify-between gap-6 group hover:shadow-xl transition-all"
                >
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 shadow-inner group-hover:rotate-12 transition-transform">
                            <ShieldCheck size={32} />
                        </div>
                        <div className="text-right">
                            <h4 className="font-black text-slate-900 text-xl leading-none">مركز الأمان</h4>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">خصوصيتك أولويتنا</p>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default ServiceHub;
