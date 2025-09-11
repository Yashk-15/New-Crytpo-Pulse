"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Navbar({ onSearch }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const itemRefs = useRef([]); // refs for dropdown items

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm.trim().length === 0) {
        setSearchResults([]);
        return;
      }

      try {
        const res = await fetch(`/api/search?query=${searchTerm}`);

        const data = await res.json();
        setSearchResults(data.coins || []);
        setHighlightedIndex(-1); // reset highlight
      } catch (err) {
        console.error("Search failed:", err);
      }
    };

    const debounce = setTimeout(fetchSearchResults, 400);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  // Scroll highlighted item into view
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

  const handleSelectCoin = (coingecko) => {
    setSearchTerm(coingecko.name); // fill input with coin name
    setSearchResults([]); // close dropdown
    setHighlightedIndex(-1);
    onSearch?.(coingecko.id); // send coin id to parent
    // Navigate to coin details page
    router.push(`/coingecko/${coingecko.id}`);
  };

  const handleKeyDown = (e) => {
    if (searchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : searchResults.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        handleSelectCoin(searchResults[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setSearchResults([]);
      setHighlightedIndex(-1);
    }
  };

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
            />
          </div>
          <span className="text-white font-bold text-xl">
            CRYPTO <span className="text-green-400">PULSE</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex items-center gap-2 justify-center">
          {["Discover", "Trending", "Liquidity", "About"].map((t) => (
            <button
              key={t}
              className={`px-3 py-1 rounded-full text-sm transition-colors
                ${
                  t === "Discover"
                    ? "bg-green-500 text-black font-semibold"
                    : "text-gray-300 hover:text-white hover:bg-surface2"
                }`}
            >
              {t}
            </button>
          ))}
        </nav>

        {/* Search + Actions */}
        <div className="flex items-center gap-3">
          {/* Search box */}
          <div className="relative">
            <input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                onSearch?.(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search coin"
              className="bg-gray-700 text-gray-200 px-3 py-2 pl-9 rounded-full text-sm 
                 border border-gray-600 focus:outline-none focus:ring-2 
                 focus:ring-green-400 placeholder-gray-400"
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

            {/* Dropdown with results */}
            {searchResults.length > 0 && (
              <ul className="absolute left-0 mt-2 w-full bg-gray-800 rounded-lg shadow-lg border border-gray-700 max-h-60 overflow-y-auto z-30">
                {searchResults.map((coin, index) => (
                  <li
                    key={coin.id}
                    ref={(el) => (itemRefs.current[index] = el)}
                    onClick={() => handleSelectCoin(coin)}
                    className={`px-3 py-2 text-sm flex items-center gap-2 cursor-pointer ${
                      index === highlightedIndex
                        ? "bg-green-600 text-white"
                        : "text-gray-200 hover:bg-gray-700"
                    }`}
                  >
                    <Image
                      src={coin.thumb}
                      alt={coin.name}
                      width={20}
                      height={20}
                      className="w-5 h-5 rounded-full"
                    />
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link href="/watchlist">
            <button
              className="px-4 py-2 rounded-full text-sm font-medium transition
    bg-gradient-to-r from-lime-700 via-lime-700 to-lime-700
    text-white shadow-md hover:shadow-lg"
            >
              Watchlist
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}