import React from 'react';
import Link from 'next/link';
import { CalendarX2, PlusCircle, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onReset?: () => void;
}

export function EmptyState({
  title = 'No requirements found',
  description = 'Try adjusting your search criteria or filter to discover more requirements.',
  actionText = 'Post a Requirement',
  actionHref = '/requirements/new',
  onReset,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-dashed border-white/[0.12] bg-[#0F1117] backdrop-blur-sm">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 shadow-inner">
        <CalendarX2 className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      <div className="flex items-center gap-3">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-[#151822] hover:bg-[#1A1F2C] border border-white/[0.08] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Filters</span>
          </button>
        )}
        {actionHref && (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-black bg-amber-500 hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>{actionText}</span>
          </Link>
        )}
      </div>
    </div>
  );
}
