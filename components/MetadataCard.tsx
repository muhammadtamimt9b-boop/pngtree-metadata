
import React from 'react';
import { motion } from 'framer-motion';
import type { ImageFile } from '../types';
import { CopyIcon } from './icons';

interface MetadataCardProps {
    image: ImageFile;
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const MetadataSection: React.FC<{ title: string; content: string; onCopy: () => void }> = ({ title, content, onCopy }) => (
    <div className="space-y-1.5">
        <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold text-sky-300">{title}</h4>
            <motion.button onClick={onCopy} className="text-gray-400 hover:text-white" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <CopyIcon className="w-4 h-4" />
            </motion.button>
        </div>
        <p className="text-sm text-gray-300 bg-gray-900/50 p-2 rounded-md min-h-[40px]">{content}</p>
    </div>
);

export const MetadataCard: React.FC<MetadataCardProps> = ({ image, showToast }) => {
    const { metadata, previewUrl, file } = image;
    
    const handleCopy = (text: string, subject: string) => {
        navigator.clipboard.writeText(text);
        showToast(`✅ Copied ${subject} to clipboard!`);
    };
    
    if (!metadata) return null;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden shadow-lg flex flex-col"
        >
            <img src={previewUrl} alt={file.name} className="w-full h-48 object-cover"/>
            <div className="p-4 space-y-4 flex-grow">
                <MetadataSection title="Title" content={metadata.title} onCopy={() => handleCopy(metadata.title, 'title')} />
                <MetadataSection title="Keywords" content={metadata.keywords} onCopy={() => handleCopy(metadata.keywords, 'keywords')} />
                <MetadataSection title="Description" content={metadata.description} onCopy={() => handleCopy(metadata.description, 'description')} />
            </div>
            
            <div className="bg-gray-900/30 p-4 border-t border-gray-700">
                 <h3 className="text-base font-semibold text-white mb-3">Primary Keywords</h3>
                 <div>
                    <div className="flex flex-wrap gap-2">
                        {metadata.primaryKeywords.map((keyword, index) => (
                             <motion.span 
                                key={index} 
                                className="bg-gray-700 text-amber-300 font-bold px-3 py-1 rounded-full text-sm cursor-default"
                                whileHover={{ scale: 1.05, y: -2 }}
                            >
                                {keyword}
                            </motion.span>
                        ))}
                    </div>
                     <motion.button 
                        onClick={() => {
                            navigator.clipboard.writeText(metadata.primaryKeywords.join(", "));
                            showToast('✅ Primary keywords copied!');
                        }}
                        className="flex items-center gap-2 mt-3 text-sm px-3 py-1.5 bg-sky-500/20 text-sky-300 rounded-lg hover:bg-sky-500/30"
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        title="Copy all 3 keywords at once"
                    >
                        <CopyIcon className="w-4 h-4"/> Copy All Keywords
                    </motion.button>
                 </div>
            </div>
        </motion.div>
    );
};
