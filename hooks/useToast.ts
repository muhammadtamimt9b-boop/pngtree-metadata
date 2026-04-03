
import { useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastState {
    message: string;
    type: ToastType;
}

export const useToast = () => {
    const [toast, setToast] = useState<ToastState | null>(null);

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 3000);
    }, []);

    return { toast, showToast };
};
