// Generic skeleton card component :-

export const SkeletonCard = ({ className = "" }) => (
  <div className={`animate-pulse bg-surface2 rounded-xl p-4 border border-border ${className}`}>
    <div className="flex items-center space-x-4">
      <div className="rounded-full bg-surface h-10 w-10"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-surface rounded w-3/4"></div>
        <div className="h-3 bg-surface rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

// Skeleton for coin table rows :-

export const SkeletonTableRow = () => (
  <tr className="border-b border-gray-700">
    <td className="py-3 px-2">
      <div className="h-4 bg-surface rounded w-8 animate-pulse"></div>
    </td>
    <td className="py-3 px-2">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-surface animate-pulse"></div>
        <div className="space-y-1">
          <div className="h-4 bg-surface rounded w-20 animate-pulse"></div>
          <div className="h-3 bg-surface rounded w-12 animate-pulse"></div>
        </div>
      </div>
    </td>
    <td className="py-3 px-2 text-right">
      <div className="h-4 bg-surface rounded w-16 ml-auto animate-pulse"></div>
    </td>
    <td className="py-3 px-2 text-right">
      <div className="h-4 bg-surface rounded w-12 ml-auto animate-pulse"></div>
    </td>
    <td className="py-3 px-2 text-right">
      <div className="h-4 bg-surface rounded w-20 ml-auto animate-pulse"></div>
    </td>
  </tr>
);

// Skeleton for top coins grid :-
export const SkeletonTopCoin = () => (
  <div className="bg-surface rounded-xl shadow p-3 w-50 h-38 border border-border animate-pulse">
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="w-8 h-8 bg-surface2 rounded-full"></div>
      <div className="h-3 bg-surface2 rounded w-16"></div>
      <div className="h-2 bg-surface2 rounded w-8"></div>
      <div className="h-3 bg-surface2 rounded w-12"></div>
      <div className="h-2 bg-surface2 rounded w-10"></div>
    </div>
  </div>
);

// Skeleton for chart component :-
export const SkeletonChart = ({ height = 300 }) => (
  <div className="bg-gray-800 text-white p-6 rounded-2xl shadow-lg">
    <div className="flex items-center justify-between mb-6">
      <div className="h-6 bg-surface2 rounded w-20 animate-pulse"></div>
      <div className="flex gap-4">
        <div className="h-8 bg-surface2 rounded w-32 animate-pulse"></div>
        <div className="h-8 bg-surface2 rounded w-24 animate-pulse"></div>
      </div>
    </div>
    
    <div className="mb-5 space-y-2">
      <div className="h-4 bg-surface2 rounded w-24 animate-pulse"></div>
      <div className="h-8 bg-surface2 rounded w-32 animate-pulse"></div>
    </div>
    
    <div className="flex gap-2 mb-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-8 bg-surface2 rounded w-12 animate-pulse"></div>
      ))}
    </div>
    
    <div 
      className="bg-surface2 rounded animate-pulse" 
      style={{ height: `${height}px` }}
    ></div>
  </div>
);

// Skeleton for portfolio items :-
export const SkeletonPortfolioItem = () => (
  <div className="flex items-center justify-between bg-gray-700/50 rounded-xl px-3 py-2 animate-pulse">
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 rounded-full bg-surface"></div>
      <div className="space-y-1">
        <div className="h-3 bg-surface rounded w-16"></div>
        <div className="h-2 bg-surface rounded w-20"></div>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <div className="h-3 bg-surface rounded w-12"></div>
      <div className="h-2 bg-surface rounded w-10"></div>
    </div>
  </div>
);

// Skeleton for liquidity metrics :-
export const SkeletonLiquidityCard = () => (
  <div className="bg-surface2 rounded-2xl p-6 border border-border animate-pulse">
    <div className="space-y-4">
      <div className="h-6 bg-surface rounded w-32"></div>
      <div className="h-8 bg-surface rounded w-20"></div>
      <div className="h-2 bg-surface rounded w-full"></div>
    </div>
  </div>
);