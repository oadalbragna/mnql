import React, { useState, useEffect } from 'react';
import { CATEGORIES, MANAQIL_LOCATIONS } from '../constants';
import { CategoryId, Product } from '../types';
import { 
  Camera, Sparkles, Loader2, X, MapPin, 
  Check, ShieldCheck, Gauge, Fuel, Settings, Maximize2, Layers, Calendar, Package, Info, Gavel, Timer, 
  Smartphone, CarFront, HomeIcon, Trash2, Edit2, ChefHat, Palette, Ruler, Hash, FileText, Clock,
  Bike, Zap, Monitor, Laptop, Power, BoxSelect
} from 'lucide-react';
import { generateSmartDescription } from '../services/geminiService';
import { ref, set, push } from 'firebase/database';
import { db } from '../firebase';
import FormattedText from './FormattedText';
import { TelegramService } from '../services/telegramService';
import SmartMedia from './SmartMedia';

interface AddListingFormProps {
    user: any;
    editingProduct?: Product | null;
    onClose: () => void;
    onSubmitSuccess: (product: Product) => void;
}

type FormStep = 'basics' | 'specifics' | 'media' | 'preview';

const AddListingForm: React.FC<AddListingFormProps> = ({ user, editingProduct, onClose, onSubmitSuccess }) => {
    const [step, setStep] = useState<FormStep>('basics');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    
    // Basic Data
    const [title, setTitle] = useState(editingProduct?.title || '');
    const [price, setPrice] = useState(editingProduct?.price.toString() || '');
    const [category, setCategory] = useState<CategoryId>(editingProduct?.categoryId || CategoryId.ELECTRONICS);
    const [stock, setStock] = useState(editingProduct?.availableQuantity.toString() || '1');
    const [description, setDescription] = useState(editingProduct?.description || '');
    const [location, setLocation] = useState(editingProduct?.location || MANAQIL_LOCATIONS[0]);
    
    // Auction
    const [isAuction, setIsAuction] = useState(editingProduct?.isAuction || false);

    const [specifics, setSpecifics] = useState<any>({
        vehicleType: editingProduct?.vehicleType || 'car',
        electronicsType: editingProduct?.electronicsType || 'mobile',
        brand: editingProduct?.brand || '',
        model: editingProduct?.model || '',
        year: editingProduct?.year || '',
        fuelType: editingProduct?.fuelType || 'بنزين',
        mileage: editingProduct?.mileage || '',
        storage: editingProduct?.storage || '',
        ram: editingProduct?.ram || '',
        condition: editingProduct?.condition || 'used',
        squareNumber: editingProduct?.squareNumber || '',
        blockNumber: editingProduct?.blockNumber || '',
        areaSize: editingProduct?.areaSize || '',
        housingType: editingProduct?.housingType || 'house',
        familyBrand: editingProduct?.familyBrand || user?.familyName || '',
        prepTime: editingProduct?.prepTime || '2h',
        ingredients: editingProduct?.ingredients || '',
    });

    const [images, setImages] = useState<string[]>(editingProduct?.images || (editingProduct?.imageUrl ? [editingProduct.imageUrl] : []));

    const handleSpecChange = (key: string, val: string) => {
        setSpecifics((prev: any) => ({ ...prev, [key]: val }));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        
        setIsUploading(true);
        const newImages = [...images];
        
        for (const file of Array.from(files)) {
            const fileId = await TelegramService.uploadFile(file);
            if (fileId) {
                newImages.push(fileId);
            } else {
                alert("فشل رفع إحدى الصور، يرجى المحاولة مرة أخرى.");
            }
        }
        
        setImages(newImages);
        setIsUploading(false);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const productData: Partial<Product> = {
                id: editingProduct?.id || `PROD_${Date.now()}`,
                title,
                description,
                price: Number(price),
                availableQuantity: Number(stock),
                currency: 'ج.س',
                categoryId: category,
                imageUrl: images[0] || '', // هذا الآن سيكون file_id من تيليجرام
                images: images,
                location: location,
                sellerName: user?.fullName || 'تاجر محلي',
                sellerPhone: user?.emailOrPhone || '',
                sellerId: user?.id || 'unknown',
                createdAt: editingProduct?.createdAt || new Date().toISOString(),
                likes: editingProduct?.likes || 0,
                views: editingProduct?.views || 0,
                isAuction: isAuction,
                ...specifics,
                attributes: {
                    'الحالة': specifics.condition === 'new' ? 'جديد' : 'مستعمل',
                    'الموقع': location,
                    ...Object.fromEntries(Object.entries(specifics).filter(([_, v]) => v !== ''))
                }
            };

            const productRef = ref(db, `Mangal-Shop/products/${productData.id}`);
            await set(productRef, productData);
            onSubmitSuccess(productData as Product);
        } catch (e) {
            alert("فشل في حفظ البيانات.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderSpecificsStep = () => {
        switch (category) {
            case CategoryId.CARS:
                return (
                    <div className="space-y-6 animate-fade-in text-right">
                        <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 justify-end"><CarFront className="text-primary"/> تفاصيل المركبة</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase mr-4">نوع المركبة</label>
                                <select value={specifics.vehicleType} onChange={e => handleSpecChange('vehicleType', e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold text-right">
                                    <option value="car">سيارة</option>
                                    <option value="bike">دراجة نارية (موتور)</option>
                                    <option value="engine">محرك / ماكينة</option>
                                    <option value="cycle">عجلة هوائية</option>
                                    <option value="truck">لوري / شاحنة</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase mr-4">الماركة / الشركة</label>
                                <input type="text" placeholder="مثلاً: تويوتا، بوكسر، شفر..." value={specifics.brand} onChange={e => handleSpecChange('brand', e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold text-right" />
                            </div>
                        </div>
                    </div>
                );
            case CategoryId.REAL_ESTATE:
                return (
                    <div className="space-y-6 animate-fade-in text-right">
                        <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 justify-end"><HomeIcon className="text-primary"/> تفاصيل العقار</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase mr-4">رقم المربع</label>
                                <input type="text" placeholder="مربع كم؟" value={specifics.squareNumber} onChange={e => handleSpecChange('squareNumber', e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold text-right" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase mr-4">المساحة</label>
                                <input type="text" placeholder="400 متر" value={specifics.areaSize} onChange={e => handleSpecChange('areaSize', e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold text-right" />
                            </div>
                        </div>
                    </div>
                );
            case CategoryId.ELECTRONICS:
                return (
                    <div className="space-y-6 animate-fade-in text-right">
                        <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 justify-end"><Monitor className="text-primary"/> مواصفات الإلكترونيات</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase mr-4">الماركة</label>
                                <input type="text" placeholder="آبل، سامسونج، HP..." value={specifics.brand} onChange={e => handleSpecChange('brand', e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold text-right" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase mr-4">الرام (RAM)</label>
                                <input type="text" placeholder="8GB, 16GB..." value={specifics.ram} onChange={e => handleSpecChange('ram', e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold text-right" />
                            </div>
                        </div>
                    </div>
                );
            default: return <div className="text-center text-slate-400 font-bold py-10">هذا القسم لا يحتاج تفاصيل إضافية حالياً</div>;
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-2xl overflow-y-auto no-scrollbar">
            <div className="bg-white w-full max-w-4xl rounded-[60px] shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[95vh] text-right">
                
                {/* Header */}
                <div className="p-8 border-b bg-slate-50/50 flex justify-between items-center shrink-0">
                    <button onClick={onClose} className="p-4 bg-white hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-[24px] transition-all shadow-sm"><X size={24}/></button>
                    <div className="flex items-center gap-6">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 leading-none mb-1">{editingProduct ? 'تعديل السلعة' : 'نشر عرض جديد'}</h2>
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">تيليجرام بريدج v1.0</p>
                        </div>
                        <div className="flex -space-x-4">
                            {['basics', 'specifics', 'media', 'preview'].map((s, i) => (
                                <div key={s} className={`w-10 h-10 rounded-full border-4 border-white flex items-center justify-center font-black text-xs relative z-10 transition-all ${step === s ? 'bg-primary text-white scale-125 shadow-lg' : 'bg-slate-200 text-slate-400'}`}>
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-10 md:p-14 space-y-12 no-scrollbar">
                    {step === 'basics' && (
                        <div className="space-y-10 animate-fade-in">
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setIsAuction(false)} className={`p-8 rounded-[40px] border-2 text-right transition-all flex flex-col gap-4 ${!isAuction ? 'border-primary bg-primary/5 shadow-lg' : 'border-slate-50 bg-slate-50'}`}>
                                    <Package size={24} className={!isAuction ? 'text-primary' : 'text-slate-300'}/>
                                    <div><h4 className="font-black text-slate-900">بيع مباشر</h4><p className="text-[10px] text-slate-400 font-bold">سعر نهائي للزبون</p></div>
                                </button>
                                <button onClick={() => setIsAuction(true)} className={`p-8 rounded-[40px] border-2 text-right transition-all flex flex-col gap-4 ${isAuction ? 'border-orange-500 bg-orange-50 shadow-lg' : 'border-slate-50 bg-slate-50'}`}>
                                    <Gavel size={24} className={isAuction ? 'text-orange-500' : 'text-slate-300'}/>
                                    <div><h4 className="font-black text-slate-900">بيع بالمزاد</h4><p className="text-[10px] text-slate-400 font-bold">نظام الدلالة المفتوح</p></div>
                                </button>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">عنوان الإعلان</label>
                                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="آيفون 15، منزل بمربع 15..." className="w-full bg-slate-50 border-none rounded-3xl py-6 px-8 font-black text-xl shadow-inner focus:ring-4 focus:ring-primary/5 text-right" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">القسم</label>
                                    <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full bg-slate-50 border-none rounded-3xl py-5 px-6 font-bold appearance-none cursor-pointer text-right">
                                        {CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">السعر المطلوب</label>
                                    <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" className="w-full bg-slate-50 border-none rounded-3xl py-5 px-6 font-bold shadow-inner text-right" />
                                </div>
                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">الموقع</label>
                                    <select value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-slate-50 border-none rounded-3xl py-5 px-6 font-bold appearance-none cursor-pointer text-right">
                                        {MANAQIL_LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                    </select>
                                </div>
                            </div>

                            <button onClick={() => setStep('specifics')} className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black text-lg shadow-xl hover:bg-black transition-all">متابعة التفاصيل</button>
                        </div>
                    )}

                    {step === 'specifics' && (
                        <div className="space-y-10 animate-fade-in">
                            {renderSpecificsStep()}
                            <div className="flex gap-4">
                                <button onClick={() => setStep('basics')} className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-3xl font-black">السابق</button>
                                <button onClick={() => setStep('media')} className="flex-1 py-5 bg-slate-900 text-white rounded-3xl font-black shadow-xl">متابعة الصور والوصف</button>
                            </div>
                        </div>
                    )}

                    {step === 'media' && (
                        <div className="space-y-10 animate-fade-in">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {images.map((id, i) => (
                                    <div key={i} className="aspect-square rounded-3xl overflow-hidden border-4 border-slate-50 relative group">
                                        <SmartMedia fileId={id} className="w-full h-full object-cover" />
                                        <button onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                                    </div>
                                ))}
                                <label className="aspect-square rounded-3xl border-4 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-all group">
                                    {isUploading ? (
                                        <Loader2 className="animate-spin text-primary" size={32} />
                                    ) : (
                                        <>
                                            <Camera size={32} className="text-slate-300 group-hover:text-primary transition-colors" />
                                            <span className="text-[9px] font-black text-slate-400 mt-2">إضافة صور (تيليجرام)</span>
                                        </>
                                    )}
                                    <input type="file" multiple hidden onChange={handleImageChange} disabled={isUploading} />
                                </label>
                            </div>

                            <div className="space-y-4 text-right">
                                <div className="flex justify-between px-4">
                                    <button onClick={async () => { setIsLoading(true); const d = await generateSmartDescription(title, `${category}, ${location}`); setDescription(d); setIsLoading(false); }} className="text-primary text-[10px] font-black flex items-center gap-1 hover:underline">
                                        <Sparkles size={12}/> صياغة ذكية (AI)
                                    </button>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الوصف الإعلاني</label>
                                </div>
                                <textarea rows={5} value={description} onChange={e => setDescription(e.target.value)} placeholder="اذكر حالة السلعة..." className="w-full bg-slate-50 border-none rounded-[40px] py-8 px-10 font-bold text-slate-700 shadow-inner focus:ring-4 focus:ring-primary/5 text-right" />
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setStep('specifics')} className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-3xl font-black">السابق</button>
                                <button onClick={() => setStep('preview')} className="flex-1 py-5 bg-slate-900 text-white rounded-3xl font-black shadow-xl">المعاينة النهائية</button>
                            </div>
                        </div>
                    )}

                    {step === 'preview' && (
                        <div className="space-y-10 animate-fade-in text-center">
                            <div className="p-12 bg-slate-50 rounded-[60px] border border-slate-100 shadow-inner relative overflow-hidden text-right">
                                <h3 className="text-3xl font-black text-slate-900 mb-6">{title}</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 border-b border-slate-200 pb-8">
                                    <div><p className="text-[9px] text-slate-400 font-black uppercase mb-1">السعر</p><p className="text-2xl font-black text-primary">{Number(price).toLocaleString()} ج.س</p></div>
                                    <div><p className="text-[9px] text-slate-400 font-black uppercase mb-1">القسم</p><p className="text-lg font-black text-slate-700">{CATEGORIES.find(c=>c.id===category)?.name}</p></div>
                                    <div><p className="text-[9px] text-slate-400 font-black uppercase mb-1">الموقع</p><p className="text-lg font-black text-slate-700">{location}</p></div>
                                    <div><p className="text-[9px] text-slate-400 font-black uppercase mb-1">الحالة</p><p className="text-lg font-black text-emerald-600">موثوق</p></div>
                                </div>
                                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                                    <label className="text-[10px] font-black text-slate-400 uppercase mb-4 block">نص الإعلان المنشور:</label>
                                    <FormattedText text={description} className="text-slate-600 font-bold" />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setStep('media')} className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-3xl font-black">تعديل الوسائط</button>
                                <button onClick={handleSubmit} disabled={isLoading} className="flex-[2] py-6 bg-primary text-white rounded-[32px] font-black text-xl shadow-xl shadow-primary/20 flex items-center justify-center gap-4 hover:scale-[1.02] transition-all">
                                    {isLoading ? <Loader2 className="animate-spin" /> : <>نشر العرض في سوق المناقل <Check size={28}/></>}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddListingForm;
