
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles, ChevronDown } from 'lucide-react';
import { createMarketChat } from '../services/geminiService';
import { Product } from '../types';
import FormattedText from './FormattedText';

interface ChatWidgetProps {
    products: Product[];
}

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ products }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'مرحباً! أنا **رفيق السوق**. أقدر أساعدك تفتش عن "حاجة معينة"؟ 🚗🏠📱', sender: 'ai', timestamp: new Date() }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatSession, setChatSession] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    useEffect(() => {
        if (isOpen && !chatSession) {
            try {
                createMarketChat(products).then(session => setChatSession(session));
            } catch (e) {
                console.error("Failed to init chat", e);
            }
        }
    }, [isOpen, products]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsLoading(true);

        try {
            let responseText = "عفواً، النظام مشغول حالياً.";
            
            if (chatSession) {
                const result = await chatSession.sendMessage({ message: userMsg.text });
                responseText = result.text;
            } else {
                responseText = "عفواً، خدمة الذكاء الاصطناعي غير مفعلة حالياً.";
            }

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "حدث خطأ في الاتصال، حاول مرة أخرى.",
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-24 md:bottom-8 right-6 z-40 bg-gray-900 hover:bg-black text-white p-4 rounded-full shadow-2xl shadow-primary/20 hover:scale-105 transition-all duration-300 group flex items-center justify-center"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary to-teal-400 rounded-full opacity-20 blur-lg group-hover:opacity-40 transition-opacity"></div>
                    <Sparkles className="absolute -top-1 -right-1 text-yellow-300 animate-pulse z-10" size={16} />
                    <Bot size={28} className="relative z-10" />
                </button>
            )}

            {isOpen && (
                <div className="fixed bottom-0 right-0 md:bottom-24 md:right-6 w-full md:w-[400px] h-[85vh] md:h-[650px] bg-white md:rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden animate-slide-up border border-gray-100/50">
                    <div className="bg-white/90 backdrop-blur-md p-4 flex justify-between items-center border-b border-gray-100 sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-tr from-primary to-teal-400 p-2.5 rounded-2xl shadow-lg shadow-primary/20">
                                <Bot size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-sm">رفيق السوق</h3>
                                <div className="flex items-center gap-1.5 text-[11px] text-green-600 font-medium">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                    متصل الآن
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                            <ChevronDown size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gray-50/50 scroll-smooth">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                                <div className={`flex max-w-[85%] gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-white ${msg.sender === 'user' ? 'bg-gray-200 text-gray-500' : 'bg-white text-primary'}`}>
                                        {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                                    </div>
                                    <div className={`px-5 py-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                                        msg.sender === 'user' 
                                            ? 'bg-primary text-white rounded-tr-none' 
                                            : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                                    }`}>
                                        <FormattedText text={msg.text} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start animate-fade-in">
                                <div className="flex max-w-[80%] gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-white border border-gray-100 text-primary flex items-center justify-center shrink-0 shadow-sm">
                                        <Bot size={14} />
                                    </div>
                                    <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex items-center gap-2">
                                        <span className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 bg-white border-t border-gray-100">
                        <div className="flex gap-2 items-end bg-gray-50 p-1.5 rounded-[20px] border border-gray-200 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 transition-all duration-300">
                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="اكتب رسالتك هنا..."
                                className="flex-1 bg-transparent border-none outline-none text-sm resize-none max-h-24 py-3 px-3 text-gray-700 placeholder-gray-400 font-bold"
                                rows={1}
                                style={{ minHeight: '44px' }}
                            />
                            <button onClick={handleSend} disabled={!inputValue.trim() || isLoading} className="w-10 h-10 bg-primary disabled:bg-gray-300 text-white rounded-full hover:bg-teal-700 transition-all duration-300 shadow-md flex items-center justify-center shrink-0 mb-0.5 hover:scale-105 active:scale-95">
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="rotate-180" />}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatWidget;
