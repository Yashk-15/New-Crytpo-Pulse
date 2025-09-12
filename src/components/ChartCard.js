"use client";
import { useEffect, useState, memo, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ChartCard({ initialCoin = "bitcoin", showDropdown = true }) {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(initialCoin);
  const [coinPrice, setCoinPrice] = useState(null);
  const [timeRange, setTimeRange] = useState("7"); // default: 7 days
  const [chartData, setChartData] = useState([]);
  const [currency, setCurrency] = useState("usd");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch coins for dropdown
  useEffect(() => {
    async function fetchCoins() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false"
        );
        const data = await res.json();
        setCoins(data);
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    }
    if (showDropdown) {
      fetchCoins();
    }
  }, [showDropdown]);

  // Fetch market chart + current price
  useEffect(() => {
    async function fetchChart() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `/api/coingecko/${selectedCoin}?days=${timeRange}&vs_currency=${currency}`
        );
        
        if (!res.ok) {
          throw new Error(`Failed to fetch chart data: ${res.status}`);
        }
        
        const data = await res.json();

        const prices = Array.isArray(data?.prices) ? data.prices : [];

        // conditional formatting of x-axis labels
        const formatted = prices.map(([timestamp, price]) => {
          const dateObj = new Date(timestamp);

          let label;
          if (timeRange === "0.04" || timeRange === "0.125") {
            // 1h or 3h -> show time
            label = dateObj.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
          } else if (timeRange === "1") {
            // 1 day -> show hours
            label = dateObj.toLocaleTimeString([], {
              hour: "2-digit",
            });
          } else {
            // 1w or 1m -> show date (MM/DD or DD Mon)
            label = dateObj.toLocaleDateString([], {
              month: "short",
              day: "numeric",
            });
          }

          return { date: label, price };
        });

        setChartData(formatted);

        if (prices.length > 0) {
          setCoinPrice(prices[prices.length - 1][1]);
        }
      } catch (error) {
        console.error("Error fetching chart:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (selectedCoin) fetchChart();
  }, [selectedCoin, timeRange, currency]);


  return (
    <div className="bg-gray-800 text-white p-6 rounded-2xl shadow-lg relative">
      {/* Title + Dropdown Row */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">CHART</h2>

        {/* Coin Selector - shifted to top right */}
        <div className="flex items-center gap-4 mb-4">
          {/* Coin Selector */}
          {showDropdown && (
            <select
              value={selectedCoin}
              onChange={(e) => setSelectedCoin(e.target.value)}
              className="bg-gray-700 hover:bg-gray-600 transition w-32 py-2 px-1 rounded-lg font-medium shadow-lg focus:outline-none focus:ring-4 focus:ring-green-400 cursor-pointer text-clip"
            >
              {coins.map((coin) => (
                <option key={coin.id} value={coin.id}>
                  {coin.name}
                </option>
              ))}
            </select>
          )}

          {/* Currency Selector */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-gray-700 hover:bg-gray-600 transition w-28 py-2 px-1 rounded-lg font-medium shadow-lg focus:outline-none focus:ring-4 focus:ring-green-400 cursor-pointer text-sm"
          >
            <option value="usd">USD</option>
            <option value="inr">INR</option>
            <option value="cny">CNY (Chinese Yuan)</option>
            <option value="rub">RUB (Russian Ruble)</option>
            <option value="eur">EUR (Euro)</option>
          </select>
        </div>
        </div>

  
      {/* Coin Info */}
      <div className="mb-5">
        <p className="text-gray-400 text-sm capitalize">
          {selectedCoin} / {currency.toUpperCase()}
        </p>
        <p className="text-3xl font-extrabold text-green-400">
          {coinPrice ? `${currency.toUpperCase()} ${coinPrice.toLocaleString()}` : "--"}
        </p>

      </div>
  
      {/* Time Range Buttons */}
      <div className="flex gap-2 mb-6">
        {[
          { label: "1H", value: "0.04" },
          { label: "3H", value: "0.125" },
          { label: "1D", value: "1" },
          { label: "1W", value: "7" },
          { label: "1M", value: "30" },
        ].map((range) => (
          <button
            key={range.value}
            onClick={() => setTimeRange(range.value)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
              timeRange === range.value
                ? "bg-green-500 text-white shadow-md"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="flex items-center justify-center h-64 text-red-400">
          Error loading chart: {error}
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 40, left: 1, bottom: 0 }} // 👈 left margin added
          >
            <XAxis
              dataKey="date"
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                borderRadius: "8px",
                border: "none",
                color: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default memo(ChartCard);






