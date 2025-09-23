// Enhanced watchlist utilities with better error handling

export const getWatchlist = () => {
  if (typeof window === "undefined") return [];
  
  try {
    const saved = localStorage.getItem("watchlist");
    if (!saved) return [];
    
    const parsed = JSON.parse(saved);
    // Ensure it's an array and filter out invalid entries
    return Array.isArray(parsed) 
      ? parsed.filter(id => id && typeof id === "string")
      : [];
  } catch (error) {
    console.error("Error reading watchlist from localStorage:", error);
    // Clean up corrupted data
    localStorage.removeItem("watchlist");
    return [];
  }
};

export const addToWatchlist = (coinId) => {
  if (typeof window === "undefined") return [];
  if (!coinId || typeof coinId !== "string") return getWatchlist();
  
  try {
    const current = getWatchlist();
    
    if (!current.includes(coinId)) {
      const updated = [...current, coinId];
      localStorage.setItem("watchlist", JSON.stringify(updated));
      
      // Verify the addition was successful
      const verification = getWatchlist();
      if (verification.includes(coinId)) {
        console.log(`✅ Successfully added ${coinId} to watchlist`);
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent("watchlist:updated", {
          detail: { 
            action: "add", 
            coinId, 
            watchlist: updated,
            timestamp: Date.now()
          }
        }));
        
        return updated;
      } else {
        throw new Error("Failed to add to watchlist");
      }
    }
    
    return current;
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    return getWatchlist();
  }
};

export const removeFromWatchlist = (coinId) => {
  if (typeof window === "undefined") return [];
  if (!coinId || typeof coinId !== "string") return getWatchlist();
  
  try {
    const current = getWatchlist();
    console.log(`Current watchlist before removing ${coinId}:`, current);
    
    if (!current.includes(coinId)) {
      console.log(`Coin ${coinId} not in watchlist, nothing to remove`);
      return current;
    }
    
    const updated = current.filter(id => id !== coinId);
    console.log(`Updated watchlist after filtering:`, updated);
    
    // Clear the entire item first to avoid any caching issues
    localStorage.removeItem("watchlist");
    
    // Set the new value (or leave empty if no items)
    if (updated.length > 0) {
      localStorage.setItem("watchlist", JSON.stringify(updated));
    }
    
    // Verify removal was successful
    const verification = getWatchlist();
    console.log(`Verification after removal:`, verification);
    
    if (verification.includes(coinId)) {
      throw new Error(`Failed to remove ${coinId} from watchlist`);
    }
    
    console.log(`✅ Successfully removed ${coinId} from watchlist`);
    
    // Dispatch event after successful removal
    window.dispatchEvent(new CustomEvent("watchlist:updated", {
      detail: { 
        action: "remove", 
        coinId, 
        watchlist: updated,
        timestamp: Date.now()
      }
    }));
    
    return updated;
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    throw error; // Re-throw so the calling code can handle it
  }
};

export const isInWatchlist = (coinId) => {
  try {
    const watchlist = getWatchlist();
    return watchlist.includes(coinId);
  } catch (error) {
    console.error("Error checking watchlist:", error);
    return false;
  }
};

export const clearWatchlist = () => {
  if (typeof window === "undefined") return [];
  
  try {
    localStorage.removeItem("watchlist");
    
    window.dispatchEvent(new CustomEvent("watchlist:updated", {
      detail: { 
        action: "clear", 
        watchlist: [],
        timestamp: Date.now()
      }
    }));
    
    return [];
  } catch (error) {
    console.error("Error clearing watchlist:", error);
    return [];
  }
};

export const getWatchlistCount = () => getWatchlist().length;

// Debug utility - use this to inspect localStorage issues
export const debugWatchlist = () => {
  try {
    const raw = localStorage.getItem("watchlist");
    const parsed = raw ? JSON.parse(raw) : null;
    
    console.log("=== WATCHLIST DEBUG ===");
    console.log("Raw localStorage value:", raw);
    console.log("Parsed value:", parsed);
    console.log("getWatchlist() result:", getWatchlist());
    console.log("=======================");
    
    return { raw, parsed, processed: getWatchlist() };
  } catch (error) {
    console.error("Debug error:", error);
    return { error: error.message };
  }
};