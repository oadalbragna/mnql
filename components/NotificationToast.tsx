import React, { useEffect } from 'react';
import { CheckCircle, Info, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'error';

interface NotificationToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <CheckCircle className="text-green-500" size={20} />,
        info: <Info className="text-blue-500" size={20} />,
        error: <AlertCircle className="text-red-500" size={20} />
    };

    const colors = {
        success: 'border-green-100 bg-green-50',
        info: 'border-blue-100 bg-blue-50',
        error: 'border-red-100 bg-red-50'
    };

    return (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl animate-in slide-in-from-top duration-300 ${colors[type]}`}>
            {icons[type]}
            <span className="text-sm font-bold text-gray-800">{message}</span>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 mr-2">
                <X size={16} />
            </button>
        </div>
    );
};

export default NotificationToast;