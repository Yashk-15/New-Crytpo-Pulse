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
} from "react-icons/fa";
import { BiTrendingUp } from "react-icons/bi";

export default function AboutSection() {
    const [activeCard, setActiveCard] = useState(null);

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

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-950 text-white font-sans overflow-hidden">
            
            {/* 🔘 Home Button (Top Right) */}
            <div className="absolute top-6 right-6 z-20">
                <a
                    href="/"
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-green-500 to-green-700 text-black font-bold shadow-lg shadow-green-500/30 hover:scale-110 hover:shadow-green-400/50 transition-transform duration-300"
                >
                    Home
                </a>
            </div>

            
            {/* Hero Header */}
            <div className="relative z-10 text-center py-16">
                <div className="inline-flex items-center gap-3 mb-6">
                    <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-green-400 to-green-700 bg-clip-text text-transparent drop-shadow-lg">
                        CRYPTO PULSE
                    </h1>
                </div>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                    Your gateway to real-time crypto markets, analytics & insights!
                </p>
            </div>

            {/* Features + Developer Layout */}
            <div className="relative z-10 container mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Features (left, span 3 columns) */}
<div className="lg:col-span-3">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {cards.map((card, index) => (
      <div
        key={index}
        className="group relative"
        onMouseEnter={() => setActiveCard(index)}
        onMouseLeave={() => setActiveCard(null)}
      >
        <div
          className={`relative h-64 rounded-2xl border border-green-700/40 bg-gradient-to-br ${card.gradient} backdrop-blur-xl p-5 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-green-500/20`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {card.icon}
              <h3 className="text-lg font-semibold">{card.title}</h3>
            </div>
            {card.stats && (
              <div className="text-right">
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
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
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
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">{item.icon}</span>
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-black/40 rounded-full text-gray-400">
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

{/* Developer Card (right, sticky & bigger than feature cards) */}
<div className="flex justify-center lg:justify-end items-start">
  <div className="sticky top-28 p-10 bg-black/50 backdrop-blur-xl rounded-3xl border border-green-500/30 hover:scale-105 transition-all duration-500 shadow-xl shadow-green-900/40 hover:shadow-green-500/30 w-full max-w-sm">
    
    {/* Avatar */}
    <div className="w-28 h-28 bg-gradient-to-r from-green-500 via-green-600 to-green-800 rounded-full mx-auto mb-5 flex items-center justify-center text-3xl font-bold text-black shadow-lg shadow-green-400/40 animate-pulse">
      YK
    </div>

    {/* Name */}
    <h3 className="text-2xl font-extrabold mb-2 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent drop-shadow-lg">
      👨‍💻 Yash Kaushik
    </h3>

    {/* Role */}
    <p className="text-gray-400 mb-6 tracking-wide">
      Front End Developer
    </p>

    {/* Social Links */}
    <div className="flex justify-center gap-5">
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
    );
}






