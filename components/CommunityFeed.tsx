import React, { useState } from 'react';
import { ChevronLeft, MessageCircle, Heart, Share2, Plus, Users, Search, Newspaper, HelpCircle, Calendar, Send } from 'lucide-react';
import { Post } from '../types';

const MOCK_POSTS: Post[] = [
    // Fixed error: Added missing 'authorId' to each mock post
    { id: 'p1', author: 'أمين حي الموظفين', authorId: 'u1', content: 'تم الانتهاء من صيانة مسجد الحي بفضل مجهوداتكم الجبارة. بارك الله فيكم جميعاً.', likes: 124, comments: 18, time: 'منذ ساعة', tag: 'news' },
    { id: 'p2', author: 'د. عثمان خضر', authorId: 'u2', content: 'تنبيه صحي: مع دخول فصل الخريف، نرجو من الجميع التأكد من تجفيف المياه الراكدة حول المنازل للوقاية من الملاريا.', likes: 450, comments: 32, time: 'منذ 4 ساعات', tag: 'help' },
    { id: 'p3', author: 'نادي المناقل الرياضي', authorId: 'u3', content: 'دعوة لحضور نهائي دوري أحياء المناقل يوم الجمعة القادم بملعب الناشئين.', likes: 89, comments: 12, time: 'أمس', tag: 'event' },
];

const CommunityFeed: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl animate-slide-up">
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-4 bg-white border border-slate-100 rounded-[24px] text-slate-400 hover:text-primary shadow-sm">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">نبض المناقل</h2>
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">مساحة اجتماعية لأهل المنطقة</p>
                    </div>
                </div>
                <button className="bg-primary text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 hover:scale-110 active:scale-95 transition-all">
                    <Plus size={28} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 overflow-x-auto no-scrollbar pb-2">
                {[
                    { label: 'الكل', icon: <Users size={16}/>, active: true },
                    { label: 'أخبار', icon: <Newspaper size={16}/> },
                    { label: 'مساعدة', icon: <HelpCircle size={16}/> },
                    { label: 'فعاليات', icon: <Calendar size={16}/> },
                ].map((f, i) => (
                    <button key={i} className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-xs border transition-all whitespace-nowrap ${f.active ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-400 hover:border-primary hover:text-primary'}`}>
                        {f.icon} {f.label}
                    </button>
                ))}
            </div>

            <div className="space-y-8">
                {posts.map(post => (
                    <div key={post.id} className="bg-white rounded-[48px] p-10 border border-slate-50 shadow-sm hover:shadow-xl transition-all duration-500 group">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                                    {post.author[0]}
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900">{post.author}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{post.time}</p>
                                </div>
                            </div>
                            <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${post.tag === 'news' ? 'bg-blue-50 text-blue-500' : post.tag === 'help' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}>
                                {post.tag === 'news' ? 'خبر' : post.tag === 'help' ? 'تنبيه' : 'فعالية'}
                            </span>
                        </div>
                        
                        <p className="text-lg text-slate-700 leading-relaxed font-bold mb-8">
                            {post.content}
                        </p>

                        <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                            <div className="flex items-center gap-8">
                                <button className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors">
                                    <Heart size={20} />
                                    <span className="text-xs font-black">{post.likes}</span>
                                </button>
                                <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors">
                                    <MessageCircle size={20} />
                                    <span className="text-xs font-black">{post.comments}</span>
                                </button>
                            </div>
                            <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="fixed bottom-28 left-4 right-4 md:left-auto md:right-10 md:w-96 z-40 bg-white/80 backdrop-blur-2xl p-4 rounded-[32px] border border-slate-100 shadow-2xl animate-slide-up">
                 <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <input type="text" placeholder="اكتب منشوراً جديداً..." className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-xs font-bold focus:ring-4 focus:ring-primary/5" />
                    </div>
                    <button className="bg-primary text-white p-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                        <Send size={20} className="rotate-180" />
                    </button>
                 </div>
            </div>
        </div>
    );
};

export default CommunityFeed;