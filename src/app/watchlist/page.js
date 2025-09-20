"use client";
import { useEffect, useState } from "react";
import { getWatchlist } from "@/utils/watchlist";
import Link from "next/link";
import Image from "next/image";

// Watchlist Loader Component
const WatchlistLoader = () => {
  const [loadingText, setLoadingText] = useState("Loading watchlist");
  const [progress, setProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Animate loading text
    const textInterval = setInterval(() => {
      setLoadingText(prev => {
        if (prev === "Loading watchlist...") return "Loading watchlist";
        return prev + ".";
      });
    }, 500);

    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 3;
      });
    }, 60);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, [isMounted]);

  // Pre-calculated fixed positions to avoid hydration mismatch
  const starPositions = [
    { x: 0, y: -40, delay: "0s" },
    { x: 38.04, y: -12.36, delay: "0.2s" },
    { x: 23.51, y: 32.36, delay: "0.4s" },
    { x: -23.51, y: 32.36, delay: "0.6s" },
    { x: -38.04, y: -12.36, delay: "0.8s" }
  ];

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg via-surface to-bg flex items-center justify-center">
        <div className="relative z-10 text-center bg-surface2/50 backdrop-blur-xl rounded-3xl p-12 border border-border shadow-2xl">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto relative">
              <div className="absolute inset-0 rounded-full border-4 border-accent-500 animate-ping opacity-60"></div>
              <div className="absolute inset-4 rounded-full border-2 border-accent-500/50 animate-pulse"></div>
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-accent-500 to-green-600 bg-clip-text text-transparent mb-2">
            My Watchlist
          </h2>
          <p className="text-lg text-muted mb-8">Loading watchlist</p>
          <div className="w-64 mx-auto mb-6">
            <div className="w-full bg-surface rounded-full h-3 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-accent-500 to-green-400 rounded-full transition-all duration-300 ease-out shadow-lg shadow-accent-500/50 w-0"></div>
            </div>
            <p className="text-sm text-muted mt-2">0% Complete</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-surface to-bg flex items-center justify-center">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[linear-gradient(rgba(44,212,147,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(44,212,147,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
      </div>

      <div className="relative z-10 text-center bg-surface2/50 backdrop-blur-xl rounded-3xl p-12 border border-border shadow-2xl">
        {/* Floating Star Icons for Watchlist */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto relative">
            {starPositions.map((star, index) => (
              <div
                key={index}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  transform: `translate(${star.x}px, ${star.y}px)`,
                  animationDelay: star.delay,
                }}
              >
                <div className="text-2xl animate-bounce" style={{ animationDelay: star.delay }}>
                  ⭐
                </div>
              </div>
            ))}
            
            {/* Center Pulse Circle */}
            <div className="absolute inset-0 rounded-full border-4 border-accent-500 animate-ping opacity-60"></div>
            <div className="absolute inset-4 rounded-full border-2 border-accent-500/50 animate-pulse"></div>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-3xl font-bold bg-gradient-to-r from-accent-500 to-green-600 bg-clip-text text-transparent mb-2">
          My Watchlist
        </h2>
        <p className="text-lg text-muted mb-8">{loadingText}</p>

        {/* Progress Bar */}
        <div className="w-64 mx-auto mb-6">
          <div className="w-full bg-surface rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-accent-500 to-green-400 rounded-full transition-all duration-300 ease-out shadow-lg shadow-accent-500/50"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-muted mt-2">{progress}% Complete</p>
        </div>

        {/* Loading Messages */}
        <div className="space-y-2 text-sm text-muted">
          {progress > 20 && <p className="animate-fade-in">Fetching your saved coins...</p>}
          {progress > 50 && <p className="animate-fade-in">Loading market data...</p>}
          {progress > 80 && <p className="animate-fade-in">Almost ready...</p>}
          {progress >= 100 && <p className="text-accent-500 animate-fade-in">Watchlist loaded! 🚀</p>}
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

// Skeleton loader for individual coin cards
const CoinCardSkeleton = () => (
  <div className="bg-surface2 p-6 rounded-2xl border border-border animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-surface rounded-full"></div>
      <div className="flex-1">
        <div className="h-5 bg-surface rounded mb-2 w-32"></div>
        <div className="h-4 bg-surface rounded mb-2 w-20"></div>
        <div className="h-6 bg-surface rounded w-28"></div>
      </div>
    </div>
  </div>
);

export default function WatchlistPage() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const list = getWatchlist();
        
        // Show initial loader for better UX
        if (isInitialLoad) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        if (list.length === 0) {
          setCoins([]);
          return;
        }

        const results = await Promise.all(
          list.map(async (id) => {
            const res = await fetch(`/api/coingecko/${id}`);
            if (!res.ok) {
              const text = await res.text().catch(() => "");
              throw new Error(
                `Failed to load watchlist coin ${id}: ${res.status} ${text}`
              );
            }
            const coin = await res.json();
            return coin;
          })
        );

        setCoins(results);
      } catch (err) {
        console.error("Error fetching watchlist:", err);
        setError(err.message || "Failed to load watchlist");
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };

    fetchData();
  }, []);

  // Show full-screen loader only on initial load
  if (loading && isInitialLoad) {
    return <WatchlistLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-surface/20 to-bg">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-[linear-gradient(rgba(44,212,147,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(44,212,147,0.1)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-black text-txt bg-gradient-to-r from-txt to-accent-500 bg-clip-text text-transparent">
                My Watchlist
              </h1>
              <p className="text-muted text-lg mt-2">
                Track your favorite cryptocurrencies
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Stats Card */}
              <div className="bg-surface2/80 backdrop-blur-xl rounded-xl p-4 border border-border shadow-lg min-w-[120px]">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-500">
                    {coins.length}
                  </div>
                  <div className="text-xs text-muted uppercase tracking-wider">
                    Coins Tracked
                  </div>
                </div>
              </div>
              
              {/* Home Button */}
              <Link href="/">
                <button className="group px-5 py-4 rounded-xl bg-gradient-to-r from-accent-500 to-green-600 text-white font-semibold shadow-lg shadow-accent-500/30 hover:shadow-xl hover:shadow-accent-500/40 hover:scale-105 transition-all duration-300 flex items-center gap-2 min-w-[120px] justify-center">
                  <span className="text-lg">🏠</span>
                  <span>Home</span>
                  <div className="w-0 group-hover:w-5 transition-all duration-300 overflow-hidden">
                    <span>→</span>
                  </div>
                </button>
              </Link>
            </div>
          </div>

          {/* Decorative line */}
          <div className="h-1 bg-gradient-to-r from-accent-500 via-green-400 to-transparent rounded-full"></div>
        </div>

        {/* Content Area */}
        {error ? (
          <div className="bg-danger/10 border border-danger/20 rounded-2xl p-8 text-center backdrop-blur-xl">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-danger font-semibold text-xl mb-2">
              Failed to Load Watchlist
            </h3>
            <p className="text-muted mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-danger/20 hover:bg-danger/30 border border-danger/30 rounded-xl text-danger font-medium transition-all"
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          // Skeleton loader for coin cards
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <CoinCardSkeleton key={index} />
            ))}
          </div>
        ) : coins.length === 0 ? (
          <div className="bg-surface2/50 backdrop-blur-xl rounded-2xl p-12 text-center border border-border shadow-lg">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-txt mb-2">
              Your Watchlist is Empty
            </h3>
            <p className="text-muted mb-6">
              Start building your watchlist by adding your favorite cryptocurrencies
            </p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-500 to-green-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-accent-500/30 transition-all"
            >
              <span>Discover Coins</span>
              <span>→</span>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {coins.map((coin) => (
              <Link key={coin.id} href={`/coingecko/${coin.id}`}>
                <div className="group bg-gradient-to-br from-surface2 to-surface2/80 p-6 rounded-2xl border border-border hover:border-accent-500/50 cursor-pointer hover:shadow-xl hover:shadow-accent-500/10 transition-all duration-300 backdrop-blur-xl relative overflow-hidden">
                  {/* Subtle background gradient */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/5 rounded-full blur-2xl group-hover:bg-accent-500/10 transition-all"></div>
                  
                  <div className="relative flex items-center gap-4">
                    <div className="relative">
                      <Image
                        src={coin.image?.small || "/placeholder-coin.svg"}
                        alt={coin.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full shadow-lg"
                      />
                      {/* Subtle glow effect */}
                      <div className="absolute inset-0 rounded-full bg-accent-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-lg text-txt group-hover:text-accent-500 transition-colors truncate">
                        {coin.name}
                      </h2>
                      <p className="text-sm text-muted uppercase font-medium">
                        {coin.symbol}
                      </p>
                      
                      {/* Price and change */}
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-xl font-bold text-accent-500">
                          ${coin.market_data?.current_price?.usd?.toLocaleString() || "N/A"}
                        </p>
                        {coin.market_data?.price_change_percentage_24h && (
                          <span className={`text-sm font-medium px-2 py-1 rounded-lg ${
                            coin.market_data.price_change_percentage_24h > 0
                              ? 'bg-green-400/10 text-green-400'
                              : 'bg-red-400/10 text-red-400'
                          }`}>
                            {coin.market_data.price_change_percentage_24h > 0 ? '+' : ''}
                            {coin.market_data.price_change_percentage_24h.toFixed(2)}%
                          </span>
                        )}
                      </div>
                      
                      {/* Market cap rank */}
                      {coin.market_cap_rank && (
                        <div className="mt-3 flex items-center gap-1">
                          <span className="text-xs text-muted">Rank:</span>
                          <span className="text-sm font-semibold text-txt">
                            #{coin.market_cap_rank}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Hover indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-500 to-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}


