import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product, Auction, Post, CropPrice, LocalPlace, UserProfile, CartItem, DynamicService, AppNotification } from '../../types';
import { FirebaseService } from '../../services/firebaseService';
import { AuthService } from '../../services/authService';

interface AppContextType {
    user: UserProfile | null;
    setUser: (user: UserProfile | null) => void;
    isAuthenticated: boolean;
    setIsAuthenticated: (val: boolean) => void;
    isGuest: boolean;
    setIsGuest: (val: boolean) => void;
    
    // DB States
    products: Product[];
    auctions: Auction[];
    posts: Post[];
    crops: CropPrice[];
    places: LocalPlace[];
    services: DynamicService[];
    notifications: AppNotification[];
    
    // Cart
    cart: CartItem[];
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
    
    // Favorites
    favorites: Set<string>;
    toggleFavorite: (id: string) => void;
    
    // Manual Refresh
    refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isGuest, setIsGuest] = useState(false);
    
    const [products, setProducts] = useState<Product[]>([]);
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [crops, setCrops] = useState<CropPrice[]>([]);
    const [places, setPlaces] = useState<LocalPlace[]>([]);
    const [services, setServices] = useState<DynamicService[]>([]);
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    
    const [cart, setCart] = useState<CartItem[]>([]);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    // 🚀 Optimized: Initial Data Fetch (Run once to prevent hanging)
    const refreshData = async () => {
        try {
            const [prods] = await Promise.all([
                FirebaseService.getProductsOnce()
            ]);
            setProducts(prods);
        } catch (e) {
            console.error("Data fetch error", e);
        }
    };

    // Session Restoration
    useEffect(() => {
        const savedPhone = AuthService.getSavedSession();
        if (savedPhone) {
            AuthService.getUserByPhone(savedPhone).then(u => {
                if (u) {
                    setUser(u);
                    setIsAuthenticated(true);
                }
            });
        }
        refreshData();
    }, []);

    // Firebase Observers (Limited to critical live UI elements only)
    useEffect(() => {
        const unsubServices = FirebaseService.observeServices(setServices);
        // Add others only if strictly necessary for live UI
        return () => unsubServices();
    }, []);

    // Notifications Observer (depends on user)
    useEffect(() => {
        if (user) {
            const unsubNotifs = FirebaseService.observeNotifications(user.emailOrPhone, setNotifications);
            return () => unsubNotifs();
        }
    }, [user]);

    const toggleFavorite = (id: string) => {
        setFavorites(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const value = useMemo(() => ({
        user, setUser,
        isAuthenticated, setIsAuthenticated,
        isGuest, setIsGuest,
        products, auctions, posts, crops, places, services, notifications,
        cart, setCart,
        favorites, toggleFavorite,
        refreshData
    }), [user, isAuthenticated, isGuest, products, auctions, posts, crops, places, services, notifications, cart, favorites]);

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within AppProvider');
    return context;
};
