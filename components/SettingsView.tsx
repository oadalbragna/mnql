
import React, { useState } from 'react';
import { ChevronLeft, Bell, Globe, Moon, ShieldCheck, ShieldAlert, Heart, Trash2, ChevronRight, Lock } from 'lucide-react';

const SettingsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [notifs, setNotifs] = useState(true);
    const [privacy, setPrivacy] = useState(true);

    const SettingItem = ({ icon, title, subtitle, action, onClick }: any) => (
        <div 
            onClick={onClick}
            className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[32px] shadow-sm hover:border-primary/20 transition-all cursor-pointer group"
        >
            <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-primary/5 group-hover:text-primary transition-all">
                    {icon}
                </div>
                <div>
                    <h4 className="font-black text-gray-900">{title}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{subtitle}</p>
                </div>
            </div>
            {action || <ChevronRight size={18} className="text-gray-300" />}
        </div>
    );

    const Toggle = ({ value, onToggle }: any) => (
        <button 
            onClick={(e) => { e.stopPropagation(); onToggle(!value); }}
            className={`w-14 h-8 rounded-full relative transition-all ${value ? 'bg-primary' : 'bg-gray-200'}`}
        >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${value ? 'right-7' : 'right-1'}`} />
        </button>
    );

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl animate-slide-up">
            <div className="flex items-center gap-4 mb-10">
                <button onClick={onBack} className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-500 shadow-sm">
                    <ChevronLeft size={24} />
                </button>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">الإعدادات</h2>
            </div>

            <div className="space-y-4">
                <h3 className="px-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">التفضيلات العامة</h3>
                <SettingItem 
                    icon={<Bell size={24}/>} 
                    title="تنبيهات المنصة" 
                    subtitle="إشعارات الرسائل والأسعار"
                    action={<Toggle value={notifs} onToggle={setNotifs} />}
                />
                <SettingItem 
                    icon={<Globe size={24}/>} 
                    title="اللغة والموقع" 
                    subtitle="العربية - السودان (المناقل)"
                />
                <SettingItem 
                    icon={<Moon size={24}/>} 
                    title="الوضع الليلي" 
                    subtitle="تلقائي حسب النظام"
                />

                <h3 className="px-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 mt-8">الأمان والخصوصية</h3>
                <SettingItem 
                    icon={<Lock size={24}/>} 
                    title="كلمة المرور" 
                    subtitle="آخر تغيير منذ شهرين"
                />
                <SettingItem 
                    icon={<ShieldCheck size={24}/>} 
                    title="توثيق الهوية" 
                    subtitle="الحساب موثق بنجاح"
                    action={<div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl"><ShieldCheck size={18}/></div>}
                />
                
                <h3 className="px-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 mt-8">الدعم والحساب</h3>
                <SettingItem 
                    icon={<ShieldAlert size={24}/>} 
                    title="بلاغ عن مشكلة" 
                    subtitle="تواصل مع فريق الدعم"
                />
                <SettingItem 
                    icon={<Trash2 size={24}/>} 
                    title="حذف الحساب" 
                    subtitle="إزالة جميع بياناتك نهائياً"
                    className="text-red-500"
                />
            </div>

            <div className="mt-12 text-center">
                <p className="text-[10px] text-gray-300 font-bold">سوق المناقل الرقمي - الإصدار 2.5.0</p>
                <p className="text-[9px] text-gray-400 font-medium mt-1">جميع الحقوق محفوظة © 2024</p>
            </div>
        </div>
    );
};

export default SettingsView;
