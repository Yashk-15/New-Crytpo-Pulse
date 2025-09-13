'use client';
import { useEffect, useState, memo } from 'react';
import Image from 'next/image';

function CoinsTable() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCoins() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          '/api/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false'
        );
        
        if (!res.ok) {
          throw new Error(`Failed to fetch coins: ${res.status}`);
        }
        
        const data = await res.json();
        setCoins(data);
      } catch (error) {
        console.error('Error fetching coins:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCoins();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="text-red-400 text-center py-8">
          Error loading coins: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-4">Top Cryptocurrencies</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400">
              <th className="text-left py-3 px-2">#</th>
              <th className="text-left py-3 px-2">Coin</th>
              <th className="text-right py-3 px-2">Price</th>
              <th className="text-right py-3 px-2">24h Change</th>
              <th className="text-right py-3 px-2">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin, index) => (
              <tr key={coin.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                <td className="py-3 px-2 text-gray-400">{coin.market_cap_rank}</td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <Image
                      src={coin.image}
                      alt={coin.name}
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-white">{coin.name}</div>
                      <div className="text-gray-400 text-xs uppercase">{coin.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2 text-right text-white font-medium">
                  ${coin.current_price.toLocaleString()}
                </td>
                <td className={`py-3 px-2 text-right font-medium ${
                  coin.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {coin.price_change_percentage_24h > 0 ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td className="py-3 px-2 text-right text-gray-300">
                  ${coin.market_cap.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default memo(CoinsTable);