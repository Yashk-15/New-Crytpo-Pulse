export const API_CONFIG = {
  COINGECKO_BASE_URL: 'https://api.coingecko.com/api/v3',
  CACHE_TIME: {
    MARKETS: 60,
    CHARTS: 300,
    SEARCH: 120,
    COIN_DETAILS: 180,
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 250,
  },
  RATE_LIMIT: {
    REQUESTS_PER_HOUR: 100,
    WINDOW_SIZE: '1h',
  }
};

export const CHART_CONFIG = {
  TIME_RANGES: [
    { label: "1H", value: "0.04" },
    { label: "3H", value: "0.125" },
    { label: "1D", value: "1" },
    { label: "1W", value: "7" },
    { label: "1M", value: "30" },
  ],
  CURRENCIES: [
    { value: "usd", label: "USD" },
    { value: "inr", label: "INR" },
    { value: "cny", label: "CNY" },
    { value: "rub", label: "RUB" },
    { value: "eur", label: "EUR" },
  ],
  DEFAULT_HEIGHT: 300,
  COLORS: {
    PRIMARY: "#22c55e",
    GRADIENT_START: "#2CD493",
    GRADIENT_END: "#22c55e",
  }
};

export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300,
  LOADER_TIMEOUT: 2000,
  ANIMATION_DURATION: 200,
  MAX_SEARCH_RESULTS: 10,
};

export const STORAGE_KEYS = {
  WATCHLIST: 'watchlist',
  PORTFOLIO: 'portfolio',
  THEME: 'theme',
  CURRENCY: 'preferred_currency',
};