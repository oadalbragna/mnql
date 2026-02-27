
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Heart, Users, Globe, MessageCircle, PartyPopper, 
  RefreshCw, Plus, X, Camera, Send, MapPin, Clock, ShieldAlert, 
  Sparkles, Trash2, AtSign, Loader2, MessageSquare 
} from 'lucide-react';
import MarketCalendar from './MarketCalendar';
import { getCommunityNews } from '../services/geminiService';
import GroundingSources from './GroundingSources';
import { Post, PostComment } from '../types';
import { ref, push, serverTimestamp, remove, update, onValue } from 'firebase/database';
import { db } from '../firebase';
import FormattedText from './FormattedText';

interface CommunityHubProps {
    onBack: () => void;
    onNavigate?: (v: string) => void;
    posts: Post[];
    user: any;
}

const CommunityHub: React.FC<CommunityHubProps> = ({ onBack, onNavigate, posts, user }) => {
    const [news, setNews] = useState<{text: string, sources: any[]} | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPostModal, setShowPostModal] = useState<'obituary' | 'congrats' | 'news' | null>(null);
    const [postContent, setPostContent] = useState('');
    const [metaData, setMetaData] = useState<any>({});
    
    // Comments Logic
    const [activePostId, setActivePostId] = useState<string | null>(null);
    const [commentText, setCommentText] = useState('');

    const loadNews = async () => {
        setIsLoading(true);
        const data = await getCommunityNews();
        setNews(data);
        setIsLoading(false);
    };

    useEffect(() => { loadNews(); }, []);

    const handleAddPost = async () => {
        if (!postContent.trim()) return;
        try {
            const postRef = ref(db, 'Mangal-Shop/community/posts');
            const newPost = {
                author: user?.fullName || 'فاعل خير',
                authorId: user?.id || 'guest',
                content: postContent,
                likes: 0,
                comments: 0,
                time: 'الآن',
                tag: showPostModal,
                timestamp: serverTimestamp(),
                metadata: metaData
            };
            await push(postRef, newPost);
            setShowPostModal(null);
            setPostContent('');
            setMetaData({});
        } catch (e) {
            alert("فشل في النشر");
        }
    };

    const handleDeletePost = async (id: string) => {
        if (confirm("هل تود حذف هذا المنشور؟")) {
            await remove(ref(db, `Mangal-Shop/community/posts/${id}`));
        }
    };

    const handleLike = async (postId: string, currentLikes: number) => {
        if (!user) return alert("يرجى تسجيل الدخول للتفاعل");
        const postRef = ref(db, `Mangal-Shop/community/posts/${postId}`);
        await update(postRef, { likes: currentLikes + 1 });
    };

    const handleAddComment = async (postId: string) => {
        if (!commentText.trim()) return;
        if (!user) return alert("يرجى تسجيل الدخول للتعليق");

        try {
            const commentsRef = ref(db, `Mangal-Shop/community/posts/${postId}/commentsList`);
            const postRef = ref(db, `Mangal-Shop/community/posts/${postId}`);
            
            const newComment: PostComment = {
                id: Date.now().toString(),
                author: user.fullName,
                authorId: user.id,
                text: commentText,
                timestamp: Date.now()
            };

            await push(commentsRef, newComment);
            
            // تحديث عداد التعليقات
            const postSnap = posts.find(p => p.id === postId);
            if (postSnap) {
                await update(postRef, { comments: (postSnap.comments || 0) + 1 });
            }

            setCommentText('');
        } catch (e) {
            alert("فشل إضافة التعليق");
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl animate-slide-up pb-32">
            {/* Modal for adding post */}
            {showPostModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-slide-up">
                        <div className={`p-8 flex justify-between items-center text-white ${showPostModal === 'obituary' ? 'bg-slate-900' : showPostModal === 'congrats' ? 'bg-amber-500' : 'bg-primary'}`}>
                            <h3 className="text-xl font-black flex items-center gap-3">
                                {showPostModal === 'obituary' ? <ShieldAlert/> : showPostModal === 'congrats' ? <PartyPopper/> : <Globe/>}
                                {showPostModal === 'obituary' ? 'إضافة بلاغ وفاة' : showPostModal === 'congrats' ? 'إرسال تهنئة' : 'إضافة خبر عاجل'}
                            </h3>
                            <button onClick={() => setShowPostModal(null)} className="p-2 hover:bg-white/10 rounded-xl"><X/></button>
                        </div>
                        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="bg-blue-50 p-4 rounded-2xl mb-4 border border-blue-100">
                                <p className="text-[10px] text-blue-600 font-black leading-relaxed">
                                    تلميحة: استخدم **للكلام المهم** و "للتظليل" و @لذكر اسم شخص في المناقل.
                                </p>
                            </div>
                            <textarea 
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                placeholder={showPostModal === 'obituary' ? "انتقل إلى رحمة الله تعالى..." : "نتقدم بأحر التهاني بمناسبة..."}
                                className="w-full bg-slate-50 border-none rounded-3xl p-6 font-bold text-slate-700 focus:ring-4 focus:ring-primary/5 min-h-[150px] resize-none"
                            />
                            {showPostModal === 'obituary' && (
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl"><MapPin size={18} className="text-primary"/><input type="text" placeholder="اسم المسجد / مكان الصلاة" className="bg-transparent border-none w-full font-bold text-sm" onChange={(e) => setMetaData({...metaData, mosque: e.target.value})} /></div>
                                    <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl"><Clock size={18} className="text-primary"/><input type="text" placeholder="وقت الصلاة" className="bg-transparent border-none w-full font-bold text-sm" onChange={(e) => setMetaData({...metaData, funeralTime: e.target.value})} /></div>
                                </div>
                            )}
                        </div>
                        <div className="p-8 bg-slate-50 border-t border-slate-100">
                            <button onClick={handleAddPost} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                                نشر فورياً للمجتمع <Send size={18} className="rotate-180" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-10">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="p-4 bg-white border border-slate-100 rounded-[24px] text-slate-400 hover:text-primary transition-all shadow-sm"><ChevronLeft size={24} /></button>
                    <div>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-1">ملتقى المناقل</h2>
                        <p className="text-sm text-slate-400 font-black uppercase tracking-[0.3em]">نبض المدينة والترابط الاجتماعي</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowPostModal('obituary')} className="bg-slate-900 text-white px-8 py-4 rounded-full font-black text-[11px] uppercase shadow-xl hover:bg-black transition-all flex items-center gap-3"><ShieldAlert size={18} /> بلاغ وفاة</button>
                    <button onClick={() => setShowPostModal('congrats')} className="bg-amber-500 text-white px-8 py-4 rounded-full font-black text-[11px] uppercase shadow-xl hover:bg-amber-600 transition-all flex items-center gap-3"><PartyPopper size={18} /> إرسال تهنئة</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-12">
                    {/* Live News Banner */}
                    <div className="bg-white rounded-[56px] p-12 border border-slate-50 shadow-sm relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-4"><Globe size={28} className="text-primary"/> أخبار المناقل الحية</h3>
                            <button onClick={loadNews} className="p-3 bg-slate-50 rounded-xl text-primary hover:bg-primary hover:text-white transition-all"><RefreshCw size={20} className={isLoading ? 'animate-spin' : ''}/></button>
                        </div>
                        {isLoading ? (
                            <div className="space-y-6 animate-pulse">
                                <div className="h-4 bg-slate-100 rounded-full w-3/4"></div>
                                <div className="h-4 bg-slate-100 rounded-full w-1/2"></div>
                                <div className="h-20 bg-slate-50 rounded-3xl w-full"></div>
                            </div>
                        ) : (
                            <div className="animate-fade-in">
                                <FormattedText text={news?.text || 'جاري جلب آخر أخبار المناقل...'} className="text-2xl text-slate-700 font-black leading-relaxed" />
                                <GroundingSources sources={news?.sources || []} />
                            </div>
                        )}
                        <Globe size={200} className="absolute -left-20 -bottom-20 text-slate-50 group-hover:rotate-12 transition-transform duration-1000 opacity-50" />
                    </div>

                    {/* Posts List */}
                    <div className="space-y-8">
                        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3"><Users size={28} className="text-primary" /> آخر المنشورات والتفاعلات</h3>
                        <div className="grid grid-cols-1 gap-8">
                            {posts.map((post) => (
                                <div key={post.id} className={`p-1 bg-white rounded-[56px] shadow-sm hover:shadow-xl transition-all group border-4 ${post.tag === 'obituary' ? 'border-slate-900 shadow-slate-900/5' : post.tag === 'congrats' ? 'border-amber-400 shadow-amber-400/5' : 'border-slate-50'}`}>
                                    <div className="p-10 relative overflow-hidden rounded-[50px]">
                                        <div className="flex items-center justify-between mb-8 relative z-10">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black transition-all ${post.tag === 'obituary' ? 'bg-slate-900 text-white' : post.tag === 'congrats' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                    {post.author?.[0]}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-slate-900 text-lg leading-none mb-1">{post.author}</h4>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">{post.time}</p>
                                                </div>
                                            </div>
                                            <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${post.tag === 'obituary' ? 'bg-slate-900 text-white' : post.tag === 'congrats' ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-600'}`}>
                                                {post.tag === 'obituary' ? 'بيان نعي' : post.tag === 'congrats' ? 'مناسبة سعيدة' : 'خبر محلي'}
                                            </div>
                                        </div>

                                        <div className="relative z-10 mb-8">
                                            <FormattedText text={post.content} className={`text-2xl font-black leading-relaxed ${post.tag === 'obituary' ? 'text-slate-800' : 'text-slate-700'}`} />
                                        </div>

                                        {post.metadata?.mosque && (
                                            <div className={`p-6 rounded-[32px] mb-8 flex items-center gap-6 border relative z-10 ${post.tag === 'obituary' ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${post.tag === 'obituary' ? 'bg-white text-slate-900' : 'bg-white text-amber-600'}`}>
                                                    {post.tag === 'obituary' ? <MapPin size={24}/> : <PartyPopper size={24}/>}
                                                </div>
                                                <div>
                                                    <h5 className="font-black text-xs uppercase tracking-widest opacity-60 mb-1">{post.tag === 'obituary' ? 'مكان الصلاة' : 'مكان المناسبة'}</h5>
                                                    <p className="text-base font-black">{post.metadata.mosque} • {post.metadata.funeralTime}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center pt-8 border-t border-slate-100 relative z-10">
                                            <div className="flex gap-8">
                                                <button 
                                                    onClick={() => handleLike(post.id, post.likes)}
                                                    className={`flex items-center gap-3 transition-all ${post.tag === 'obituary' ? 'hover:text-slate-900' : 'hover:text-red-500'} text-slate-400`}
                                                >
                                                    <Heart size={24} className={post.likes > 0 ? "fill-current" : ""} />
                                                    <span className="text-sm font-black">{post.likes}</span>
                                                </button>
                                                <button 
                                                    onClick={() => setActivePostId(activePostId === post.id ? null : post.id)}
                                                    className="flex items-center gap-3 text-slate-400 hover:text-primary transition-all"
                                                >
                                                    <MessageCircle size={24} />
                                                    <span className="text-sm font-black">{post.comments || (post.commentsList ? Object.keys(post.commentsList).length : 0)}</span>
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {(user?.id === post.authorId || user?.role === 'admin') && (
                                                    <button onClick={() => handleDeletePost(post.id)} className="p-3 text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
                                                )}
                                                <button className="p-3 text-slate-400 hover:text-slate-900 transition-colors"><AtSign size={20}/></button>
                                            </div>
                                        </div>

                                        {/* Comments Sub-section */}
                                        {activePostId === post.id && (
                                            <div className="mt-10 pt-10 border-t border-slate-50 space-y-6 animate-fade-in relative z-10">
                                                <div className="space-y-4">
                                                    {post.commentsList && Object.values(post.commentsList).map((comment: any) => (
                                                        <div key={comment.id} className="flex gap-4 items-start bg-slate-50 p-5 rounded-[28px] border border-slate-100 group">
                                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-slate-400 shrink-0 shadow-sm">{comment.author?.[0]}</div>
                                                            <div className="flex-1">
                                                                <div className="flex justify-between items-center mb-1">
                                                                    <h5 className="font-black text-slate-900 text-xs">{comment.author}</h5>
                                                                    <span className="text-[9px] text-slate-400 font-bold">{new Date(comment.timestamp).toLocaleTimeString('ar-SA')}</span>
                                                                </div>
                                                                <FormattedText text={comment.text} className="text-sm leading-relaxed" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex gap-3 items-center bg-white p-2 rounded-[32px] border-2 border-slate-100 focus-within:border-primary transition-all shadow-sm">
                                                    <input 
                                                        value={commentText}
                                                        onChange={(e) => setCommentText(e.target.value)}
                                                        type="text" 
                                                        placeholder="اكتب ردك أو منشن أحد أهل المناقل باستخدام @..." 
                                                        className="flex-1 bg-transparent border-none py-3 px-4 font-bold text-slate-700 outline-none text-sm"
                                                    />
                                                    <button onClick={() => handleAddComment(post.id)} className="w-12 h-12 bg-primary text-white rounded-[20px] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg">
                                                        <Send size={20} className="rotate-180" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Decorative Background Icons */}
                                        {post.tag === 'obituary' ? (
                                            <ShieldAlert size={180} className="absolute -left-10 -bottom-10 opacity-[0.03] text-slate-900 -rotate-12 pointer-events-none" />
                                        ) : (
                                            <Sparkles size={180} className="absolute -left-10 -bottom-10 opacity-[0.05] text-amber-500 rotate-12 pointer-events-none" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Fixed error: Added missing MessageSquare import from lucide-react */}
                <div className="lg:col-span-4 space-y-10">
                    <MarketCalendar />
                    <div className="bg-slate-900 rounded-[56px] p-10 text-white relative overflow-hidden shadow-2xl group">
                        <div className="relative z-10">
                             <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform"><MessageSquare size={32} className="text-teal-400"/></div>
                             <h4 className="text-2xl font-black mb-4 tracking-tighter">قوانين النشر المحلي</h4>
                             <p className="text-sm opacity-60 font-bold leading-relaxed mb-8 italic">"الرمز الرقمي" هو مساحة لخدمة أهل المناقل فقط. نرجو المصداقية التامة في بلاغات الوفاة ومراعاة مشاعر الآخرين.</p>
                             <button onClick={() => setShowPostModal('news')} className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xs shadow-xl shadow-primary/20 hover:scale-105 transition-all">إرسال منشور عاجل</button>
                        </div>
                        <Users size={200} className="absolute -right-20 -bottom-20 opacity-5 text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityHub;
