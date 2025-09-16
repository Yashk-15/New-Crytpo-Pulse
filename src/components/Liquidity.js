"use client";
import { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
  Cell,
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
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-surface2"></div>
          <div className="absolute top-0 animate-spin rounded-full h-16 w-16 border-4 border-accent-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger/10 border border-danger/20 rounded-2xl p-8 text-center backdrop-blur">
        <p className="text-danger font-semibold text-lg">⚠️ Error Loading Data</p>
        <p className="text-gray-400 text-sm mt-2">{error}</p>
      </div>
    );
  }

  if (!coin) return <p className="text-gray-400">Loading liquidity data...</p>;

  const volume = coin.market_data.total_volume.usd;
  let risk = { label: "High", color: "text-green-400", bgColor: "bg-green-400", value: 85 };
  if (volume < 500_000_000) {
    risk = { label: "Low", color: "text-red-400", bgColor: "bg-red-400", value: 25 };
  } else if (volume < 5_000_000_000) {
    risk = { label: "Medium", color: "text-yellow-400", bgColor: "bg-yellow-400", value: 55 };
  }

  // Prepare radial chart data for liquidity score
  const liquidityScoreData = [{
    name: 'Score',
    value: coin.liquidity_score || 0,
    fill: '#2CD493'
  }];

  return (
    <div className="w-auto space-y-6 mt-4">
      {/* Header Section with Dropdown */}
      <div className="bg-gradient-to-r from-surface2 via-surface2/95 to-surface2 rounded-2xl p-6 border border-border backdrop-blur relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl"></div>
        <div className="relative flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-txt bg-gradient-to-r from-txt to-accent-500 bg-clip-text text-transparent">
              Liquidity Analysis
            </h2>
            <p className="text-muted text-sm mt-1">Real-time market liquidity metrics</p>
          </div>
          <select
            value={selectedCoin}
            onChange={(e) => setSelectedCoin(e.target.value)}
            className="bg-surface/80 backdrop-blur hover:bg-surface2 transition-all w-56 py-3 px-4 rounded-xl font-medium shadow-xl focus:outline-none focus:ring-2 focus:ring-accent-500 cursor-pointer text-sm text-txt border border-border"
          >
            {coins.map((c) => (
              <option key={c.id} value={c.id} className="bg-surface">
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Key Metrics */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Volume Card with Gradient */}
          <div className="bg-gradient-to-br from-surface2 to-surface2/80 rounded-2xl p-6 border border-border relative overflow-hidden group hover:shadow-xl transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/10 rounded-full blur-2xl group-hover:bg-accent-500/20 transition-all"></div>
            <div className="relative">
              <p className="text-muted text-xs font-medium uppercase tracking-wider">24h Volume</p>
              <p className="text-accent-500 font-bold text-3xl mt-3">${formatVolume(volume)}</p>
              <div className="mt-4 flex items-center space-x-2">
                <div className="h-1 flex-1 bg-surface rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-accent-500 to-green-400 rounded-full transition-all"
                    style={{ width: `${Math.min((volume / 10000000000) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="text-xs text-muted">Global</span>
              </div>
            </div>
          </div>

          {/* Liquidity Score with Radial Chart */}
          <div className="bg-surface2 rounded-2xl p-6 border border-border">
            <p className="text-muted text-xs font-medium uppercase tracking-wider mb-4">Liquidity Score</p>
            <div className="flex items-center justify-center">
              <div className="relative">
                <ResponsiveContainer width={120} height={120}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" data={liquidityScoreData}>
                    <RadialBar dataKey="value" cornerRadius={10} fill="#2CD493" maxValue={100} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-accent-500">
                    {coin.liquidity_score?.toFixed(1) ?? "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Market Cap Rank */}
          <div className="bg-surface2 rounded-2xl p-8 border border-border hover:border-accent-500/30 transition-all">
            <p className="text-muted text-xs font-medium uppercase tracking-wider">Market Cap Rank</p>
            <div className="flex items-baseline mt-3">
              <span className="text-4xl font-bold text-txt">#{coin.market_cap_rank || "N/A"}</span>
              <span className="text-muted text-sm ml-2">Global</span>
            </div>
          </div>
        </div>

        {/* Center - Main Chart */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Trend Chart with Enhanced Design */}
          <div className="bg-surface2 rounded-2xl p-6 border border-border">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-txt text-lg font-semibold">24h Liquidity Trend</h3>
              <div className="flex space-x-2">
                <span className="px-3 py-1 bg-accent-500/10 text-accent-500 text-xs font-medium rounded-lg">
                  Live
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2CD493" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2CD493" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time" 
                  tick={{ fill: "#A0A1A1", fontSize: 10 }} 
                  axisLine={{ stroke: "#2a2b2a" }}
                />
                <YAxis 
                  tick={{ fill: "#A0A1A1", fontSize: 10 }} 
                  tickFormatter={formatVolume}
                  axisLine={{ stroke: "#2a2b2a" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(21, 22, 21, 0.95)",
                    border: "1px solid #2CD493",
                    borderRadius: "0.75rem",
                    color: "#EDEEEE",
                    backdropFilter: "blur(10px)"
                  }}
                  formatter={(value) => [`$${formatVolume(value)}`, "Volume"]}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#2CD493"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorVolume)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Assessment with Visual Indicator */}
          <div className="bg-gradient-to-r from-surface2 to-surface2/90 rounded-2xl p-6 border border-border">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-txt text-lg font-semibold">Liquidity Risk Assessment</h3>
                <p className="text-muted text-sm mt-1">Based on 24h trading volume analysis</p>
              </div>
              <div className="text-center">
                <div className={`relative inline-flex items-center justify-center w-24 h-24 rounded-full ${risk.bgColor}/10 border-2 border-${risk.bgColor}/30`}>
                  <span className={`font-bold text-lg ${risk.color}`}>{risk.label}</span>
                </div>
                <div className="mt-3 flex items-center space-x-1">
                  {[1,2,3,4,5].map((i) => (
                    <div 
                      key={i}
                      className={`h-2 w-4 rounded-full ${i <= risk.value/20 ? risk.bgColor : 'bg-surface'}`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top 5 Liquidity Coins */}
        <div className="bg-surface2 rounded-2xl p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4 text-txt flex items-center">
            <span className="w-1 h-6 bg-accent-500 rounded-full mr-3"></span>
            Top 5 Liquidity Coins
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topCoins} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <XAxis
                dataKey="name"
                tick={{ fill: "#A0A1A1", fontSize: 11 }}
                axisLine={{ stroke: "#2a2b2a" }}
              />
              <YAxis
                tick={{ fill: "#A0A1A1", fontSize: 11 }}
                axisLine={{ stroke: "#2a2b2a" }}
                tickFormatter={formatVolume}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(21, 22, 21, 0.95)",
                  border: "1px solid #2CD493",
                  borderRadius: "0.75rem",
                  color: "#EDEEEE",
                  backdropFilter: "blur(10px)"
                }}
                formatter={(value) => [`$${formatVolume(value)}`, "Volume"]}
              />
              <Bar dataKey="volume" fill="#2CD493" radius={[8, 8, 0, 0]}>
                {topCoins.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#2CD493' : '#2CD493AA'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Educational Card */}
        <div className="bg-gradient-to-br from-accent-500/10 to-surface2 rounded-2xl p-6 border border-accent-500/20">
          <div className="flex items-start space-x-3">
            <div className="text-3xl">🚀</div>
            <div className="flex-1">
              <h3 className="text-txt font-semibold text-lg mb-3">Why Liquidity Matters</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <p className="text-sm text-gray-300">
                    <span className="text-green-400 font-medium">High liquidity</span> = Stable prices & instant trades
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <p className="text-sm text-gray-300">
                    <span className="text-yellow-400 font-medium">Medium liquidity</span> = Some price impact expected
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <p className="text-sm text-gray-300">
                    <span className="text-red-400 font-medium">Low liquidity</span> = High slippage risk & volatility
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-surface2 via-accent-500/5 to-surface2 rounded-2xl p-4 border border-border">
        <div className="flex items-center space-x-3">
          <div className="text-accent-500">💡</div>
          <p className="text-gray-300 text-sm">
            <span className="font-medium text-txt">Pro tip:</span> Liquidity directly impacts your trading experience. Higher liquidity means you can enter and exit positions quickly without significantly affecting the market price.
          </p>
        </div>
      </div>
    </div>
  );
}

