
import React, { useState, useMemo } from 'react';
import { CategoryId, Product, ViewType } from './types';
import { MOCK_PRODUCTS } from './constants';
import { useAppContext } from './core/context/AppContext';

// Components
import CategoryNav from './components/CategoryNav';
import ProductCard from './components/ProductCard';
import ProductLandingPage from './components/ProductLandingPage';
import AddListingForm from './components/AddListingForm';
import ChatWidget from './components/ChatWidget';
import NotificationToast, { ToastType } from './components/NotificationToast';
import MessagingView from './components/MessagingView';
import LiveVoiceAssistant from './components/LiveVoiceAssistant';
import MarketStories from './components/MarketStories';
import TraderDashboard from './components/TraderDashboard';
import CommunityHub from './components/CommunityHub';
import LogisticsHub from './components/LogisticsHub';
import AuctionView from './components/AuctionView';
import AuctionDetails from './components/AuctionDetails';
import LocalPlaces from './components/LocalPlaces';
import AgriAI from './components/AgriAI';
import ServiceHub from './components/ServiceHub';
import MarketMap from './components/MarketMap';
import WalletView from './components/WalletView';
import FavoritesView from './components/FavoritesView';
import SafetyCenter from './components/SafetyCenter';
import AgriMarketView from './components/AgriMarketView';
import AuthView from './components/AuthView';
import CartView from './components/CartView';
import ProductiveFamiliesView from './components/ProductiveFamiliesView';
import TelegramBridge from './components/TelegramBridge';
import MarketingStudio from './components/MarketingStudio';
import TransportBooking from './components/TransportBooking';
import PaymentGateway from './components/PaymentGateway';
import TrackDelivery from './components/TrackDelivery';
import HomeBento from './components/HomeBento';
import NotificationsView from './components/NotificationsView';
import AdminDashboard from './features/admin/AdminDashboard';
import ChatView from './components/ChatView';

import { 
  Plus, Store, MessageSquare, 
  Mic, LayoutGrid, Shield, Heart,
  SearchIcon, ShoppingCart, Home, UserCircle, Filter, Bell, FilterX
} from 'lucide-react';

const App: React.FC = () => {
    const { 
        user, setUser, isAuthenticated, setIsAuthenticated, isGuest, setIsGuest,
        products: dbProducts, auctions: dbAuctions, posts: dbPosts, crops: dbCrops, 
        cart, setCart, favorites, toggleFavorite, notifications
    } = useAppContext();

    const [selectedCategory, setSelectedCategory] = useState<CategoryId>(CategoryId.ALL);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentView, setCurrentView] = useState<ViewType | 'admin' | 'chats'>('home');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<any>({ brand: '', vehicleType: '', electronicsType: '', square: '' });
    
    const [isAddListingOpen, setIsAddListingOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isLiveAssistantOpen, setIsLiveAssistantOpen] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedAuction, setSelectedAuction] = useState<any>(null);
    const [toast, setToast] = useState<{message: string, type: ToastType} | null>(null);

    const unreadNotifsCount = notifications.filter(n => !n.isRead).length;
    const allProducts = useMemo(() => [...MOCK_PRODUCTS, ...dbProducts], [dbProducts]);

    const filteredProducts = useMemo(() => {
        return allProducts.filter(p => {
            const matchesCat = selectedCategory === CategoryId.ALL || p.categoryId === selectedCategory;
            
            // تحويل النصوص للبحث مع التحقق من وجودها لمنع الخطأ
            const title = p.title || '';
            const description = p.description || '';
            const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 description.toLowerCase().includes(searchQuery.toLowerCase());
            
            // Advanced Filters Logic
            const matchesBrand = !filters.brand || (p.brand && p.brand.toLowerCase().includes(filters.brand.toLowerCase()));
            const matchesVehicle = !filters.vehicleType || p.vehicleType === filters.vehicleType;
            const matchesElectronics = !filters.electronicsType || p.electronicsType === filters.electronicsType;
            const matchesSquare = !filters.square || (p.squareNumber && p.squareNumber.includes(filters.square));
            
            return matchesCat && matchesSearch && matchesBrand && matchesVehicle && matchesElectronics && matchesSquare;
        });
    }, [allProducts, selectedCategory, searchQuery, filters]);

    const showToast = (message: string, type: ToastType = 'success') => setToast({ message, type });

    const checkAuthAction = (action: () => void) => {
        if (isGuest) {
            showToast("يرجى تسجيل الدخول لتتمكن من التفاعل أو الشراء", "error");
            return;
        }
        action();
    };

    const renderAdvancedFilters = () => {
        return (
            <div className="flex gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 overflow-x-auto no-scrollbar animate-fade-in mt-4">
                {selectedCategory === CategoryId.CARS && (
                    <>
                        <select value={filters.vehicleType} onChange={e => setFilters({...filters, vehicleType: e.target.value})} className="bg-white border-none rounded-xl px-4 py-2 font-bold text-[10px] shadow-sm text-primary">
                            <option value="">كل المركبات</option>
                            <option value="car">سيارات</option>
                            <option value="bike">دراجات</option>
                            <option value="truck">شاحنات</option>
                        </select>
                        <input type="text" placeholder="الماركة..." value={filters.brand} onChange={e => setFilters({...filters, brand: e.target.value})} className="bg-white border-none rounded-xl px-4 py-2 font-bold text-[10px] shadow-sm text-primary w-24" />
                    </>
                )}
                {selectedCategory === CategoryId.REAL_ESTATE && (
                    <input type="text" placeholder="رقم المربع..." value={filters.square} onChange={e => setFilters({...filters, square: e.target.value})} className="bg-white border-none rounded-xl px-4 py-2 font-bold text-[10px] shadow-sm text-primary w-24" />
                )}
                <button onClick={() => setFilters({ brand: '', vehicleType: '', electronicsType: '', square: '' })} className="p-2 bg-white text-slate-300 rounded-xl hover:text-red-500 shadow-sm"><FilterX size={14}/></button>
            </div>
        );
    };

    const renderMainContent = () => {
        switch (currentView) {
            case 'admin': return <AdminDashboard onBack={() => setCurrentView('home')} />;
            case 'chats': return <ChatView onBack={() => setCurrentView('home')} />;
            case 'hub': return <ServiceHub onNavigate={(v) => setCurrentView(v as ViewType)} />;
            case 'notifications': return <NotificationsView onBack={() => setCurrentView('home')} />;
            case 'favorites': return <FavoritesView products={allProducts} favorites={favorites} onBack={() => setCurrentView('home')} onProductClick={setSelectedProduct} onToggleFavorite={toggleFavorite} />;
            case 'cart': return <CartView items={cart} onUpdateQuantity={(id, d) => setCart(prev => prev.map(it => it.product.id === id ? {...it, quantity: Math.max(1, it.quantity+d)} : it))} onRemove={(id) => setCart(prev => prev.filter(it => it.product.id !== id))} onCheckout={() => {showToast("تم إرسال الطلب وحفظه في الأرشيف"); setCart([]); setCurrentView('home');}} onBack={() => setCurrentView('home')} user={user} />;
            case 'wallet': return <WalletView user={user} onBack={() => setCurrentView('home')} onNavigate={(v) => setCurrentView(v as ViewType)} />;
            case 'profile': return user ? <TraderDashboard user={user} products={allProducts} allPosts={dbPosts} allAuctions={dbAuctions} onBack={() => setCurrentView('home')} onEditProduct={(p) => { setEditingProduct(p); setIsAddListingOpen(true); }} onLogout={() => {setIsAuthenticated(false); setUser(null);}} /> : null;
            case 'community': return <CommunityHub posts={dbPosts} onBack={() => setCurrentView('hub')} onNavigate={(v) => setCurrentView(v as ViewType)} user={user} />;
            case 'logistics': return <LogisticsHub onBack={() => setCurrentView('hub')} onNavigate={(v) => setCurrentView(v as ViewType)} />;
            case 'auction': return <AuctionView auctions={dbAuctions} onBack={() => setCurrentView('hub')} onAuctionClick={(a) => { setSelectedAuction(a); setCurrentView('auction-details'); }} />;
            case 'auction-details': return selectedAuction ? <AuctionDetails auction={selectedAuction} user={user} onBack={() => setCurrentView('auction')} /> : null;
            case 'agri-ai': return <AgriAI onBack={() => setCurrentView('hub')} />;
            case 'places': return <LocalPlaces onBack={() => setCurrentView('hub')} />;
            case 'agri-market': return <AgriMarketView crops={dbCrops} user={user} onBack={() => setCurrentView('hub')} />;
            case 'home-produce': return <ProductiveFamiliesView user={user} onBack={() => setCurrentView('hub')} onProductClick={setSelectedProduct} />;
            case 'transport': return <TransportBooking onBack={() => setCurrentView('hub')} />;
            case 'track-delivery': return <TrackDelivery onBack={() => setCurrentView('logistics')} />;
            case 'marketing-studio': return <MarketingStudio onBack={() => setCurrentView('hub')} />;
            case 'telegram-bridge': return <TelegramBridge onBack={() => setCurrentView('hub')} />;
            case 'safety': return <SafetyCenter onBack={() => setCurrentView('hub')} />;
            case 'payment-gateway': return <PaymentGateway onBack={() => setCurrentView('wallet')} />;
            default: return (
                <div className="animate-fade-in pt-4 space-y-6 max-w-5xl mx-auto pb-24 px-4">
                    <div className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tighter">سوق المناقل الرقمي</h2>
                            <div className="flex gap-2">
                                {user?.role === 'admin' && (
                                    <button onClick={() => setCurrentView('admin')} className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all border border-red-100">
                                        <Shield size={18}/>
                                    </button>
                                )}
                                <button onClick={() => setCurrentView('notifications')} className="relative p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-primary transition-all">
                                    <Bell size={18}/>
                                    {unreadNotifsCount > 0 && <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>}
                                </button>
                                <button onClick={() => setShowFilters(!showFilters)} className={`p-3 rounded-xl transition-all ${showFilters ? 'bg-primary text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}><Filter size={18}/></button>
                            </div>
                        </div>
                        <div className="relative group">
                            <input type="text" placeholder="لابتوب، سيارة، منزل..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-50 border-none rounded-[24px] py-4 pr-14 pl-6 font-bold text-slate-700 shadow-inner text-base" />
                            <SearchIcon className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                        </div>
                        {showFilters && renderAdvancedFilters()}
                    </div>

                    <CategoryNav selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
                    <HomeBento onNavigate={(v) => v === 'map' ? setIsMapOpen(true) : setCurrentView(v as ViewType)} />
                    <MarketStories />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                onClick={setSelectedProduct} 
                                isFavorite={favorites.has(product.id)}
                                onToggleFavorite={(e) => { e.stopPropagation(); checkAuthAction(() => toggleFavorite(product.id)); }}
                                onAddToCart={(e) => { e.stopPropagation(); checkAuthAction(() => { setCart(prev => [...prev, { product, quantity: 1 }]); showToast("تمت الإضافة للسلة"); }); }}
                            />
                        ))}
                    </div>
                </div>
            );
        }
    };

    if (!isAuthenticated) return <AuthView onLoginSuccess={(u, g) => { if(g) { setIsGuest(true); setIsAuthenticated(true); } else { setUser(u); setIsAuthenticated(true); setIsGuest(false); } }} />;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 md:pb-0 relative overflow-x-hidden">
            {toast && <NotificationToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            
            {/* Nav Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 p-4 z-50 md:sticky md:top-0 md:bg-white/80">
                <div className="flex justify-around items-center max-w-7xl mx-auto">
                    <button onClick={() => setCurrentView('home')} className={`p-3 rounded-2xl ${currentView === 'home' ? 'bg-primary/10 text-primary scale-110' : 'text-slate-400'}`}><Home size={24} /></button>
                    <button onClick={() => setCurrentView('hub')} className={`p-3 rounded-2xl ${currentView === 'hub' ? 'bg-primary/10 text-primary scale-110' : 'text-slate-400'}`}><LayoutGrid size={24} /></button>
                    <button onClick={() => checkAuthAction(() => { setEditingProduct(null); setIsAddListingOpen(true); })} className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl hover:scale-105 transition-all"><Plus size={24} /></button>
                    <button onClick={() => setCurrentView('chats')} className={`p-3 rounded-2xl ${currentView === 'chats' ? 'bg-primary/10 text-primary scale-110' : 'text-slate-400'}`}><MessageSquare size={24} /></button>
                    <button onClick={() => setCurrentView('favorites')} className={`p-3 rounded-2xl ${currentView === 'favorites' ? 'bg-primary/10 text-primary scale-110' : 'text-slate-400'}`}><Heart size={24} /></button>
                    <button onClick={() => checkAuthAction(() => setCurrentView('profile'))} className={`p-3 rounded-2xl ${currentView === 'profile' ? 'bg-primary/10 text-primary scale-110' : 'text-slate-400'}`}><UserCircle size={24} /></button>
                </div>
            </div>

            {renderMainContent()}

            {selectedProduct && <ProductLandingPage product={selectedProduct} onClose={() => setSelectedProduct(null)} isFavorite={favorites.has(selectedProduct.id)} onToggleFavorite={() => checkAuthAction(() => toggleFavorite(selectedProduct.id))} onAddToCart={(p) => { checkAuthAction(() => { setCart(prev => [...prev, { product: p, quantity: 1 }]); showToast("تمت الإضافة للسلة"); }); }} onSellerClick={() => {}} />}
            {isAddListingOpen && <AddListingForm user={user} editingProduct={editingProduct} onClose={() => { setIsAddListingOpen(false); setEditingProduct(null); }} onSubmitSuccess={() => { setIsAddListingOpen(false); showToast(editingProduct ? "تم التحديث" : "تم النشر"); }} />}
            {isLiveAssistantOpen && <LiveVoiceAssistant onClose={() => setIsLiveAssistantOpen(false)} />}
            {isMapOpen && <MarketMap products={filteredProducts} onClose={() => setIsMapOpen(false)} onProductClick={(p: Product) => { setIsMapOpen(false); setSelectedProduct(p); }} />}
            
            <ChatWidget products={allProducts} />
        </div>
    );
};

export default App;
