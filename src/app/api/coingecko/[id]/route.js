// app/api/coins/[id]/route.js
import { NextResponse } from "next/server";

export async function GET(request, context) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);

    const days = searchParams.get("days");
    const vs_currency = searchParams.get("vs_currency") || "usd"; // 👈 default to usd

    // If a days param is provided, return market chart data which includes `prices`
    const endpoint = days
      ? `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${encodeURIComponent(
          vs_currency
        )}&days=${encodeURIComponent(days)}`
      : `https://api.coingecko.com/api/v3/coins/${id}?vs_currency=${encodeURIComponent(
          vs_currency
        )}`;

    const res = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
        "x-cg-demo-api-key": process.env.COINGECKO_API_KEY, // ✅ API key from env
      },
      next: { revalidate: 60 }, // caching
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch data for ${id}` },
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


  