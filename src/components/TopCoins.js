'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import ChartCard from "./ChartCard";
import MyPortfolio from "./MyPortfolio";

export default function TopCoins() {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    async function fetchCoins() {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=3&page=1&sparkline=false'
        );
        const data = await res.json();
        setCoins(data);
      } catch (error) {
        console.error('Error fetching coins:', error);
      }
    }
    fetchCoins();
  }, []);

  return (
    <div className="w-full flex mt-8 px-8">
  {/* Left Side - Top Coins + Portfolio */}
  <div className="w-full md:w-1/3 md:sticky md:top-4 self-start">
    <h2 className="text-xl font-black mb-4 text-gray-100 border-l-4 border-green-500 pl-3 -mt-2">
      Top 3 Cryptocurrencies
    </h2>

        {/* Grid for compact square cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {coins.map((coin) => (
            <div
              key={coin.id}
              className="bg-gray-800 rounded-xl shadow flex flex-col items-center justify-center p-3 w-50 h-38 hover:shadow-lg transition"
            >
              <Image
                src={coin.image}
                alt={coin.name}
                width={32}
                height={32}
                className="w-8 h-8 mb-2"
              />
              <h3 className="text-xs font-semibold text-white text-center">
                {coin.name}
              </h3>
              <p className="text-[10px] text-gray-400 uppercase">
                {coin.symbol}
              </p>
              <p className="text-green-400 font-bold text-xs mt-1">
                ${coin.current_price.toLocaleString()}
              </p>
              <p
                className={`text-[10px] font-medium ${
                  coin.price_change_percentage_24h > 0
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {coin.price_change_percentage_24h.toFixed(2)}%
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





