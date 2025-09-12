"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import ChartCard from "@/components/ChartCard";
import {
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
} from "@/utils/watchlist";
import { addToPortfolio } from "@/utils/portfolio";

export default function CoinPage() {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    const fetchCoinDetails = async () => {
      try {
        const res = await fetch(`/api/coingecko/${id}`);
        const data = await res.json();
        setCoin(data);
      } catch (err) {
        console.error("Failed to load coin details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinDetails();
    setInWatchlist(isInWatchlist(id));
  }, [id]);

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(id);
      setInWatchlist(false);
    } else {
      addToWatchlist(id);
      setInWatchlist(true);
    }
  };

  const handleAddToPortfolio = () => {
    const parsed = Number(amount);
    if (!parsed || parsed <= 0) {
      setSaveMsg("Enter a valid amount");
      return;
    }
    setSaving(true);
    try {
      addToPortfolio(id, parsed);
      setSaveMsg("Added to portfolio");
      setAmount("");
    } catch (e) {
      console.error("Failed to add to portfolio", e);
      setSaveMsg("Failed to add");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 2000);
    }
  };

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
          src={coin.image?.small || "/placeholder-coin.svg"}
          alt={coin.name}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full"
        />
        <h1 className="text-2xl font-bold">
          {coin.name} ({coin.symbol.toUpperCase()})
        </h1>

        {/* ✅ Watchlist Button */}
        <button
          onClick={handleWatchlistToggle}
          className={`ml-auto px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200
    ${inWatchlist
              ? "bg-red-500/80 hover:bg-red-600 text-white"
              : "bg-emerald-500/80 hover:bg-emerald-600 text-white"
            }`}
        >
          {inWatchlist ? "− Watchlist" : "+ Watchlist"}
        </button>

      </div>

      {/* Add to Portfolio */}
      <div className="flex items-center gap-3 bg-surface2 p-4 rounded-lg">
        <label className="text-sm text-gray-300">Amount owned</label>
        <input
          type="number"
          min="0"
          step="any"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 0.25"
          className="bg-gray-800 text-white text-sm px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 w-40"
        />
        <button
          onClick={handleAddToPortfolio}
          disabled={saving}
          className="px-3 py-2 rounded-md text-sm font-medium bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60"
        >
          {saving ? "Saving..." : "+ Portfolio"}
        </button>
        {saveMsg && <span className="text-xs text-gray-400 ml-2">{saveMsg}</span>}
      </div>

      {/* Market Info */}
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
        <ChartCard key={id} initialCoin={id} showDropdown={false} />
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


