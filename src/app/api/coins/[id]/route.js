import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);

    const days = searchParams.get("days");
    const vs_currency = searchParams.get("vs_currency") || "usd";

    const endpoint = days
      ? `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${encodeURIComponent(vs_currency)}&days=${encodeURIComponent(days)}`
      : `https://api.coingecko.com/api/v3/coins/${id}?vs_currency=${encodeURIComponent(vs_currency)}`;

    const headers = {
      Accept: "application/json",
      ...(process.env.COINGECKO_API_KEY && { "x-cg-demo-api-key": process.env.COINGECKO_API_KEY }),
    };

    const res = await fetch(endpoint, {
      headers,
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      let errorMsg = `Failed to fetch data for ${id}`;
      try {
        const errorBody = await res.json();
        if (errorBody.error) errorMsg += `: ${errorBody.error}`;
      } catch {}
      return NextResponse.json({ error: errorMsg }, { status: res.status });
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