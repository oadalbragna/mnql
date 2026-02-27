
import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, Truck, MapPin, Phone, MessageSquare, Clock, ShieldCheck, CheckCircle2, Navigation, Plus, Minus, Crosshair, Map as MapIcon, Globe, Layers, AlertCircle, Sparkles, MousePointer2 } from 'lucide-react';

const TrackDelivery: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [zoom, setZoom] = useState(1.4);
    const [mapMode, setMapMode] = useState<'streets' | 'satellite'>('satellite');
    const [isCentering, setIsCentering] = useState(false);
    const [driverPos, setDriverPos] = useState({ top: 55, left: 50 });
    const [timeRemaining, setTimeRemaining] = useState(12);
    
    const statusSteps = [
        { label: 'تم استلام الطلب', time: '12:30 م', done: true },
        { label: 'جاري التحميل', time: '12:45 م', done: true },
        { label: 'في الطريق إليك', time: 'الآن', active: true },
        { label: 'تم التوصيل', time: '--:--', done: false },
    ];

    // Simulate Smooth Movement
    useEffect(() => {
        const interval = setInterval(() => {
            setDriverPos(prev => ({
                top: prev.top - 0.05,
                left: prev.left - 0.02
            }));
            setTimeRemaining(prev => Math.max(0, prev - 0.01));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 4));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.8));
    
    const handleRecenter = () => {
        setIsCentering(true);
        setZoom(1.4);
        setTimeout(() => setIsCentering(false), 500);
    };

    const mapUrl = useMemo(() => {
        const style = mapMode === 'satellite' ? 'satellite-streets-v12' : 'streets-v12';
        return `https://api.mapbox.com/styles/v1/mapbox/${style}/static/32.99,14.24,${14 + zoom},0/1000x800?access_token=none`;
    }, [mapMode, zoom]);

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl animate-slide-up">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-4 bg-white border border-slate-200 rounded-[20px] text-slate-400 hover:text-primary shadow-sm transition-all">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">رادار التوصيل المباشر</h2>
                        <div className="flex items-center gap-2 mt-1">
                             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">إحداثيات المندوب: 14.24°N, 32.99°E</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setMapMode(mapMode === 'streets' ? 'satellite' : 'streets')}
                        className="bg-white border border-slate-100 px-6 py-3 rounded-full shadow-sm text-xs font-black text-slate-600 hover:border-primary transition-all flex items-center gap-2"
                    >
                        {mapMode === 'streets' ? <Globe size={16}/> : <MapIcon size={16}/>}
                        {mapMode === 'streets' ? 'واقعي' : 'طرق'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Side Info */}
                <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
                    <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                        <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3">
                            <Clock size={18} className="text-primary" /> التقدم الزمني
                        </h3>
                        <div className="space-y-8 relative">
                            <div className="absolute top-1 bottom-1 right-5 w-0.5 bg-slate-50"></div>
                            {statusSteps.map((s, i) => (
                                <div key={i} className="relative flex items-center gap-6 pr-12">
                                    <div className={`absolute right-0 w-10 h-10 rounded-full flex items-center justify-center z-10 border-4 border-white shadow-lg ${s.done ? 'bg-primary text-white' : s.active ? 'bg-teal-400 animate-pulse text-white' : 'bg-slate-50 text-slate-300'}`}>
                                        {s.done ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 bg-current rounded-full" />}
                                    </div>
                                    <div>
                                        <h4 className={`font-black text-[13px] ${s.active ? 'text-primary' : 'text-slate-700'}`}>{s.label}</h4>
                                        <p className="text-[9px] text-slate-400 font-bold">{s.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
                        <div className="flex items-center gap-5 mb-8">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/5">
                                <Truck size={32} className="text-teal-400" />
                            </div>
                            <div>
                                <h4 className="font-black">ياسين محمد</h4>
                                <p className="text-[10px] text-teal-400 font-black uppercase">مندوب موثق • ركشة</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => window.open('tel:0912345678')} className="bg-primary text-white py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-teal-600 transition-all">
                                <Phone size={14} /> اتصال
                            </button>
                            <button className="bg-white/5 text-white border border-white/10 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2">
                                <MessageSquare size={14} /> دردشة
                            </button>
                        </div>
                        <Sparkles className="absolute -left-4 -bottom-4 text-white/5 opacity-10" size={120} />
                    </div>
                </div>

                {/* Map Interface */}
                <div className="lg:col-span-8 order-1 lg:order-2">
                    <div className="bg-white rounded-[56px] h-[550px] md:h-[650px] relative overflow-hidden shadow-2xl border-4 border-white group">
                        <div 
                            className={`absolute inset-0 transition-all duration-700 ease-out origin-center ${isCentering ? 'scale-[0.98] opacity-50' : ''}`}
                            style={{ transform: `scale(${zoom})` }}
                        >
                            <div className="absolute inset-0 bg-cover bg-center transition-all duration-[2s]" style={{ backgroundImage: `url('${mapUrl}')` }}></div>

                            {/* Simulated Smooth Driver Icon */}
                            <div className="absolute transition-all duration-1000 ease-linear z-20" style={{ top: `${driverPos.top}%`, left: `${driverPos.left}%`, transform: `translate(-50%, -50%) scale(${1 / zoom})` }}>
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping scale-[2.2]"></div>
                                    <div className="relative bg-primary text-white p-4 rounded-2xl shadow-2xl border-4 border-white rotate-12">
                                        <Truck size={24} />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Destination Pin */}
                            <div className="absolute top-[20%] left-[35%] z-10" style={{ transform: `scale(${1 / zoom})` }}>
                                <div className="bg-slate-900 text-white p-3 rounded-xl shadow-2xl border-2 border-white">
                                    <MapPin size={20} />
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="absolute right-6 top-6 flex flex-col gap-3 z-30">
                            <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-xl flex flex-col gap-1 border border-white/50">
                                <button onClick={handleZoomIn} className="p-4 hover:bg-slate-50 rounded-xl text-slate-700 transition-all active:scale-90"><Plus size={18} strokeWidth={3}/></button>
                                <button onClick={handleZoomOut} className="p-4 hover:bg-slate-50 rounded-xl text-slate-700 transition-all active:scale-90"><Minus size={18} strokeWidth={3}/></button>
                            </div>
                            <button onClick={handleRecenter} className="p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 text-slate-700 active:scale-90"><Crosshair size={20}/></button>
                        </div>

                        {/* Status Float */}
                        <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-6 rounded-[40px] border border-white/50 shadow-2xl flex items-center justify-between z-30">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                                    <Clock size={28} />
                                </div>
                                <div>
                                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">الموعد المتوقع</p>
                                    <h4 className="text-2xl font-black text-slate-900 tracking-tighter">{Math.ceil(timeRemaining)} دقيقة</h4>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase border border-emerald-100">
                                <AlertCircle size={14}/> تتبع حي
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackDelivery;
