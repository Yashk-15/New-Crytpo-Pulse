"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function LiquidityCard({ coinId }) {
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}`
      );
      const json = await res.json();
      setData(json);

      // Prepare chart from market chart endpoint
      const chartRes = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`
      );
      const chartJson = await chartRes.json();

      const formatted = chartJson.total_volumes.map(([time, vol]) => ({
        time: new Date(time).toLocaleDateString(),
        volume: vol,
      }));

      setChartData(formatted);
    };

    fetchData();
  }, [coinId]);

  if (!data) return <p className="text-gray-400">Loading liquidity data...</p>;

  return (
    <div className="bg-surface2 rounded-2xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-green-400">
        {data.name} Liquidity Overview
      </h2>

      {/* 📘 Definition */}
      <p className="text-gray-300 mb-6">
        Liquidity refers to how easily an asset can be bought or sold in the
        market without affecting its price. Higher liquidity means smoother
        trades, tighter spreads, and lower volatility.
      </p>

      {/* 📊 Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
        <div className="p-4 bg-surface rounded-xl">
          <p className="text-gray-400 text-sm">24h Volume</p>
          <p className="text-green-400 font-bold">
            ${data.market_data.total_volume.usd.toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-surface rounded-xl">
          <p className="text-gray-400 text-sm">Market Cap Rank</p>
          <p className="text-green-400 font-bold">#{data.market_cap_rank}</p>
        </div>
        <div className="p-4 bg-surface rounded-xl">
          <p className="text-gray-400 text-sm">Status</p>
          <p
            className={`font-bold ${
              data.liquidity_score > 0.5 ? "text-green-400" : "text-red-400"
            }`}
          >
            {data.liquidity_score > 0.5 ? "High" : "Low"}
          </p>
        </div>
      </div>

      {/* 📈 Chart */}
      <div className="bg-surface rounded-xl p-4 mb-6">
        <p className="text-gray-400 text-sm mb-2">7D Trading Volume</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="time" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
              <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1E293B",
                  borderRadius: "0.5rem",
                  border: "none",
                }}
                labelStyle={{ color: "#E5E7EB" }}
              />
              <Line
                type="monotone"
                dataKey="volume"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🚦 Risk Indicator */}
      <div>
        <p className="text-gray-400 text-sm mb-1">Risk Indicator</p>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400"
            style={{
              width: `${Math.min(data.liquidity_score * 100, 100)}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

