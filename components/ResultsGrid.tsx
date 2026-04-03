
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MetadataCard } from './MetadataCard';
import { CopyAllIcon, DownloadIcon, RefreshIcon } from './icons';
import type { ImageFile } from '../types';

interface ResultsGridProps {
    images: ImageFile[];
    onRegenerate: (imageIds: string[]) => void;
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const ResultsGrid: React.FC<ResultsGridProps> = ({ images, onRegenerate, showToast }) => {
    const imagesWithMetadata = images.filter(img => img.metadata);
    
    if (imagesWithMetadata.length === 0) return null;

    const copyAll = () => {
        const text = imagesWithMetadata.map(img => 
            `Image: ${img.file.name}\nTitle: ${img.metadata!.title}\nKeywords: ${img.metadata!.keywords}\nDescription: ${img.metadata!.description}\n\n`
        ).join('');
        navigator.clipboard.writeText(text);
        showToast('✅ Copied all metadata to clipboard!');
    };

    const downloadCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,Image,Title,Keywords,Description,PrimaryKeywords\n";
        imagesWithMetadata.forEach(img => {
            const row = [
                img.file.name,
                `"${img.metadata!.title.replace(/"/g, '""')}"`,
                `"${img.metadata!.keywords.replace(/"/g, '""')}"`,
                `"${img.metadata!.description.replace(/"/g, '""')}"`,
                `"${img.metadata!.primaryKeywords.join(', ').replace(/"/g, '""')}"`
            ].join(',');
            csvContent += row + "\r\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "tamimstock_metadata.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('✅ CSV download started!');
    };
    
    const handleRegenerate = () => {
        onRegenerate(imagesWithMetadata.map(i => i.id));
    };

    return (
        <div className="mt-8">
            <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Generated Metadata</h2>
                <div className="flex gap-2">
                    <motion.button onClick={handleRegenerate} className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <RefreshIcon className="w-5 h-5"/> Re-Generate All
                    </motion.button>
                     <motion.button onClick={copyAll} className="flex items-center gap-2 px-4 py-2 bg-sky-500/20 text-sky-300 rounded-lg hover:bg-sky-500/30" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <CopyAllIcon className="w-5 h-5"/> Copy All
                    </motion.button>
                    <motion.button onClick={downloadCSV} className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <DownloadIcon className="w-5 h-5"/> Download CSV
                    </motion.button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {imagesWithMetadata.map(image => (
                    <MetadataCard key={image.id} image={image} showToast={showToast} />
                ))}
            </div>
        </div>
    );
};
