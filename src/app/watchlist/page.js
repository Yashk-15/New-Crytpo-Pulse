"use client";
import { useEffect, useState } from "react";
import { Star, Home, TrendingUp, AlertTriangle, Search, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getWatchlist, removeFromWatchlist } from "../../utils/watchlist";

// Watchlist Loader :-
const WatchlistLoader = () => {
  const [loadingText, setLoadingText] = useState("Loading watchlist");
  const [progress, setProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const textInterval = setInterval(() => {                      // loading text
      setLoadingText(prev => {
        if (prev === "Loading watchlist...") return "Loading watchlist";
        return prev + ".";
      });
    }, 500);

    const progressInterval = setInterval(() => {              // progress bar
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
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-green-950 flex items-center justify-center">
        <div className="relative z-10 text-center bg-gray-800/50 backdrop-blur-xl rounded-3xl p-12 border border-gray-700 shadow-2xl">
          <div className="relative mb-8 flex justify-center">
            <div className="w-24 h-24 relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-ping opacity-60"></div>
              <div className="absolute inset-4 rounded-full border-2 border-green-500/50 animate-pulse"></div>
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent mb-2">
            My Watchlist
          </h2>
          <p className="text-lg text-gray-300 mb-8">Loading watchlist</p>
          <div className="w-64 max-w-full mx-auto mb-6 px-4">
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-300 ease-out shadow-lg shadow-green-500/50 w-0"></div>
            </div>
            <p className="text-sm text-gray-400 mt-2">0% Complete</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-green-950 flex items-center justify-center">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[linear-gradient(rgba(44,212,147,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(44,212,147,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
      </div>

      <div className="relative z-10 text-center bg-gray-800/50 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-gray-700 shadow-2xl max-w-md mx-4">
        {/* Floating Star Icons for Watchlist */}
        <div className="relative mb-8 flex justify-center">
          <div className="w-24 h-24 relative flex items-center justify-center">
            {starPositions.map((star, index) => (
              <div
                key={index}
                className="absolute"
                style={{
                  transform: `translate(${star.x}px, ${star.y}px)`,
                  animationDelay: star.delay,
                }}
              >
                <Star className="w-6 h-6 text-yellow-400 animate-bounce fill-current" style={{ animationDelay: star.delay }} />
              </div>
            ))}
            
            {/* Center Pulse Circle */}
            <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-ping opacity-60"></div>
            <div className="absolute inset-4 rounded-full border-2 border-green-500/50 animate-pulse"></div>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent mb-2">
          My Watchlist
        </h2>
        <p className="text-base sm:text-lg text-gray-300 mb-8">{loadingText}</p>

        {/* Progress Bar */}
        <div className="w-64 max-w-full mx-auto mb-6 px-4">
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-300 ease-out shadow-lg shadow-green-500/50"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400 mt-2">{progress}% Complete</p>
        </div>

        {/* Loading Messages */}
        <div className="space-y-2 text-sm text-gray-400 px-4">
          {progress > 20 && <p className="animate-fade-in">Fetching your saved coins...</p>}
          {progress > 50 && <p className="animate-fade-in">Loading market data...</p>}
          {progress > 80 && <p className="animate-fade-in">Almost ready...</p>}
          {progress >= 100 && <p className="text-green-500 animate-fade-in">Watchlist loaded! 🚀</p>}
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

// Skeleton loader for individual coin cards :-

const CoinCardSkeleton = () => (
  <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-gray-700 rounded-full flex-shrink-0"></div>
      <div className="flex-1 min-w-0">
        <div className="h-5 bg-gray-700 rounded mb-2 w-32"></div>
        <div className="h-4 bg-gray-700 rounded mb-2 w-20"></div>
        <div className="h-6 bg-gray-700 rounded w-28"></div>
      </div>
    </div>
  </div>
);

// Remove confirmation modal :-

const RemoveConfirmModal = ({ isOpen, onClose, onConfirm, coinName, coinSymbol, coinImage }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700 shadow-2xl animate-modal-in">
        <div className="flex items-center gap-3 mb-6">
          {coinImage && (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400/20 to-red-600/20 p-1">
              <img 
                src={coinImage} 
                alt={coinName}
                className="w-full h-full rounded-full"
              />
            </div>
          )}
          <div>
            <h3 className="text-white font-bold text-xl">Remove from Watchlist</h3>
            <p className="text-gray-400 text-sm">{coinName} ({coinSymbol?.toUpperCase()})</p>
          </div>
        </div>

        <p className="text-gray-300 mb-6">
          Are you sure you want to remove <span className="text-white font-semibold">{coinName}</span> from your watchlist?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-2"
          >
            <Trash2 className="text-sm" />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function WatchlistPage() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [removeModal, setRemoveModal] = useState({ isOpen: false, coin: null });

  const fetchCoinData = async (coinIds) => {
    if (!coinIds.length) return [];
    
    try {
      const response = await fetch(`/api/markets?vs_currency=usd&ids=${coinIds.join(',')}&order=market_cap_desc&per_page=${coinIds.length}&page=1&sparkline=false`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching coin data:', error);
      throw error;
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const watchlistIds = getWatchlist();
      
      if (isInitialLoad) {           // initial loader
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      if (watchlistIds.length === 0) {
        setCoins([]);
        return;
      }
      const coinData = await fetchCoinData(watchlistIds);
      setCoins(coinData);

    } catch (err) {
      console.error("Error fetching watchlist:", err);
      setError(err.message || "Failed to load watchlist");
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchData();
    const handleWatchlistUpdate = () => {                // check for watchlist updates from other components
      fetchData();
    };

    window.addEventListener('watchlist:updated', handleWatchlistUpdate);
    return () => {
      window.removeEventListener('watchlist:updated', handleWatchlistUpdate);
    };
  }, []);

  const handleRemoveCoin = (coin) => {
    setRemoveModal({ 
      isOpen: true, 
      coin: {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image
      }
    });
  };

  const confirmRemove = () => {
    if (removeModal.coin) {
      removeFromWatchlist(removeModal.coin.id);
      setCoins(coins.filter(coin => coin.id !== removeModal.coin.id));
      
      // Dispatch update event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('watchlist:updated'));
      }
    }
    setRemoveModal({ isOpen: false, coin: null });
  };

  if (loading && isInitialLoad) {
    return <WatchlistLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900/50 to-gray-950">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-[linear-gradient(rgba(44,212,147,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(44,212,147,0.1)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-black text-white bg-gradient-to-r from-white to-green-500 bg-clip-text text-transparent">
                My Watchlist
              </h1>
              <p className="text-gray-300 text-base sm:text-lg mt-2">
                Track your favorite cryptocurrencies
              </p>
            </div>
            
            <div className="flex items-center justify-center sm:justify-end gap-4">
              {/* Stats Card */}
              <div className="bg-gray-800/80 backdrop-blur-xl rounded-xl p-4 border border-gray-700 shadow-lg min-w-[120px]">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {coins.length}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">
                    Coins Tracked
                  </div>
                </div>
              </div>
              
              {/* Home Button */}
              <Link href="/">
                <button className="group px-4 sm:px-5 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-105 transition-all duration-300 flex items-center gap-2 min-w-[100px] sm:min-w-[120px] justify-center">
                  <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Home</span>
                  <div className="w-0 group-hover:w-4 transition-all duration-300 overflow-hidden">
                    <span>→</span>
                  </div>
                </button>
              </Link>
            </div>
          </div>

          {/* Decorative line */}
          <div className="h-1 bg-gradient-to-r from-green-500 via-green-400 to-transparent rounded-full"></div>
        </div>

        {/* Content Area */}
        {error ? (
          <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-8 text-center backdrop-blur-xl max-w-2xl mx-auto">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-red-400 font-semibold text-xl mb-2">
              Failed to Load Watchlist
            </h3>
            <p className="text-gray-300 mb-4">{error}</p>
            <button
              onClick={() => fetchData()}
              className="px-6 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-500/30 rounded-xl text-red-400 font-medium transition-all"
            >
              Try Again
            </button>
          </div>
        ) : loading ? (

          // Skeleton loader for coin cards
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <CoinCardSkeleton key={index} />
            ))}
          </div>
        ) : coins.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 sm:p-12 text-center border border-gray-700 shadow-lg max-w-2xl mx-auto">
            <div className="text-5xl sm:text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Your Watchlist is Empty
            </h3>
            <p className="text-gray-300 mb-6">
              Start building your watchlist by adding your favorite cryptocurrencies
            </p>
            <Link href="/">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all">
                <Search className="w-4 h-4" />
                <span>Discover Coins</span>
                <span>→</span>
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {coins.map((coin) => (
              <div key={coin.id} className="group bg-gradient-to-br from-gray-800 to-gray-800/80 p-6 rounded-2xl border border-gray-700 hover:border-green-500/50 transition-all duration-300 backdrop-blur-xl relative overflow-hidden">
                
                {/* Subtle background gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl group-hover:bg-green-500/10 transition-all"></div>
                
                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveCoin(coin);
                  }}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300"
                  title="Remove from watchlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <Link href={`/coingecko/${coin.id}`}>
                  <div className="relative flex items-center gap-4 cursor-pointer">
                    <div className="relative flex-shrink-0">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-12 h-12 rounded-full shadow-lg"
                      />
                      {/* Subtle glow effect */}
                      <div className="absolute inset-0 rounded-full bg-green-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="font-bold text-lg text-white group-hover:text-green-500 transition-colors truncate">
                          {coin.name}
                        </h2>
                        <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-sm text-gray-400 uppercase font-medium">
                        {coin.symbol}
                      </p>
                      
                      {/* Price and change */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <p className="text-xl font-bold text-green-500">
                          ${coin.current_price?.toLocaleString() || "N/A"}
                        </p>
                        {coin.price_change_percentage_24h && (
                          <span className={`text-sm font-medium px-2 py-1 rounded-lg flex-shrink-0 ${
                            coin.price_change_percentage_24h > 0
                              ? 'bg-green-400/10 text-green-400'
                              : 'bg-red-400/10 text-red-400'
                          }`}>
                            {coin.price_change_percentage_24h > 0 ? '+' : ''}
                            {coin.price_change_percentage_24h.toFixed(2)}%
                          </span>
                        )}
                      </div>
                      
                      {/* Market cap rank */}
                      {coin.market_cap_rank && (
                        <div className="mt-3 flex items-center gap-1">
                          <span className="text-xs text-gray-400">Rank:</span>
                          <span className="text-sm font-semibold text-white">
                            #{coin.market_cap_rank}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
                
                {/* Hover indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Remove Confirmation Modal */}
      
      <RemoveConfirmModal
        isOpen={removeModal.isOpen}
        onClose={() => setRemoveModal({ isOpen: false, coin: null })}
        onConfirm={confirmRemove}
        coinName={removeModal.coin?.name}
        coinSymbol={removeModal.coin?.symbol}
        coinImage={removeModal.coin?.image}
      />

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes modal-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-modal-in {
          animation: modal-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

