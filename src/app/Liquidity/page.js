'use client';
import Navbar from '../../components/Navbar';
import Liquidity from '../../components/Liquidity';

export default function LiquidityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-950">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <Liquidity />
      </div>
    </div>
  );
}

