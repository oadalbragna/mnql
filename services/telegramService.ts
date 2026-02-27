
import { ref, update } from 'firebase/database';
import { db } from '../firebase';

// ⚠️ ملاحظة: في بيئة الإنتاج، يفضل وضع هذه القيم في متغيرات بيئة .env
const TG_BOT_TOKEN = 'YOUR_BOT_TOKEN'; // ضع توكن البوت هنا
const TG_CHAT_ID = 'YOUR_CHAT_ID';   // معرف القناة أو الدردشة التي ستخزن الملفات

export const TelegramService = {
    /**
     * رفع ملف (صورة أو فيديو) إلى تيليجرام
     */
    uploadFile: async (file: File | Blob): Promise<string | null> => {
        const formData = new FormData();
        formData.append('chat_id', TG_CHAT_ID);
        
        // تحديد نوع الملف (صورة أو وثيقة عامة)
        const isImage = file.type.startsWith('image/');
        const endpoint = isImage ? 'sendPhoto' : 'sendDocument';
        formData.append(isImage ? 'photo' : 'document', file);

        try {
            const response = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/${endpoint}`, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            
            if (data.ok) {
                // استخراج file_id (للصور نأخذ آخر نسخة وهي الأعلى جودة)
                const fileId = isImage 
                    ? data.result.photo[data.result.photo.length - 1].file_id 
                    : data.result.document.file_id;
                return fileId;
            }
            return null;
        } catch (error) {
            console.error("Telegram Upload Error:", error);
            return null;
        }
    },

    /**
     * إنشاء رابط مموه لإخفاء التوكن
     * هذا الرابط سيمر عبر دالة معالجة داخل التطبيق
     */
    getMaskedUrl: (fileId: string) => {
        // الرابط المموه الذي سيراه المستخدم
        // سيقوم التطبيق داخلياً بتحويله إلى رابط تيليجرام حقيقي
        return `/media-bridge/${fileId}`;
    },

    /**
     * جلب الرابط الحقيقي للملف من تيليجرام باستخدام file_id
     * (تستخدم داخلياً فقط ولا تظهر للمستخدم)
     */
    getRealTelegramUrl: async (fileId: string): Promise<string | null> => {
        try {
            const fileResponse = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/getFile?file_id=${fileId}`);
            const fileData = await fileResponse.json();
            
            if (fileData.ok) {
                const filePath = fileData.result.file_path;
                return `https://api.telegram.org/file/bot${TG_BOT_TOKEN}/${filePath}`;
            }
            return null;
        } catch (error) {
            return null;
        }
    }
};
