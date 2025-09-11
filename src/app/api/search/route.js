import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json({ coins: [] });
    }

    const res = await fetch(
      `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Accept: "application/json",
          "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
        },
        next: { revalidate: 60 }, // cache for 1 min
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch search results" },
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
