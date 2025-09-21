// src/components/CoinPageLayout.js
"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaHome, FaStar, FaPlus, FaCheck, FaTimes } from "react-icons/fa";
import { addToPortfolio, getPortfolio } from "../utils/portfolio";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "../utils/watchlist";

// Watchlist Success Toast notifications :-

const WatchlistToast = ({ isVisible, onClose, coinName, coinSymbol, coinImage, isAdded }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-6 z-50 animate-slide-in">
      <div className={`${isAdded ? 'bg-gradient-to-r from-yellow-500/95 to-yellow-600/95' : 'bg-gradient-to-r from-gray-500/95 to-gray-600/95'} backdrop-blur-md rounded-2xl shadow-2xl border ${isAdded ? 'border-yellow-400/30' : 'border-gray-400/30'} p-4 max-w-sm`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <FaStar className={`${isAdded ? 'text-yellow-200' : 'text-gray-200'} text-sm`} />
            </div>
            <h3 className="text-white font-bold text-sm">
              {isAdded ? 'Added to Watchlist!' : 'Removed from Watchlist'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <FaTimes className="text-xs" />
          </button>
        </div>
        
        <div className="flex items-center gap-3 mb-3">
          {coinImage && (
            <div className="w-10 h-10 rounded-full bg-white/10 p-1">
              <img 
                src={coinImage} 
                alt={coinName}
                className="w-full h-full rounded-full"
              />
            </div>
          )}
          <div>
            <p className="text-white font-semibold">{coinName}</p>
            <p className={`${isAdded ? 'text-yellow-100' : 'text-gray-100'} text-xs`}>{coinSymbol?.toUpperCase()}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-1 ${isAdded ? 'text-yellow-100' : 'text-gray-100'} text-xs`}>
            <FaStar className={`${isAdded ? 'text-yellow-300' : 'text-gray-300'}`} />
            <span>{isAdded ? 'Track price changes' : 'No longer tracking'}</span>
          </div>
          <div className="w-8 h-1 bg-white/30 rounded-full overflow-hidden">
            <div className="w-full h-full bg-white animate-shrink origin-right"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Success Toast Component for Portfolio addition :-

const SuccessToast = ({ isVisible, onClose, coinName, amount, coinSymbol, coinImage }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-6 z-50 animate-slide-in">
      <div className="bg-gradient-to-r from-green-500/95 to-green-600/95 backdrop-blur-md rounded-2xl shadow-2xl border border-green-400/30 p-4 max-w-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <FaCheck className="text-white text-sm" />
            </div>
            <h3 className="text-white font-bold text-sm">Added to Portfolio!</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <FaTimes className="text-xs" />
          </button>
        </div>
        
        <div className="flex items-center gap-3 mb-3">
          {coinImage && (
            <div className="w-10 h-10 rounded-full bg-white/10 p-1">
              <img 
                src={coinImage} 
                alt={coinName}
                className="w-full h-full rounded-full"
              />
            </div>
          )}
          <div>
            <p className="text-white font-semibold">{amount} {coinSymbol?.toUpperCase()}</p>
            <p className="text-green-100 text-xs">{coinName}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-green-100 text-xs">
            <FaStar className="text-yellow-300" />
            <span>Track in your portfolio</span>
          </div>
          <div className="w-8 h-1 bg-white/30 rounded-full overflow-hidden">
            <div className="w-full h-full bg-white animate-shrink origin-right"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Floating Stars for Watchlist :-

const FloatingStars = ({ isVisible, coinImage }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float-star opacity-0"
          style={{
            left: `${30 + i * 8}%`,
            top: `${20 + i * 5}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: '2.5s'
          }}
        >
          <FaStar className="w-4 h-4 text-yellow-400" />
        </div>
      ))}
    </div>
  );
};

// Watchlist Button :-

const WatchlistButton = ({ onClick, isInWatchlist, isLoading }) => {
  if (isLoading) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-600 text-gray-400 cursor-not-allowed font-medium transition-all duration-200"
      >
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
        <span className="text-sm">Processing...</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg ${
        isInWatchlist 
          ? 'bg-yellow-600 hover:bg-yellow-500 text-white hover:shadow-yellow-500/25 hover:scale-105' 
          : 'bg-gray-600 hover:bg-yellow-600 text-gray-200 hover:text-white hover:shadow-yellow-500/25 hover:scale-105'
      }`}
    >
      <FaStar className={`text-sm ${isInWatchlist ? 'fill-current' : ''}`} />
      <span className="text-sm">
        {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
      </span>
    </button>
  );
};

// Portfolio Button with States:-
const PortfolioButton = ({ onClick, isInPortfolio, isLoading }) => {
  if (isLoading) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-600 text-gray-400 cursor-not-allowed font-medium transition-all duration-200"
      >
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
        <span className="text-sm">Adding...</span>
      </button>
    );
  }

  if (isInPortfolio) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600/80 text-green-100 cursor-not-allowed font-medium transition-all duration-200"
      >
        <FaStar className="text-sm" />
        <span className="text-sm">In Portfolio</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white hover:scale-105 font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
    >
      <FaPlus className="text-sm" />
      <span className="text-sm">Add to Portfolio</span>
    </button>
  );
};

export default function CoinPageLayout({ children, coinId, coinName, coinSymbol, coinImage, coinPrice }) {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [isInPortfolio, setIsInPortfolio] = useState(false);
  const [isPortfolioLoading, setIsPortfolioLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  // Watchlist state
  const [isInWatchlistState, setIsInWatchlistState] = useState(false);
  const [isWatchlistLoading, setIsWatchlistLoading] = useState(false);
  const [showWatchlistToast, setShowWatchlistToast] = useState(false);
  const [watchlistAction, setWatchlistAction] = useState(null);
  const [showFloatingStars, setShowFloatingStars] = useState(false);

  // Check if coin is already in portfolio and watchlist
  useEffect(() => {
    if (coinId) {
      const portfolio = getPortfolio();
      setIsInPortfolio(portfolio.some(item => item.coinId === coinId));
      setIsInWatchlistState(isInWatchlist(coinId));
    }
  }, [coinId]);

  const handleAddToPortfolio = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return;
    }

    try {
      setIsPortfolioLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      addToPortfolio(coinId, Number(amount));
      setIsInPortfolio(true);
      setShowAddModal(false);
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('portfolio:updated'));
      }
      
      setShowSuccessToast(true);
      setAmount("");
    } catch (error) {
      console.error("Failed to add to portfolio:", error);
    } finally {
      setIsPortfolioLoading(false);
    }
  };

  const handleWatchlistToggle = async () => {
    try {
      setIsWatchlistLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // doing API delay for better UX
      
      if (isInWatchlistState) {
        removeFromWatchlist(coinId);
        setIsInWatchlistState(false);
        setWatchlistAction('removed');
      } else {
        addToWatchlist(coinId);
        setIsInWatchlistState(true);
        setWatchlistAction('added');
        setShowFloatingStars(true);
        setTimeout(() => setShowFloatingStars(false), 2500);
      }
      // Trigger watchlist update event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('watchlist:updated'));
      }
      
      setShowWatchlistToast(true);
    } catch (error) {
      console.error("Failed to update watchlist:", error);
    } finally {
      setIsWatchlistLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-950">
      {/* Success notification for Portfolio */}
      <SuccessToast
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        coinName={coinName}
        amount={amount}
        coinSymbol={coinSymbol}
        coinImage={coinImage}
      />

      {/* Watchlist notification */}
      <WatchlistToast
        isVisible={showWatchlistToast}
        onClose={() => setShowWatchlistToast(false)}
        coinName={coinName}
        coinSymbol={coinSymbol}
        coinImage={coinImage}
        isAdded={watchlistAction === 'added'}
      />

      {/* Floating Stars for Watchlist */}
      <FloatingStars 
        isVisible={showFloatingStars} 
        coinImage={coinImage}
      />

      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            
            {/* Home Button */}
            <div className="flex items-center">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-green-500/25 hover:scale-105"
              >
                <FaHome className="text-sm" />
                <span className="text-sm">Home</span>
              </button>
            </div>

            {/* Center: Coin Info */}
            {coinName && (
              <div className="flex items-center gap-3 bg-gray-800/50 px-4 py-2 rounded-xl backdrop-blur">
                {coinImage && (
                  <img 
                    src={coinImage} 
                    alt={coinName}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div>
                  <h1 className="text-white font-bold text-lg">{coinName}</h1>
                  <p className="text-gray-400 text-sm uppercase">{coinSymbol}</p>
                </div>
                {coinPrice && (
                  <div className="ml-4 text-green-400 font-bold text-lg">
                    ${typeof coinPrice === 'number' ? coinPrice.toLocaleString() : coinPrice}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}

            <div className="flex items-center gap-3">
              <WatchlistButton
                onClick={handleWatchlistToggle}
                isInWatchlist={isInWatchlistState}
                isLoading={isWatchlistLoading}
              />
              <PortfolioButton
                onClick={() => setShowAddModal(true)}
                isInPortfolio={isInPortfolio}
                isLoading={isPortfolioLoading}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative">
        {children}
      </div>

      {/* Enhanced Add to Portfolio Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700 shadow-2xl animate-modal-in">
            <div className="flex items-center gap-3 mb-6">
              {coinImage && (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400/20 to-blue-400/20 p-1">
                  <img 
                    src={coinImage} 
                    alt={coinName}
                    className="w-full h-full rounded-full"
                  />
                </div>
              )}
              <div>
                <h3 className="text-white font-bold text-xl">Add to Portfolio</h3>
                <p className="text-gray-400 text-sm">{coinName} ({coinSymbol?.toUpperCase()})</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-3">
                How many {coinSymbol?.toUpperCase() || 'coins'} do you own?
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="any"
                  min="0"
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-medium"
                  autoFocus
                />
              </div>
              {coinPrice && amount && !isNaN(amount) && Number(amount) > 0 && (
                <p className="text-gray-400 text-sm mt-2 flex items-center gap-2">
                  <FaStar className="text-yellow-400 text-xs" />
                  Total portfolio value: ${(Number(amount) * Number(coinPrice)).toLocaleString()}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setAmount("");
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToPortfolio}
                disabled={!amount || isNaN(amount) || Number(amount) <= 0 || isPortfolioLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPortfolioLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <FaPlus className="text-sm" />
                    <span>Add to Portfolio</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes modal-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes float-star {
          0% {
            transform: translateY(50px) rotate(0deg) scale(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-50px) rotate(180deg) scale(1);
            opacity: 0;
          }
        }
        
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
        
        .animate-modal-in {
          animation: modal-in 0.3s ease-out;
        }
        
        .animate-float-star {
          animation: float-star 2.5s ease-out forwards;
        }
        
        .animate-shrink {
          animation: shrink 3s linear;
        }
      `}</style>
    </div>
  );
}