import { NextResponse } from "next/server";

// In-memory cache for speedy search results

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 100;

// Cleaning up expired cache entries :-

function cleanupCache() {
  const now = Date.now();
  for (const [key, { timestamp }] of cache.entries()) {
    if (now - timestamp > CACHE_TTL) {
      cache.delete(key);
    }
  }
}

// Get cached result or null if finds search cache is expired/missing :-

function getCachedResult(query) {
  const cached = cache.get(query);
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.timestamp > CACHE_TTL) {
    cache.delete(query);
    return null;
  }
  
  return cached.data;
}

// Set cache with size limit
function setCachedResult(query, data) {
  // Clean up if cache is getting too large
  if (cache.size >= MAX_CACHE_SIZE) {
    const entries = Array.from(cache.entries());                      // Remove oldest entries
    entries.sort(([,a], [,b]) => a.timestamp - b.timestamp);
    
    const toRemove = Math.floor(MAX_CACHE_SIZE * 0.2);              // Remove 20% of oldest entries
    for (let i = 0; i < toRemove; i++) {
      cache.delete(entries[i][0]);
    }
  }
  
  cache.set(query, {
    data,
    timestamp: Date.now(),
  });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query || typeof query !== 'string') {    // Validate and sanitize input
      return NextResponse.json({ coins: [] });
    }

    const trimmedQuery = query.trim();
    if (trimmedQuery.length === 0) {
      return NextResponse.json({ coins: [] });
    }

    if (trimmedQuery.length > 50) {                // Limit query length to prevent abuse
      return NextResponse.json(
        { error: "Query too long" },
        { status: 400 }
      );
    }

    const cacheKey = trimmedQuery.toLowerCase();   // Check cache first
    const cachedResult = getCachedResult(cacheKey);
    
    if (cachedResult) {
      return NextResponse.json(cachedResult, {
        headers: {
          'Cache-Control': 'public, max-age=300', // 5 minutes browser cache
          'X-Cache': 'HIT'
        }
      });
    }

    // Clean up expired cache entries periodically
    if (Math.random() < 0.1) { // 10% chance
      cleanupCache();
    }

    // Make API request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(trimmedQuery)}`,
        {
          headers: {
            Accept: "application/json",
            ...(process.env.COINGECKO_API_KEY && { 
              "x-cg-demo-api-key": process.env.COINGECKO_API_KEY 
            }),
          },
          signal: controller.signal,
          next: { revalidate: 300 }, // 5 minutes Next.js cache
        }
      );

      clearTimeout(timeoutId);

      if (!res.ok) {
        if (res.status === 429) {                                  // Handle rate limiting gracefully
          return NextResponse.json(
            { error: "Too many requests. Please try again later." },
            { status: 429 }
          );
        }
        
        throw new Error(`CoinGecko API error: ${res.status}`);
      }

      const data = await res.json();
      const processedData = {
        coins: (data.coins || [])
          .slice(0, 10) // Limiting to top 10 results for better performance
          .map(coin => ({
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            thumb: coin.thumb || coin.large || coin.small || '/default-coin.png',
            market_cap_rank: coin.market_cap_rank
          }))
          .sort((a, b) => {
            const aExact = a.name.toLowerCase() === trimmedQuery.toLowerCase() ? 1000 : 0;  // Prioritize exact matches and higher market cap rank
            const bExact = b.name.toLowerCase() === trimmedQuery.toLowerCase() ? 1000 : 0;
            const aRank = a.market_cap_rank || 9999;
            const bRank = b.market_cap_rank || 9999;
            
            return (bExact - aExact) || (aRank - bRank);
          })
      };

      setCachedResult(cacheKey, processedData);

      return NextResponse.json(processedData, {
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=300',
          'X-Cache': 'MISS'
        }
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: "Request timeout" },
          { status: 408 }
        );
      }
      
      throw fetchError;
    }

  } catch (error) {
    console.error("Search API error:", error);
    
    return NextResponse.json(
      { 
        error: "Search temporarily unavailable",
        coins: [] // Return empty array to prevent UI breaks
      },
      { status: 500 }
    );
  }
}