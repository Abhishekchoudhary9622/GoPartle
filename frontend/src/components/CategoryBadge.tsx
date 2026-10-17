import React from 'react';
import { EventCategory } from '@/types/event';
import { Briefcase, Music, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category: EventCategory | string;
  className?: string;
  showIcon?: boolean;
}

export function CategoryBadge({ category, className, showIcon = true }: CategoryBadgeProps) {
  const cat = (category || 'planner').toLowerCase();

  if (cat === 'planner') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border',
          'bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-sm shadow-amber-500/10',
          className
        )}
      >
        {showIcon && <Briefcase className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
        <span>Event Planner</span>
      </span>
    );
  }

  if (cat === 'performer') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border',
          'bg-rose-500/10 text-rose-300 border-rose-500/30 shadow-sm shadow-rose-500/10',
          className
        )}
      >
        {showIcon && <Music className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
        <span>Performer</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border',
        'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-sm shadow-emerald-500/10',
        className
      )}
    >
      {showIcon && <Wrench className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
      <span>Crew</span>
    </span>
  );
}
