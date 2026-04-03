
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Settings } from '../types';
import { Platform } from '../types';
import { ChevronDownIcon, TrashIcon } from './icons';

interface ControlPanelProps {
    settings: Settings;
    onSettingsChange: (newSettings: Partial<Settings>) => void;
}

const Slider: React.FC<{ label: string; value: number; min: number; max: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, value, min, max, onChange }) => (
    <div className="space-y-2">
        <label className="flex justify-between items-center text-sm font-medium text-gray-300">
            <span>{label}</span>
            <span className="px-2 py-1 text-xs font-semibold text-sky-300 bg-gray-700 rounded">{value}</span>
        </label>
        <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={onChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-sky-500"
        />
    </div>
);

const Toggle: React.FC<{ isOn: boolean; onToggle: () => void; }> = ({ isOn, onToggle }) => (
    <div onClick={onToggle} className={`relative w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${isOn ? 'bg-sky-500' : 'bg-gray-600'}`}>
        <motion.div layout className={`w-4 h-4 bg-white rounded-full transition-transform ${isOn ? 'translate-x-6' : ''}`} />
    </div>
);

export const ControlPanel: React.FC<ControlPanelProps> = ({ settings, onSettingsChange }) => {
    const [isKeywordControlsOpen, setIsKeywordControlsOpen] = useState(false);

    const handleResetKeywords = () => {
        onSettingsChange({
            negativeKeywords: '',
            useNegativeKeywords: false,
            customKeywords: '',
            useCustomKeywords: false,
        });
    };

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 space-y-6 sticky top-8">
            <h2 className="text-xl font-semibold text-white">Controls</h2>
            <Slider
                label="Title Word Limit"
                value={settings.titleWordLimit}
                min={3}
                max={10}
                onChange={(e) => onSettingsChange({ titleWordLimit: parseInt(e.target.value) })}
            />
            <Slider
                label="Keyword Count"
                value={settings.keywordCount}
                min={10}
                max={40}
                onChange={(e) => onSettingsChange({ keywordCount: parseInt(e.target.value) })}
            />
            <div className="space-y-2">
                <label className="flex justify-between items-center text-sm font-medium text-gray-300">
                    <span>Description Word Limit</span>
                     <span className="px-2 py-1 text-xs font-semibold text-sky-300 bg-gray-700 rounded">40 (Fixed)</span>
                </label>
                 <div className="w-full h-2 bg-gray-600 rounded-lg"></div>
            </div>
            <div className="space-y-2">
                <label htmlFor="platform" className="text-sm font-medium text-gray-300">Platform</label>
                <select
                    id="platform"
                    value={settings.platform}
                    onChange={(e) => onSettingsChange({ platform: e.target.value as Platform })}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 focus:ring-sky-500 focus:border-sky-500"
                >
                    {Object.values(Platform).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>
            <div className="flex items-center justify-between pt-2">
                <label htmlFor="custom-prompt-toggle" className="text-sm font-medium text-gray-300">Custom Prompt</label>
                <div onClick={() => onSettingsChange({ useCustomPrompt: !settings.useCustomPrompt })} className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${settings.useCustomPrompt ? 'bg-sky-500' : 'bg-gray-600'}`}>
                    <motion.div layout className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.useCustomPrompt ? 'translate-x-6' : ''}`} />
                </div>
            </div>

            {/* Collapsible Keyword Controls Section */}
            <div className="border-t border-gray-700 pt-6">
                <button
                    onClick={() => setIsKeywordControlsOpen(!isKeywordControlsOpen)}
                    className="w-full flex justify-between items-center text-left text-lg font-semibold text-white"
                >
                    <span>Keyword Controls</span>
                    <motion.div animate={{ rotate: isKeywordControlsOpen ? 180 : 0 }}>
                        <ChevronDownIcon className="w-5 h-5" />
                    </motion.div>
                </button>
                <AnimatePresence>
                    {isKeywordControlsOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                        >
                            <div className="mt-4 space-y-6">
                                {/* Negative Keywords */}
                                <div className="space-y-3 p-4 bg-gray-900/30 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-gray-300">Exclude from Metadata</label>
                                        <Toggle isOn={settings.useNegativeKeywords} onToggle={() => onSettingsChange({ useNegativeKeywords: !settings.useNegativeKeywords })} />
                                    </div>
                                    <input
                                        type="text"
                                        value={settings.negativeKeywords}
                                        onChange={e => onSettingsChange({ negativeKeywords: e.target.value })}
                                        placeholder="Enter words to exclude, commas separated."
                                        className="w-full text-sm bg-gray-700 border border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all disabled:opacity-50"
                                        disabled={!settings.useNegativeKeywords}
                                    />
                                </div>
                                {/* Custom Keywords */}
                                <div className="space-y-3 p-4 bg-gray-900/30 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-gray-300">Inject into Metadata</label>
                                        <Toggle isOn={settings.useCustomKeywords} onToggle={() => onSettingsChange({ useCustomKeywords: !settings.useCustomKeywords })} />
                                    </div>
                                    <textarea
                                        value={settings.customKeywords}
                                        onChange={e => onSettingsChange({ customKeywords: e.target.value })}
                                        placeholder="Enter custom keywords to always include."
                                        rows={3}
                                        className="w-full text-sm bg-gray-700 border border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all disabled:opacity-50 resize-none"
                                        disabled={!settings.useCustomKeywords}
                                    />
                                </div>
                                {/* Reset Button */}
                                <motion.button
                                    onClick={handleResetKeywords}
                                    className="w-full flex items-center justify-center gap-2 text-sm px-3 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <TrashIcon className="w-4 h-4" /> Reset Keyword Settings
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
