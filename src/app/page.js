'use client';
import React from 'react';
import Navbar from '../components/Navbar';
import TopCoins from '../components/TopCoins';  

export default function Page() {
  return (
    <div>
      <Navbar />
      <TopCoins />
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="mt-6 grid grid-cols-12 gap-6">
          <aside className="col-span-12 lg:col-span-4">
            {/* reserved for sidebar widgets if needed */}
          </aside>
         
          <main className="col-span-12 lg:col-span-8 space-y-6">
          </main>
        </div>
      </div>
    </div>
  );
}


