'use client';

import React from 'react';
import { EventCategory, EventType } from '@/types/event';
import { CategorySelector } from '../CategorySelector';
import { Calendar, MapPin, Building, Tag, ArrowRight } from 'lucide-react';

interface Step1BasicsProps {
  formData: {
    eventName: string;
    eventType: EventType;
    startDate: string;
    endDate: string;
    location: string;
    venue?: string;
    category: EventCategory;
  };
  errors: Record<string, string>;
  updateFormData: (data: Partial<Step1BasicsProps['formData']>) => void;
  onNext: () => void;
}

const EVENT_TYPES: EventType[] = [
  'Cultural',
  'Music',
  'Corporate',
  'Wedding',
  'Sports',
  'Educational',
  'Other',
];

const SUGGESTED_CITIES = [
  'Bengaluru, Karnataka',
  'Hyderabad, Telangana',
  'Vijayawada, Andhra Pradesh',
  'Chennai, Tamil Nadu',
  'Mumbai, Maharashtra',
  'Pune, Maharashtra',
  'Delhi',
  'Kolkata, West Bengal',
];

export function Step1Basics({
  formData,
  errors,
  updateFormData,
  onNext,
}: Step1BasicsProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>PHASE 01 // BASIC SPECIFICATIONS</span>
        </div>
        <h2 className="text-xl font-bold text-white">
          Let&apos;s start with the basics
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Tell us about your event so we can connect you with the right professionals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Event Name */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="block text-sm font-semibold text-slate-100">
            Event Name <span className="text-amber-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.eventName}
              onChange={(e) => updateFormData({ eventName: e.target.value })}
              placeholder="e.g. Bangalore Cultural Youth Fest 2026"
              className="w-full px-4 py-3 rounded-xl border bg-[#12151E] text-white border-white/[0.1] focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all text-sm placeholder:text-slate-500"
            />
          </div>
          {errors.eventName && (
            <p className="text-xs text-rose-500 font-medium">{errors.eventName}</p>
          )}
        </div>

        {/* Event Type */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-100">
            Event Type <span className="text-amber-500">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.eventType}
              onChange={(e) => updateFormData({ eventType: e.target.value as EventType })}
              className="w-full px-4 py-3 rounded-xl border bg-[#12151E] text-white border-white/[0.1] focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all text-sm appearance-none cursor-pointer"
            >
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          {errors.eventType && (
            <p className="text-xs text-rose-500 font-medium">{errors.eventType}</p>
          )}
        </div>

        {/* City & State (Location) */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-100">
            City, State <span className="text-amber-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.location}
              onChange={(e) => updateFormData({ location: e.target.value })}
              placeholder="e.g. Bengaluru, Karnataka"
              className="w-full pl-10 pr-4 py-3 rounded-xl border bg-[#12151E] text-white border-white/[0.1] focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all text-sm placeholder:text-slate-500"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          {errors.location && (
            <p className="text-xs text-rose-500 font-medium">{errors.location}</p>
          )}

          {/* Quick city suggestions */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {SUGGESTED_CITIES.slice(0, 4).map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => updateFormData({ location: city })}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#161A26] border border-white/[0.06] text-slate-400 hover:text-amber-400 hover:border-amber-400/40 transition-colors"
              >
                + {city.split(',')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Start Date */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-100">
            Start Date <span className="text-amber-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.startDate ? formData.startDate.substring(0, 10) : ''}
              onChange={(e) => updateFormData({ startDate: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border bg-[#12151E] text-white border-white/[0.1] focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all text-sm cursor-pointer"
            />
          </div>
          {errors.startDate && (
            <p className="text-xs text-rose-500 font-medium">{errors.startDate}</p>
          )}
        </div>

        {/* End Date */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-100">
            End Date <span className="text-amber-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.endDate ? formData.endDate.substring(0, 10) : ''}
              onChange={(e) => updateFormData({ endDate: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border bg-[#12151E] text-white border-white/[0.1] focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all text-sm cursor-pointer"
            />
          </div>
          {errors.endDate && (
            <p className="text-xs text-rose-500 font-medium">{errors.endDate}</p>
          )}
        </div>

        {/* Venue (Optional) */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="block text-sm font-semibold text-slate-100">
            Venue <span className="text-xs text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.venue || ''}
              onChange={(e) => updateFormData({ venue: e.target.value })}
              placeholder="e.g. Palace Grounds, Jayamahal Road"
              className="w-full pl-10 pr-4 py-3 rounded-xl border bg-[#12151E] text-white border-white/[0.1] focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all text-sm placeholder:text-slate-500"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Building className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Selection Cards */}
      <div className="pt-2">
        <CategorySelector
          value={formData.category}
          onChange={(newCategory) => {
            updateFormData({ category: newCategory });
          }}
          error={errors.category}
        />
      </div>

      {/* Action Buttons */}
      <div className="pt-6 border-t border-white/[0.08] flex items-center justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-black bg-amber-500 hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
        >
          <span>Next: Category Details</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </form>
  );
}
