// Format price with proper currency and decimal places :-
export const formatPrice = (price, currency = 'USD') => {
  if (price === null || price === undefined || isNaN(price)) return '--';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: price < 1 ? 6 : 2,
    maximumFractionDigits: price < 1 ? 6 : 2,
  }).format(price);
};

// Format large numbers with K, M, B suffixes :-
export const formatVolume = (volume) => {
  if (volume === null || volume === undefined || isNaN(volume)) return '--';
  
  const billion = 1e9;
  const million = 1e6;
  const thousand = 1e3;

  if (volume >= billion) {
    return `${(volume / billion).toFixed(1)}B`;
  } else if (volume >= million) {
    return `${(volume / million).toFixed(1)}M`;
  } else if (volume >= thousand) {
    return `${(volume / thousand).toFixed(1)}K`;
  }
  return volume.toFixed(0);
};

// Format percentage with proper color coding :-
export const formatPercentage = (percentage, includeSign = true) => {
  if (percentage === null || percentage === undefined || isNaN(percentage)) return '--';
  
  const sign = includeSign && percentage > 0 ? '+' : '';
  return `${sign}${Number(percentage).toFixed(2)}%`;
};

// Format market cap rank :-
export const formatRank = (rank) => {
  if (!rank) return 'N/A';
  return `#${rank}`;
};

// Format timestamp for charts :-
export const formatChartTimestamp = (timestamp, timeRange) => {
  const dateObj = new Date(timestamp);
  
  if (timeRange === "0.04" || timeRange === "0.125") {
    // 1h or 3h -> show time
    return dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (timeRange === "1") {
    // 1 day -> show hours
    return dateObj.toLocaleTimeString([], {
      hour: "2-digit",
    });
  } else {
    // 1w or 1m -> show date
    return dateObj.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  }
};

// Get color based on percentage change
export const getChangeColor = (change) => {
  if (change > 0) return 'text-green-400';
  if (change < 0) return 'text-red-400';
  return 'text-gray-400';
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};