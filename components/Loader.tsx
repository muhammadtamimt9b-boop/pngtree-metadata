
import React from 'react';

export const Loader: React.FC = () => (
    <div className="w-24 h-24 rounded-full animate-spin"
         style={{ background: 'conic-gradient(from 180deg at 50% 50%, #1e293b 0deg, #0ea5e9 360deg)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-black bg-opacity-70 rounded-full"></div>
    </div>
);
