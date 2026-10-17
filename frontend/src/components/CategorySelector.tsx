'use client';

import React from 'react';
import { EventCategory } from '@/types/event';
import { Briefcase, Music, Users, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategorySelectorProps {
  value: EventCategory;
  onChange: (category: EventCategory) => void;
  error?: string;
}

const CATEGORIES: Array<{
  id: EventCategory;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  theme: {
    selectedBorder: string;
    selectedBg: string;
    selectedShadow: string;
    iconActiveBg: string;
    iconInactiveBg: string;
    iconInactiveText: string;
    checkFill: string;
    accentText: string;
  };
}> = [
  {
    id: 'planner',
    title: 'Event Planner',
    subtitle: 'Production & Planning',
    description: 'Plan, budget, and manage your entire event smoothly.',
    icon: Briefcase,
    theme: {
      selectedBorder: 'border-amber-500',
      selectedBg: 'bg-amber-500/10',
      selectedShadow: 'shadow-lg shadow-amber-500/15',
      iconActiveBg: 'bg-amber-500 text-black',
      iconInactiveBg: 'bg-amber-500/10',
      iconInactiveText: 'text-amber-400',
      checkFill: 'fill-amber-500 text-[#0F1117]',
      accentText: 'text-amber-400',
    },
  },
  {
    id: 'performer',
    title: 'Performer',
    subtitle: 'Live Acts & Artists',
    description: 'Bands, singers, DJs, dancers, comedians, and speakers.',
    icon: Music,
    theme: {
      selectedBorder: 'border-rose-500',
      selectedBg: 'bg-rose-500/10',
      selectedShadow: 'shadow-lg shadow-rose-500/15',
      iconActiveBg: 'bg-rose-500 text-white',
      iconInactiveBg: 'bg-rose-500/10',
      iconInactiveText: 'text-rose-400',
      checkFill: 'fill-rose-500 text-[#0F1117]',
      accentText: 'text-rose-400',
    },
  },
  {
    id: 'crew',
    title: 'Crew',
    subtitle: 'Technical & Stage Crew',
    description: 'Sound, lighting, stage managers, camera & security.',
    icon: Users,
    theme: {
      selectedBorder: 'border-emerald-500',
      selectedBg: 'bg-emerald-500/10',
      selectedShadow: 'shadow-lg shadow-emerald-500/15',
      iconActiveBg: 'bg-emerald-500 text-black',
      iconInactiveBg: 'bg-emerald-500/10',
      iconInactiveText: 'text-emerald-400',
      checkFill: 'fill-emerald-500 text-[#0F1117]',
      accentText: 'text-emerald-400',
    },
  },
];

export function CategorySelector({ value, onChange, error }: CategorySelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-100">
          Category <span className="text-amber-500">*</span>
        </label>
        <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase">
          SELECT PRODUCTION ROLE
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {CATEGORIES.map((cat) => {
          const isSelected = value === cat.id;
          const Icon = cat.icon;
          const { theme } = cat;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange(cat.id)}
              className={cn(
                'relative flex flex-col items-center text-center p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-left',
                isSelected
                  ? `${theme.selectedBorder} ${theme.selectedBg} ${theme.selectedShadow}`
                  : 'border-white/[0.08] bg-[#0F1117] hover:border-white/20 hover:bg-[#151822]'
              )}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5">
                  <CheckCircle2 className={cn('w-5 h-5', theme.checkFill)} />
                </div>
              )}

              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors',
                  isSelected ? theme.iconActiveBg : `${theme.iconInactiveBg} ${theme.iconInactiveText}`
                )}
              >
                <Icon className="w-6 h-6" />
              </div>

              <h4 className="text-base font-bold text-white">
                {cat.title}
              </h4>
              <span className={cn('text-xs font-semibold mb-1', isSelected ? theme.accentText : 'text-slate-400')}>
                {cat.subtitle}
              </span>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {cat.description}
              </p>
            </button>
          );
        })}
      </div>

      {error && <p className="text-xs text-rose-500 mt-1.5 font-medium">{error}</p>}
    </div>
  );
}
