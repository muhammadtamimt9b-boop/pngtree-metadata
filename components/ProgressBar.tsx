
import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
    progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    return (
        <div className="w-64 h-2.5 bg-gray-700 rounded-full mt-4 overflow-hidden">
            <motion.div
                className="h-full bg-gradient-to-r from-sky-400 to-blue-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeInOut", duration: 0.5 }}
            />
        </div>
    );
};
