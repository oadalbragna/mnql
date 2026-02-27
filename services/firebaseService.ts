
import { ref, onValue, set, push, update, get, serverTimestamp, remove } from 'firebase/database';
import { db } from '../firebase';
import { Product, Auction, Post, CropPrice, LocalPlace, UserProfile, DynamicService, AppNotification, Review, ChatMessage, ChatThread } from '../types';

export const FirebaseService = {
    // Products
    observeProducts: (callback: (products: Product[]) => void) => {
        const productsRef = ref(db, 'Mangal-Shop/products');
        return onValue(productsRef, (snap) => {
            callback(snap.exists() ? Object.values(snap.val()) : []);
        });
    },

    // Auctions
    observeAuctions: (callback: (auctions: Auction[]) => void) => {
        const auctionsRef = ref(db, 'Mangal-Shop/auctions');
        return onValue(auctionsRef, (snap) => {
            callback(snap.exists() ? Object.values(snap.val()) : []);
        });
    },

    // Community Posts
    observePosts: (callback: (posts: Post[]) => void) => {
        const postsRef = ref(db, 'Mangal-Shop/community/posts');
        return onValue(postsRef, (snap) => {
            callback(snap.exists() ? Object.values(snap.val()) : []);
        });
    },

    // Market Prices
    observeCropPrices: (callback: (crops: CropPrice[]) => void) => {
        const cropsRef = ref(db, 'Mangal-Shop/crops/prices');
        return onValue(cropsRef, (snap) => {
            callback(snap.exists() ? Object.values(snap.val()) : []);
        });
    },

    // Local Places
    observePlaces: (callback: (places: LocalPlace[]) => void) => {
        const placesRef = ref(db, 'Mangal-Shop/guide/places');
        return onValue(placesRef, (snap) => {
            callback(snap.exists() ? Object.values(snap.val()) : []);
        });
    },

    // Dynamic Services Configuration
    observeServices: (callback: (services: DynamicService[]) => void) => {
        const servicesRef = ref(db, 'Mangal-Shop/config/services');
        return onValue(servicesRef, (snap) => {
            callback(snap.exists() ? Object.values(snap.val()) : []);
        });
    },

    // Get Data Once (For performance in Admin/Static views)
    getProductsOnce: async (): Promise<Product[]> => {
        const snapshot = await get(ref(db, 'Mangal-Shop/products'));
        return snapshot.exists() ? Object.values(snapshot.val()) : [];
    },

    getTransactionsOnce: async (): Promise<WalletTransaction[]> => {
        const snapshot = await get(ref(db, 'Mangal-Shop/transactions'));
        return snapshot.exists() ? Object.values(snapshot.val()) : [];
    },

    // Notifications System
    sendNotification: async (notification: Omit<AppNotification, 'id' | 'isRead' | 'timestamp'>) => {
        const notifRef = push(ref(db, `Mangal-Shop/notifications/${notification.userId}`));
        return set(notifRef, {
            ...notification,
            id: notifRef.key,
            isRead: false,
            timestamp: Date.now()
        });
    },

    observeNotifications: (userId: string, callback: (notifs: AppNotification[]) => void) => {
        const notifRef = ref(db, `Mangal-Shop/notifications/${userId}`);
        return onValue(notifRef, (snap) => {
            if (snap.exists()) {
                const data = Object.values(snap.val()) as AppNotification[];
                callback(data.sort((a, b) => b.timestamp - a.timestamp));
            } else {
                callback([]);
            }
        });
    },

    markNotificationRead: async (userId: string, notifId: string) => {
        return update(ref(db, `Mangal-Shop/notifications/${userId}/${notifId}`), { isRead: true });
    },

    // Messaging System
    sendMessage: async (threadId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>, threadInfo: Partial<ChatThread>) => {
        const msgRef = push(ref(db, `Mangal-Shop/chats/messages/${threadId}`));
        const msgData = {
            ...message,
            id: msgRef.key,
            timestamp: Date.now()
        };
        await set(msgRef, msgData);

        // Update Threads for both participants
        const updateData = {
            ...threadInfo,
            lastMessage: message.text,
            lastTimestamp: Date.now()
        };
        
        threadInfo.participants?.forEach((uid: string) => {
            update(ref(db, `Mangal-Shop/chats/threads/${uid}/${threadId}`), updateData);
        });
    },

    observeThreads: (userId: string, callback: (threads: ChatThread[]) => void) => {
        const threadsRef = ref(db, `Mangal-Shop/chats/threads/${userId}`);
        return onValue(threadsRef, (snap) => {
            callback(snap.exists() ? (Object.values(snap.val()) as ChatThread[]).sort((a: any, b: any) => b.lastTimestamp - a.lastTimestamp) : []);
        });
    },

    observeMessages: (threadId: string, callback: (messages: ChatMessage[]) => void) => {
        const msgsRef = ref(db, `Mangal-Shop/chats/messages/${threadId}`);
        return onValue(msgsRef, (snap) => {
            callback(snap.exists() ? Object.values(snap.val()) : []);
        });
    },

    // Generic Add/Update
    writeData: async (path: string, data: any) => {
        return set(ref(db, path), data);
    },

    // Analytics & Stats
    incrementProductViews: async (productId: string) => {
        const viewRef = ref(db, `Mangal-Shop/products/${productId}/views`);
        const snapshot = await get(viewRef);
        const currentViews = snapshot.exists() ? snapshot.val() : 0;
        return update(ref(db, `Mangal-Shop/products/${productId}`), { views: currentViews + 1 });
    },

    addProductReview: async (productId: string, review: Review) => {
        const reviewRef = push(ref(db, `Mangal-Shop/products/${productId}/reviews`));
        return set(reviewRef, { ...review, id: reviewRef.key });
    },

    addReviewReply: async (productId: string, reviewId: string, replyText: string) => {
        const replyRef = ref(db, `Mangal-Shop/products/${productId}/reviews/${reviewId}/reply`);
        return set(replyRef, {
            text: replyText,
            timestamp: new Date().toISOString()
        });
    },

    pushData: async (path: string, data: any) => {
        const newRef = push(ref(db, path));
        return set(newRef, { ...data, id: newRef.key });
    },

    updateData: async (path: string, data: any) => {
        return update(ref(db, path), data);
    }
};
