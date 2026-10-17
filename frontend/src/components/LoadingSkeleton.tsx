import React from 'react';

export function EventCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0F1117] overflow-hidden animate-pulse">
      <div className="h-48 bg-[#151822] w-full" />
      <div className="p-5 space-y-4">
        <div className="h-6 bg-[#151822] rounded-md w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-[#151822] rounded-md w-1/2" />
          <div className="h-4 bg-[#151822] rounded-md w-2/3" />
        </div>
        <div className="pt-4 border-t border-white/[0.08] grid grid-cols-2 gap-3">
          <div className="h-8 bg-[#151822] rounded-md" />
          <div className="h-8 bg-[#151822] rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function EventListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}
