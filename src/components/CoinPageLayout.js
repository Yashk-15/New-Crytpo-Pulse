// src/components/CoinPageLayout.js
"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaHome, FaStar, FaPlus, FaCheck, FaTimes } from "react-icons/fa";
import { addToPortfolio, getPortfolio } from "../utils/portfolio";

// Creative Success Toast Component
const SuccessToast = ({ isVisible, onClose, coinName, amount, coinSymbol, coinImage }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // Auto close after 4 seconds
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

// Animated Floating Particles Component
const FloatingParticles = ({ isVisible, coinImage }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float-up opacity-0"
          style={{
            left: `${20 + i * 10}%`,
            animationDelay: `${i * 0.2}s`,
            animationDuration: '3s'
          }}
        >
          {coinImage ? (
            <img 
              src={coinImage} 
              alt=""
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          )}
        </div>
      ))}
    </div>
  );
};

// Portfolio Button with States
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
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  // Check if coin is already in portfolio
  useState(() => {
    const portfolio = getPortfolio();
    setIsInPortfolio(portfolio.some(item => item.coinId === coinId));
  }, [coinId]);

  const handleAddToPortfolio = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      // Could add a validation toast here too
      return;
    }

    try {
      setIsLoading(true);
      
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      addToPortfolio(coinId, Number(amount));
      setIsInPortfolio(true);
      setShowAddModal(false);
      
      // Trigger portfolio update event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('portfolio:updated'));
      }
      
      // Show creative success feedback
      setShowSuccessToast(true);
      setShowParticles(true);
      
      // Hide particles after animation
      setTimeout(() => setShowParticles(false), 3000);
      
      setAmount("");
    } catch (error) {
      console.error("Failed to add to portfolio:", error);
      // Could show error toast here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-950">
      {/* Success Toast */}
      <SuccessToast
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        coinName={coinName}
        amount={amount}
        coinSymbol={coinSymbol}
        coinImage={coinImage}
      />

      {/* Floating Particles */}
      <FloatingParticles 
        isVisible={showParticles} 
        coinImage={coinImage}
      />

      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            
            {/* Left: Home Button */}
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

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-3">
              <PortfolioButton
                onClick={() => setShowAddModal(true)}
                isInPortfolio={isInPortfolio}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
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
                {coinPrice && amount && !isNaN(amount) && Number(amount) > 0 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="bg-green-500/10 text-green-400 px-2 py-1 rounded-lg text-xs font-medium">
                      ${(Number(amount) * Number(coinPrice)).toLocaleString()}
                    </div>
                  </div>
                )}
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
                disabled={!amount || isNaN(amount) || Number(amount) <= 0 || isLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
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
        
        @keyframes float-up {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
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
        
        .animate-float-up {
          animation: float-up 3s ease-out forwards;
        }
        
        .animate-shrink {
          animation: shrink 4s linear;
        }
      `}</style>
    </div>
  );
}