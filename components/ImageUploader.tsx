import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { UploadCloudIcon, XIcon } from './icons';
import type { ImageFile } from '../types';
import { MAX_IMAGES } from '../constants';


interface ImageUploaderProps {
    onUpload: (files: File[]) => void;
    images: ImageFile[];
    clearImages: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, images, clearImages }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            onUpload(Array.from(e.target.files).slice(0, MAX_IMAGES - images.length));
        }
    };

    const handleDragEvent = (e: React.DragEvent<HTMLDivElement>, dragging: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(dragging);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        handleDragEvent(e, false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            // Fix: Explicitly type 'f' as File to resolve TypeScript error.
            onUpload(Array.from(e.dataTransfer.files).filter((f: File) => f.type.startsWith('image/')).slice(0, MAX_IMAGES - images.length));
        }
    };
    
    return (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div
                onDragEnter={(e) => handleDragEvent(e, true)}
                onDragLeave={(e) => handleDragEvent(e, false)}
                onDragOver={(e) => handleDragEvent(e, true)}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging ? 'border-sky-500 bg-gray-700/50' : 'border-gray-600'}`}
            >
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={images.length >= MAX_IMAGES}
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                    <UploadCloudIcon className="w-12 h-12 text-gray-500" />
                    <p className="font-semibold text-white">Drag &amp; drop images here, or click to select</p>
                    <p className="text-sm text-gray-400">Up to {MAX_IMAGES} images supported</p>
                </div>
            </div>
            {images.length > 0 && (
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg">Uploaded Images ({images.length}/{MAX_IMAGES})</h3>
                        <motion.button 
                            onClick={clearImages}
                            className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <XIcon className="w-4 h-4"/> Clear All
                        </motion.button>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 max-h-48 overflow-y-auto pr-2">
                        {images.map(image => (
                            <img key={image.id} src={image.previewUrl} alt={image.file.name} className="w-full h-full object-cover rounded-md aspect-square" />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};