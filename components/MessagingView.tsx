
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Search, ChevronLeft, User, Send, CheckCheck, Bot, Sparkles, MoreVertical, Phone, Image as ImageIcon, Smile, Mic, Trash2, ShieldCheck } from 'lucide-react';

const MOCK_CONVERSATIONS = [
    { id: '1', name: 'أحمد الطيب', lastMessage: 'كم آخر سعر للهايلكس يا ريس؟', time: '10:30 ص', unread: 2, isOnline: true, avatar: 'https://picsum.photos/100/100?random=5' },
    { id: '2', name: 'عقارات المناقل الشاملة', lastMessage: 'تم تحديث موقع قطعة الأرض في حي النصر', time: 'أمس', unread: 0, isOnline: false, avatar: 'https://picsum.photos/100/100?random=6' },
    { id: '3', name: 'سما المساعدة الذكية', lastMessage: 'وجدت لك 3 عروض جديدة لسيارات هايلكس!', time: 'أمس', unread: 0, isAi: true, isOnline: true, avatar: null },
];

const MOCK_MESSAGES = [
    { id: 'm1', text: 'سلام عليكم، شفت إعلانك بخصوص الهايلكس 2020', sender: 'other', time: '09:00 ص' },
    { id: 'm2', text: 'وعليكم السلام، حياك الله. السيارة موجودة وبحالة ممتازة جداً', sender: 'me', time: '09:05 ص' },
    { id: 'm3', text: 'كم آخر سعر ممكن نصل فيه؟ أنا جاد في الشراء من المناقل.', sender: 'other', time: '09:10 ص' },
    { id: 'm4', text: 'السعر النهائي 8 مليون و500 ألف، والسيارة ما محتاجة أي مصروف.', sender: 'me', time: '09:15 ص' },
];

interface MessagingViewProps {
    onBack: () => void;
    initialContext?: { sellerName: string, initialText: string } | null;
    onClearContext?: () => void;
}

const MessagingView: React.FC<MessagingViewProps> = ({ onBack, initialContext, onClearContext }) => {
    const [selectedChat, setSelectedChat] = useState<any>(MOCK_CONVERSATIONS[0]);
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    useEffect(() => {
        if (initialContext) {
            const newConv = {
                id: Date.now().toString(),
                name: initialContext.sellerName,
                lastMessage: initialContext.initialText,
                time: 'الآن',
                unread: 0,
                isOnline: true,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${initialContext.sellerName}`
            };
            setSelectedChat(newConv);
            setMessages([...MOCK_MESSAGES, { id: 'init', text: initialContext.initialText, sender: 'me', time: 'الآن' }]);
            if (onClearContext) onClearContext();
        }
    }, [initialContext]);

    useEffect(() => { scrollToBottom(); }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        const newMsg = { id: Date.now().toString(), text: input, sender: 'me', time: 'الآن' };
        setMessages([...messages, newMsg]);
        setInput('');
        
        setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
                const reply = { id: (Date.now()+1).toString(), text: 'تمام، هل ممكن أعاين السلعة غداً في المناقل؟', sender: 'other', time: 'الآن' };
                setMessages(prev => [...prev, reply]);
                setIsTyping(false);
            }, 2000);
        }, 1000);
    };

    return (
        <div className="container mx-auto px-4 py-8 h-[calc(100vh-120px)] animate-slide-up">
            <div className="bg-white rounded-[56px] shadow-[0_40px_100px_rgba(0,0,0,0.05)] border border-slate-50 h-full overflow-hidden flex flex-col md:flex-row relative">
                
                {/* Conversations Sidebar */}
                <div className={`w-full md:w-96 border-l border-slate-50 flex flex-col ${selectedChat && 'hidden md:flex'}`}>
                    <div className="p-8 border-b border-slate-50 bg-slate-50/50">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">دردشاتي</h2>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">تواصل آمن داخل المنصة</p>
                            </div>
                            <button onClick={onBack} className="md:hidden p-3 bg-white rounded-2xl text-slate-400"><ChevronLeft/></button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        {MOCK_CONVERSATIONS.map(chat => (
                            <button 
                                key={chat.id} 
                                onClick={() => setSelectedChat(chat)}
                                className={`w-full p-6 flex items-center gap-4 hover:bg-slate-50 transition-all text-right relative ${selectedChat?.id === chat.id ? 'bg-primary/5 before:absolute before:right-0 before:top-4 before:bottom-4 before:w-1.5 before:bg-primary before:rounded-l-full' : ''}`}
                            >
                                <div className="relative shrink-0">
                                    <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center shadow-sm overflow-hidden border-2 ${chat.isAi ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-400 border-white'}`}>
                                        {chat.isAi ? <Bot size={28}/> : chat.avatar ? <img src={chat.avatar} className="w-full h-full object-cover"/> : <User size={28}/>}
                                    </div>
                                    {chat.isOnline && <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full"></div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-black text-slate-900 text-sm truncate">{chat.name}</h4>
                                        <span className="text-[10px] text-slate-400 font-bold">{chat.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate font-medium">{chat.lastMessage}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`flex-1 flex flex-col bg-slate-50/30 ${!selectedChat && 'hidden md:flex items-center justify-center'}`}>
                    {selectedChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="bg-white/80 backdrop-blur-xl p-6 border-b border-slate-50 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setSelectedChat(null)} className="md:hidden p-2 text-slate-400"><ChevronLeft/></button>
                                    <div className="relative">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedChat.isAi ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            {selectedChat.isAi ? <Bot size={24}/> : selectedChat.avatar ? <img src={selectedChat.avatar} className="w-full h-full object-cover rounded-2xl"/> : <User size={24}/>}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                                            {selectedChat.name}
                                            <ShieldCheck size={14} className="text-blue-500" />
                                        </h4>
                                        <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">متصل الآن</p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                                {messages.map((m) => (
                                    <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                                        <div className={`max-w-[75%] space-y-1 ${m.sender === 'me' ? 'items-end' : 'items-start'}`}>
                                            <div className={`p-5 rounded-[28px] text-sm leading-relaxed shadow-sm font-bold ${
                                                m.sender === 'me' 
                                                    ? 'bg-primary text-white rounded-tl-none shadow-primary/10' 
                                                    : 'bg-white text-slate-700 rounded-tr-none border border-slate-100'
                                            }`}>
                                                {m.text}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isTyping && <div className="flex justify-start animate-pulse"><span className="text-xs text-slate-400 font-bold">جاري الكتابة...</span></div>}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-8 bg-white border-t border-slate-50">
                                <div className="flex gap-4 items-center">
                                    <div className="flex-1 bg-slate-50 rounded-[32px] border border-slate-100/50 flex items-center px-4 shadow-inner">
                                        <input 
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                            type="text" 
                                            placeholder="اكتب ردك هنا..." 
                                            className="flex-1 bg-transparent border-none py-5 px-4 font-bold text-slate-700 outline-none text-sm"
                                        />
                                    </div>
                                    <button 
                                        onClick={handleSend}
                                        className="w-16 h-16 bg-primary text-white rounded-[24px] flex items-center justify-center shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                    >
                                        <Send size={24} className="rotate-180 ml-1" />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-20">
                            <h3 className="text-2xl font-black text-slate-900">اختر محادثة للمتابعة</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessagingView;
