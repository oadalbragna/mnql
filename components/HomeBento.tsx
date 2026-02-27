import React from 'react';
import { Sprout, Compass, Bus, Gavel, Globe, ArrowUpRight, Zap, Sparkles } from 'lucide-react';
import { useAppContext } from '../core/context/AppContext';
import * as Icons from 'lucide-react';

interface HomeBentoProps {
  onNavigate: (view: string) => void;
}

const HomeBento: React.FC<HomeBentoProps> = ({ onNavigate }) => {
  const { services } = useAppContext();

  // Default services if DB is empty
  const defaultServices = [
    { id: '1', name: 'شخص محاصيلك بالذكاء الاصطناعي', description: 'طبيب المحاصيل الذكي', icon: 'Sprout', route: 'agri-ai', type: 'featured', color: 'bg-gradient-to-br from-[#0F766E] to-[#0D9488]' },
    { id: '2', name: 'الرادار الجغرافي', description: 'تصفح الأسواق عبر الأقمار الصناعية', icon: 'Compass', route: 'map', type: 'standard', color: 'bg-white' },
    { id: '3', name: 'المواصلات', description: 'حجز الرحلات', icon: 'Bus', route: 'transport', type: 'small', color: 'bg-gradient-to-br from-blue-600 to-indigo-700' },
    { id: '4', name: 'المزاد الحي', description: 'الدلالة الرقمية', icon: 'Gavel', route: 'auction', type: 'small', color: 'bg-slate-900' }
  ];

  const displayServices = services.length > 0 ? services.filter(s => s.isActive) : defaultServices;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:gap-6">
      {displayServices.map((service) => {
        // @ts-ignore
        const Icon = Icons[service.icon] || Globe;
        
        if (service.type === 'featured') {
          return (
            <button key={service.id} onClick={() => onNavigate(service.route)} className={`col-span-1 md:col-span-2 md:row-span-2 ${service.color} rounded-[32px] p-8 text-white relative overflow-hidden group hover:shadow-premium transition-all duration-700 hover:-translate-y-1 text-right`}>
               <div className="relative z-10 flex flex-col h-full justify-between items-start">
                  <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-2xl border border-white/20 shadow-2xl"><Icon size={28} className="text-emerald-300" /></div>
                  <div className="space-y-2 text-right">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-100">{service.description}</span>
                    <h3 className="text-2xl md:text-3xl font-black mb-1 leading-tight tracking-tighter">{service.name}</h3>
                    <div className="pt-2"><div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary rounded-full text-[9px] font-black shadow-xl">ابدأ الآن <ArrowUpRight size={12} /></div></div>
                  </div>
               </div>
               <Globe className="absolute -left-20 -bottom-20 text-white/5 w-80 h-80 group-hover:rotate-12 transition-transform duration-1000" />
            </button>
          );
        }

        if (service.type === 'standard') {
            return (
                <button key={service.id} onClick={() => onNavigate(service.route)} className={`col-span-1 md:col-span-2 ${service.color} rounded-[32px] p-6 border border-slate-100 relative overflow-hidden group hover:shadow-premium transition-all duration-500 hover:-translate-y-1`}>
                    <div className="relative z-10 flex items-center justify-between h-full">
                        <div className="text-right">
                            <h3 className="text-lg font-black text-slate-900 mb-1">{service.name}</h3>
                            <p className="text-[9px] text-slate-400 font-bold">{service.description}</p>
                        </div>
                        <div className="w-12 h-12 bg-primary/5 rounded-[18px] flex items-center justify-center text-primary group-hover:rotate-180 transition-all duration-700"><Icon size={24} /></div>
                    </div>
                </button>
            );
        }

        return (
            <button key={service.id} onClick={() => onNavigate(service.route)} className={`col-span-1 ${service.color} rounded-[32px] p-6 text-white relative overflow-hidden group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 text-right`}>
                <div className="relative z-10 flex flex-col h-full justify-between items-start">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md"><Icon size={20} /></div>
                    <div>
                        <h3 className="text-base font-black mb-0.5">{service.name}</h3>
                        <p className="text-[8px] opacity-70 font-black uppercase tracking-widest">{service.description}</p>
                    </div>
                </div>
                {service.icon === 'Bus' ? <Zap className="absolute -left-4 -bottom-4 text-white/10 w-20 h-20" /> : <Sparkles className="absolute -left-4 -bottom-4 text-white/10 w-20 h-20" />}
            </button>
        );
      })}
    </div>
  );
};

export default HomeBento;
