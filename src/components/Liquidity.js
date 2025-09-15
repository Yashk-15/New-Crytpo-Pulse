"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function LiquidityCard({ coinId = "bitcoin" }) {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(coinId);
  const [coin, setCoin] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [topCoins, setTopCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setSelectedCoin(coinId);
  }, [coinId]);

  useEffect(() => {
    async function fetchCoins() {
      try {
        const res = await fetch(
          "/api/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1"
        );
        const data = await res.json();
        setCoins(data);
      } catch (err) {
        setError("Failed to load coin list");
      }
    }
    fetchCoins();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCoin) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/coins/liquidity?id=${selectedCoin}&days=1`);
        if (!res.ok) throw new Error(`Failed to fetch liquidity data: ${res.status}`);
        const json = await res.json();

        setCoin(json.coin);

        if (json.chartData?.total_volumes) {
          const formatted = json.chartData.total_volumes.map(([time, vol]) => ({
            time: new Date(time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            volume: vol,
          }));
          setTrendData(formatted);
        }

        setTopCoins(json.topCoins || []);
      } catch (err) {
        setError(err.message || "Failed to load liquidity data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCoin]);

  const formatVolume = (num) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toFixed(0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger/10 border border-danger/20 rounded-xl p-6 text-center">
        <p className="text-danger font-medium">Error Loading Data</p>
        <p className="text-gray-400 text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!coin) return <p className="text-gray-400">Loading liquidity data...</p>;

  const volume = coin.market_data.total_volume.usd;
  let risk = { label: "High", color: "text-green-400" };
  if (volume < 500_000_000) risk = { label: "Low", color: "text-red-400" };
  else if (volume < 5_000_000_000) risk = { label: "Medium", color: "text-yellow-400" };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
      {/* Left Side – Top 5 Liquidity Coins */}
      <div className="md:col-span-1 bg-surface2 rounded-xl p-3 border border-border">

  <h2 className="text-md font-semibold mb-2 text-txt border-l-4 border-accent-500 pl-2">
    Top 5 Liquidity Coins
  </h2>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={topCoins} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <XAxis
                dataKey="name"
                tick={{ fill: "#A0A1A1", fontSize: 11 }}
                axisLine={{ stroke: "#A0A1A1" }}
              />
              <YAxis
                tick={{ fill: "#A0A1A1", fontSize: 11 }}
                axisLine={{ stroke: "#A0A1A1" }}
                tickFormatter={formatVolume}
              />
              <Tooltip
                contentStyle={{
                  background: "#151615",
                  border: "1px solid #A0A1A1",
                  borderRadius: "0.5rem",
                  color: "#EDEEEE",
                }}
                formatter={(value) => [`$${formatVolume(value)}`, "Volume"]}
              />
              <Bar dataKey="volume" fill="#2CD493" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right Side – All Other Components */}
      <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dropdown */}
        <div className="col-span-full bg-surface2 rounded-xl p-4 border border-border flex justify-between items-center">
          <h2 className="text-xl font-semibold text-txt">Liquidity Analysis</h2>
          <select
            value={selectedCoin}
            onChange={(e) => setSelectedCoin(e.target.value)}
            className="bg-surface hover:bg-surface2 transition-colors w-48 py-2 px-3 rounded-lg font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-accent-500 cursor-pointer text-sm text-txt border border-border"
          >
            {coins.map((c) => (
              <option key={c.id} value={c.id} className="bg-surface">
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Definition */}
        <div className="col-span-full bg-surface2 rounded-xl p-4 border border-border">
          <p className="text-gray-300">
            💡 Liquidity shows how easily a coin can be traded without large price swings.
          </p>
        </div>

        {/* Metrics */}
        <div className="bg-surface2 rounded-xl border border-border flex flex-col items-center justify-center h-40">
          <p className="text-muted text-xs font-medium">24h Volume</p>
          <p className="text-accent-500 font-bold text-lg mt-2">${formatVolume(volume)}</p>
        </div>
        <div className="bg-surface2 rounded-xl border border-border flex flex-col items-center justify-center h-40">
          <p className="text-muted text-xs font-medium">Market Cap Rank</p>
          <p className="text-accent-500 font-bold text-lg mt-2">
            #{coin.market_cap_rank || "N/A"}
          </p>
        </div>
        <div className="bg-surface2 rounded-xl border border-border flex flex-col items-center justify-center h-40">
          <p className="text-muted text-xs font-medium">Liquidity Score</p>
          <p className="text-accent-500 font-bold text-lg mt-2">
            {coin.liquidity_score?.toFixed(2) ?? "N/A"}
          </p>
        </div>

        {/* Line Chart */}
        <div className="col-span-full lg:col-span-2 bg-surface2 rounded-xl p-6 border border-border h-80">
          <p className="text-txt text-sm font-medium mb-4">24h Liquidity Trend</p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <XAxis dataKey="time" tick={{ fill: "#A0A1A1", fontSize: 10 }} />
              <YAxis tick={{ fill: "#A0A1A1", fontSize: 10 }} tickFormatter={formatVolume} />
              <Tooltip
                contentStyle={{
                  background: "#151615",
                  border: "1px solid #A0A1A1",
                  borderRadius: "0.5rem",
                  color: "#EDEEEE",
                }}
                formatter={(value) => [`$${formatVolume(value)}`, "Volume"]}
              />
              <Line
                type="monotone"
                dataKey="volume"
                stroke="#2CD493"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#2CD493" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Risk */}
        <div className="bg-surface2 rounded-xl border border-border flex justify-between items-center p-6 h-40">
          <div>
            <p className="text-txt text-sm font-medium">Liquidity Risk Assessment</p>
            <p className="text-muted text-xs mt-1">Based on 24h trading volume</p>
          </div>
          <div className="text-right">
            <span className={`font-bold text-lg ${risk.color}`}>{risk.label} Liquidity</span>
            <div
              className={`w-3 h-3 rounded-full mt-1 ml-auto ${risk.color.replace("text-", "bg-")}`}
            ></div>
          </div>
        </div>

        {/* Tip */}
        <div className="col-span-full bg-surface2 rounded-xl p-6 border border-border">
          <div className="flex items-start space-x-3">
            <div className="text-accent-500 text-xl">💡</div>
            <div>
              <p className="text-txt font-medium">Why liquidity matters?</p>
              <div className="text-muted text-sm mt-2 space-y-1">
                <p>
                  • <span className="text-green-400 font-medium">High liquidity</span> = stable
                  prices + faster execution
                </p>
                <p>
                  • <span className="text-yellow-400 font-medium">Medium liquidity</span> = moderate
                  price impact
                </p>
                <p>
                  • <span className="text-red-400 font-medium">Low liquidity</span> = higher risk of
                  slippage
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

