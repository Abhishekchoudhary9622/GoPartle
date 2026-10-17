'use client';

import React, { useState } from 'react';
import { ContactMethod } from '@/types/event';
import { ArrowLeft, ArrowRight, UploadCloud, Clock, Mail, Phone, MessageSquare, FileText, CheckCircle2 } from 'lucide-react';

interface Step3AdditionalProps {
  additional: {
    setupTimeline?: string;
    preferredContact: ContactMethod;
    contactInfo?: string;
    notes?: string;
    referenceFile?: string;
  };
  errors: Record<string, string>;
  updateAdditional: (data: Partial<Step3AdditionalProps['additional']>) => void;
  onNext: () => void;
  onBack: () => void;
}

const CONTACT_METHODS: Array<{ id: ContactMethod; label: string; icon: React.ElementType }> = [
  { id: 'Email', label: 'Email', icon: Mail },
  { id: 'Phone', label: 'Phone Call', icon: Phone },
  { id: 'WhatsApp', label: 'WhatsApp', icon: MessageSquare },
];

export function Step3Additional({
  additional,
  errors,
  updateAdditional,
  onNext,
  onBack,
}: Step3AdditionalProps) {
  const [selectedFileName, setSelectedFileName] = useState<string>(additional.referenceFile || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      updateAdditional({ referenceFile: file.name });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>PHASE 03 // LOGISTICS &amp; CALL PROTOCOL</span>
        </div>
        <h2 className="text-xl font-bold text-white">
          Additional Requirements
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Specify schedule timelines, contact preferences, and reference materials.
        </p>
      </div>

      <div className="space-y-5">
        {/* Setup Timeline */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-100">
            Setup Timeline / Schedule
          </label>
          <div className="relative">
            <input
              type="text"
              value={additional.setupTimeline || ''}
              onChange={(e) => updateAdditional({ setupTimeline: e.target.value })}
              placeholder="e.g. Stage setup starts 24 hours prior; soundcheck at 4:00 PM"
              className="w-full pl-10 pr-4 py-3 rounded-xl border bg-[#12151E] text-white border-white/[0.1] focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 text-sm placeholder:text-slate-500"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Preferred Contact Method */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-100">
            Preferred Contact Method <span className="text-amber-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {CONTACT_METHODS.map((method) => {
              const isSelected = additional.preferredContact === method.id;
              const Icon = method.icon;

              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => updateAdditional({ preferredContact: method.id })}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/15 text-amber-300 font-bold shadow-sm shadow-amber-500/10'
                      : 'border-white/[0.08] bg-[#12151E] text-slate-300 hover:border-white/20 hover:bg-[#161A26]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{method.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-100">
            Contact Details ({additional.preferredContact}) <span className="text-amber-500">*</span>
          </label>
          <input
            type="text"
            value={additional.contactInfo || ''}
            onChange={(e) => updateAdditional({ contactInfo: e.target.value })}
            placeholder={
              additional.preferredContact === 'Email'
                ? 'e.g. organizer@event.com'
                : 'e.g. +91 98765 43210'
            }
            className="w-full px-4 py-3 rounded-xl border bg-[#12151E] text-white border-white/[0.1] focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 text-sm placeholder:text-slate-500"
          />
          {errors['additional.contactInfo'] && (
            <p className="text-xs text-rose-500 font-medium">{errors['additional.contactInfo']}</p>
          )}
        </div>

        {/* Additional Notes */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-100">
            Additional Notes &amp; Special Instructions
          </label>
          <textarea
            rows={3}
            value={additional.notes || ''}
            onChange={(e) => updateAdditional({ notes: e.target.value })}
            placeholder="Any parking guidelines, VIP protocol, dietary guidelines, or dress code info..."
            className="w-full px-4 py-3 rounded-xl border bg-[#12151E] text-white border-white/[0.1] focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 text-sm placeholder:text-slate-500"
          />
        </div>

        {/* Optional Reference File Upload */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-100">
            Reference Document / Tech Rider <span className="text-xs text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative border-2 border-dashed border-white/[0.12] rounded-2xl p-6 text-center hover:border-amber-400/40 transition-colors bg-[#12151E]/60">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                <UploadCloud className="w-5 h-5" />
              </div>
              {selectedFileName ? (
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Selected: {selectedFileName}</span>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-slate-200">
                    Click to browse or drag &amp; drop files here
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    Supports PDF, DOCX, PNG, JPG up to 10MB
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-[#151822] hover:bg-[#1A1F2C] border border-white/[0.08] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Details</span>
        </button>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-black bg-amber-500 hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
        >
          <span>Next: Review &amp; Submit</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </form>
  );
}
