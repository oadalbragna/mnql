import React, { useState, useEffect } from 'react';
import { 
  Package, ChevronLeft, Trash2, Edit3, ShieldCheck, 
  Activity, User, Phone, Save, LogOut, RefreshCw, ShoppingBag, 
  Clock, CheckCircle2, MessageSquare, AlertCircle, Share2, 
  Gavel, MessageCircle, ArrowUpRight, Box, Tag, MapPin, Edit2,
  Users, UserPlus, TrendingUp, BarChart3, Star, MoreVertical, Lock, Mail, Key, Shield, History, X, Store, Truck, Check, Search, Filter, Plus, Minus, Eye, EyeOff, Printer, FileText
} from 'lucide-react';
import { Product, UserProfile, Order, Post, Auction, Bid, Worker, UserActivity, ActivityType } from '../types';
import { ref, remove, update, onValue, push, set } from 'firebase/database';
import { db } from '../firebase';
import FormattedText from './FormattedText';
import { MANAQIL_LOCATIONS } from '../constants';
import { FirebaseService } from '../services/firebaseService';

interface TraderDashboardProps {
    user: UserProfile;
    products: Product[];
    allPosts: Post[];
    allAuctions: Auction[];
    onBack: () => void;
    onEditProduct: (product: Product | null) => void;
    onLogout?: () => void;
}

type DashboardTab = 'overview' | 'listings' | 'orders_received' | 'staff' | 'analytics' | 'activities' | 'settings' | 'profile' | 'reviews';

const TraderDashboard: React.FC<TraderDashboardProps> = ({ 
    user, products, allPosts, allAuctions, onBack, onEditProduct, onLogout 
}) => {
    const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
    const [receivedOrders, setReceivedOrders] = useState<Order[]>([]);
    const [staff, setStaff] = useState<Worker[]>(user.staff || []);
    const [activities, setActivities] = useState<UserActivity[]>([]);
    const [showAddWorker, setShowAddWorker] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

    const handleReply = async (productId: string, reviewId: string) => {
        const text = replyText[`${productId}-${reviewId}`];
        if (!text) return;
        
        await FirebaseService.addReviewReply(productId, reviewId, text);
        setReplyText(prev => ({ ...prev, [`${productId}-${reviewId}`]: '' }));
        alert("تم إرسال الرد بنجاح");
    };

    // Profile & Settings States
    const [profileForm, setProfileForm] = useState({
        fullName: user.fullName,
        location: user.location,
        bio: user.bio || '',
        activityType: user.activityType || 'general',
        workingHours: user.storeConfig?.workingHours || '9:00 ص - 9:00 م',
        deliveryAreas: user.storeConfig?.deliveryAreas || '',
        whatsapp: user.storeConfig?.socialLinks?.whatsapp || '',
        facebook: user.storeConfig?.socialLinks?.facebook || ''
    });

    useEffect(() => {
        const ordersRef = ref(db, 'Mangal-Shop/orders');
        onValue(ordersRef, (snap) => {
            if (snap.exists()) {
                const all = Object.values(snap.val()) as Order[];
                setReceivedOrders(all.filter(o => o.sellerIds && o.sellerIds.includes(user.emailOrPhone)).sort((a,b) => b.timestamp - a.timestamp));
            }
        });

        const staffRef = ref(db, `Mangal-Shop/users/${user.emailOrPhone}/staff`);
        onValue(staffRef, (snap) => {
            if (snap.exists()) setStaff(Object.values(snap.val()));
            else setStaff([]);
        });

        const activityRef = ref(db, `Mangal-Shop/users/${user.emailOrPhone}/activities`);
        onValue(activityRef, (snap) => {
            if (snap.exists()) setActivities((Object.values(snap.val()) as UserActivity[]).reverse());
        });
    }, [user.emailOrPhone]);

    const myProducts = products.filter(p => p.sellerId === user.emailOrPhone);
    const totalViews = myProducts.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalRevenue = receivedOrders.filter(o => o.status !== 'cancelled').reduce((sum, order) => sum + order.totalPrice, 0);

    const handleStockUpdate = async (productId: string, current: number, delta: number) => {
        const newQty = Math.max(0, current + delta);
        await update(ref(db, `Mangal-Shop/products/${productId}`), { availableQuantity: newQty });
    };

    const toggleProductVisibility = async (product: Product) => {
        const newStatus = !product.isActive;
        await update(ref(db, `Mangal-Shop/products/${product.id}`), { isActive: newStatus });
    };

    const handleUpdateProfile = async () => {
        setIsSaving(true);
        try {
            await update(ref(db, `Mangal-Shop/users/${user.emailOrPhone}`), {
                fullName: profileForm.fullName,
                location: profileForm.location,
                bio: profileForm.bio,
                activityType: profileForm.activityType,
                storeConfig: {
                    workingHours: profileForm.workingHours,
                    deliveryAreas: profileForm.deliveryAreas,
                    socialLinks: {
                        whatsapp: profileForm.whatsapp,
                        facebook: profileForm.facebook
                    }
                }
            });
            alert("تم حفظ التعديلات بنجاح");
        } catch (e) {
            alert("فشل الحفظ");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 text-slate-500 transition-all"><ChevronLeft size={24}/></button>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">لوحة التاجر</h1>
                            <p className="text-xs text-slate-400 font-bold">مرحباً، {user.fullName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={onLogout} className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all"><LogOut size={20}/></button>
                    </div>
                </div>
                
                {/* Horizontal Navigation */}
                <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar pb-2">
                    <div className="flex gap-2 min-w-max">
                        {[
                            { id: 'overview', label: 'نظرة عامة', icon: <Activity size={18}/> },
                            { id: 'listings', label: 'إعلاناتي', icon: <Package size={18}/> },
                            { id: 'orders_received', label: 'الطلبات', icon: <ShoppingBag size={18}/>, badge: receivedOrders.filter(o => o.status === 'pending').length },
                            { id: 'analytics', label: 'التحليلات', icon: <BarChart3 size={18}/> },
                            { id: 'reviews', label: 'التقييمات', icon: <Star size={18}/> },
                            { id: 'profile', label: 'المتجر', icon: <Store size={18}/> },
                            { id: 'staff', label: 'الفريق', icon: <Users size={18}/> },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as DashboardTab)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                            >
                                {tab.icon} {tab.label}
                                {tab.badge ? <span className="bg-red-500 text-white px-1.5 py-0.5 rounded-md text-[9px]">{tab.badge}</span> : null}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
                
                {/* 1. OVERVIEW & ANALYTICS CARDS */}
                {(activeTab === 'overview' || activeTab === 'analytics') && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
                                <p className="text-[10px] text-slate-400 font-black uppercase mb-2">إجمالي المشاهدات</p>
                                <h3 className="text-3xl font-black text-slate-900">{totalViews.toLocaleString()}</h3>
                                <TrendingUp size={48} className="absolute -right-4 -bottom-4 text-emerald-50 opacity-50 group-hover:scale-110 transition-transform"/>
                            </div>
                            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
                                <p className="text-[10px] text-slate-400 font-black uppercase mb-2">إجمالي المبيعات</p>
                                <h3 className="text-3xl font-black text-emerald-600">{totalRevenue.toLocaleString()}</h3>
                                <ArrowUpRight size={48} className="absolute -right-4 -bottom-4 text-emerald-50 opacity-50 group-hover:scale-110 transition-transform"/>
                            </div>
                            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
                                <p className="text-[10px] text-slate-400 font-black uppercase mb-2">المنتجات النشطة</p>
                                <h3 className="text-3xl font-black text-blue-600">{myProducts.filter(p => p.isActive !== false).length}</h3>
                                <Box size={48} className="absolute -right-4 -bottom-4 text-blue-50 opacity-50 group-hover:scale-110 transition-transform"/>
                            </div>
                            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
                                <p className="text-[10px] text-slate-400 font-black uppercase mb-2">طلبات معلقة</p>
                                <h3 className="text-3xl font-black text-orange-500">{receivedOrders.filter(o => o.status === 'pending').length}</h3>
                                <Clock size={48} className="absolute -right-4 -bottom-4 text-orange-50 opacity-50 group-hover:scale-110 transition-transform"/>
                            </div>
                        </div>

                        {/* Top Products Table */}
                        <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3"><BarChart3 size={24} className="text-primary"/> أداء المنتجات</h3>
                            <div className="overflow-x-auto no-scrollbar">
                                <table className="w-full text-right">
                                    <thead>
                                        <tr className="border-b border-slate-50">
                                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase">المنتج</th>
                                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase">المشاهدات</th>
                                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase">المخزون</th>
                                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase">الحالة</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {myProducts.map(p => (
                                            <tr key={p.id} className="group hover:bg-slate-50/50 transition-all">
                                                <td className="py-4 flex items-center gap-3">
                                                    <img src={p.imageUrl} className="w-10 h-10 rounded-xl object-cover" />
                                                    <span className="font-bold text-slate-700 text-sm">{p.title}</span>
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex items-center gap-2 font-black text-slate-900">
                                                        <Eye size={14} className="text-slate-300"/> {p.views || 0}
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <span className={`text-xs font-black ${p.availableQuantity > 5 ? 'text-slate-500' : 'text-red-500'}`}>{p.availableQuantity}</span>
                                                </td>
                                                <td className="py-4">
                                                    <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase ${p.isActive !== false ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                        {p.isActive !== false ? 'نشط' : 'مخفي'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* REVIEWS TAB */}
                {activeTab === 'reviews' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-black text-slate-900">تقييمات الزبائن</h3>
                        <div className="grid grid-cols-1 gap-6">
                            {myProducts.some(p => p.reviews) ? myProducts.map(p => 
                                p.reviews && Object.values(p.reviews).map((r: any) => (
                                    <div key={r.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <img src={p.imageUrl} className="w-12 h-12 rounded-xl object-cover" />
                                                <div>
                                                    <h5 className="font-black text-slate-900 text-sm">{r.userName} <span className="text-slate-400 font-bold">على</span> {p.title}</h5>
                                                    <div className="flex gap-0.5 text-amber-400">
                                                        {[...Array(r.rating)].map((_, i) => <Star key={i} size={10} fill="currentColor"/>)}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-bold">{new Date(r.timestamp).toLocaleDateString('ar-SA')}</span>
                                        </div>
                                        <p className="text-slate-600 font-bold text-xs bg-slate-50 p-4 rounded-2xl">"{r.comment}"</p>
                                        
                                        {r.reply ? (
                                            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                                                <p className="text-[9px] font-black text-emerald-600 uppercase mb-1">ردك السابق:</p>
                                                <p className="text-xs text-slate-700 font-bold">{r.reply.text}</p>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    placeholder="اكتب رداً للمشتري..." 
                                                    className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-bold"
                                                    value={replyText[`${p.id}-${r.id}`] || ''}
                                                    onChange={(e) => setReplyText({ ...replyText, [`${p.id}-${r.id}`]: e.target.value })}
                                                />
                                                <button 
                                                    onClick={() => handleReply(p.id, r.id)}
                                                    className="bg-primary text-white px-4 py-2 rounded-xl font-black text-[10px]"
                                                >
                                                    رد
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center bg-white rounded-[40px] border-4 border-dashed border-slate-50">
                                    <Star size={48} className="mx-auto text-slate-200 mb-4" />
                                    <p className="text-slate-400 font-black">لا توجد تقييمات لمنتجاتك بعد.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 2. LISTINGS TAB */}
                {activeTab === 'listings' && (
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <h3 className="text-xl font-black text-slate-900">إدارة المنتجات ({myProducts.length})</h3>
                            <button onClick={() => onEditProduct(null)} className="bg-slate-900 text-white px-8 py-4 rounded-[20px] font-black text-xs shadow-xl flex items-center gap-2 hover:scale-105 transition-all w-full md:w-auto justify-center">
                                <Plus size={18} /> إضافة إعلان جديد
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myProducts.map(p => (
                                <div key={p.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:border-primary/20 transition-all group">
                                    <div className="flex gap-4 mb-4">
                                        <div className="relative">
                                            <img src={p.imageUrl} className="w-20 h-20 rounded-2xl object-cover" />
                                            <div className="absolute top-1 right-1 bg-white/90 px-1.5 py-0.5 rounded-md flex items-center gap-1 text-[8px] font-black shadow-sm">
                                                <Eye size={10} className="text-primary"/> {p.views || 0}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-black text-slate-900 truncate mb-1">{p.title}</h4>
                                            <p className="text-xs text-primary font-black mb-2">{p.price.toLocaleString()} ج.س</p>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleStockUpdate(p.id, p.availableQuantity, -1)} className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200"><Minus size={12}/></button>
                                                <span className="text-[10px] font-black">{p.availableQuantity}</span>
                                                <button onClick={() => handleStockUpdate(p.id, p.availableQuantity, 1)} className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200"><Plus size={12}/></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <button onClick={() => onEditProduct(p)} className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[10px] hover:bg-black transition-all">تعديل</button>
                                        <button onClick={() => toggleProductVisibility(p)} className={`px-3 rounded-xl transition-all ${p.isActive === false ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                            {p.isActive === false ? <EyeOff size={16}/> : <Eye size={16}/>}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. PROFILE SETTINGS */}
                {activeTab === 'profile' && (
                    <div className="bg-white rounded-[40px] p-10 border border-slate-50 shadow-sm space-y-8 animate-fade-in max-w-2xl mx-auto text-right">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 bg-primary/10 text-primary rounded-2xl"><Store size={32}/></div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900">بيانات المتجر</h3>
                                <p className="text-xs text-slate-400 font-bold">هوية متجرك في سوق المناقل</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">اسم المتجر / العلامة</label>
                                <input type="text" value={profileForm.fullName} onChange={e => setProfileForm({...profileForm, fullName: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold text-slate-700" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">رقم الواتساب</label>
                                    <input type="text" value={profileForm.whatsapp} onChange={e => setProfileForm({...profileForm, whatsapp: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold text-slate-700" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">موقع المتجر</label>
                                    <select value={profileForm.location} onChange={e => setProfileForm({...profileForm, location: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold text-slate-700 appearance-none">
                                        {MANAQIL_LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                    </select>
                                </div>
                            </div>
                            <button onClick={handleUpdateProfile} disabled={isSaving} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-black transition-all">
                                {isSaving ? 'جاري الحفظ...' : 'تحديث البيانات'}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default TraderDashboard;
