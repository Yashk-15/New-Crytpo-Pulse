// src/app/coingecko/[id]/page.js
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CoinPageLayout from "../../../components/CoinPageLayout";
import ChartCard from "../../../components/ChartCard";
import { FaCoins, FaChartBar, FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function CoinDetailsPage() {
  const params = useParams();
  const coinId = params?.id;
  
  const [coinData, setCoinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!coinId) return;

    async function fetchCoinData() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/coins/${coinId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch coin data: ${response.status}`);
        }
        
        const data = await response.json();
        setCoinData(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching coin data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCoinData();
  }, [coinId]);

  if (loading) {
    return (
      <CoinPageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading coin data...</p>
          </div>
        </div>
      </CoinPageLayout>
    );
  }

  if (error) {
    return (
      <CoinPageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center bg-red-900/20 border border-red-500/30 rounded-2xl p-8 max-w-md">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <h2 className="text-red-400 font-bold text-xl mb-2">Error Loading Coin</h2>
            <p className="text-gray-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </CoinPageLayout>
    );
  }

  if (!coinData) {
    return (
      <CoinPageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-gray-400">Coin not found</p>
          </div>
        </div>
      </CoinPageLayout>
    );
  }

  const price = coinData.market_data?.current_price?.usd || 0;
  const priceChange24h = coinData.market_data?.price_change_percentage_24h || 0;
  const marketCap = coinData.market_data?.market_cap?.usd || 0;
  const volume24h = coinData.market_data?.total_volume?.usd || 0;
  const rank = coinData.market_cap_rank || 0;

  return (
    <CoinPageLayout
      coinId={coinId}
      coinName={coinData.name}
      coinSymbol={coinData.symbol}
      coinImage={coinData.image?.large}
      coinPrice={price}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Key Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-2">
              <FaCoins className="text-green-400 text-xl" />
              <h3 className="text-gray-400 font-medium">Market Cap Rank</h3>
            </div>
            <p className="text-white font-bold text-2xl">#{rank || 'N/A'}</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-2">
              <div className={`text-xl ${priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {priceChange24h >= 0 ? <FaArrowUp /> : <FaArrowDown />}
              </div>
              <h3 className="text-gray-400 font-medium">24h Change</h3>
            </div>
            <p className={`font-bold text-2xl ${priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {priceChange24h >= 0 ? '+' : ''}{priceChange24h.toFixed(2)}%
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-2">
              <FaChartBar className="text-blue-400 text-xl" />
              <h3 className="text-gray-400 font-medium">Market Cap</h3>
            </div>
            <p className="text-white font-bold text-2xl">
              ${(marketCap / 1e9).toFixed(1)}B
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-2">
              <FaChartBar className="text-purple-400 text-xl" />
              <h3 className="text-gray-400 font-medium">24h Volume</h3>
            </div>
            <p className="text-white font-bold text-2xl">
              ${volume24h >= 1e9 ? (volume24h / 1e9).toFixed(1) + 'B' : (volume24h / 1e6).toFixed(1) + 'M'}
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Chart */}
          <div className="lg:col-span-2">
            <ChartCard 
              initialCoin={coinId} 
              showDropdown={false}
            />
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            
            {/* Description */}
            {coinData.description?.en && (
              <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-white font-bold text-lg mb-4">About {coinData.name}</h3>
                <div 
                  className="text-gray-300 text-sm leading-relaxed max-h-48 overflow-y-auto"
                  dangerouslySetInnerHTML={{ 
                    __html: coinData.description.en
                      .replace(/<a[^>]*>/g, '')
                      .replace(/<\/a>/g, '')
                      .substring(0, 500) + (coinData.description.en.length > 500 ? '...' : '')
                  }}
                />
              </div>
            )}

            {/* Additional Stats */}
            <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-white font-bold text-lg mb-4">Additional Stats</h3>
              <div className="space-y-3">
                {coinData.market_data?.circulating_supply && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Circulating Supply</span>
                    <span className="text-white font-medium">
                      {(coinData.market_data.circulating_supply / 1e6).toFixed(1)}M
                    </span>
                  </div>
                )}
                
                {coinData.market_data?.total_supply && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Supply</span>
                    <span className="text-white font-medium">
                      {coinData.market_data.total_supply >= 1e9 
                        ? (coinData.market_data.total_supply / 1e9).toFixed(1) + 'B'
                        : (coinData.market_data.total_supply / 1e6).toFixed(1) + 'M'
                      }
                    </span>
                  </div>
                )}

                {coinData.market_data?.high_24h?.usd && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h High</span>
                    <span className="text-green-400 font-medium">
                      ${coinData.market_data.high_24h.usd.toLocaleString()}
                    </span>
                  </div>
                )}

                {coinData.market_data?.low_24h?.usd && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h Low</span>
                    <span className="text-red-400 font-medium">
                      ${coinData.market_data.low_24h.usd.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CoinPageLayout>
  );
}


