'use client';

import React, { useEffect, useState, useTransition, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { EventRequirement } from '@/types/event';
import { fetchEvents } from '@/lib/api';
import { EventCard } from '@/components/EventCard';
import { EventListSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState } from '@/components/EmptyState';
import { Search, Sliders, RefreshCw, AlertCircle, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

function BrowseEventsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialType = searchParams.get('eventType') || 'all';

  const [events, setEvents] = useState<EventRequirement[]>([]);
  const [stats, setStats] = useState({ all: 0, planner: 0, performer: 0, crew: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [selectedEventType, setSelectedEventType] = useState<string>(initialType);
  const [isPending, startTransition] = useTransition();

  const loadEvents = async (category = activeCategory, search = searchQuery, eventType = selectedEventType) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchEvents({
        category: category !== 'all' ? category : undefined,
        search: search.trim() !== '' ? search.trim() : undefined,
        eventType: eventType !== 'all' ? eventType : undefined,
        limit: 50,
      });

      if (res && res.data) {
        setEvents(res.data);
        if (res.stats) {
          setStats(res.stats);
        }
      }
    } catch (err: any) {
      console.error('Failed to load events:', err);
      setError(err.message || 'Failed to connect to the backend server. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents(activeCategory, searchQuery, selectedEventType);
  }, [activeCategory, selectedEventType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadEvents(activeCategory, searchQuery, selectedEventType);
  };

  const handleCategoryChange = (cat: string) => {
    startTransition(() => {
      setActiveCategory(cat);
    });
  };

  const handleReset = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setSelectedEventType('all');
    loadEvents('all', '', 'all');
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#08090C] text-[#F3F4F6]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider bg-[#11131A] text-amber-400 border border-amber-500/25 mb-2.5">
            <Radio className="w-3.5 h-3.5" />
            <span>TALENT DIRECTORY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Browse Event Requirements
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Explore active call sheets across India. Filter by production category, event format, or target metropolitan city.
          </p>
        </div>

        {/* Total Count Pill */}
        <div className="self-start md:self-end">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#0F1117] border border-white/[0.08] text-slate-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{stats.all} ACTIVE CALL SHEETS</span>
          </span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-[#0F1117] shadow-lg mb-8 space-y-4">
        {/* Top: Category Filter Tabs with dynamic counts */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none font-mono">
          <button
            type="button"
            onClick={() => handleCategoryChange('all')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer',
              activeCategory === 'all'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-[#151822] text-slate-300 hover:bg-[#1A1F2C] border border-white/[0.06]'
            )}
          >
            All ({stats.all})
          </button>

          <button
            type="button"
            onClick={() => handleCategoryChange('planner')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer',
              activeCategory === 'planner'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-500/10'
                : 'bg-[#151822] text-slate-300 hover:bg-[#1A1F2C] border border-white/[0.06]'
            )}
          >
            Event Planner ({stats.planner})
          </button>

          <button
            type="button"
            onClick={() => handleCategoryChange('performer')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer',
              activeCategory === 'performer'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-md shadow-rose-500/10'
                : 'bg-[#151822] text-slate-300 hover:bg-[#1A1F2C] border border-white/[0.06]'
            )}
          >
            Performer ({stats.performer})
          </button>

          <button
            type="button"
            onClick={() => handleCategoryChange('crew')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer',
              activeCategory === 'crew'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-md shadow-emerald-500/10'
                : 'bg-[#151822] text-slate-300 hover:bg-[#1A1F2C] border border-white/[0.06]'
            )}
          >
            Crew ({stats.crew})
          </button>
        </div>

        {/* Bottom: Search bar & Event Type selector */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event name, city, venue, or keywords..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-[#12151E] text-white border-white/[0.1] focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 text-sm placeholder:text-slate-500"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Event Type Filter */}
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border bg-[#12151E] text-slate-200 border-white/[0.1] focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 text-xs font-semibold cursor-pointer"
            >
              <option value="all">All Event Types</option>
              <option value="Cultural">Cultural</option>
              <option value="Music">Music</option>
              <option value="Corporate">Corporate</option>
              <option value="Wedding">Wedding</option>
              <option value="Sports">Sports</option>
              <option value="Educational">Educational</option>
              <option value="Other">Other</option>
            </select>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 transition-colors shrink-0 shadow-md shadow-amber-500/20"
            >
              Search
            </button>

            {(searchQuery || activeCategory !== 'all' || selectedEventType !== 'all') && (
              <button
                type="button"
                onClick={handleReset}
                className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors shrink-0"
                title="Reset filters"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-900/60 text-rose-300 flex items-start gap-4 mb-8">
          <AlertCircle className="w-6 h-6 shrink-0 text-rose-500 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm">Failed to connect to backend API</h4>
            <p className="text-xs leading-relaxed">{error}</p>
            <button
              type="button"
              onClick={() => loadEvents()}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Request</span>
            </button>
          </div>
        </div>
      )}

      {/* Loading & Content */}
      {loading ? (
        <EventListSkeleton count={6} />
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <EventCard key={evt._id || evt.id} event={evt} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No event requirements matched"
          description={`We couldn't find any requirements matching your criteria. Try resetting the filters or post a new requirement.`}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

export default function BrowseEventsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-8"><EventListSkeleton count={6} /></div>}>
      <BrowseEventsContent />
    </Suspense>
  );
}
