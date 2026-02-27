
import { ref, get, set, update } from 'firebase/database';
import { db } from '../firebase';
import { UserProfile, UserRole } from '../types';

const SESSION_KEY = 'mangal_user_session';

export const AuthService = {
    // Session Management
    saveSession: (phone: string) => {
        localStorage.setItem(SESSION_KEY, phone);
    },

    getSavedSession: (): string | null => {
        return localStorage.getItem(SESSION_KEY);
    },

    clearSession: () => {
        localStorage.removeItem(SESSION_KEY);
    },

    // User Operations
    getUserByPhone: async (phone: string): Promise<UserProfile | null> => {
        // تنظيف الرقم من الرموز التي تمنع استخدامه كمفتاح في Firebase
        const cleanPhone = phone.replace(/[.#$[\]]/g, "_");
        const userRef = ref(db, `Mangal-Shop/users/${cleanPhone}`);
        const snapshot = await get(userRef);
        return snapshot.exists() ? snapshot.val() : null;
    },

    registerUser: async (userData: Partial<UserProfile>): Promise<UserProfile> => {
        const phone = userData.emailOrPhone!;
        const cleanPhone = phone.replace(/[.#$[\]]/g, "_");
        const newUser: UserProfile = {
            id: cleanPhone,
            fullName: userData.fullName || '',
            emailOrPhone: phone,
            password: userData.password, // حفظ كلمة المرور
            role: userData.role || 'user',
            location: userData.location || '',
            createdAt: new Date().toISOString(),
            balance: 0,
            isVerified: false,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanPhone}`,
            ...userData
        } as UserProfile;

        await set(ref(db, `Mangal-Shop/users/${cleanPhone}`), newUser);
        return newUser;
    },

    // Admin Operations
    getAllUsers: async (): Promise<UserProfile[]> => {
        const usersRef = ref(db, 'Mangal-Shop/users');
        const snapshot = await get(usersRef);
        return snapshot.exists() ? Object.values(snapshot.val()) : [];
    },

    updateUserRole: async (phone: string, newRole: UserRole): Promise<void> => {
        const cleanPhone = phone.replace(/[.#$[\]]/g, "_");
        const userRef = ref(db, `Mangal-Shop/users/${cleanPhone}`);
        return update(userRef, { role: newRole });
    }
};
