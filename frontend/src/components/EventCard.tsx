import React from 'react';
import Link from 'next/link';
import { EventRequirement } from '@/types/event';
import { CategoryBadge } from './CategoryBadge';
import { Calendar, MapPin, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { formatCurrencyINR, formatDateRange } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: EventRequirement;
}

export function EventCard({ event }: EventCardProps) {
  const eventId = event._id || event.id;
  const isDemo = event.isDemo;

  // Fallback visual image if event doesn't have one
  const imageUrl =
    event.imageUrl ||
    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80';

  const categoryBorderHover =
    event.category === 'planner'
      ? 'hover:border-amber-500/50 hover:shadow-amber-500/10'
      : event.category === 'performer'
      ? 'hover:border-rose-500/50 hover:shadow-rose-500/10'
      : 'hover:border-emerald-500/50 hover:shadow-emerald-500/10';

  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-2xl border border-white/[0.08] bg-[#0F1117] overflow-hidden shadow-md transition-all duration-300',
        categoryBorderHover
      )}
    >
      {/* Thumbnail Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={imageUrl}
          alt={event.eventName}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1117] via-black/40 to-transparent" />

        {/* Badges on Thumbnail */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <CategoryBadge category={event.category} />
          {isDemo && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-black/75 text-amber-300 backdrop-blur-md border border-amber-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              DEMO PASS
            </span>
          )}
        </div>

        {/* Event Type pill at bottom of image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-black/80 text-white backdrop-blur-md border border-white/10 shadow-sm">
            {event.eventType}
          </span>
          <span className="text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
            ID: {String(eventId).slice(-6)}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <Link href={`/events/${eventId}`}>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
              {event.eventName}
            </h3>
          </Link>

          {/* Date & Location */}
          <div className="mt-2.5 space-y-1.5 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="line-clamp-1">{formatDateRange(event.startDate, event.endDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="line-clamp-1">{event.location} {event.venue ? `• ${event.venue}` : ''}</span>
            </div>
          </div>

          {/* Category Highlights */}
          <div className="mt-4 pt-3.5 border-t border-dashed border-white/[0.08]">
            {event.category === 'planner' && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono font-semibold">Budget Range</span>
                  <span className="font-bold text-amber-300">
                    {formatCurrencyINR(event.details?.budget)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono font-semibold">Audience</span>
                  <span className="font-medium text-slate-200">
                    {event.details?.expectedAudience || 'N/A'}
                  </span>
                </div>
              </div>
            )}

            {event.category === 'performer' && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono font-semibold">Act Type</span>
                  <span className="font-bold text-rose-300">
                    {event.details?.performanceType || 'Performer'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono font-semibold">Genre / Style</span>
                  <span className="font-medium text-slate-200 line-clamp-1">
                    {event.details?.genre || 'Open'}
                  </span>
                </div>
              </div>
            )}

            {event.category === 'crew' && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono font-semibold">Specialization</span>
                  <span className="font-bold text-emerald-300 line-clamp-1">
                    {Array.isArray(event.details?.roles) ? event.details.roles.join(', ') : 'Crew Support'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono font-semibold">Crew Size</span>
                  <span className="font-medium text-slate-200">
                    {event.details?.numberOfCrew ? `${event.details.numberOfCrew} Techs` : 'N/A'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Button & Status */}
        <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            CALL SHEET OPEN
          </span>

          <Link
            href={`/events/${eventId}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 group-hover:translate-x-1 transition-all"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
