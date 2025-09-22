"use client";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Custom hook for debounced search with caching :-

function useOptimizedSearch(searchTerm, delay = 300) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Cache for search results :-

  const cache = useRef(new Map());
  const abortController = useRef(null);

  const debouncedSearch = useCallback(
    async (term) => {
      const trimmedTerm = term.trim();
      
      if (!trimmedTerm) {
        setResults([]);
        setLoading(false);
        return;
      }

      // Checking cache first :-
      if (cache.current.has(trimmedTerm)) {
        setResults(cache.current.get(trimmedTerm));
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      if (abortController.current) {
        abortController.current.abort();
      }

      abortController.current = new AbortController();

      try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(trimmedTerm)}`, {
          signal: abortController.current.signal,
        });

        if (!response.ok) {
          throw new Error(`Search failed: ${response.status}`);
        }

        const data = await response.json();
        const limitedResults = (data.coins || []).slice(0, 10);  //only 10 coins
        
        // Cache the results
        cache.current.set(trimmedTerm, limitedResults);
        
        // Clean cache if it gets too large :-
        if (cache.current.size > 50) {
          const firstKey = cache.current.keys().next().value;
          cache.current.delete(firstKey);
        }

        setResults(limitedResults);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSearch(searchTerm);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [searchTerm, delay, debouncedSearch]);

  return { results, loading, error };
}

// virtual dropdown component for better performance with large lists :-
function SearchDropdown({ 
  results, 
  loading, 
  error, 
  onSelect, 
  highlightedIndex, 
  itemRefs 
}) {
  if (loading) {
    return (
      <div className="absolute left-0 mt-2 w-full bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-30 p-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
          <span className="text-gray-300 text-sm">Searching...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute left-0 mt-2 w-full bg-gray-800 rounded-lg shadow-lg border border-red-500 z-30 p-4">
        <div className="text-red-400 text-sm text-center">
          Search failed. Please try again.
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <ul className="absolute left-0 mt-2 w-full bg-gray-800 rounded-lg shadow-lg border border-gray-700 max-h-60 overflow-y-auto z-30">
      {results.map((coin, index) => (
        <li
          key={coin.id}
          ref={(el) => (itemRefs.current[index] = el)}
          onClick={() => onSelect(coin)}
          className={`px-3 py-2 text-sm flex items-center gap-2 cursor-pointer transition-colors ${
            index === highlightedIndex
              ? "bg-green-600 text-white"
              : "text-gray-200 hover:bg-gray-700"
          }`}
        >
          <div className="relative w-5 h-5 flex-shrink-0">
            <Image
              src={coin.thumb}
              alt={coin.name}
              fill
              sizes="20px"
              className="rounded-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="truncate">
            <span className="font-medium">{coin.name}</span>
            <span className="text-gray-400 ml-1">({coin.symbol.toUpperCase()})</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Navbar({ onSearch }) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const itemRefs = useRef([]);
  const searchInputRef = useRef(null);

  // Using optimized search hook :-
  const { results: searchResults, loading, error } = useOptimizedSearch(searchTerm);

  // Memoize navigation items to prevent re-renders
  const navigationItems = useMemo(() => [
    { label: "About", path: "/" },
    { label: "Discover", path: "/discover" },
    { label: "Liquidity", path: "/Liquidity" },
  ], []);

  // Handle search input changes
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setHighlightedIndex(-1);
    setIsDropdownOpen(value.trim().length > 0);
    onSearch?.(value);
  }, [onSearch]);

  // Optimized coin selection with faster navigation
  const handleSelectCoin = useCallback((coin) => {
    setSearchTerm(coin.name);
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
    onSearch?.(coin.id);
    
    // Use replace for faster navigation and better UX
    router.replace(`/coingecko/${coin.id}`);
  }, [router, onSearch]);

  // Keyboard navigation :-
  const handleKeyDown = useCallback((e) => {
    if (!isDropdownOpen || searchResults.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && searchResults[highlightedIndex]) {
          handleSelectCoin(searchResults[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
        searchInputRef.current?.blur();
        break;
    }
  }, [isDropdownOpen, searchResults, highlightedIndex, handleSelectCoin]);

  // Auto-scroll highlighted :-
  useEffect(() => {
    if (
      highlightedIndex >= 0 &&
      itemRefs.current[highlightedIndex]
    ) {
      itemRefs.current[highlightedIndex].scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [highlightedIndex]);

  // Close dropdown when clicking outside :-
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-bg/80 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3">
          <div className="w-[90px] h-[90px] flex items-center justify-center">
            <Image
              src="/Print.svg"
              alt="Crypto Pulse"
              width={90}
              height={90}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <span className="text-white font-bold text-xl">
            CRYPTO <span className="text-green-400">PULSE</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex items-center gap-2 justify-center">
          {navigationItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.label} href={item.path} prefetch={true}>
                <button
                  className={`px-3 py-1 rounded-full text-sm transition-colors
                    ${isActive
                      ? "bg-green-500 text-black font-semibold"
                      : "text-gray-300 hover:text-white hover:bg-surface2"
                    }`}
                >
                  {item.label}
                </button>
              </Link>
            );
          })}
        </nav>

        {/* Search + Actions */}
        <div className="flex items-center gap-3">
          {/* Enhanced search box */}
          <div className="relative">
            <input
              ref={searchInputRef}
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              placeholder="Search coin..."
              autoComplete="off"
              spellCheck="false"
              className="bg-gray-700 text-gray-200 px-3 py-2 pl-9 rounded-full text-sm 
                 border border-gray-600 focus:outline-none focus:ring-2 
                 focus:ring-green-400 placeholder-gray-400 transition-all
                 w-48 focus:w-56"
            />
            
            {/* Search icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 13.65z"
              />
            </svg>

            {/* Clear button */}
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setIsDropdownOpen(false);
                  searchInputRef.current?.focus();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}

            {/* dropdown */}
            {isDropdownOpen && (
              <SearchDropdown
                results={searchResults}
                loading={loading}
                error={error}
                onSelect={handleSelectCoin}
                highlightedIndex={highlightedIndex}
                itemRefs={itemRefs}
              />
            )}
          </div>

          <Link href="/watchlist" prefetch={true}>
            <button
              className="px-4 py-2 rounded-full text-sm font-medium transition-all
                bg-gradient-to-r from-lime-700 via-lime-700 to-lime-700
                text-white shadow-md hover:shadow-lg hover:scale-105"
            >
              Watchlist
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}