import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const coinId = searchParams.get("id");
    const days = searchParams.get("days") || "1";

    if (!coinId) {
      return NextResponse.json(
        { error: "Coin ID is required" },
        { status: 400 }
      );
    }

    // Fetch coin details
    const coinRes = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}`,
      {
        headers: {
          Accept: "application/json",
          "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
        },
        next: { revalidate: 60 },
      }
    );

    if (!coinRes.ok) {
      return NextResponse.json(
        { error: `Failed to fetch coin data for ${coinId}` },
        { status: coinRes.status }
      );
    }

    const coinData = await coinRes.json();

    // Fetch market chart data for trend
    const chartRes = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
      {
        headers: {
          Accept: "application/json",
          "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
        },
        next: { revalidate: 60 },
      }
    );

    let chartData = null;
    if (chartRes.ok) {
      chartData = await chartRes.json();
    }

    // Fetch top coins by volume
    const topCoinsRes = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=5&page=1",
      {
        headers: {
          Accept: "application/json",
          "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
        },
        next: { revalidate: 60 },
      }
    );

    let topCoins = [];
    if (topCoinsRes.ok) {
      const topCoinsData = await topCoinsRes.json();
      topCoins = topCoinsData.map((c) => ({
        name: c.symbol.toUpperCase(),
        volume: c.total_volume,
      }));
    }

    return NextResponse.json({
      coin: coinData,
      chartData,
      topCoins,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}
