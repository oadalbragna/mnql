
import React, { useState } from 'react';
import { 
  LogIn, Sparkles, ShieldCheck, Loader2, AlertCircle, Phone, ArrowLeft, CheckCircle2, Store, Users, Briefcase, MapPin, Lock, Eye, EyeOff, User
} from 'lucide-react';
import { AuthService } from '../services/authService';
import { UserRole, ActivityType } from '../types';
import { MANAQIL_LOCATIONS } from '../constants';

interface AuthViewProps {
  onLoginSuccess: (userData: any, isGuest: boolean) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    password: '',
    role: 'user' as UserRole,
    location: MANAQIL_LOCATIONS[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
        const user = await AuthService.getUserByPhone(formData.phone);

        if (mode === 'login') {
            if (!user) {
                setError("عذراً، هذا الحساب غير موجود. يرجى إنشاء حساب جديد.");
            } else if (user.password !== formData.password) {
                setError("كلمة المرور التي أدخلتها غير صحيحة.");
            } else {
                AuthService.saveSession(formData.phone);
                onLoginSuccess(user, false);
            }
        } else {
            if (user) {
                setError("هذا الرقم مسجل مسبقاً، حاول تسجيل الدخول.");
            } else {
                const newUser = await AuthService.registerUser({
                    fullName: formData.fullName,
                    emailOrPhone: formData.phone,
                    password: formData.password,
                    role: formData.role,
                    location: formData.location
                });
                AuthService.saveSession(formData.phone);
                onLoginSuccess(newUser, false);
            }
        }
    } catch (err) {
        setError("حدث خطأ أثناء الاتصال بالخادم.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-[1000px] bg-white rounded-[48px] shadow-premium border border-white flex flex-col md:flex-row overflow-hidden relative z-10">
        
        {/* Side Content */}
        <div className="md:w-5/12 bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden text-right">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg"><ShieldCheck size={24} /></div>
              <h1 className="text-xl font-black tracking-tighter">سوق المناقل</h1>
            </div>
            <h2 className="text-3xl font-black leading-tight mb-4">أهلاً بك في <br/>قلب التجارة</h2>
            <p className="text-slate-400 text-sm font-bold opacity-80 leading-relaxed">منصة المناقل الرقمية لربط المزارعين والتجار والمواطنين في بيئة آمنة وسهلة.</p>
          </div>
          <div className="relative z-10 space-y-4">
             <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                <CheckCircle2 size={18} className="text-primary"/>
                <p className="text-[10px] font-bold">تحقق سريع وآمن للبيانات</p>
             </div>
          </div>
          <Sparkles className="absolute -left-20 -bottom-20 text-primary/10 w-80 h-80 rotate-12" />
        </div>

        {/* Auth Form Area */}
        <div className="flex-1 p-10 md:p-14 flex flex-col justify-center text-right">
          <div className="max-w-sm mx-auto w-full">
            
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-900">
                    {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
                </h3>
                <button onClick={() => onLoginSuccess(null, true)} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1">دخول كزائر <ArrowLeft size={12}/></button>
            </div>

            {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-[11px] font-black flex items-center gap-2 border border-red-100"><AlertCircle size={16}/> {error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                    <>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">من أنت؟</label>
                            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-3xl">
                                <button type="button" onClick={() => setFormData({...formData, role: 'user'})} className={`py-3 rounded-2xl text-[9px] font-black flex flex-col items-center gap-1 transition-all ${formData.role === 'user' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}><Users size={14}/> عادي</button>
                                <button type="button" onClick={() => setFormData({...formData, role: 'trader'})} className={`py-3 rounded-2xl text-[9px] font-black flex flex-col items-center gap-1 transition-all ${formData.role === 'trader' ? 'bg-primary text-white shadow-lg' : 'text-slate-400'}`}><Store size={14}/> تاجر</button>
                                <button type="button" onClick={() => setFormData({...formData, role: 'worker'})} className={`py-3 rounded-2xl text-[9px] font-black flex flex-col items-center gap-1 transition-all ${formData.role === 'worker' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}><Briefcase size={14}/> عامل</button>
                            </div>
                        </div>

                        <div className="relative group">
                            <User className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                            <input required type="text" placeholder="الاسم بالكامل" className="w-full bg-slate-50 border-none rounded-2xl py-5 pr-14 pl-6 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary/5 shadow-inner" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                        </div>

                        <div className="relative group">
                            <MapPin className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                            <select value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-5 pr-14 pl-6 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary/5 appearance-none">
                                {MANAQIL_LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                            </select>
                        </div>
                    </>
                )}

                <div className="relative group">
                    <Phone className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                    <input required type="tel" placeholder="رقم الهاتف" className="w-full bg-slate-50 border-none rounded-2xl py-5 pr-14 pl-6 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-inner" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>

                <div className="relative group">
                    <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                    <input required type={showPassword ? "text" : "password"} placeholder="كلمة المرور" className="w-full bg-slate-50 border-none rounded-2xl py-5 pr-14 pl-14 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-inner" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-all">
                        {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                    </button>
                </div>

                <button disabled={isLoading} type="submit" className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3">
                    {isLoading ? <Loader2 className="animate-spin" /> : <>{mode === 'login' ? 'دخول السوق' : 'إنشاء الحساب ودخول السوق'} <LogIn size={20}/></>}
                </button>
            </form>

            <div className="mt-8 text-center">
                <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-xs font-bold text-slate-400">
                    {mode === 'login' ? 'ليس لديك حساب؟ ' : 'لديك حساب مسبق؟ '}
                    <span className="text-primary font-black hover:underline">{mode === 'login' ? 'أنشئ حسابك الآن' : 'سجل دخول'}</span>
                </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
