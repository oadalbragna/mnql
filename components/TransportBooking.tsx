import React, { useState, useMemo } from 'react';
import { Bus, MapPin, Clock, Users, ChevronLeft, Search, Calendar, ShieldCheck, Phone, CheckCircle, Ticket, Navigation, Car, Zap, Filter, Loader2, Info, ArrowRightLeft, Star } from 'lucide-react';
import { TransportOption } from '../types';

const MOCK_RIDES: TransportOption[] = [
    // Fixed error: Added missing 'driverPhone' to each mock ride
    { id: 'r1', from: 'المناقل (الموقف العام)', to: 'ود مدني', type: 'hiace', time: '07:30 صباحاً', price: 2500, seatsLeft: 4, driverName: 'أحمد الطيب', driverPhone: '249912345671' },
    { id: 'r2', from: 'المناقل (الموقف العام)', to: 'الخرطوم', type: 'bus', time: '08:00 صباحاً', price: 8000, seatsLeft: 12, driverName: 'عثمان خضر', driverPhone: '249912345672' },
    { id: 'r3', from: 'المناقل (سوق المحاصيل)', to: 'سنار', type: 'hiace', time: '10:00 صباحاً', price: 3500, seatsLeft: 2, driverName: 'علي عيسى', driverPhone: '249912345673' },
    { id: 'r4', from: 'المناقل (حي الموظفين)', to: 'الخرطوم', type: 'private', time: 'توقيت مرن', price: 25000, seatsLeft: 3, driverName: 'محمد جادين', driverPhone: '249912345674' },
];

const VEHICLE_TYPES = [
    { id: 'all', label: 'الكل', icon: <Navigation size={16}/> },
    { id: 'bus', label: 'حافلة كبييرة', icon: <Bus size={16}/> },
    { id: 'hiace', label: 'هايس (شريحة)', icon: <Zap size={16}/> },
    { id: 'private', label: 'خاص (صالون)', icon: <Car size={16}/> },
];

const TransportBooking: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [selectedRide, setSelectedRide] = useState<TransportOption | null>(null);
    const [activeTab, setActiveTab] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const [bookedTrips, setBookedTrips] = useState<TransportOption[]>([]);
    const [showMyTickets, setShowMyTickets] = useState(false);

    const handleSearch = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 800);
    };

    const confirmBooking = () => {
        if (selectedRide) {
            setBookedTrips([...bookedTrips, selectedRide]);
            setSelectedRide(null);
            alert("تم حجز مقعدك بنجاح! يمكنك العثور على التذكرة في قسم حجوزاتي.");
        }
    };

    const filteredRides = useMemo(() => {
        if (activeTab === 'all') return MOCK_RIDES;
        return MOCK_RIDES.filter(r => r.type === activeTab);
    }, [activeTab]);

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl animate-slide-up">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="p-4 bg-white border border-slate-100 rounded-[24px] text-slate-400 hover:text-primary transition-all shadow-sm">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">حجز مواصلات</h2>
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">تنسيق رحلتك من المناقل بكل سهولة</p>
                    </div>
                </div>
                <button 
                    onClick={() => setShowMyTickets(!showMyTickets)}
                    className={`px-8 py-4 rounded-full font-black text-xs flex items-center gap-3 transition-all ${showMyTickets ? 'bg-primary text-white shadow-xl' : 'bg-white border border-slate-100 text-slate-600 shadow-sm'}`}
                >
                    <Ticket size={18} /> {showMyTickets ? 'العودة للبحث' : `حجوزاتي النشطة (${bookedTrips.length})`}
                </button>
            </div>

            {showMyTickets ? (
                /* Booked Tickets View */
                <div className="space-y-8 animate-fade-in">
                    {bookedTrips.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {bookedTrips.map((trip, idx) => (
                                <div key={idx} className="bg-white border-2 border-primary/20 rounded-[40px] p-8 relative overflow-hidden shadow-xl">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center">
                                            <Ticket size={32} />
                                        </div>
                                        <div className="text-left">
                                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 uppercase tracking-widest">مؤكدة</span>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 justify-between">
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-black uppercase">من</p>
                                                <h4 className="font-black text-slate-800 text-lg">المناقل</h4>
                                            </div>
                                            <ArrowRightLeft className="text-slate-200" size={20} />
                                            <div className="text-left">
                                                <p className="text-[10px] text-slate-400 font-black uppercase">إلى</p>
                                                <h4 className="font-black text-slate-800 text-lg">{trip.to}</h4>
                                            </div>
                                        </div>
                                        <div className="flex justify-between border-t border-dashed border-slate-100 pt-6">
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-black uppercase">السائق</p>
                                                <p className="font-bold text-slate-700">{trip.driverName}</p>
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[10px] text-slate-400 font-black uppercase">التحرك</p>
                                                <p className="font-bold text-slate-700">{trip.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center bg-white rounded-[60px] border-4 border-dashed border-slate-50 flex flex-col items-center">
                            <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-6">
                                <Ticket size={48} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-300">لا توجد حجوزات حالية</h3>
                            <p className="text-slate-400 font-bold mt-2">ابدأ بالبحث عن رحلة واحجز مقعدك الآن</p>
                        </div>
                    )}
                </div>
            ) : (
                /* Search View */
                <>
                    <div className="bg-white rounded-[48px] p-8 shadow-sm border border-slate-50 mb-12 flex flex-col md:flex-row gap-6">
                        <div className="flex-1 space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">من (نقطة الانطلاق)</label>
                            <div className="relative">
                                <MapPin className="absolute right-5 top-1/2 -translate-y-1/2 text-primary" size={20} />
                                <select className="w-full bg-slate-50 border-none rounded-3xl py-4 pr-14 pl-6 font-bold text-slate-700 focus:ring-4 focus:ring-primary/5 appearance-none cursor-pointer">
                                    <option>المناقل - الموقف العام</option>
                                    <option>المناقل - السوق الكبير</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex-1 space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">إلى (الوجهة)</label>
                            <div className="relative">
                                <Navigation className="absolute right-5 top-1/2 -translate-y-1/2 text-primary" size={20} />
                                <select className="w-full bg-slate-50 border-none rounded-3xl py-4 pr-14 pl-6 font-bold text-slate-700 focus:ring-4 focus:ring-primary/5 appearance-none cursor-pointer">
                                    <option>ود مدني</option>
                                    <option>الخرطوم</option>
                                    <option>سنار</option>
                                    <option>كوستي</option>
                                </select>
                            </div>
                        </div>
                        <button 
                            onClick={handleSearch}
                            className="bg-slate-900 text-white px-10 rounded-[28px] font-black text-sm hover:bg-black transition-all h-16 md:mt-6 shadow-xl flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'تحديث النتائج'}
                        </button>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-8">
                        {VEHICLE_TYPES.map(type => (
                            <button
                                key={type.id}
                                onClick={() => setActiveTab(type.id)}
                                className={`flex items-center gap-3 px-8 py-4 rounded-[24px] text-sm font-black whitespace-nowrap transition-all border ${activeTab === type.id ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-primary/30'}`}
                            >
                                {type.icon}
                                {type.label}
                            </button>
                        ))}
                    </div>

                    {isLoading ? (
                        <div className="py-24 text-center space-y-6">
                            <Loader2 size={48} className="text-primary animate-spin mx-auto" />
                            <p className="text-slate-400 font-bold">جاري جلب قائمة الرحلات المتوفرة من الموقف...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredRides.length > 0 ? (
                                filteredRides.map(ride => (
                                    <div 
                                        key={ride.id}
                                        className="bg-white rounded-[40px] p-8 border border-slate-50 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 hover:border-primary/20 transition-all group animate-fade-in"
                                    >
                                        <div className="flex items-center gap-6 w-full md:w-auto">
                                            <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                                                {ride.type === 'hiace' ? <Zap size={32} /> : ride.type === 'bus' ? <Bus size={32} /> : <Car size={32} />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="text-xl font-black text-slate-900">إلى {ride.to}</h4>
                                                    <div className="flex items-center gap-1 text-[10px] text-yellow-500 font-black">
                                                        <Star size={12} fill="currentColor" /> 4.8
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-[10px] text-slate-400 font-black uppercase tracking-wider">
                                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg"><Clock size={12} className="text-primary" /> {ride.time}</span>
                                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg"><Users size={12} className="text-primary" /> {ride.seatsLeft} مقاعد متوفرة</span>
                                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg"><ShieldCheck size={12} /> السائق: {ride.driverName}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-6 md:pt-0">
                                            <div className="text-right">
                                                <p className="text-3xl font-black text-slate-900 tracking-tighter">{ride.price.toLocaleString()} ج.س</p>
                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">للمقعد الواحد</p>
                                            </div>
                                            <button 
                                                onClick={() => setSelectedRide(ride)}
                                                className="bg-primary text-white px-10 py-5 rounded-[24px] font-black text-xs shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                            >
                                                احجز الآن
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-24 text-center bg-white rounded-[60px] border border-slate-50">
                                    <p className="text-slate-400 font-bold">عفواً، لا توجد رحلات متوفرة لهذا النوع حالياً.</p>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Booking Modal */}
            {selectedRide && (
                <div className="fixed inset-0 z-[160] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-white w-full max-w-md rounded-[50px] overflow-hidden shadow-2xl animate-slide-up border border-white/20">
                        <div className="p-10 text-center">
                            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative">
                                <Bus size={44} />
                                <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping"></div>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">تأكيد الحجز الرقمي</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                                أنت على وشك حجز مقعد في رحلة <b>{selectedRide.to}</b>. سيتم خصم المبلغ من محفظتك الرقمية.
                            </p>
                            
                            <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 mb-10 text-right space-y-4 shadow-inner">
                                <div className="flex justify-between items-center"><span className="text-xs text-slate-400 font-black uppercase">نوع المركبة</span><span className="font-black text-slate-900">{selectedRide.type === 'bus' ? 'حافلة كبييرة' : 'هايس سريعة'}</span></div>
                                <div className="flex justify-between items-center"><span className="text-xs text-slate-400 font-black uppercase">توقيت التحرك</span><span className="font-black text-primary">{selectedRide.time}</span></div>
                                <div className="flex justify-between items-center pt-4 border-t border-slate-200"><span className="text-xs text-slate-400 font-black uppercase">إجمالي السعر</span><span className="text-2xl font-black text-slate-900">{selectedRide.price.toLocaleString()} ج.س</span></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setSelectedRide(null)} className="py-5 bg-slate-100 text-slate-500 rounded-[20px] font-black text-xs hover:bg-slate-200 transition-all">إلغاء</button>
                                <button 
                                    onClick={confirmBooking}
                                    className="py-5 bg-primary text-white rounded-[20px] font-black text-xs shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                                >
                                    تأكيد ودفع
                                </button>
                            </div>
                            
                            <div className="mt-8 flex items-center justify-center gap-2 text-slate-300">
                                <ShieldCheck size={14} />
                                <span className="text-[9px] font-black uppercase tracking-widest">عملية دفع مؤمنة بالكامل</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Safety Footer */}
            {!showMyTickets && (
                <div className="mt-20 p-10 bg-slate-50 rounded-[48px] border border-slate-100 flex flex-col md:flex-row items-center gap-8 text-center md:text-right">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm shrink-0">
                        <Info size={32} />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-xl font-black text-slate-900 mb-1">نصيحة للمسافرين</h4>
                        <p className="text-xs text-slate-500 font-bold leading-relaxed">يرجى التواجد في نقطة الانطلاق قبل 15 دقيقة من الموعد المحدد. في حال إلغاء الحجز، سيتم استرداد 90% من المبلغ لمحفظتك.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransportBooking;