'use client';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { getPortfolio, removeFromPortfolio } from '../utils/portfolio';

export default function MyPortfolio() {
  const [items, setItems] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => setItems(getPortfolio());
    load();
    const handler = () => load();
    if (typeof window !== 'undefined') {
      window.addEventListener('portfolio:updated', handler);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('portfolio:updated', handler);
      }
    };
  }, []);

  useEffect(() => {
    async function fetchPrices() {
      if (!items || items.length === 0) {
        setLoading(false);
        return;
      }
      try {
        const ids = items.map((i) => i.coinId).join(',');
        const res = await fetch(
          `/api/coins/markets?vs_currency=usd&ids=${encodeURIComponent(ids)}&order=market_cap_desc&per_page=250&page=1&sparkline=false`
        );
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(`Failed to fetch portfolio prices: ${res.status} ${text}`);
        }
        const data = await res.json();
        const map = {};
        data.forEach((coin) => {
          map[coin.id] = coin;
        });
        setPrices(map);
      } catch (e) {
        console.error('Failed to load portfolio prices', e);
      } finally {
        setLoading(false);
      }
    }
    fetchPrices();
  }, [items]);

  const totalValue = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = prices[item.coinId]?.current_price || 0;
      return sum + price * Number(item.amount || 0);
    }, 0);
  }, [items, prices]);

  const handleRemove = (coinId) => {
    const updated = removeFromPortfolio(coinId);
    setItems(updated);
  };

  return (
    <div className="mt-6 bg-gray-800 rounded-2xl p-4 border border-gray-700/60 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-extrabold text-white border-l-4 border-emerald-500 pl-3">My Portfolio</h3>
        <div className="text-sm text-gray-300">${totalValue.toLocaleString()}</div>
      </div>

      {loading ? (
        <div className="py-6 text-center text-gray-400 text-sm">Loading...</div>
      ) : items.length === 0 ? (
        <div className="py-6 text-center text-gray-400 text-sm">No coins added yet.</div>
      ) : (
        <div className="space-y-3 max-h-72 overflow-auto pr-1">
          {items.map((item) => {
            const coin = prices[item.coinId];
            const price = coin?.current_price || 0;
            const value = price * Number(item.amount || 0);
            return (
              <div key={item.coinId} className="flex items-center justify-between bg-gray-700/50 hover:bg-gray-700 rounded-xl px-3 py-2 transition">
                <div className="flex items-center gap-2">
                  {coin?.image ? (
                    <Image src={coin.image} alt={coin?.name || item.coinId} width={20} height={20} className="rounded-full" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-gray-600" />)
                  }
                  <div>
                    <div className="text-sm text-white font-semibold">{coin?.name || item.coinId}</div>
                    <div className="text-xs text-gray-400">{Number(item.amount || 0)} @ ${price.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-bold text-emerald-400">${value.toLocaleString()}</div>
                  <button onClick={() => handleRemove(item.coinId)} className="text-xs text-gray-400 hover:text-red-400">Remove</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


