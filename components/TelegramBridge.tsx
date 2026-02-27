
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Send, Download, Upload, Link as LinkIcon, 
  FileText, ShieldCheck, Loader2, Copy, Check, MessageSquare, 
  ExternalLink, Trash2, RefreshCw, Smartphone, Bot, CheckCircle2,
  Layers, BookOpen, Image as ImageIcon, Video, FilePlus, Save, History, 
  Globe, Cpu, Monitor, Palette, Code, GraduationCap, Mic, ClipboardList, Share2, Database, Lock,
  Zap
} from 'lucide-react';
import { ref, get, update, push, serverTimestamp, set } from 'firebase/database';
import { db } from '../firebase';

interface TelegramBridgeProps {
  onBack: () => void;
}

interface UploadHistory {
  id: string;
  name: string;
  fileId: string;
  category: string;
  url: string; // رابط البوابة الآمنة
  directUrl: string; // الرابط الحقيقي (مخفي)
  timestamp: number;
}

type StorageCategory = 'products' | 'orders' | 'delivery' | 'identity' | 'general';

const TelegramBridge: React.FC<TelegramBridgeProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'upload' | 'download' | 'history'>('upload');
  
  const [botToken, setBotToken] = useState(localStorage.getItem('tg_bot_token') || '8300515932:AAFOj6scD2bqKamDbII87hTANq1PTzJZZmU');
  const [chatId, setChatId] = useState(localStorage.getItem('tg_chat_id') || '1086351274');
  
  const [fileCategory, setFileCategory] = useState<StorageCategory>('products');
  
  const [safeLink, setSafeLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [history, setHistory] = useState<UploadHistory[]>(JSON.parse(localStorage.getItem('tg_upload_history') || '[]'));

  const saveConfig = () => {
    localStorage.setItem('tg_bot_token', botToken);
    localStorage.setItem('tg_chat_id', chatId);
    alert('تم حفظ إعدادات جسر تيليجرام بنجاح');
  };

  const generateSafeLink = async (fileName: string, tgFileId: string, directUrl: string) => {
    try {
        const shortId = `mnq_${Math.random().toString(36).substring(2, 9)}`;
        const updates: any = {};
        
        // التعديل: استخدام فرع Mangal-Shop للبيانات الوصفية
        const safeLinkPath = `Mangal-Shop/meta_data/safe_links/${shortId}`;
        const safeLinkData = {
            id: shortId,
            name: fileName,
            direct_url: directUrl,
            tele_file_id: tgFileId,
            category: fileCategory,
            timestamp: serverTimestamp()
        };
        updates[safeLinkPath] = safeLinkData;

        const metaPath = `Mangal-Shop/meta_data/cloud_storage/${fileCategory}/${shortId}`;
        updates[metaPath] = safeLinkData;

        await update(ref(db), updates);

        const platformSafeUrl = `${window.location.origin}/media?f=${shortId}`;
        return { shortId, platformSafeUrl };
    } catch (e) {
        console.error("Safe Link Error:", e);
        return null;
    }
  };

  const uploadToTelegram = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !botToken || !chatId) {
        alert('يرجى إكمال إعدادات البوت أولاً');
        return;
    }
    
    setLoading(true);
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('document', file);
    formData.append('caption', `📦 صنف: ${fileCategory}\n📄 اسم الملف: ${file.name}\n📍 المصدر: سوق المناقل الرقمي`);

    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      
      if (data.ok) {
        const result = data.result.document;
        const fId = result.file_id;
        
        const fileInfo = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fId}`);
        const fileRes = await fileInfo.json();
        
        if (fileRes.ok) {
            const directUrl = `https://api.telegram.org/file/bot${botToken}/${fileRes.result.file_path}`;
            const safeData = await generateSafeLink(file.name, fId, directUrl);
            
            if (safeData) {
                setSafeLink(safeData.platformSafeUrl);

                const newItem: UploadHistory = {
                    id: safeData.shortId,
                    name: file.name,
                    fileId: fId,
                    category: fileCategory,
                    url: safeData.platformSafeUrl,
                    directUrl: directUrl,
                    timestamp: Date.now()
                };
                const newHistory = [newItem, ...history].slice(0, 30);
                setHistory(newHistory);
                localStorage.setItem('tg_upload_history', JSON.stringify(newHistory));
            }
        }
      } else {
        alert(`فشل الرفع: ${data.description}`);
      }
    } catch (e) {
      alert('خطأ في الاتصال بالشبكة');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#F8FAFC] min-h-screen pb-24 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 pt-12 sticky top-0 z-30 shadow-sm border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-slate-50 rounded-2xl hover:bg-primary hover:text-white transition-all">
            <ArrowRight size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">مركز التخزين السحابي</h1>
            <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">Telegram Media Bridge v4.0</p>
          </div>
        </div>
        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
          <Database size={32} />
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sidebar Settings */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                    <h3 className="font-black text-xs text-slate-400 uppercase tracking-widest">إعدادات الربط</h3>
                    <Lock size={14} className="text-slate-300" />
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase mr-4">Bot API Token</label>
                        <input type="password" value={botToken} onChange={e => setBotToken(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl text-left font-mono text-[10px] border-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase mr-4">Group Chat ID</label>
                        <input type="text" value={chatId} onChange={e => setChatId(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl text-left font-mono text-[10px] border-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <button onClick={saveConfig} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-black transition-all shadow-lg">حفظ البيانات</button>
                </div>
            </div>

            <div className="bg-emerald-600 p-8 rounded-[40px] text-white relative overflow-hidden group">
                <div className="relative z-10">
                    <h4 className="text-xl font-black mb-2">حالة الجسر</h4>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase">متصل ومزامن</span>
                    </div>
                    <p className="text-xs opacity-70 leading-relaxed font-bold">يتم رفع كافة وسائط المنتجات والطلبات آلياً إلى مجموعات تيليجرام الموثقة لضمان ديمومة البيانات.</p>
                </div>
                <Bot size={150} className="absolute -left-10 -bottom-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000" />
            </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
            {/* Tab Selector */}
            <div className="flex bg-slate-100 p-1.5 rounded-3xl gap-2">
                <button onClick={() => setActiveMode('upload')} className={`flex-1 py-4 rounded-[22px] text-xs font-black flex items-center justify-center gap-3 transition-all ${activeMode === 'upload' ? 'bg-white shadow-xl text-primary' : 'text-slate-500 hover:bg-white/50'}`}><Upload size={18} /> رفع وسائط جديدة</button>
                <button onClick={() => setActiveMode('history')} className={`flex-1 py-4 rounded-[22px] text-xs font-black flex items-center justify-center gap-3 transition-all ${activeMode === 'history' ? 'bg-white shadow-xl text-primary' : 'text-slate-500 hover:bg-white/50'}`}><History size={18} /> سجل الأرشيف</button>
            </div>

            {activeMode === 'upload' ? (
                <div className="space-y-8 animate-fade-in">
                    <div className="bg-white p-8 rounded-[48px] border border-slate-50 shadow-sm space-y-8">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3"><Layers size={22} className="text-primary"/> تصنيف البيانات المرفوعة</h3>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {['products', 'orders', 'delivery', 'identity', 'general'].map(cat => (
                                    <button 
                                        key={cat} 
                                        onClick={() => setFileCategory(cat as any)} 
                                        className={`py-4 rounded-2xl border-2 text-[10px] font-black transition-all ${fileCategory === cat ? 'border-primary bg-primary/5 text-primary' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
                                    >
                                        {cat.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <label className="w-full h-64 border-4 border-dashed border-slate-100 rounded-[48px] bg-slate-50/50 flex flex-col items-center justify-center cursor-pointer hover:border-primary/20 hover:bg-white transition-all group relative overflow-hidden">
                            <input type="file" className="hidden" onChange={uploadToTelegram} disabled={loading} />
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-4 border border-slate-50">
                                    {loading ? <Loader2 className="w-10 h-10 animate-spin" /> : <ShieldCheck size={40} />}
                                </div>
                                <span className="text-lg font-black text-slate-700">اسحب الملف أو اضغط للرفع</span>
                                <span className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-widest">Secure Direct Upload Enabled</span>
                            </div>
                            {loading && <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20"><div className="text-center font-black text-primary animate-pulse">جاري نقل الملف لتيليجرام...</div></div>}
                        </label>

                        {safeLink && (
                            <div className="p-8 bg-blue-50 rounded-[40px] border border-blue-100 animate-scale-in">
                                <div className="flex justify-between items-center mb-6">
                                    <h5 className="font-black text-blue-700 text-sm flex items-center gap-2">
                                        <Globe size={18} /> رابط الوصول الداخلي الآمن
                                    </h5>
                                    <span className="bg-blue-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase">Ready</span>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-blue-100 flex justify-between items-center shadow-inner">
                                    <span className="text-[11px] font-mono text-slate-600 truncate max-w-[250px]">{safeLink}</span>
                                    <button onClick={() => copyToClipboard(safeLink)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:scale-110 transition-all">
                                        {isCopied ? <Check size={18} /> : <Copy size={18} />}
                                    </button>
                                </div>
                                <p className="text-[10px] text-blue-400 mt-4 font-bold text-center italic">تمت أرشفة الملف بنجاح وتوليد رابط تشعبي للمنصة.</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-4 animate-fade-in">
                    {history.length > 0 ? history.map(item => (
                        <div key={item.id} className="bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm flex items-center justify-between group hover:border-primary/20 transition-all">
                            <div className="flex gap-3">
                               <button onClick={() => copyToClipboard(item.url)} className="p-4 bg-primary/5 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm"><LinkIcon size={20} /></button>
                               <button onClick={() => { setHistory(history.filter(h => h.id !== item.id)); localStorage.setItem('tg_upload_history', JSON.stringify(history.filter(h => h.id !== item.id))); }} className="p-4 text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                            </div>
                            <div className="text-right flex-1 px-6">
                                <h4 className="text-base font-black text-slate-800 truncate max-w-[200px]">{item.name}</h4>
                                <div className="flex items-center justify-end gap-4 mt-1">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">{new Date(item.timestamp).toLocaleDateString()}</span>
                                    <span className="text-[9px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded-full uppercase">{item.category}</span>
                                </div>
                            </div>
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 shrink-0 shadow-inner group-hover:text-primary transition-all">
                                <Zap size={28} />
                            </div>
                        </div>
                    )) : (
                        <div className="bg-white rounded-[56px] p-32 text-center border-4 border-dashed border-slate-50">
                            <Database size={64} className="mx-auto text-slate-100 mb-6" />
                            <h4 className="text-xl font-black text-slate-300 uppercase tracking-widest">الأرشيف فارغ</h4>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TelegramBridge;
