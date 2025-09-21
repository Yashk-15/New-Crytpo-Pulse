import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const vs_currency = searchParams.get("vs_currency") || "usd";
    const order = searchParams.get("order") || "market_cap_desc";
    const per_page = searchParams.get("per_page") || "20";
    const page = searchParams.get("page") || "1";
    const sparkline = searchParams.get("sparkline") || "false";

    const endpoint = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs_currency}&order=${order}&per_page=${per_page}&page=${page}&sparkline=${sparkline}`;

    const res = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
        "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
      },
      next: { revalidate: 60 }, // to ensure caching is for 1 minute
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch market data" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}
