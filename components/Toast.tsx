
import React from 'react';
import { motion } from 'framer-motion';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
}

const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
};

export const Toast: React.FC<ToastProps> = ({ message, type }) => (
    <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg text-white font-semibold shadow-2xl z-50 ${colors[type]}`}
    >
        {message}
    </motion.div>
);
