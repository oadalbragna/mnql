import React from 'react';
import { ChevronLeft, Bell, BellOff, Check, Trash2, ShoppingBag, Star, ShieldAlert, CreditCard, Clock } from 'lucide-react';
import { useAppContext } from '../core/context/AppContext';
import { FirebaseService } from '../services/firebaseService';

const NotificationsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { user, notifications } = useAppContext();

    const markAllRead = () => {
        if (!user) return;
        notifications.filter(n => !n.isRead).forEach(n => {
            FirebaseService.markNotificationRead(user.emailOrPhone, n.id);
        });
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'order': return <ShoppingBag className="text-blue-500" size={18} />;
            case 'review': return <Star className="text-amber-500" size={18} />;
            case 'payment': return <CreditCard className="text-emerald-500" size={18} />;
            default: return <ShieldAlert className="text-primary" size={18} />;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-primary transition-all">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tighter">التنبيهات</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">إشعارات سوق المناقل</p>
                    </div>
                </div>
                {notifications.some(n => !n.isRead) && (
                    <button onClick={markAllRead} className="text-[10px] font-black text-primary hover:underline flex items-center gap-1">
                        <Check size={14}/> تحديد الكل كمقروء
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {notifications.length > 0 ? notifications.map((n) => (
                    <div 
                        key={n.id} 
                        onClick={() => user && FirebaseService.markNotificationRead(user.emailOrPhone, n.id)}
                        className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${n.isRead ? 'bg-white border-slate-50 opacity-60' : 'bg-white border-primary/20 shadow-md translate-x-1'}`}
                    >
                        {!n.isRead && <div className="absolute top-0 right-0 w-1.5 h-full bg-primary"></div>}
                        <div className="flex gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${n.isRead ? 'bg-slate-50' : 'bg-primary/5'}`}>
                                {getIcon(n.type)}
                            </div>
                            <div className="flex-1">
                                <h4 className={`text-sm mb-1 ${n.isRead ? 'font-bold text-slate-600' : 'font-black text-slate-900'}`}>{n.title}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">{n.message}</p>
                                <div className="flex items-center gap-2 mt-3 text-[9px] text-slate-400 font-bold uppercase">
                                    <Clock size={10} /> {new Date(n.timestamp).toLocaleString('ar-SA')}
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="py-24 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <BellOff size={32} className="text-slate-200" />
                        </div>
                        <h3 className="text-lg font-black text-slate-300">لا توجد تنبيهات حالياً</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsView;
