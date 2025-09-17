"use client";
import { useEffect, useState } from "react";
import { getWatchlist } from "@/utils/watchlist";
import Link from "next/link";
import Image from "next/image";

export default function WatchlistPage() {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const list = getWatchlist();
      if (list.length === 0) return;

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
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6">My Watchlist</h1>

      {coins.length === 0 ? (
        <p className="text-gray-400">No coins in your watchlist yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {coins.map((coin) => (
            <Link key={coin.id} href={`/coingecko/${coin.id}`}>
              <div className="bg-surface2 p-4 rounded-lg cursor-pointer hover:bg-surface3 transition flex items-center gap-3">
                <Image
                  src={coin.image?.small || "/placeholder-coin.svg"}
                  alt={coin.name}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <div>
                  <h2 className="font-bold">{coin.name}</h2>
                  <p className="text-sm text-gray-400">
                    {coin.symbol.toUpperCase()}
                  </p>
                  <p className="text-green-400">
                    ${coin.market_data?.current_price?.usd?.toLocaleString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
