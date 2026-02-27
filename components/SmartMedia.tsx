
import React, { useState, useEffect } from 'react';
import { TelegramService } from '../services/telegramService';
import { Loader2, Image as ImageIcon } from 'lucide-react';

interface SmartMediaProps {
    fileId: string;
    className?: string;
    alt?: string;
    type?: 'image' | 'video';
}

const SmartMedia: React.FC<SmartMediaProps> = ({ fileId, className, alt, type = 'image' }) => {
    const [realUrl, setRealUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchUrl = async () => {
            if (!fileId) return;
            
            // إذا كان الرابط يبدأ بـ http (رابط قديم)، استخدمه مباشرة
            if (fileId.startsWith('http')) {
                setRealUrl(fileId);
                setLoading(false);
                return;
            }

            try {
                const url = await TelegramService.getRealTelegramUrl(fileId);
                if (url) {
                    setRealUrl(url);
                } else {
                    setError(true);
                }
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchUrl();
    }, [fileId]);

    if (loading) {
        return (
            <div className={`flex items-center justify-center bg-slate-100 animate-pulse ${className}`}>
                <Loader2 className="animate-spin text-slate-300" size={24} />
            </div>
        );
    }

    if (error || !realUrl) {
        return (
            <div className={`flex items-center justify-center bg-slate-100 text-slate-400 ${className}`}>
                <ImageIcon size={24} />
            </div>
        );
    }

    if (type === 'video') {
        return <video src={realUrl} className={className} controls />;
    }

    return (
        <img 
            src={realUrl} 
            className={className} 
            alt={alt || "Media"} 
            onError={() => setError(true)}
            loading="lazy"
        />
    );
};

export default SmartMedia;
