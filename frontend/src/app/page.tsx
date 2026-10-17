'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { EventRequirement } from '@/types/event';
import { fetchEvents } from '@/lib/api';
import { EventCard } from '@/components/EventCard';
import { EventListSkeleton } from '@/components/LoadingSkeleton';
import {
  ArrowRight,
  Briefcase,
  Music,
  Users,
  Radio,
  Sliders,
  CheckCircle2,
  Calendar,
  Sparkles,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  const [featuredEvents, setFeaturedEvents] = useState<EventRequirement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetchEvents({ limit: 3 });
        if (res && res.data) {
          setFeaturedEvents(res.data);
        }
      } catch (err) {
        console.error('Failed to load featured events:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#08090C] text-[#F3F4F6]">
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-white/[0.08]">
        {/* Warm Stage Spotlight Ambient Cones */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-amber-500/[0.07] blur-[140px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-rose-500/[0.04] blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-1/4 w-[350px] h-[250px] bg-emerald-500/[0.04] blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Telemetry Ticker */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#11131A] border border-white/[0.1] text-xs font-mono text-slate-300 shadow-inner">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                PRODUCTION ROSTER
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 hidden sm:inline">BLR • BOM • HYD • DEL</span>
            </div>
          </div>

          {/* Main Headline & Subtitle */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] font-sans">
              Where India&apos;s Event Productions{' '}
              <span className="relative inline-block text-amber-400">
                Post &amp; Book.
                <span className="absolute left-0 bottom-1 w-full h-[3px] bg-gradient-to-r from-amber-500 via-amber-300 to-transparent" />
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              The direct talent desk for event planners, live headline acts, and technical stage crews.
              Publish detailed call sheets and connect with verified professionals in hours.
            </p>

            {/* CTA Action Deck */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/requirements/new"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-extrabold text-black bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/25 transition-all duration-200 active:scale-95"
              >
                <span>Post Requirement</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </Link>

              <Link
                href="/events"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-semibold text-slate-200 bg-[#12151E] hover:bg-[#181C28] border border-white/[0.12] transition-all duration-200"
              >
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Explore Talent</span>
              </Link>
            </div>
          </div>

          {/* ===================== FOH STAGE CONSOLE DISPLAY BANNER ===================== */}
          <div className="mt-14 relative rounded-3xl overflow-hidden border border-white/[0.1] bg-[#0E1017] shadow-2xl">
            {/* Top Console Deck Bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.08] bg-[#0A0C11] text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="ml-2 font-bold text-slate-300">STAGE // CONSOLE DECK v2.4</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-emerald-400 hidden sm:inline flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5" /> DMX 512 ACTIVE
                </span>
                <span className="text-amber-400 font-bold">SAMPLE CALL SHEETS</span>
              </div>
            </div>

            {/* Hero Visual Image with Backstage Overlay */}
            <div className="relative h-72 sm:h-96 lg:h-[400px] w-full">
              <img
                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=85"
                alt="Concert stage with laser lighting and crowd"
                className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E1017] via-black/40 to-transparent" />

              {/* Live Stage Info Floating Overlays */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/15 text-[11px] font-mono uppercase tracking-wider text-amber-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    LIVE PRODUCTION RADAR
                  </div>
                  <h3 className="text-xl sm:text-3xl font-black text-white">
                    Palace Grounds • MMRDA • Hitec Arena • Aerocity
                  </h3>
                  <p className="text-xs text-slate-300 font-mono">
                    VERIFIED VENUES • LINE ARRAYS • PRODUCTION DIRECTORS
                  </p>
                </div>

                <Link
                  href="/events"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold font-mono uppercase bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
                >
                  <span>BROWSE 15+ ACTIVE GIGS</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </Link>
              </div>
            </div>
          </div>

          {/* ===================== THREE PRODUCTION DEPARTMENTS ===================== */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Department 1: Event Planners */}
            <Link
              href="/events?category=planner"
              className="group p-6 rounded-2xl border border-white/[0.08] bg-[#0F1117] hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform border border-amber-500/20">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    DEPT 01
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                  Event Planners
                </h3>
                <p className="text-xs font-semibold text-amber-400/90 mt-0.5 font-mono">
                  Production &amp; Turnkey Management
                </p>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                  Hire premier agencies for complete festival coordination, grand weddings, corporate summits, venue booking, and guest logistics.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-bold text-amber-400">
                <span>View Planners</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Department 2: Performers */}
            <Link
              href="/events?category=performer"
              className="group p-6 rounded-2xl border border-white/[0.08] bg-[#0F1117] hover:border-rose-500/50 hover:shadow-xl hover:shadow-rose-500/10 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform border border-rose-500/20">
                    <Music className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono text-rose-400/80 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    DEPT 02
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition-colors">
                  Performers
                </h3>
                <p className="text-xs font-semibold text-rose-400/90 mt-0.5 font-mono">
                  Live Acts, Artists &amp; DJs
                </p>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                  Book live bands, playback vocalists, electronic DJs, standup comedians, classical dancers, and celebrity keynote speakers.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-bold text-rose-400">
                <span>View Performers</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Department 3: Crew */}
            <Link
              href="/events?category=crew"
              className="group p-6 rounded-2xl border border-white/[0.08] bg-[#0F1117] hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform border border-emerald-500/20">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    DEPT 03
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Crew
                </h3>
                <p className="text-xs font-semibold text-emerald-400/90 mt-0.5 font-mono">
                  FOH Sound, Lighting &amp; Rigging
                </p>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                  Source certified FOH sound engineers, GrandMA3 lighting specialists, 4K camera operators, stage managers, and event security.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>View Crew</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {/* ===================== PRODUCTION TELEMETRY STRIP ===================== */}
          <div className="mt-12 p-6 rounded-2xl border border-white/[0.08] bg-[#0F1117] shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
              <div className="pt-2 md:pt-0">
                <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400">₹1.8 Cr+</span>
                <span className="block text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider font-mono">
                  Live Event Budgets
                </span>
              </div>
              <div className="pt-2 md:pt-0">
                <span className="text-2xl sm:text-3xl font-black font-mono text-rose-400">15+</span>
                <span className="block text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider font-mono">
                  Verified Call Sheets
                </span>
              </div>
              <div className="pt-2 md:pt-0">
                <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">4 Hubs</span>
                <span className="block text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider font-mono">
                  BLR • BOM • HYD • DEL
                </span>
              </div>
              <div className="pt-2 md:pt-0">
                <span className="text-2xl sm:text-3xl font-black font-mono text-cyan-400">&lt; 4 hrs</span>
                <span className="block text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider font-mono">
                  Avg. Response Time
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FEATURED CALL SHEETS SECTION ===================== */}
      <section className="py-16 bg-[#0B0D13] border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                VERIFIED CALL SHEETS
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Featured Requirements
              </h2>
            </div>

            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-amber-400 hover:text-amber-300"
            >
              <span>View all call sheets</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>

          {loading ? (
            <EventListSkeleton count={3} />
          ) : featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredEvents.map((evt) => (
                <EventCard key={evt._id || evt.id} event={evt} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm font-mono">
              No requirements posted yet. Be the first to post!
            </div>
          )}
        </div>
      </section>

      {/* ===================== PRODUCTION CALL WORKFLOW ===================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
            THREE-PHASE DISCOVERY
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            How GoPratle Works
          </h2>
          <p className="text-sm text-slate-400">
            From publishing your specific technical requirements to locking talent and executing on stage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl border border-white/[0.08] bg-[#0F1117] relative">
            <span className="text-4xl font-black font-mono text-white/[0.05] absolute top-4 right-6 select-none">
              01
            </span>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5 border border-amber-500/20">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Publish The Call Sheet
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use our 4-step wizard to define event dates, city, venue, confirmed budget, performance genre, or specific technical crew roles.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-white/[0.08] bg-[#0F1117] relative">
            <span className="text-4xl font-black font-mono text-white/[0.05] absolute top-4 right-6 select-none">
              02
            </span>
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-5 border border-rose-500/20">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Direct Talent Match
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Call sheets are published to our talent desk. Verified directors, live bands, and certified sound/lighting engineers review specs directly.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-white/[0.08] bg-[#0F1117] relative">
            <span className="text-4xl font-black font-mono text-white/[0.05] absolute top-4 right-6 select-none">
              03
            </span>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 border border-emerald-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Execute Show Day
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lock in technical riders, coordinate soundchecks, and confirm on-site call times with zero middleman friction.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== CALL TO ACTION BANNER ===================== */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-br from-[#12151E] via-[#0E1017] to-[#0A0C11] border border-amber-500/30 text-white shadow-2xl overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>FREE FOR ORGANIZERS DURING BETA</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Ready to lock in talent for your next event?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Join organizers across Bengaluru, Hyderabad, Mumbai, and Delhi who post their requirements on GoPratle.
            </p>
            <div className="pt-3">
              <Link
                href="/requirements/new"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-extrabold bg-amber-500 text-black hover:bg-amber-400 shadow-lg shadow-amber-500/25 transition-transform active:scale-95"
              >
                <span>Post Requirement Now</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
