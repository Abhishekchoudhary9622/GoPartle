'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { EventRequirement } from '@/types/event';
import { fetchEventById, fetchEvents } from '@/lib/api';
import { EventCard } from '@/components/EventCard';
import { EventListSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState } from '@/components/EmptyState';
import {
  Bookmark,
  Info,
  Radio,
  PlusCircle,
  FolderOpen,
} from 'lucide-react';

export default function MyRequirementsPage() {
  const [events, setEvents] = useState<EventRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'session' | 'all'>('session');
  const [sessionIdsCount, setSessionIdsCount] = useState(0);

  const loadRequirements = async (mode: 'session' | 'all' = viewMode) => {
    setLoading(true);
    try {
      if (mode === 'session') {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('gopratle_user_submissions') : null;
        const ids: string[] = stored ? JSON.parse(stored) : [];
        setSessionIdsCount(ids.length);

        if (ids.length > 0) {
          const fetchedList = await Promise.all(
            ids.map(async (id) => {
              try {
                const res = await fetchEventById(id);
                return res.data;
              } catch {
                return null;
              }
            })
          );
          setEvents(fetchedList.filter(Boolean) as EventRequirement[]);
        } else {
          setEvents([]);
        }
      } else {
        // Mode 'all': fetch recent requirements for demonstration
        const res = await fetchEvents({ limit: 12 });
        if (res && res.data) {
          setEvents(res.data);
        }
      }
    } catch (err) {
      console.error('Failed to load my requirements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequirements(viewMode);
  }, [viewMode]);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 bg-[#08090C] text-[#F3F4F6] animate-in fade-in-50 duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider bg-[#11131A] text-amber-400 border border-amber-500/25 mb-2.5">
            <Radio className="w-3.5 h-3.5" />
            <span>SESSION CALL SHEETS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            My Posted Requirements
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Track requirements submitted from this browser session or explore recent community call sheets.
          </p>
        </div>

        <Link
          href="/requirements/new"
          className="self-start md:self-end inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-all"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>Post New Requirement</span>
        </Link>
      </div>

      {/* Internship Demo Disclaimer Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0F1117] border border-white/[0.08] text-xs sm:text-sm text-slate-300 flex items-start gap-3.5 shadow-sm">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-white">
            Demo Environment Note (No Authentication Required)
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Per the internship assignment requirements, user authentication / login is not implemented. This view tracks call sheets submitted by you in this local browser session (via localStorage synced with MongoDB).
          </p>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4 font-mono">
        <button
          type="button"
          onClick={() => setViewMode('session')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            viewMode === 'session'
              ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
              : 'bg-[#151822] text-slate-300 hover:bg-[#1A1F2C] border border-white/[0.06]'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>My Browser Session ({sessionIdsCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode('all')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            viewMode === 'all'
              ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
              : 'bg-[#151822] text-slate-300 hover:bg-[#1A1F2C] border border-white/[0.06]'
          }`}
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span>All Recent Platform Requirements</span>
        </button>
      </div>

      {/* Event Cards Grid or Empty State */}
      {loading ? (
        <EventListSkeleton count={3} />
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <EventCard key={evt._id || evt.id} event={evt} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No requirements posted in this session yet"
          description="You haven't posted any requirements from this browser session yet. Create your first requirement using our 4-step wizard!"
          actionText="Post Your First Requirement"
          actionHref="/requirements/new"
        />
      )}
    </div>
  );
}
