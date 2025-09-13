# API Key Setup Instructions

## Current Status
✅ **Fixed**: All components now use API routes with proper authentication
❌ **Missing**: You need to set up your CoinGecko API key

## What Was Fixed
- Created API routes for all CoinGecko endpoints
- Updated all components to use internal API routes instead of direct calls
- Centralized API key management in API routes

## Setup Your API Key

1. **Get a CoinGecko API Key**:
   - Visit: https://www.coingecko.com/en/api
   - Sign up for a free account
   - Generate an API key

2. **Create Environment File**:
   ```bash
   # Create .env.local file in your project root
   touch .env.local
   ```

3. **Add Your API Key**:
   ```bash
   # Add this line to .env.local
   COINGECKO_API_KEY=your_actual_api_key_here
   ```

4. **Restart Your Development Server**:
   ```bash
   npm run dev
   ```

## Benefits of This Setup
- ✅ **Rate Limit Protection**: API routes handle rate limiting
- ✅ **Caching**: 1-minute cache on all API calls
- ✅ **Error Handling**: Centralized error handling
- ✅ **Security**: API key never exposed to client-side
- ✅ **Consistency**: All components use the same API architecture

## Files Updated
- `src/app/api/coins/markets/route.js` - New market data API
- `src/app/api/coins/liquidity/route.js` - New liquidity data API
- `src/components/TopCoins.js` - Updated to use API routes
- `src/components/ChartCard.js` - Updated to use API routes
- `src/components/CoinsTable.js` - Updated to use API routes
- `src/components/Liquidity.js` - Updated to use API routes

## Without API Key
Your app will still work but with:
- Strict rate limits (10-30 calls/minute)
- Potential "Failed to fetch" errors
- Slower response times

## With API Key
- Higher rate limits (up to 100 calls/minute)
- More reliable API access
- Better performance
