import { useState, useEffect, useCallback, useRef } from 'react';

// Custom hook for fetching coin data with caching and error handling :-

export const useCoinData = (coinId, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (!coinId) {
      setData(null);
      setLoading(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (options.days) queryParams.append('days', options.days);
      if (options.vs_currency) queryParams.append('vs_currency', options.vs_currency);

      const url = `/api/coingecko/${coinId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to fetch coin data');
        console.error('Coin data fetch error:', err);
      }
    } finally {
      if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
        setLoading(false);
      }
    }
  }, [coinId, options.days, options.vs_currency]);

  useEffect(() => {
    fetchData();
    
    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { data, loading, error, refetch: fetchData };
};

// Hook for fetching multiple coins data :-
export const useCoinsData = (coinIds = [], options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!coinIds.length) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        vs_currency: options.vs_currency || 'usd',
        ids: coinIds.join(','),
        order: 'market_cap_desc',
        per_page: coinIds.length,
        page: 1,
        sparkline: false,
        ...options
      });

      const response = await fetch(`/api/coins/markets?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch coins data');
      console.error('Coins data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [coinIds, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};