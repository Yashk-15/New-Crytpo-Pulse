// utils/watchlist.js

export const getWatchlist = () => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("watchlist");
    return saved ? JSON.parse(saved) : [];
  };
  
  export const addToWatchlist = (coinId) => {
    const current = getWatchlist();
    if (!current.includes(coinId)) {
      const updated = [...current, coinId];
      localStorage.setItem("watchlist", JSON.stringify(updated));
      return updated;
    }
    return current;
  };
  
  export const removeFromWatchlist = (coinId) => {
    const current = getWatchlist();
    const updated = current.filter((id) => id !== coinId);
    localStorage.setItem("watchlist", JSON.stringify(updated));
    return updated;
  };
  
  export const isInWatchlist = (coinId) => {
    return getWatchlist().includes(coinId);
  };
  