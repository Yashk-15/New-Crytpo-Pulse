"use client";
import Liquidity from "../../components/Liquidity";
import Navbar from "../../components/Navbar";

export default function LiquidityPage() {
  return (
    <div>
      <Navbar />

      <div className="mx-auto max-w-7xl py-5">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent mb-6">
          Liquidity
        </h1>

        {/* Show Bitcoin by default */}
        <Liquidity coinId="bitcoin" />
      </div>
    </div>
  );
}

