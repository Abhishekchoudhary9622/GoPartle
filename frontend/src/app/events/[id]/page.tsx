'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { EventRequirement } from '@/types/event';
import { fetchEventById, deleteEventApi } from '@/lib/api';
import { CategoryBadge } from '@/components/CategoryBadge';
import {
  Calendar,
  MapPin,
  Building,
  ArrowLeft,
  Share2,
  Trash2,
  Check,
  Mail,
  Phone,
  MessageSquare,
  ShieldCheck,
  FileText,
  AlertCircle,
  Loader2,
  Radio,
} from 'lucide-react';
import { formatCurrencyINR, formatDateRange } from '@/lib/utils';

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [event, setEvent] = useState<EventRequirement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function loadEvent() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchEventById(id);
        if (res && res.data) {
          setEvent(res.data);
        } else {
          setError('Event requirement not found.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch event requirement details.');
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [id]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await deleteEventApi(id);
      router.push('/events');
    } catch (err: any) {
      alert(`Failed to delete event: ${err.message}`);
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 flex flex-col items-center justify-center bg-[#08090C] text-[#F3F4F6]">
        <Loader2 className="w-10 h-10 animate-spin text-amber-400 mb-3" />
        <p className="text-sm font-mono font-semibold text-slate-400">Loading call sheet specs...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen py-20 px-4 max-w-xl mx-auto text-center bg-[#08090C] text-[#F3F4F6]">
        <div className="w-16 h-16 rounded-2xl bg-rose-950/50 border border-rose-900/50 flex items-center justify-center text-rose-500 mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">
          Event Not Found
        </h2>
        <p className="text-sm text-slate-400 mt-2 mb-6">
          {error || 'This event requirement could not be located in the database.'}
        </p>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-black bg-amber-500 hover:bg-amber-400"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Browse Events</span>
        </Link>
      </div>
    );
  }

  const imageUrl =
    event.imageUrl ||
    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 bg-[#08090C] text-[#F3F4F6] animate-in fade-in-50 duration-300">
      {/* Top Navigation & Actions Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all events</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-white/[0.08] bg-[#12151E] hover:bg-[#181C26] transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied Link</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 border border-rose-900/40 bg-rose-950/20 hover:bg-rose-950/50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Hero Visual Card */}
      <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-[#0E1017] shadow-2xl">
        <div className="relative h-64 sm:h-80 w-full">
          <img
            src={imageUrl}
            alt={event.eventName}
            className="w-full h-full object-cover object-center filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E1017] via-black/50 to-transparent" />

          {/* Badges in Hero */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <CategoryBadge category={event.category} />
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/80 text-white border border-white/10 backdrop-blur-md">
                {event.eventType}
              </span>
              {event.isDemo && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black/80 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                  DEMO PASS
                </span>
              )}
            </div>
          </div>

          {/* Title and location at base of image */}
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {event.eventName}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                {formatDateRange(event.startDate, event.endDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-400" />
                {event.location}
              </span>
              {event.venue && (
                <span className="flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-cyan-400" />
                  {event.venue}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Comprehensive Details (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category-Specific Section */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0F1117] space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h2 className="text-lg font-bold text-white capitalize">
                {event.category} Specifications
              </h2>
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                CALL SHEET ACTIVE
              </span>
            </div>

            {/* PLANNER DETAILS */}
            {event.category === 'planner' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <span className="text-[11px] uppercase font-mono font-bold text-slate-400 block">Confirmed Budget</span>
                    <span className="text-lg font-black text-amber-400 font-mono mt-0.5 block">
                      {formatCurrencyINR(event.details?.budget)}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#12151E] border border-white/[0.08]">
                    <span className="text-[11px] uppercase font-mono font-bold text-slate-400 block">Expected Audience</span>
                    <span className="text-sm font-bold text-slate-200 mt-0.5 block">
                      {event.details?.expectedAudience} attendees
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#12151E] border border-white/[0.08]">
                    <span className="text-[11px] uppercase font-mono font-bold text-slate-400 block">Production Days</span>
                    <span className="text-sm font-bold text-slate-200 mt-0.5 block font-mono">
                      {event.details?.durationDays} Day(s)
                    </span>
                  </div>
                </div>

                {event.details?.services && event.details.services.length > 0 && (
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Services Required
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {event.details.services.map((s: string) => (
                        <span
                          key={s}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/25"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Scope of Production
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed bg-[#12151E] p-4 rounded-xl border border-white/[0.08]">
                    {event.details?.description}
                  </p>
                </div>
              </div>
            )}

            {/* PERFORMER DETAILS */}
            {event.category === 'performer' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <span className="text-[11px] uppercase font-mono font-bold text-slate-400 block">Act Type</span>
                    <span className="text-lg font-black text-rose-300 mt-0.5 block">
                      {event.details?.performanceType}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#12151E] border border-white/[0.08]">
                    <span className="text-[11px] uppercase font-mono font-bold text-slate-400 block">Genre / Style</span>
                    <span className="text-sm font-bold text-slate-200 mt-0.5 block">
                      {event.details?.genre}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#12151E] border border-white/[0.08]">
                    <span className="text-[11px] uppercase font-mono font-bold text-slate-400 block">Performers / Duration</span>
                    <span className="text-sm font-bold text-slate-200 mt-0.5 block">
                      {event.details?.numberOfPerformers} artist(s) • {event.details?.performanceDuration}
                    </span>
                  </div>
                </div>

                {event.details?.equipmentRequired && (
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Equipment Required
                    </h4>
                    <p className="text-sm text-slate-300">
                      {event.details.equipmentRequired}
                    </p>
                  </div>
                )}

                {event.details?.stageRequirements && (
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Stage &amp; Technical Rider
                    </h4>
                    <p className="text-sm text-slate-300">
                      {event.details.stageRequirements}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Performance Details
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed bg-[#12151E] p-4 rounded-xl border border-white/[0.08]">
                    {event.details?.description}
                  </p>
                </div>
              </div>
            )}

            {/* CREW DETAILS */}
            {event.category === 'crew' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-[11px] uppercase font-mono font-bold text-slate-400 block">Crew Size</span>
                    <span className="text-lg font-black text-emerald-300 mt-0.5 block font-mono">
                      {event.details?.numberOfCrew} Techs
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#12151E] border border-white/[0.08]">
                    <span className="text-[11px] uppercase font-mono font-bold text-slate-400 block">Experience</span>
                    <span className="text-sm font-bold text-slate-200 mt-0.5 block">
                      {event.details?.experienceLevel}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#12151E] border border-white/[0.08]">
                    <span className="text-[11px] uppercase font-mono font-bold text-slate-400 block">Shift Duration</span>
                    <span className="text-sm font-bold text-slate-200 mt-0.5 block">
                      {event.details?.shiftDuration}
                    </span>
                  </div>
                </div>

                {event.details?.roles && (
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Required Roles
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {event.details.roles.map((r: string) => (
                        <span
                          key={r}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {event.details?.requiredSkills && (
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Required Technical Skills
                    </h4>
                    <p className="text-sm text-slate-300">
                      {event.details.requiredSkills}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Job Description &amp; Shift Schedule
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed bg-[#12151E] p-4 rounded-xl border border-white/[0.08]">
                    {event.details?.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Additional Notes Card */}
          {event.additional && (
            <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0F1117] space-y-4">
              <h3 className="text-base font-bold text-white">
                Logistics &amp; Additional Requirements
              </h3>

              <div className="space-y-3 text-sm">
                {event.additional.setupTimeline && (
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Setup Timeline</span>
                    <span className="text-slate-200 font-semibold">
                      {event.additional.setupTimeline}
                    </span>
                  </div>
                )}

                {event.additional.referenceFile && (
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Reference File</span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 mt-1">
                      <FileText className="w-4 h-4" />
                      {event.additional.referenceFile}
                    </span>
                  </div>
                )}

                {event.additional.notes && (
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Notes</span>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {event.additional.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Organizer Contact & Database Specs */}
        <div className="space-y-6">
          {/* Contact Box */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0F1117] space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>Organizer Contact</span>
            </h3>

            <p className="text-xs text-slate-400">
              Reach out directly to submit your quote or availability for this requirement.
            </p>

            <div className="p-4 rounded-xl bg-[#12151E] border border-white/[0.08] space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                {event.additional?.preferredContact === 'Phone' && <Phone className="w-4 h-4 text-emerald-400" />}
                {event.additional?.preferredContact === 'WhatsApp' && <MessageSquare className="w-4 h-4 text-emerald-400" />}
                {(!event.additional?.preferredContact || event.additional?.preferredContact === 'Email') && (
                  <Mail className="w-4 h-4 text-amber-400" />
                )}
                <span>Preferred via {event.additional?.preferredContact || 'Email'}</span>
              </div>
              <div className="text-sm font-bold text-white font-mono break-all">
                {event.additional?.contactInfo || 'Contact details provided upon request'}
              </div>
            </div>

            {event.additional?.contactInfo && (
              <a
                href={
                  event.additional.preferredContact === 'Email'
                    ? `mailto:${event.additional.contactInfo}?subject=Application for ${encodeURIComponent(event.eventName)}`
                    : event.additional.preferredContact === 'WhatsApp'
                    ? `https://wa.me/${event.additional.contactInfo.replace(/[^0-9]/g, '')}`
                    : `tel:${event.additional.contactInfo}`
                }
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-extrabold text-black bg-amber-500 hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-all"
              >
                <span>Contact Organizer</span>
              </a>
            )}
          </div>

          {/* Database & Metadata Info */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0F1117] space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Call Sheet Metadata
            </h4>
            <div className="space-y-2 text-xs text-slate-400 font-mono">
              <div className="flex justify-between">
                <span>Record ID:</span>
                <span className="font-mono font-bold text-amber-400 truncate max-w-[140px]">
                  {event._id || id}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Created:</span>
                <span>{event.createdAt ? new Date(event.createdAt).toLocaleDateString() : 'Recent'}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-semibold text-emerald-400 uppercase">
                  {event.status || 'open'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0F1117] border border-white/[0.1] shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-950/60 border border-rose-900/50 flex items-center justify-center text-rose-400">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white">
              Delete Requirement?
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-white">&quot;{event.eventName}&quot;</span>? This will permanently remove the record from the MongoDB database.
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-[#151822] hover:bg-[#1A1F2C] border border-white/[0.08] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
