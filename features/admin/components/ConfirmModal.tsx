
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen, title, message, onConfirm, onCancel, confirmText = 'تأكيد', cancelText = 'إلغاء', isDestructive = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-[32px] w-full max-w-md p-8 animate-scale-up relative">
                <button onClick={onCancel} className="absolute top-4 left-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-all"><X size={20}/></button>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-primary/10 text-primary'}`}>
                    <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-900 text-center mb-2">{title}</h3>
                <p className="text-slate-500 text-sm font-bold text-center leading-relaxed mb-8">{message}</p>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={onCancel} className="py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all">
                        {cancelText}
                    </button>
                    <button onClick={onConfirm} className={`py-4 text-white rounded-2xl font-black text-sm shadow-xl transition-all ${isDestructive ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-primary hover:bg-primary-dark shadow-primary/20'}`}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
