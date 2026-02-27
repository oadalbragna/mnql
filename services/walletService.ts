
import { ref, get, update, push, set, runTransaction } from 'firebase/database';
import { db } from '../firebase';
import { WalletTransaction } from '../types';

export const WalletService = {
    // Transfer balance between two users
    transfer: async (senderPhone: string, receiverPhone: string, amount: number) => {
        const senderRef = ref(db, `Mangal-Shop/users/${senderPhone}`);
        const receiverRef = ref(db, `Mangal-Shop/users/${receiverPhone}`);
        
        // Use Firebase Transaction for atomic updates
        const result = await runTransaction(senderRef, (currentData) => {
            if (currentData && currentData.balance >= amount) {
                currentData.balance -= amount;
                return currentData;
            }
            return; // Abort
        });

        if (result.committed) {
            // Update receiver
            const receiverSnap = await get(receiverRef);
            if (receiverSnap.exists()) {
                const currentBalance = receiverSnap.val().balance || 0;
                await update(receiverRef, { balance: currentBalance + amount });
                
                // Log Transactions
                const txId = push(ref(db, 'Mangal-Shop/transactions')).key;
                const txData: WalletTransaction = {
                    id: txId!,
                    title: `تحويل إلى ${receiverPhone}`,
                    amount: amount,
                    type: 'debit',
                    senderId: senderPhone,
                    receiverId: receiverPhone,
                    status: 'completed',
                    timestamp: Date.now()
                };
                
                // Add to both logs
                await set(ref(db, `Mangal-Shop/users/${senderPhone}/transactions/${txId}`), txData);
                await set(ref(db, `Mangal-Shop/users/${receiverPhone}/transactions/${txId}`), {
                    ...txData,
                    title: `استلام من ${senderPhone}`,
                    type: 'credit'
                });
                
                return { success: true };
            }
        }
        return { success: false, error: 'رصيد غير كافٍ أو رقم غير صحيح' };
    },

    // Handle Sale with Commission (90% Seller, 10% Platform)
    processSale: async (sellerPhone: string, amount: number) => {
        const commission = amount * 0.10;
        const sellerAmount = amount - commission;
        const adminPhone = 'admin'; // Static admin phone for now

        // Update Seller
        const sellerRef = ref(db, `Mangal-Shop/users/${sellerPhone}`);
        const sellerSnap = await get(sellerRef);
        if (sellerSnap.exists()) {
            const currentBalance = sellerSnap.val().balance || 0;
            await update(sellerRef, { balance: currentBalance + sellerAmount });
        }

        // Update Admin (Commission)
        const adminRef = ref(db, `Mangal-Shop/users/${adminPhone}`);
        const adminSnap = await get(adminRef);
        if (adminSnap.exists()) {
            const currentAdminBalance = adminSnap.val().balance || 0;
            await update(adminRef, { balance: currentAdminBalance + commission });
        }
    }
};
