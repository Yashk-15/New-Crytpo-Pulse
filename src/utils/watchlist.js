// Enhanced watchlist utilities

export const getWatchlist = () => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("watchlist");
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed)
      ? parsed.filter(id => id && typeof id === "string")
      : [];
  } catch (error) {
    localStorage.removeItem("watchlist");
    return [];
  }
};

export const addToWatchlist = (coinId) => {
  if (typeof window === "undefined") return [];
  try {
    const current = getWatchlist();
    if (!current.includes(coinId)) {
      const updated = [...current, coinId];
      localStorage.setItem("watchlist", JSON.stringify(updated));
      // Verify
      const verification = getWatchlist();
      if (verification.includes(coinId)) {
        window.dispatchEvent(
          new CustomEvent("watchlist:updated", {
            detail: { action: "add", coinId, watchlist: updated }
          })
        );
        return updated;
      }
    }
    return current;
  } catch (error) {
    return getWatchlist();
  }
};

export const removeFromWatchlist = (coinId) => {
  if (typeof window === "undefined") return [];
  try {
    const current = getWatchlist();
    const updated = current.filter(id => id !== coinId);
    // Force clear then set
    localStorage.removeItem("watchlist");
    if (updated.length > 0)
      localStorage.setItem("watchlist", JSON.stringify(updated));

    // Verify removal
    const finalCheck = getWatchlist();
    if (!finalCheck.includes(coinId)) {
      window.dispatchEvent(
        new CustomEvent("watchlist:updated", {
          detail: { action: "remove", coinId, watchlist: updated }
        })
      );
    }
    return updated;
  } catch (error) {
    return getWatchlist();
  }
};

export const isInWatchlist = (coinId) => {
  try {
    const watchlist = getWatchlist();
    return watchlist.includes(coinId);
  } catch {
    return false;
  }
};

export const clearWatchlist = () => {
  if (typeof window === "undefined") return [];
  try {
    localStorage.removeItem("watchlist");
    window.dispatchEvent(
      new CustomEvent("watchlist:updated", {
        detail: { action: "clear", watchlist: [] }
      })
    );
    return [];
  } catch {
    return [];
  }
};

export const getWatchlistCount = () => getWatchlist().length;

export const refreshWatchlist = () => {
  try {
    const current = getWatchlist();
    window.dispatchEvent(
      new CustomEvent("watchlist:updated", {
        detail: { action: "refresh", watchlist: current }
      })
    );
    return current;
  } catch {
    return [];
  }
};

export const inspectWatchlistStorage = () => {
  try {
    const raw = localStorage.getItem("watchlist");
    const parsed = raw ? JSON.parse(raw) : null;
    return { raw, parsed };
  } catch {
    return { raw: null, parsed: null };
  }
};
