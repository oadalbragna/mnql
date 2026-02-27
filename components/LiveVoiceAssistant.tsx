
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Sparkles, Volume2, Loader2, Bot } from 'lucide-react';
import { connectToLiveAssistant, encodeAudio, decodeAudio, decodeAudioData } from '../services/geminiService';

const LiveVoiceAssistant: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [isActive, setIsActive] = useState(false);
    const [status, setStatus] = useState('جاري الاتصال بـ "سما"...');
    const [isThinking, setIsThinking] = useState(false);
    
    const audioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const sessionRef = useRef<any>(null);
    const nextStartTimeRef = useRef(0);
    const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

    const startAssistant = async () => {
        try {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            const inputCtx = new AudioContext({ sampleRate: 16000 });
            streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            const sessionPromise = connectToLiveAssistant({
                onopen: () => {
                    setStatus('تحدث الآن، "سما" تسمعك...');
                    setIsActive(true);
                    
                    const source = inputCtx.createMediaStreamSource(streamRef.current!);
                    const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
                    
                    scriptProcessor.onaudioprocess = (e) => {
                        const inputData = e.inputBuffer.getChannelData(0);
                        const int16 = new Int16Array(inputData.length);
                        for (let i = 0; i < inputData.length; i++) {
                            int16[i] = inputData[i] * 32768;
                        }
                        sessionPromise.then(session => {
                            session.sendRealtimeInput({
                                media: {
                                    data: encodeAudio(new Uint8Array(int16.buffer)),
                                    mimeType: 'audio/pcm;rate=16000'
                                }
                            });
                        });
                    };
                    source.connect(scriptProcessor);
                    scriptProcessor.connect(inputCtx.destination);
                },
                onmessage: async (message: any) => {
                    // Fix: Added optional chaining for parts access
                    const audioBase64 = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    if (audioBase64 && audioContextRef.current) {
                        setIsThinking(false);
                        const ctx = audioContextRef.current;
                        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                        const buffer = await decodeAudioData(decodeAudio(audioBase64), ctx, 24000, 1);
                        const source = ctx.createBufferSource();
                        source.buffer = buffer;
                        source.connect(ctx.destination);
                        source.start(nextStartTimeRef.current);
                        nextStartTimeRef.current += buffer.duration;
                        sourcesRef.current.add(source);
                    }
                    if (message.serverContent?.interrupted) {
                        sourcesRef.current.forEach(s => s.stop());
                        sourcesRef.current.clear();
                    }
                },
                onerror: () => setStatus('خطأ في الاتصال'),
                onclose: () => setIsActive(false)
            });
            
            sessionRef.current = await sessionPromise;
        } catch (e) {
            setStatus('فشل الوصول للميكروفون');
        }
    };

    useEffect(() => {
        startAssistant();
        return () => {
            streamRef.current?.getTracks().forEach(t => t.stop());
            audioContextRef.current?.close();
            sessionRef.current?.close();
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-xl animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-[50px] overflow-hidden shadow-2xl border border-white/20 flex flex-col items-center p-10 space-y-8 animate-slide-up">
                
                <div className="relative">
                    <div className={`w-32 h-32 rounded-full bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center shadow-2xl transition-all duration-500 ${isActive ? 'scale-110' : 'scale-100'}`}>
                        <Bot size={56} className="text-white" />
                        {isActive && (
                            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
                        )}
                    </div>
                    <div className="absolute -top-2 -right-2 bg-yellow-400 p-2 rounded-2xl shadow-lg border-4 border-white">
                        <Sparkles size={16} className="text-white" />
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <h3 className="text-2xl font-black text-gray-900">سما المساعدة الذكية</h3>
                    <p className={`text-sm font-bold ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                        {status}
                    </p>
                </div>

                <div className="w-full flex justify-center gap-4 py-4">
                    {isActive ? (
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className={`w-1.5 bg-primary rounded-full animate-bounce`} style={{ height: `${10 + Math.random() * 30}px`, animationDelay: `${i * 0.1}s` }} />
                            ))}
                        </div>
                    ) : (
                        <Loader2 className="animate-spin text-gray-300" size={32} />
                    )}
                </div>

                <p className="text-[11px] text-gray-400 font-bold text-center px-4 leading-relaxed italic">
                    "اسألي سما عن سعر الدولار اليوم، أو أسعار الفول السوداني في سوق المناقل، أو ابحثي عن سيارة معينة"
                </p>

                <button 
                    onClick={onClose}
                    className="w-full bg-gray-900 text-white py-5 rounded-[24px] font-black shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2"
                >
                    <X size={20} /> إنهاء المحادثة
                </button>
            </div>
        </div>
    );
};

export default LiveVoiceAssistant;
