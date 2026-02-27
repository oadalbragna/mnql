
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Send, MessageCircle, User, Store, ArrowRight, Loader2, Clock } from 'lucide-react';
import { useAppContext } from '../core/context/AppContext';
import { FirebaseService } from '../services/firebaseService';
import { ChatMessage, ChatThread } from '../types';

const ChatView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { user } = useAppContext();
    const [threads, setThreads] = useState<ChatThread[]>([]);
    const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!user) return;
        const unsub = FirebaseService.observeThreads(user.emailOrPhone, setThreads);
        return () => unsub();
    }, [user]);

    useEffect(() => {
        if (!selectedThread) return;
        const unsub = FirebaseService.observeMessages(selectedThread.id, (msgs) => {
            setMessages(msgs.sort((a, b) => a.timestamp - b.timestamp));
            setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        });
        return () => unsub();
    }, [selectedThread]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !selectedThread || !newMessage.trim()) return;

        const otherId = selectedThread.participants.find(id => id !== user?.emailOrPhone)!;
        
        await FirebaseService.sendMessage(selectedThread.id, {
            senderId: user.emailOrPhone,
            text: newMessage
        }, selectedThread);

        setNewMessage('');
    };

    if (selectedThread) {
        const otherId = selectedThread.participants.find(id => id !== user?.emailOrPhone)!;
        const otherName = selectedThread.participantNames[otherId];

        return (
            <div className="fixed inset-0 z-[250] bg-white flex flex-col animate-fade-in">
                {/* Chat Header */}
                <div className="bg-white border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSelectedThread(null)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400"><ArrowRight size={24} /></button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-black">{otherName[0]}</div>
                            <div>
                                <h3 className="text-sm font-black text-slate-900">{otherName}</h3>
                                <p className="text-[10px] text-primary font-bold">{selectedThread.productTitle || 'دردشة مباشرة'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                    {messages.map((m) => (
                        <div key={m.id} className={`flex ${m.senderId === user?.emailOrPhone ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-4 rounded-[24px] shadow-sm text-sm ${
                                m.senderId === user?.emailOrPhone 
                                ? 'bg-primary text-white rounded-br-none' 
                                : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                            }`}>
                                <p className="font-bold leading-relaxed">{m.text}</p>
                                <p className={`text-[8px] mt-2 font-black uppercase opacity-60 ${m.senderId === user?.emailOrPhone ? 'text-right' : 'text-left'}`}>
                                    {new Date(m.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={scrollRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-3">
                    <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="اكتب رسالتك هنا..." 
                        className="flex-1 bg-slate-100 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <button type="submit" className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:scale-105 transition-all shadow-xl">
                        <Send size={20} />
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl animate-fade-in h-screen flex flex-col">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-primary transition-all shadow-sm">
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter">الرسائل</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">تواصل مع البائعين والمشترين</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar pb-24">
                {threads.length > 0 ? threads.map((t) => {
                    const otherId = t.participants.find(id => id !== user?.emailOrPhone)!;
                    const otherName = t.participantNames[otherId];
                    return (
                        <div 
                            key={t.id} 
                            onClick={() => setSelectedThread(t)}
                            className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
                        >
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-black text-lg group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                {otherName[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-black text-slate-900 text-sm truncate">{otherName}</h4>
                                    <span className="text-[8px] text-slate-400 font-bold">{new Date(t.lastTimestamp).toLocaleDateString('ar-SA')}</span>
                                </div>
                                <p className="text-xs text-slate-500 font-bold truncate">{t.lastMessage}</p>
                                {t.productTitle && <span className="text-[9px] text-primary font-black uppercase mt-1 block">حول: {t.productTitle}</span>}
                            </div>
                        </div>
                    );
                }) : (
                    <div className="py-32 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MessageCircle size={32} className="text-slate-200" />
                        </div>
                        <h3 className="text-lg font-black text-slate-300">لا توجد محادثات نشطة</h3>
                        <p className="text-xs text-slate-400 mt-2 font-bold">ابدأ بمراسلة البائعين من صفحة المنتج</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatView;
