'use client';
import React, { useState, useEffect } from 'react';
import { FaBitcoin } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import TopCoins from '../../components/TopCoins';

// Simple Main Page Loader
const MainPageLoader = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) return 100;
                return prev + 8; // Fast progress
            });
        }, 60);

        return () => clearInterval(progressInterval);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-950 flex items-center justify-center">
            <div className="text-center max-w-sm mx-auto px-6">
                
                {/* loader */}
                <div className="relative mb-6">
                    <div className="w-16 h-16 mx-auto">
                        <FaBitcoin className="w-full h-full text-green-400 animate-spin" style={{ animationDuration: '2s' }} />
                    </div>
                    {/* Pulse effect */}
                    <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full border-2 border-green-400/30 animate-ping"></div>
                </div>

                {/* Name */}
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-2">
                    CRYPTO PULSE
                </h1>
                <p className="text-gray-400 text-sm mb-6">Loading market data</p>

                {/* progress bar */}
                <div className="w-full max-w-xs mx-auto">
                    <div className="w-full bg-gray-800 rounded-full h-1 overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-150 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function DiscoverPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500); // 1.5 seconds

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <MainPageLoader />;
    }

    return (
        <div className="animate-fade-in">
            <Navbar />
            <TopCoins />
            <div className="mx-auto max-w-7xl px-6 py-6">
                <div className="mt-6 grid grid-cols-12 gap-6">
                    <aside className="col-span-12 lg:col-span-4">
                        {/* component for updation in future if side bar has to be developed. */}
                    </aside>
                    
                    <main className="col-span-12 lg:col-span-8 space-y-6">
                    </main>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out;
                }
            `}</style>
        </div>
    );
}