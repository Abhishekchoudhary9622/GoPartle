'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { EventCategory } from '@/types/event';
import { CategoryBadge } from '../CategoryBadge';
import { CheckCircle2, Copy, Check, Eye, PlusCircle, Calendar } from 'lucide-react';

interface SuccessConfirmationProps {
  eventId: string;
  eventName: string;
  category: EventCategory;
  onReset: () => void;
}

export function SuccessConfirmation({
  eventId,
  eventName,
  category,
  onReset,
}: SuccessConfirmationProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fire celebratory confetti on mount!
    try {
      confetti({
        particleCount: 110,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#FCD34D', '#10B981', '#FF385C', '#FFFFFF'],
      });
    } catch {
      // ignore in environments without canvas
    }
  }, []);

  const handleCopyId = () => {
    if (eventId) {
      navigator.clipboard.writeText(eventId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl border border-white/[0.08] bg-[#0F1117] shadow-2xl animate-in zoom-in-95 duration-400">
      {/* Animated glowing check circle */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping duration-1000" />
        <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center text-amber-400 relative z-10 shadow-lg shadow-amber-500/20">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider bg-[#11131A] text-amber-400 border border-amber-500/30 mb-2">
        <span>CALL SHEET VERIFIED &amp; PUBLISHED</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
        Requirement Posted Successfully!
      </h2>
      <p className="text-sm text-slate-400 mt-2 max-w-md leading-relaxed">
        Your call sheet is now live on GoPratle and discoverable by verified event planners, performers, and technical stage crew members.
      </p>

      {/* Confirmation Details Card */}
      <div className="w-full max-w-md mt-6 p-5 rounded-2xl border border-white/[0.08] bg-[#12151E] text-left space-y-3.5">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-slate-400 block">
            Event Title
          </span>
          <span className="text-base font-bold text-white block mt-0.5">
            {eventName}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-slate-400 block">
              Department
            </span>
            <div className="mt-1">
              <CategoryBadge category={category} />
            </div>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-slate-400 block">
              Status
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Published (Live)
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-white/[0.08]">
          <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-slate-400 block">
            MongoDB Record ID
          </span>
          <div className="mt-1 flex items-center justify-between gap-2 p-2 rounded-xl bg-[#08090C] border border-white/[0.1]">
            <code className="text-xs font-mono font-bold text-amber-400 truncate">
              {eventId}
            </code>
            <button
              type="button"
              onClick={handleCopyId}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              title="Copy ID to clipboard"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
        <Link
          href={`/events/${eventId}`}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-extrabold text-black bg-amber-500 hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-all"
        >
          <Eye className="w-4 h-4" />
          <span>View Requirement</span>
        </Link>

        <Link
          href="/events"
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-200 bg-[#151822] hover:bg-[#1A1F2C] border border-white/[0.08] transition-colors"
        >
          <Calendar className="w-4 h-4" />
          <span>Browse All</span>
        </Link>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-4 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
      >
        <PlusCircle className="w-3.5 h-3.5" />
        <span>Post another requirement</span>
      </button>
    </div>
  );
}
