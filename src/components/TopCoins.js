'use client';
import { useEffect, useState, memo } from 'react';
import Image from 'next/image';
import ChartCard from "./ChartCard";
import MyPortfolio from "./MyPortfolio";

function TopCoins() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Retry mechanism with exponential backoff
  const retryWithBackoff = async (fn, retries = 3, delay = 1000) => {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        console.log(`Retrying in ${delay}ms... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return retryWithBackoff(fn, retries - 1, delay * 2);
      }
      throw error;
    }
  };

  useEffect(() => {
    let mounted = true;
    async function fetchCoins() {
      try {
        setLoading(true);
        // request only 3 items from API
        const res = await fetch('/api/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=3&page=1&sparkline=false');
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(`Failed to load top coins: ${res.status} ${text}`);
        }
        const data = await res.json();
        if (!mounted) return;
        setCoins(data || []);
        setError(null);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Error fetching top coins');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchCoins();
    return () => { mounted = false; };
  }, [isOnline]);

  const handleRetry = () => {
    setError(null);
    setRetryCount(0);
    // Trigger re-fetch by updating a dependency or calling fetchCoins directly
    window.location.reload(); // Simple retry by reloading
  };

  if (loading) {
    return (
      <div className="w-full flex mt-8 px-8">
        <div className="w-full md:w-1/3 md:sticky md:top-4 self-start">
          <div className="animate-pulse">
            <div className="h-6 bg-surface2 rounded mb-4 border-l-4 border-accent-500"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-surface rounded-xl h-32 border border-border"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex mt-8 px-8">
        <div className="w-full md:w-1/3 md:sticky md:top-4 self-start">
          <div className="bg-danger/10 border border-danger/20 rounded-xl p-6 text-center">
            <div className="text-danger text-xl mb-2">⚠️</div>
            <h3 className="text-danger font-medium mb-2">Failed to Load Data</h3>
            <p className="text-muted text-sm mb-4">{error}</p>
            
            {!isOnline && (
              <div className="bg-warn/10 border border-warn/20 rounded-lg p-3 mb-4">
                <p className="text-warn text-sm">🔌 You are currently offline</p>
              </div>
            )}
            
            <div className="space-y-2">
              <button
                onClick={handleRetry}
                disabled={!isOnline}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                  isOnline
                    ? 'bg-accent-500 hover:bg-accent-600 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {retryCount > 0 ? `Retry (${retryCount} attempts)` : 'Try Again'}
              </button>
              
              {retryCount >= 3 && (
                <p className="text-muted text-xs">
                  Still having issues? The API might be temporarily unavailable.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ensure rendering only top 3 even if API changes
  const displayCoins = (coins || []).slice(0, 3);

  return (
    <div className="w-full flex mt-8 px-8">
  {/* Left Side - Top Coins + Portfolio */}
  <div className="w-full md:w-1/3 md:sticky md:top-4 self-start">
    <h2 className="text-xl font-black mb-9 text-txt border-l-4 border-accent-500 pl-3 -mt-1">
      Top 3 Cryptocurrencies
    </h2>

        {/* Grid for compact square cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {displayCoins.map((coin) => (
            <div
              key={coin.id}
              className="bg-surface rounded-xl shadow flex flex-col items-center justify-center p-3 w-50 h-38 hover:shadow-lg hover:bg-surface2 transition-all duration-200 border border-border"
            >
              <Image
                src={coin.image}
                alt={coin.name}
                width={32}
                height={32}
                className="w-8 h-8 mb-2"
              />
              <h3 className="text-xs font-semibold text-txt text-center">
                {coin.name}
              </h3>
              <p className="text-[10px] text-muted uppercase">
                {coin.symbol}
              </p>
              <p className="text-accent-500 font-bold text-xs mt-1">
                ${coin.current_price.toLocaleString()}
              </p>
              <p
                className={`text-[10px] font-medium ${
                  (coin.price_change_percentage_24h ?? 0) > 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {(Number(coin.price_change_percentage_24h) ?? 0).toFixed(2)}%
              </p>
            </div>
          ))}
        </div>

        {/* My Portfolio below top coins, same column width */}
        <MyPortfolio />
      </div>

      {/* Right Side - Chart */}
      <div className="flex-1 ml-8 mt-9">
        <ChartCard />
        </div>
      </div>
  );
}

export default memo(TopCoins);





