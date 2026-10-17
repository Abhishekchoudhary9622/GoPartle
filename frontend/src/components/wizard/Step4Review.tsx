'use client';

import React from 'react';
import { EventCategory, EventType, ContactMethod } from '@/types/event';
import { CategoryBadge } from '../CategoryBadge';
import {
  ArrowLeft,
  Edit2,
  Calendar,
  MapPin,
  Building,
  CheckCircle2,
  AlertCircle,
  Loader2,
  IndianRupee,
  Users,
  Clock,
  Sparkles,
  Send,
} from 'lucide-react';
import { formatCurrencyINR, formatDateRange } from '@/lib/utils';

interface Step4ReviewProps {
  formData: {
    eventName: string;
    eventType: EventType;
    startDate: string;
    endDate: string;
    location: string;
    venue?: string;
    category: EventCategory;
    details: Record<string, any>;
    additional: {
      setupTimeline?: string;
      preferredContact: ContactMethod;
      contactInfo?: string;
      notes?: string;
      referenceFile?: string;
    };
  };
  isSubmitting: boolean;
  submitError: string | null;
  onEditSection: (stepNumber: number) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export function Step4Review({
  formData,
  isSubmitting,
  submitError,
  onEditSection,
  onSubmit,
  onBack,
}: Step4ReviewProps) {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>PHASE 04 // FINAL CALL SHEET VERIFICATION</span>
        </div>
        <h2 className="text-xl font-bold text-white">
          Review Your Requirement
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Please verify your event information before submitting to the live production platform.
        </p>
      </div>

      {submitError && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-900/60 text-rose-300 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
          <div className="text-sm">
            <h5 className="font-bold">Submission Failed</h5>
            <p className="mt-0.5">{submitError}</p>
          </div>
        </div>
      )}

      {/* Section 1: Event Basics Card */}
      <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0F1117] space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Event Basics</span>
          </h3>
          <button
            type="button"
            onClick={() => onEditSection(1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-400 hover:text-amber-300 bg-[#151822] hover:bg-[#1A1F2C] border border-white/[0.08] transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Event Name</span>
            <span className="font-bold text-white">{formData.eventName}</span>
          </div>

          <div>
            <span className="text-xs text-slate-400 block font-medium">Event Type</span>
            <span className="font-semibold text-slate-200">{formData.eventType}</span>
          </div>

          <div>
            <span className="text-xs text-slate-400 block font-medium">Category</span>
            <div className="mt-0.5">
              <CategoryBadge category={formData.category} />
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-400 block font-medium">Date Range</span>
            <span className="font-semibold text-slate-200 font-mono text-xs">
              {formatDateRange(formData.startDate, formData.endDate)}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 block font-medium">Location</span>
            <span className="font-semibold text-slate-200">{formData.location}</span>
          </div>

          <div>
            <span className="text-xs text-slate-400 block font-medium">Venue</span>
            <span className="font-semibold text-slate-200">
              {formData.venue || 'To be finalized'}
            </span>
          </div>
        </div>
      </div>

      {/* Section 2: Category Details Card */}
      <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0F1117] space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Category Specific Details</span>
          </h3>
          <button
            type="button"
            onClick={() => onEditSection(2)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-400 hover:text-amber-300 bg-[#151822] hover:bg-[#1A1F2C] border border-white/[0.08] transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        {/* Planner Details */}
        {formData.category === 'planner' && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-xs text-slate-400 block font-medium font-mono">Budget</span>
                <span className="font-bold text-amber-400 font-mono">
                  {formatCurrencyINR(formData.details?.budget)}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Expected Audience</span>
                <span className="font-semibold text-slate-200">
                  {formData.details?.expectedAudience} attendees
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Event Days</span>
                <span className="font-semibold text-slate-200">
                  {formData.details?.durationDays} Day(s)
                </span>
              </div>
            </div>

            {formData.details?.services && formData.details.services.length > 0 && (
              <div>
                <span className="text-xs text-slate-400 block font-medium mb-1.5">Required Services</span>
                <div className="flex flex-wrap gap-1.5">
                  {formData.details.services.map((s: string) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/25"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <span className="text-xs text-slate-400 block font-medium mb-1">Description</span>
              <p className="text-sm text-slate-300 leading-relaxed bg-[#12151E] p-3 rounded-xl border border-white/[0.08]">
                {formData.details?.description}
              </p>
            </div>
          </div>
        )}

        {/* Performer Details */}
        {formData.category === 'performer' && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Performance Type</span>
                <span className="font-bold text-rose-300">
                  {formData.details?.performanceType}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Genre</span>
                <span className="font-semibold text-slate-200">
                  {formData.details?.genre}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Performers / Duration</span>
                <span className="font-semibold text-slate-200">
                  {formData.details?.numberOfPerformers} artist(s) • {formData.details?.performanceDuration}
                </span>
              </div>
            </div>

            {formData.details?.equipmentRequired && (
              <div>
                <span className="text-xs text-slate-400 block font-medium">Equipment Required</span>
                <span className="text-slate-300">{formData.details.equipmentRequired}</span>
              </div>
            )}

            <div>
              <span className="text-xs text-slate-400 block font-medium mb-1">Description</span>
              <p className="text-sm text-slate-300 leading-relaxed bg-[#12151E] p-3 rounded-xl border border-white/[0.08]">
                {formData.details?.description}
              </p>
            </div>
          </div>
        )}

        {/* Crew Details */}
        {formData.category === 'crew' && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Team Size</span>
                <span className="font-bold text-emerald-300">
                  {formData.details?.numberOfCrew} Tech(s)
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Experience Level</span>
                <span className="font-semibold text-slate-200">
                  {formData.details?.experienceLevel}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Shift Duration</span>
                <span className="font-semibold text-slate-200">
                  {formData.details?.shiftDuration}
                </span>
              </div>
            </div>

            {formData.details?.roles && formData.details.roles.length > 0 && (
              <div>
                <span className="text-xs text-slate-400 block font-medium mb-1.5">Required Roles</span>
                <div className="flex flex-wrap gap-1.5">
                  {formData.details.roles.map((r: string) => (
                    <span
                      key={r}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {formData.details?.requiredSkills && (
              <div>
                <span className="text-xs text-slate-400 block font-medium">Required Skills</span>
                <span className="text-slate-300">{formData.details.requiredSkills}</span>
              </div>
            )}

            <div>
              <span className="text-xs text-slate-400 block font-medium mb-1">Description</span>
              <p className="text-sm text-slate-300 leading-relaxed bg-[#12151E] p-3 rounded-xl border border-white/[0.08]">
                {formData.details?.description}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Section 3: Additional Requirements Card */}
      <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0F1117] space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Additional Requirements &amp; Contact</span>
          </h3>
          <button
            type="button"
            onClick={() => onEditSection(3)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-400 hover:text-amber-300 bg-[#151822] hover:bg-[#1A1F2C] border border-white/[0.08] transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Preferred Contact</span>
            <span className="font-semibold text-slate-200">
              {formData.additional.preferredContact}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 block font-medium">Contact Details</span>
            <span className="font-semibold text-amber-400 font-mono">
              {formData.additional.contactInfo}
            </span>
          </div>

          {formData.additional.setupTimeline && (
            <div className="sm:col-span-2">
              <span className="text-xs text-slate-400 block font-medium">Setup Timeline</span>
              <span className="font-medium text-slate-200">{formData.additional.setupTimeline}</span>
            </div>
          )}

          {formData.additional.referenceFile && (
            <div className="sm:col-span-2">
              <span className="text-xs text-slate-400 block font-medium">Uploaded Tech Rider / Document</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {formData.additional.referenceFile}
              </span>
            </div>
          )}

          {formData.additional.notes && (
            <div className="sm:col-span-2">
              <span className="text-xs text-slate-400 block font-medium">Notes</span>
              <p className="text-xs text-slate-300 mt-1">
                {formData.additional.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Final Action Controls */}
      <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-[#151822] hover:bg-[#1A1F2C] border border-white/[0.08] transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Additional</span>
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-extrabold text-black bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/25 transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-black" />
              <span>Submitting to Database...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 stroke-[2.5]" />
              <span>Submit Requirement</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
