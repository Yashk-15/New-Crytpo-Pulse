"use client";
import { useEffect, useState, use } from "react";
import Image from "next/image";
import ChartCard from "@/components/ChartCard";

export default function CoinPage({ params }) {
  const { id } = use(params);
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoinDetails = async () => {
      try {
        const res = await fetch(`/api/coingecko/${id}`); // ✅ use proxy
        const data = await res.json();
        setCoin(data);
      } catch (err) {
        console.error("Failed to load coin details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto text-white">Loading...</div>
    );
  }

  if (!coin) {
    return (
      <div className="p-6 max-w-6xl mx-auto text-red-400">
        Failed to load coin data.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto text-white space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Image
          src={coin.image?.small || '/placeholder-coin.svg'}
          alt={coin.name}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full"
        />
        <h1 className="text-2xl font-bold">
          {coin.name} ({coin.symbol.toUpperCase()})
        </h1>
      </div>

      {/* Market info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div className="bg-surface2 p-4 rounded-lg">
          <p className="text-gray-400">Current Price (USD)</p>
          <p className="text-green-400 font-bold">
            ${coin.market_data?.current_price?.usd?.toLocaleString()}
          </p>
        </div>
        <div className="bg-surface2 p-4 rounded-lg">
          <p className="text-gray-400">Market Cap</p>
          <p>${coin.market_data?.market_cap?.usd?.toLocaleString()}</p>
        </div>
        <div className="bg-surface2 p-4 rounded-lg">
          <p className="text-gray-400">24h Volume</p>
          <p>${coin.market_data?.total_volume?.usd?.toLocaleString()}</p>
        </div>
        <div className="bg-surface2 p-4 rounded-lg">
          <p className="text-gray-400">Rank</p>
          <p>#{coin.market_cap_rank}</p>
        </div>
      </div>

      {/* Chart */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Chart</h2>
        <ChartCard key={id} initialCoin={id} />
      </div>

      {/* Description */}
      <div>
        <h2 className="text-xl font-semibold mb-2">About {coin.name}</h2>
        <p
          className="text-gray-300 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: coin.description?.en?.split(". ")[0] + ".",
          }}
        />
      </div>
    </div>
  );
}

