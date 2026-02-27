
import React, { useState, useMemo } from 'react';
import { Truck, Bike, ChevronLeft, MapPin, Phone, ShieldCheck, Clock, Zap, Navigation, ArrowRight, Package, Search, Info, Star, CreditCard } from 'lucide-react';

const DELIVERY_SERVICES = [
    { id: '1', name: 'ياسين محمد (ركشة)', area: 'حي الموظفين - السوق', rating: 4.9, price: '1200', status: 'available' },
    { id: '2', name: 'أحمد الطيب (تكتك)', area: 'السوق الشعبي - حي الثورة', rating: 4.8, price: '1500', status: 'available' },
    { id: '3', name: 'شركة ترحيل الجزيرة', area: 'المناقل - مدني', rating: 4.7, price: '8000', status: 'busy' },
];

const LogisticsHub: React.FC<{ onBack: () => void, onNavigate?: (v: string) => void }> = ({ onBack, onNavigate }) => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

    const calculateCost = () => {
        if (from && to) {
            // Mock price calculation logic
            setEstimatedPrice(1500 + Math.floor(Math.random() * 1000));
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl animate-slide-up">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="p-4 bg-white border border-slate-100 rounded-[24px] text-slate-400 hover:text-primary shadow-sm transition-all">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">خدمات التوصيل</h2>
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">تغطية شاملة لجميع أحياء المناقل والقرى المجاورة</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-emerald-50 text-emerald-600 px-6 py-3 rounded-full border border-emerald-100">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-widest">32 مندوب نشط الآن</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                {/* Cost Estimator Section */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-[48px] p-10 border border-slate-50 shadow-sm">
                        <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                            <Zap size={24} className="text-primary" /> حاسبة التكلفة
                        </h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">من (نقطة الاستلام)</label>
                                <div className="relative">
                                    <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                                    <select onChange={(e) => setFrom(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-4 pr-12 pl-6 font-bold text-slate-700 focus:ring-4 focus:ring-primary/5 appearance-none">
                                        <option value="">اختر الحي...</option>
                                        <option value="1">حي الموظفين</option>
                                        <option value="2">السوق الكبير</option>
                                        <option value="3">حي الثورة</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">إلى (نقطة التوصيل)</label>
                                <div className="relative">
                                    <Navigation className="absolute right-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                                    <select onChange={(e) => setTo(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-4 pr-12 pl-6 font-bold text-slate-700 focus:ring-4 focus:ring-primary/5 appearance-none">
                                        <option value="">اختر الحي...</option>
                                        <option value="1">حي النصر</option>
                                        <option value="2">قرية شكابة</option>
                                        <option value="3">الموقف العام</option>
                                    </select>
                                </div>
                            </div>
                            
                            {estimatedPrice ? (
                                <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 text-center animate-fade-in">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">التكلفة التقديرية</p>
                                    <p className="text-3xl font-black text-primary tracking-tighter">{estimatedPrice} <span className="text-xs">ج.س</span></p>
                                </div>
                            ) : null}

                            <button onClick={calculateCost} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs shadow-xl shadow-slate-900/20 hover:bg-black transition-all">احسب السعر</button>
                        </div>
                    </div>

                    <div className="bg-emerald-600 rounded-[40px] p-8 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <h4 className="text-xl font-black mb-4">اشحن بضاعتك فوراً</h4>
                            <p className="text-xs opacity-80 leading-relaxed mb-8">نضمن لك سرعة التوصيل وسلامة المنتج مع نظام تتبع حي عبر الخريطة.</p>
                            <button className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-black text-xs shadow-xl">طلب توصيل سريع</button>
                        </div>
                        <Package size={150} className="absolute -left-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform" />
                    </div>
                </div>

                {/* Tracking & Active Drivers Section */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Active Tracking Banner */}
                    <div className="bg-slate-900 rounded-[56px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl border border-white/5 group">
                        <div className="flex items-center gap-8 relative z-10">
                            <div className="w-20 h-20 bg-primary/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/10 animate-pulse">
                                <Truck size={36} className="text-teal-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black mb-1">تتبع رحلتك القادمة</h3>
                                <p className="text-sm opacity-60 font-bold leading-relaxed">المندوب ياسين في طريقه لاستلام طلبيتك من السوق الكبير.</p>
                            </div>
                        </div>
                        <button onClick={() => onNavigate?.('track-delivery')} className="bg-white text-slate-900 px-10 py-5 rounded-[24px] font-black text-sm shadow-xl hover:scale-105 transition-all relative z-10">
                            فتح الخريطة
                        </button>
                        <Navigation size={300} className="absolute -left-10 -bottom-10 opacity-5 group-hover:rotate-12 transition-transform duration-1000" />
                    </div>

                    {/* Drivers List */}
                    <div className="bg-white rounded-[56px] p-10 border border-slate-50 shadow-sm">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-2xl font-black text-slate-900">أقرب المناديب إليك</h3>
                            <div className="relative w-64 group">
                                <input type="text" placeholder="بحث عن مندوب..." className="w-full bg-slate-50 border-none rounded-2xl py-3 px-10 text-xs font-bold focus:ring-4 focus:ring-primary/5" />
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            {DELIVERY_SERVICES.map(service => (
                                <div key={service.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50 rounded-[32px] border border-slate-100/50 hover:bg-white hover:shadow-xl hover:border-primary/20 transition-all group gap-6">
                                    <div className="flex items-center gap-6 w-full md:w-auto">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm border border-slate-50 group-hover:scale-110 transition-transform">
                                            {service.id === '1' ? <Bike size={32} /> : <Truck size={32} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="font-black text-slate-800 text-lg">{service.name}</h4>
                                                <div className="flex items-center gap-1 text-[10px] text-yellow-500 font-black">
                                                    <Star size={12} fill="currentColor" /> {service.rating}
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-[10px] text-slate-400 font-black uppercase tracking-wider">
                                                <span className="flex items-center gap-1.5"><MapPin size={12} className="text-primary"/> {service.area}</span>
                                                <span className="flex items-center gap-1.5"><Clock size={12} className="text-primary"/> {service.status === 'available' ? 'متوفر الآن' : 'في مهمة'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-6 md:pt-0">
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-slate-900 tracking-tighter">{service.price} ج.س</p>
                                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">سعر الطلب التقديري</p>
                                        </div>
                                        <button onClick={() => window.open(`tel:${service.id}`)} className="p-5 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all shadow-lg">
                                            <Phone size={24} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="p-10 bg-blue-50 rounded-[48px] border border-blue-100 flex flex-col md:flex-row items-center gap-8">
                <div className="w-20 h-20 bg-white rounded-[28px] flex items-center justify-center text-blue-500 shadow-sm shrink-0">
                    <Info size={36} />
                </div>
                <div>
                    <h4 className="text-xl font-black text-blue-900 mb-1 leading-none">تأمين الشحنات</h4>
                    <p className="text-sm text-blue-700 font-bold leading-relaxed opacity-80">جميع المناديب في سوق المناقل مسجلون لدينا بأوراق ثبوتية كاملة لضمان أمان ممتلكاتك من لحظة الاستلام وحتى التسليم.</p>
                </div>
            </div>
        </div>
    );
};

export default LogisticsHub;
