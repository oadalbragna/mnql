
import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { ChevronLeft, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, Loader2, CheckCircle2, PackageCheck, Truck, Bike } from 'lucide-react';
import { ref, push, update, serverTimestamp } from 'firebase/database';
import { db } from '../firebase';
import FormattedText from './FormattedText';

interface CartViewProps {
    items: CartItem[];
    onUpdateQuantity: (productId: string, delta: number) => void;
    onRemove: (productId: string) => void;
    onCheckout: () => void;
    onBack: () => void;
    user: any;
}

const CartView: React.FC<CartViewProps> = ({ items, onUpdateQuantity, onRemove, onCheckout, onBack, user }) => {
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [shippingMethod, setShippingMethod] = useState<'express' | 'standard' | 'pickup'>('standard');
    
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const shippingCost = shippingMethod === 'express' ? 3000 : shippingMethod === 'pickup' ? 0 : 1500;

    const handleCheckoutProcess = async () => {
        if (!user) {
            alert("يرجى تسجيل الدخول لإتمام الطلب");
            return;
        }
        
        setIsCheckingOut(true);
        try {
            const orderId = `ORD-${Date.now().toString().substring(7)}`;
            const ordersRef = ref(db, 'Mangal-Shop/orders');
            
            const newOrder: Order = {
                id: orderId,
                customerId: user.id,
                customerName: user.fullName,
                customerPhone: user.emailOrPhone,
                items: items,
                totalPrice: total + shippingCost,
                status: 'pending',
                timestamp: Date.now(),
                deliveryLocation: user.location || 'المناقل',
                sellerIds: Array.from(new Set(items.map(it => it.product.sellerId))) as string[],
                shippingMethod: shippingMethod
            };

            await push(ordersRef, newOrder);
            
            const inventoryUpdates: any = {};
            items.forEach(item => {
                const newQty = Math.max(0, item.product.availableQuantity - item.quantity);
                inventoryUpdates[`Mangal-Shop/products/${item.product.id}/availableQuantity`] = newQty;
            });
            await update(ref(db), inventoryUpdates);

            const userOrdersRef = ref(db, `Mangal-Shop/users/${user.id}/orders_history`);
            await push(userOrdersRef, newOrder);

            setOrderSuccess(true);
            setTimeout(() => onCheckout(), 3000);
        } catch (e) {
            alert("حدث خطأ أثناء معالجة الطلب.");
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="container mx-auto px-4 py-24 text-center space-y-8 animate-fade-in max-w-lg">
                <div className="w-32 h-32 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner relative">
                    <PackageCheck size={64} />
                    <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-3xl font-black text-slate-900">تم تأكيد طلبك بنجاح</h3>
                    <FormattedText text={`رقم الطلب: "**#${Date.now().toString().substring(7)}**"\nتم تأكيد وسيلة الشحن: "**${shippingMethod === 'express' ? 'توصيل سريع' : shippingMethod === 'pickup' ? 'استلام من المعرض' : 'توصيل عادي'}**".`} className="text-slate-500 font-bold" />
                </div>
                <button onClick={onBack} className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black shadow-xl">العودة للتسوق</button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl animate-slide-up">
            <div className="flex items-center gap-6 mb-12">
                <button onClick={onBack} className="p-4 bg-white border border-slate-100 rounded-[24px] text-slate-400 hover:text-primary shadow-sm">
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">سلة المشتريات</h2>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">تأكيد المشتريات وطريقة الاستلام</p>
                </div>
            </div>

            {items.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-6">
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.product.id} className="bg-white rounded-[40px] p-6 border border-slate-50 shadow-sm flex items-center gap-6 group">
                                    <div className="w-24 h-24 rounded-[28px] overflow-hidden shrink-0 bg-slate-50">
                                        <img src={item.product.imageUrl} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-black text-slate-900 mb-1">{item.product.title}</h4>
                                        <p className="text-xs text-slate-400 font-bold">بواسطة: {item.product.sellerName}</p>
                                    </div>
                                    <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl">
                                        <button onClick={() => onUpdateQuantity(item.product.id, -1)} className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-400"><Minus size={16}/></button>
                                        <span className="font-black text-slate-900 min-w-[20px] text-center">{item.quantity}</span>
                                        <button onClick={() => onUpdateQuantity(item.product.id, 1)} className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-400"><Plus size={16}/></button>
                                    </div>
                                    <button onClick={() => onRemove(item.product.id)} className="p-4 text-slate-200 hover:text-red-500"><Trash2 size={20}/></button>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3"><Truck size={24} className="text-primary"/> اختر وسيلة التوصيل</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button onClick={() => setShippingMethod('standard')} className={`p-6 rounded-[32px] border-2 text-right transition-all flex flex-col gap-3 ${shippingMethod === 'standard' ? 'border-primary bg-primary/5 shadow-lg' : 'border-slate-50 bg-slate-50 hover:bg-white'}`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${shippingMethod === 'standard' ? 'bg-primary text-white' : 'bg-white text-slate-300'}`}><Truck size={20}/></div>
                                    <div><p className="font-black text-xs">توصيل عادي</p><p className="text-[9px] text-slate-400">1,500 ج.س</p></div>
                                </button>
                                <button onClick={() => setShippingMethod('express')} className={`p-6 rounded-[32px] border-2 text-right transition-all flex flex-col gap-3 ${shippingMethod === 'express' ? 'border-teal-500 bg-teal-50 shadow-lg' : 'border-slate-50 bg-slate-50 hover:bg-white'}`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${shippingMethod === 'express' ? 'bg-teal-500 text-white' : 'bg-white text-slate-300'}`}><Bike size={20}/></div>
                                    <div><p className="font-black text-xs">توصيل سريع</p><p className="text-[9px] text-slate-400">3,000 ج.س</p></div>
                                </button>
                                <button onClick={() => setShippingMethod('pickup')} className={`p-6 rounded-[32px] border-2 text-right transition-all flex flex-col gap-3 ${shippingMethod === 'pickup' ? 'border-slate-900 bg-slate-900 text-white shadow-lg' : 'border-slate-50 bg-slate-50 hover:bg-white'}`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${shippingMethod === 'pickup' ? 'bg-white text-slate-900' : 'bg-white text-slate-300'}`}><ShoppingBag size={20}/></div>
                                    <div><p className="font-black text-xs">استلام يدوي</p><p className="text-[9px] opacity-60">0 ج.س</p></div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-slate-900 rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl">
                            <h3 className="text-xl font-black mb-8 border-b border-white/10 pb-6">الفاتورة النهائية</h3>
                            <div className="space-y-4 mb-10">
                                <div className="flex justify-between items-center text-slate-400 font-bold"><span>المجموع</span><span>{total.toLocaleString()} ج.س</span></div>
                                <div className="flex justify-between items-center text-slate-400 font-bold"><span>الشحن</span><span>{shippingCost.toLocaleString()} ج.س</span></div>
                                <div className="flex justify-between items-center pt-6 border-t border-white/10">
                                    <span className="text-lg font-black text-teal-400">الإجمالي الكلي</span>
                                    <span className="text-3xl font-black">{(total + shippingCost).toLocaleString()}</span>
                                </div>
                            </div>
                            <button 
                                onClick={handleCheckoutProcess}
                                disabled={isCheckingOut}
                                className="w-full bg-primary text-white py-6 rounded-[32px] font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.03] transition-all flex items-center justify-center gap-3"
                            >
                                {isCheckingOut ? <Loader2 size={24} className="animate-spin" /> : <>تأكيد العملية الآن <CheckCircle2 size={20}/></>}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-[60px] p-32 text-center border-4 border-dashed border-slate-50 flex flex-col items-center">
                    <ShoppingBag size={64} className="text-slate-100 mb-6" />
                    <h3 className="text-2xl font-black text-slate-300 uppercase tracking-widest">السلة فارغة</h3>
                </div>
            )}
        </div>
    );
};

export default CartView;
