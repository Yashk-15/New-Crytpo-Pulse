"use client";
import { useState, useEffect } from "react";
import {
    FaGithub,
    FaLinkedin,
    FaRocket,
    FaChartLine,
    FaStar,
    FaEye,
    FaCode,
    FaBell,
    FaMoon,
    FaWallet,
    FaBitcoin,
    FaEthereum,
} from "react-icons/fa";
import { BiTrendingUp } from "react-icons/bi";
import { SiDogecoin, SiLitecoin } from "react-icons/si";
import Link from 'next/link';

// Crypto Loader :-

const CryptoLoader = () => {
    const [loadingText, setLoadingText] = useState("Loading");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const textInterval = setInterval(() => {   // loading text
            setLoadingText(prev => {
                if (prev === "Loading...") return "Loading";
                return prev + ".";
            });
        }, 500);
        // progress bar
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) return 100;
                return prev + 2;
            });
        }, 60);

        return () => {
            clearInterval(textInterval);
            clearInterval(progressInterval);
        };
    }, []);

    const cryptoIcons = [
        { icon: FaBitcoin, color: "text-orange-400", delay: "0s" },
        { icon: FaEthereum, color: "text-blue-400", delay: "0.2s" },
        { icon: SiDogecoin, color: "text-yellow-400", delay: "0.4s" },
        { icon: SiLitecoin, color: "text-gray-400", delay: "0.6s" },
    ];

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-green-950 flex items-center justify-center z-50">
            {/* Animated Background Grid */}
            <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full bg-[linear-gradient(rgba(0,255,127,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,127,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
            </div>

            <div className="relative z-10 text-center">
                {/* Floating Crypto Icons */}
                <div className="relative mb-8 flex justify-center">
                    <div className="w-32 h-32 relative flex items-center justify-center">
                        {cryptoIcons.map((crypto, index) => {
                            const IconComponent = crypto.icon;
                            const angle = (index * 90) * (Math.PI / 180);
                            const radius = 60;
                            const x = Math.cos(angle) * radius;
                            const y = Math.sin(angle) * radius;
                            
                            return (
                                <div
                                    key={index}
                                    className="absolute"
                                    style={{
                                        transform: `translate(${x}px, ${y}px)`,
                                        animationDelay: crypto.delay,
                                    }}
                                >
                                    <IconComponent 
                                        className={`text-4xl ${crypto.color} animate-bounce`} 
                                        style={{ animationDelay: crypto.delay }}
                                    />
                                </div>
                            );
                        })}
                        
                        {/* Center Pulse Circle */}
                        <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping opacity-60"></div>
                        <div className="absolute inset-4 rounded-full border-2 border-green-500 animate-pulse"></div>
                    </div>
                </div>

                {/* Loading Text */}
                <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-4">
                    CRYPTO PULSE
                </h2>
                <p className="text-xl text-gray-300 mb-8">{loadingText}</p>

                {/* Progress Bar */}
                <div className="w-80 max-w-full mx-auto mb-6 px-4">
                    <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-300 ease-out shadow-lg shadow-green-500/50"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">{progress}% Complete</p>
                </div>

                {/* Loading Messages */}
                <div className="space-y-2 text-sm text-gray-400 px-4">
                    {progress > 20 && <p className="animate-fade-in">Connecting to blockchain networks...</p>}
                    {progress > 40 && <p className="animate-fade-in">Fetching real-time market data...</p>}
                    {progress > 60 && <p className="animate-fade-in">Loading advanced analytics...</p>}
                    {progress > 80 && <p className="animate-fade-in">Initializing dashboard...</p>}
                    {progress >= 100 && <p className="text-green-400 animate-fade-in">Ready to launch! 🚀</p>}
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out;
                }
            `}</style>
        </div>
    );
};

export default function AboutSection() {
    const [isLoading, setIsLoading] = useState(true);
    const [activeCard, setActiveCard] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 4000); // 4 seconds

        return () => clearTimeout(timer);
    }, []);

    const cards = [
        {
            title: "Real-Time Market Data",
            icon: <FaChartLine className="text-2xl text-green-400" />,
            content:
                "Instant access to live cryptocurrency prices, market caps, and trading volumes across 1000+ assets.",
            gradient: "from-green-900/40 to-black/40",
            stats: { value: "1000+", label: "Cryptos" },
            features: ["Live Prices", "Market Cap", "24h Volume", "Historical Charts"],
        },
        {
            title: "Advanced Analytics",
            icon: <BiTrendingUp className="text-2xl text-green-400" />,
            content:
                "Charting tools with indicators, trend analysis, and market sentiment tracking.",
            gradient: "from-green-800/40 to-black/40",
            stats: { value: "10+", label: "Indicators" },
            features: ["Tech Analysis", "Market Trends", "Volume"],
        },
        {
            title: "Your Watchlist",
            icon: <FaStar className="text-2xl text-green-400" />,
            content:
                "Create a watchlist with portfolio tracking",
            gradient: "from-green-700/40 to-black/40",
            stats: { value: "∞", label: "Watchlist Items" },
            features: ["Lists", "Purchased Coins ", "Tracking"],
        },
        {
            title: "Liquidity Insights",
            icon: <FaEye className="text-2xl text-green-400" />,
            content:
                "Deep liquidity analysis",
            gradient: "from-green-600/40 to-black/40",
            stats: { value: "24/7", label: "Monitoring" },
            features: ["24h Trading Volume", "Risk Assessment", "Top 5 Liquidity Coins Bar Chart", "Liquidity Scores"],
        },
        {
            title: "Modern Tech Stack",
            icon: <FaCode className="text-2xl text-green-400" />,
            content:
                "Built with cutting-edge technologies for speed, scalability, and UX.",
            gradient: "from-green-900/40 to-black/40",
            features: ["Next.js", "Tailwind CSS", "Framer Motion", "CoinGecko API"],
        },
        {
            title: "Future Roadmap",
            icon: <FaRocket className="text-2xl text-green-400" />,
            content:
                "Upcoming features to make your crypto journey even more powerful.",
            gradient: "from-green-700/40 to-black/40",
            upcoming: [
                { icon: <FaWallet />, name: "Portfolio Tracker", status: "Soon" },
                { icon: <FaBell />, name: "Smart Alerts", status: "Soon" },
                { icon: <FaMoon />, name: "Dark/Light Theme", status: "Next" },
            ],
        },
    ];

    if (isLoading) {
        return <CryptoLoader />;
    }

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-950 text-white font-sans overflow-hidden">
            {/* implemented fade-in animation */}
            <div className="animate-fade-in">
                {/* Home Button (Top right*/}
                <div className="absolute top-6 right-6 z-20">
                    <Link href="/"Home
                        className="px-5 py-2 rounded-full bg-gradient-to-r from-green-500 to-green-700 text-black font-bold shadow-lg shadow-green-500/30 hover:scale-110 hover:shadow-green-400/50 transition-transform duration-300"
                        ></Link>
                </div>

                {/* Hero Header */}
                <div className="relative z-10 text-center py-16 px-4">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black bg-gradient-to-r from-green-400 to-green-700 bg-clip-text text-transparent drop-shadow-lg">
                            CRYPTO PULSE
                        </h1>
                    </div>
                    <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto px-4">
                        Your gateway to real-time crypto markets, analytics & insights!
                    </p>
                </div>

                {/* Features & Developer Layout */}
                <div className="relative z-10 container mx-auto px-4 sm:px-6 pb-16">
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                        {/* Features (left, span 3 columns on xl screens) */}
                        <div className="xl:col-span-3">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {cards.map((card, index) => (
                                    <div
                                        key={index}
                                        className="group relative"
                                        onMouseEnter={() => setActiveCard(index)}
                                        onMouseLeave={() => setActiveCard(null)}
                                        style={{
                                            animationDelay: `${index * 0.1}s`,
                                            animation: 'slide-up 0.6s ease-out forwards'
                                        }}
                                    >
                                        <div
                                            className={`relative min-h-[16rem] rounded-2xl border border-green-700/40 bg-gradient-to-br ${card.gradient} backdrop-blur-xl p-5 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-green-500/20`}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    {card.icon}
                                                    <h3 className="text-lg font-semibold">{card.title}</h3>
                                                </div>
                                                {card.stats && (
                                                    <div className="text-right flex-shrink-0">
                                                        <div className="text-xl font-bold text-green-400">
                                                            {card.stats.value}
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            {card.stats.label}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <p className="text-gray-300 mb-3 text-sm leading-relaxed">
                                                {card.content}
                                            </p>

                                            {/* Features */}
                                            {card.features && (
                                                <div className="space-y-1.5">
                                                    {card.features
                                                        .slice(0, activeCard === index ? 4 : 2)
                                                        .map((feature, idx) => (
                                                            <div key={idx} className="flex items-center gap-2">
                                                                <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" />
                                                                <span className="text-sm text-gray-300">
                                                                    {feature}
                                                                </span>
                                                            </div>
                                                        ))}
                                                </div>
                                            )}

                                            {/* Roadmap */}
                                            {card.upcoming && (
                                                <div className="space-y-2">
                                                    {card.upcoming.map((item, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center justify-between"
                                                        >
                                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                <span className="text-green-400 flex-shrink-0">{item.icon}</span>
                                                                <span className="text-sm truncate">{item.name}</span>
                                                            </div>
                                                            <span className="text-xs px-2 py-0.5 bg-black/40 rounded-full text-gray-400 flex-shrink-0 ml-2">
                                                                {item.status}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Developer Card */}
                        <div className="xl:col-span-1 flex justify-center xl:justify-end">
                            <div className="w-full max-w-sm">
                                <div className="sticky top-28 p-8 sm:p-10 bg-black/50 backdrop-blur-xl rounded-3xl border border-green-500/30 hover:scale-105 transition-all duration-500 shadow-xl shadow-green-900/40 hover:shadow-green-500/30 text-center"
                                     style={{
                                         animationDelay: '0.8s',
                                         animation: 'slide-up 0.6s ease-out forwards'
                                     }}>
                                    
                                    {/* Avatar */}
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-r from-green-500 via-green-600 to-green-800 rounded-full mx-auto mb-5 flex items-center justify-center text-2xl sm:text-3xl font-bold text-black shadow-lg shadow-green-400/40 animate-pulse">
                                        YK
                                    </div>

                                    {/* Name */}
                                    <h3 className="text-xl sm:text-2xl font-extrabold mb-2 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent drop-shadow-lg">
                                        👨‍💻 Yash Kaushik
                                    </h3>

                                    {/* Role */}
                                    <p className="text-gray-400 mb-6 tracking-wide text-sm sm:text-base">
                                        Front End Developer
                                    </p>

                                    {/* Social Links */}
                                    <div className="flex justify-center gap-4 sm:gap-5">
                                        {[
                                            { icon: <FaLinkedin />, href: "https://www.linkedin.com/in/yashk15/", label: "LinkedIn", color: "text-green-500" },
                                            { icon: <FaGithub />, href: "https://github.com/Yashk-15", label: "GitHub", color: "text-green-300" },
                                        ].map((social, idx) => (
                                            <a
                                                key={idx}
                                                href={social.href}
                                                title={social.label}
                                                className={`p-3 bg-black/40 rounded-full hover:scale-125 transition-all duration-300 ${social.color} hover:bg-green-900/40 hover:shadow-md hover:shadow-green-500/40`}
                                            >
                                                {social.icon}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slide-up {
                    from { 
                        opacity: 0; 
                        transform: translateY(30px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0); 
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.8s ease-out;
                }
            `}</style>
        </div>
    );
}






