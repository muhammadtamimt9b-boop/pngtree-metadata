
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { ImageUploader } from './components/ImageUploader';
import { ResultsGrid } from './components/ResultsGrid';
import { Loader } from './components/Loader';
import { Toast } from './components/Toast';
import { ProgressBar } from './components/ProgressBar';
import { generateMetadata } from './services/geminiService';
import { useToast } from './hooks/useToast';
import type { ImageFile, Settings, Metadata } from './types';
import { Platform } from './types';
import { BATCH_SIZE } from './constants';

const App: React.FC = () => {
    const [settings, setSettings] = useState<Settings>({
        titleWordLimit: 7,
        keywordCount: 30,
        descriptionWordLimit: 40,
        platform: Platform.ADOBE_STOCK,
        useCustomPrompt: false,
        customPrompt: '',
        negativeKeywords: '',
        useNegativeKeywords: false,
        customKeywords: '',
        useCustomKeywords: false,
    });
    const [images, setImages] = useState<ImageFile[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const { toast, showToast } = useToast();

    const handleSettingsChange = useCallback((newSettings: Partial<Settings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    }, []);

    const handleImageUpload = useCallback((files: File[]) => {
        const newImages: ImageFile[] = files.map(file => ({
            id: `${file.name}-${file.lastModified}-${Math.random()}`,
            file,
            previewUrl: URL.createObjectURL(file),
            metadata: null,
            status: 'pending',
        }));
        setImages(prev => [...prev, ...newImages]);
    }, []);

    const updateImageState = (id: string, updates: Partial<ImageFile>) => {
        setImages(prev => prev.map(img => img.id === id ? { ...img, ...updates } : img));
    };

    const processBatch = async (batch: ImageFile[]) => {
        const promises = batch.map(image =>
            generateMetadata(image.file, settings)
                .then(metadata => {
                    updateImageState(image.id, { metadata, status: 'completed' });
                })
                .catch(err => {
                    console.error(`Failed to process ${image.file.name}:`, err);
                    updateImageState(image.id, { status: 'error' });
                    showToast('❌ Error generating metadata', 'error');
                })
        );
        await Promise.all(promises);
    };

    const handleGenerateMetadata = async (imageIds?: string[]) => {
        const imagesToProcess = imageIds
            ? images.filter(img => imageIds.includes(img.id))
            : images.filter(img => img.status !== 'completed');
        
        if (imagesToProcess.length === 0) {
            showToast('ℹ️ No images to process.', 'info');
            return;
        }

        setIsLoading(true);
        setProgress(0);
        
        imagesToProcess.forEach(img => updateImageState(img.id, { status: 'processing' }));
        
        let processedCount = 0;
        for (let i = 0; i < imagesToProcess.length; i += BATCH_SIZE) {
            const batch = imagesToProcess.slice(i, i + BATCH_SIZE);
            await processBatch(batch);
            processedCount += batch.length;
            setProgress(Math.round((processedCount / imagesToProcess.length) * 100));
        }
        
        setIsLoading(false);
        showToast('✅ Metadata generated successfully!', 'success');
    };
    
    const clearImages = () => {
        images.forEach(img => URL.revokeObjectURL(img.previewUrl));
        setImages([]);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
            <Header />
            <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
                <aside className="lg:col-span-3">
                    <ControlPanel settings={settings} onSettingsChange={handleSettingsChange} />
                </aside>
                <div className="lg:col-span-9">
                    <ImageUploader onUpload={handleImageUpload} images={images} clearImages={clearImages} />
                    {images.length > 0 && (
                        <ResultsGrid images={images} onRegenerate={handleGenerateMetadata} showToast={showToast} />
                    )}
                </div>
            </main>

            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50"
                    >
                        <Loader />
                        <p className="text-lg mt-4 text-sky-300">Generating Metadata...</p>
                        <ProgressBar progress={progress} />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} />}
            </AnimatePresence>
            
            <AnimatePresence>
            {images.length > 0 && !isLoading && (
                 <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
                 >
                    <motion.button
                        onClick={() => handleGenerateMetadata()}
                        className="px-8 py-4 bg-sky-500 text-white font-bold rounded-full text-lg shadow-lg animate-glow-pulse"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Generate Metadata for {images.filter(i => i.status !== 'completed').length} Images
                    </motion.button>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
};

export default App;
