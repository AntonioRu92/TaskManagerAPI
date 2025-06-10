import React, { useState, useEffect } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface ToastItem {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
}

interface ToastProps {
    toast: ToastItem;
    onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onRemove(toast.id);
        }, 5000);

        return () => clearTimeout(timer);
    }, [toast.id, onRemove]);

    const getIcon = () => {
        switch (toast.type) {
            case 'success':
                return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
            case 'error':
                return <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />;
            case 'warning':
                return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />;
            case 'info':
                return <InformationCircleIcon className="h-5 w-5 text-blue-400" />;
        }
    };

    const getBackgroundColor = () => {
        switch (toast.type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            case 'info':
                return 'bg-blue-50 border-blue-200';
        }
    };

    return (
        <div className={`${getBackgroundColor()} border rounded-lg p-4 shadow-lg transition-all duration-300`}>
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    {getIcon()}
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">{toast.message}</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                    <button
                        onClick={() => onRemove(toast.id)}
                        className="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export const ToastContainer: React.FC = () => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const addToast = (message: string, type: ToastItem['type'] = 'info') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    // Global toast function
    if (typeof window !== 'undefined') {
        (window as any).showToast = addToast;
    }

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>
    );
};

// Utility function to show toasts
export const showToast = (message: string, type: ToastItem['type'] = 'info') => {
    if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast(message, type);
    }
};
