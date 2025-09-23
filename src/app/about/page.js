'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "../../components/Navbar";
import About from "../../components/About";

export default function AboutPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('hasVisitedApp');
    
    if (!hasVisited) {
      // First time visitor - show about page for 5 seconds then redirect
      localStorage.setItem('hasVisitedApp', 'true');
      
      const timer = setTimeout(() => {
        router.push('/discover');
      }, 5000); // 5 seconds to read about page

      return () => clearTimeout(timer);
    } else {
      // Returning user - redirect immediately to discover
      router.push('/discover');
    }
  }, [router]);

  return (
    <div>
      <Navbar />
      <About />
      
      {/* Add a countdown or skip button for better UX */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => router.push('/discover')}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          <span>Skip to Discover</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
