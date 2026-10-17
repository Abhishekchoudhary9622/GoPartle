'use client';

import React from 'react';
import { EventCategory } from '@/types/event';
import { ArrowLeft, ArrowRight, IndianRupee, Users, Clock, Music, Wrench } from 'lucide-react';

interface Step2DetailsProps {
  category: EventCategory;
  details: Record<string, any>;
  errors: Record<string, string>;
  updateDetails: (data: Record<string, any>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PLANNER_SERVICES = [
  'Venue Booking',
  'Event Management',
  'Logistics',
  'Marketing & Promotion',
  'Guest Coordination',
  'Technical Setup',
  'Other',
];

const CREW_ROLES = [
  'Sound Technician',
  'Lighting Technician',
  'Stage Manager',
  'Camera Operator',
  'Security',
  'Video Switcher',
  'Rigging & Truss',
  'Other',
];

const AUDIENCE_OPTIONS = [
  '< 100',
  '100 - 300',
  '300 - 500',
  '500 - 1,000',
  '1,000 - 2,500',
  '2,500 - 5,000',
  '5,000+',
];

const EXPERIENCE_OPTIONS = [
  'Fresher / Entry Level',
  '1-3 Years',
  '3-5 Years',
  '5+ Years Senior',
];

export function Step2Details({
  category,
  details,
  errors,
  updateDetails,
  onNext,
  onBack,
}: Step2DetailsProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const toggleService = (service: string) => {
    const currentServices: string[] = details.services || [];
    const exists = currentServices.includes(service);
    const updated = exists
      ? currentServices.filter((s) => s !== service)
      : [...currentServices, service];
    updateDetails({ services: updated });
  };

  const toggleRole = (role: string) => {
    const currentRoles: string[] = details.roles || [];
    const exists = currentRoles.includes(role);
    const updated = exists
      ? currentRoles.filter((r) => r !== role)
      : [...currentRoles, role];
    updateDetails({ roles: updated });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Header Banner */}
      <div className="border-b border-white/[0.08] pb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>PHASE 02 // ROLE-SPECIFIC PARAMETERS</span>
          </div>
          <h2 className="text-xl font-bold text-white capitalize">
            {category === 'planner' && 'Planner Details'}
            {category === 'performer' && 'Performer Details'}
            {category === 'crew' && 'Crew & Technical Details'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {category === 'planner' && 'Tell us what you need help with for planning this event.'}
            {category === 'performer' && 'Specify the talent, genre, and stage setup you are looking for.'}
            {category === 'crew' && 'Define crew roles, team size, and technical skill requirements.'}
          </p>
        </div>
      </div>

      {/* ===================== CATEGORY: EVENT PLANNER ===================== */}
      {category === 'planner' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Estimated Budget */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-100">
                Estimated Budget (INR) <span className="text-amber-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  step="5000"
                  value={details.budget || ''}
                  onChange={(e) => updateDetails({ budget: Number(e.target.value) })}
                  placeholder="e.g. 500000"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border bg-[#12151E] text-white border-white/[0.1] focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 text-sm font-mono"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <IndianRupee className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              {errors['details.budget'] && (
                <p className="text-xs text-rose-500 font-medium">{errors['details.budget']}</p>
              )}
            </div>

            {/* Expected Audience */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-100">
                Expected Audience <span className="text-amber-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={details.expectedAudience || ''}
                  onChange={(e) => updateDetails({ expectedAudience: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border bg-[#12151E] text-white border-white/[0.1] focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 text-sm appearance-none cursor-pointer"
                >
                  <option value="">Select audience size</option>
                  {AUDIENCE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt} attendees
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3.5 pointer-events-none text-slate-400">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              {errors['details.expectedAudience'] && (
                <p className="text-xs text-rose-500 font-medium">{errors['details.expectedAudience']}</p>
              )}
            </div>

            {/* Number of Days */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-100">
                Number of Days <span className="text-amber-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={details.durationDays || 1}
                  onChange={(e) => updateDetails({ durationDays: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border bg-[#12151E] text-white border-white/[0.1] focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 text-sm font-mono"
                />
              </div>
              {errors['details.durationDays'] && (
                <p className="text-xs text-rose-500 font-medium">{errors['details.durationDays']}</p>
              )}
            </div>
          </div>

          {/* Services Needed */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-100">
              Services Needed <span className="text-amber-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {PLANNER_SERVICES.map((service) => {
                const checked = (details.services || []).includes(service);
                return (
                  <label
                    key={service}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      checked
                        ? 'border-amber-500 bg-amber-500/15 text-amber-300 font-bold shadow-sm shadow-amber-500/10'
                        : 'border-white/[0.08] bg-[#12151E] text-slate-300 hover:border-white/20 hover:bg-[#161A26]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleService(service)}
                      className="rounded accent-amber-500"
                    />
                    <span>{service}</span>
                  </label>
                );
              })}
            </div>
            {errors['details.services'] && (
              <p className="text-xs text-rose-500 font-medium">{errors['details.services']}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-100">
              Event Description &amp; Requirements <span className="text-amber-500">*</span>
            </label>
            <textarea
              rows={4}
              value={details.description || ''}
              onChange={(e) => updateDetails({ description: e.target.value })}
              placeholder="Describe your event scope, themes, specific expectations, and deliverables..."
              className="w-full px-4 py-3 rounded-xl border bg-[#12151E] text-white border-white/[0.1] focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 text-sm placeholder:text-slate-500"
            />
            {errors['details.description'] && (
              <p className="text-xs text-rose-500 font-medium">{errors['details.description']}</p>
            )}
          </div>
        </div>
      )}

      {/* ===================== CATEGORY: PERFORMER ===================== */}
      {category === 'performer' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Performance Type */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-100">
                Performance Type <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={details.performanceType || ''}
                onChange={(e) => updateDetails({ performanceType: e.target.value })}
                placeholder="e.g. Singer, DJ, Band, Dancer, Speaker"
                className="w-full px-4 py-3 rounded-xl border bg-[#12151E] text-white border-white/[0.1] focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 text-sm placeholder:text-slate-500"
              />
              {errors['details.performanceType'] && (
                <p className="text-xs text-rose-500 font-medium">{errors['details.performanceType']}</p>
              )}
            </div>

            {/* Genre */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-100">
                Genre / Performance Style <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={details.genre || ''}
                onChange={(e) => updateDetails({ genre: e.target.value })}
                placeholder="e.g. Indie Rock, Bollywood, Classical, Melodic Techno"
                className="w-full px-4 py-3 rounded-xl border bg-[#12151E] text-white border-white/[0.1] focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 text-sm placeholder:text-slate-500"
              />
              {errors['details.genre'] && (
                <p className="text-xs text-rose-500 font-medium">{errors['details.genre']}</p>
              )}
            </div>

            {/* Number of Performers */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-100">
                Number of Performers <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={details.numberOfPerformers || 1}
                onChange={(e) => updateDetails({ numberOfPerformers: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border bg-[#12151E] text-white border-white/[0.1] focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 text-sm font-mono"
              />
              {errors['details.numberOfPerformers'] && (
                <p className="text-xs text-rose-500 font-medium">{errors['details.numberOfPerformers']}</p>
              )}
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-100">
                Performance Duration <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={details.performanceDuration || ''}
                onChange={(e) => updateDetails({ performanceDuration: e.target.value })}
                placeholder="e.g. 90 minutes, 2 hours"
                className="w-full px-4 py-3 rounded-xl border bg-[#12151E] text-white border-white/[0.1] focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 text-sm placeholder:text-slate-500"
              />
              {errors['details.performanceDuration'] && (
                <p className="text-xs text-rose-500 font-medium">{errors['details.performanceDuration']}</p>
              )}
            </div>

            {/* Equipment Required */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-100">
                Equipment Required
              </label>
              <input
                type="text"
                value={details.equipmentRequired || ''}
                onChange={(e) => updateDetails({ equipmentRequired: e.target.value })}
                placeholder="e.g. Drum kit, in-ear monitors, wireless microphones"
                className="w-full px-4 py-3 rounded-xl border bg-[#12151E] text-white border-white/[0.1] focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 text-sm placeholder:text-slate-500"
              />
            </div>

            {/* Stage Requirements */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-100">
                Stage / Technical Requirements
              </label>
              <input
                type="text"
                value={details.stageRequirements || ''}
                onChange={(e) => updateDetails({ stageRequirements: e.target.value })}
                placeholder="e.g. 24x16 ft stage, spotlight, DJ riser console"
                className="w-full px-4 py-3 rounded-xl border bg-[#12151E] text-white border-white/[0.1] focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 text-sm placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-100">
              Performance Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={details.description || ''}
              onChange={(e) => updateDetails({ description: e.target.value })}
              placeholder="Describe the mood, target audience, preferred setlist type, and expectations..."
              className="w-full px-4 py-3 rounded-xl border bg-[#12151E] text-white border-white/[0.1] focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 text-sm placeholder:text-slate-500"
            />
            {errors['details.description'] && (
              <p className="text-xs text-rose-500 font-medium">{errors['details.description']}</p>
            )}
          </div>
        </div>
      )}

      {/* ===================== CATEGORY: CREW ===================== */}
      {category === 'crew' && (
        <div className="space-y-5">
          {/* Roles Checkboxes */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-100">
              Required Roles <span className="text-emerald-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {CREW_ROLES.map((role) => {
                const checked = (details.roles || []).includes(role);
                return (
                  <label
                    key={role}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      checked
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 font-bold shadow-sm shadow-emerald-500/10'
                        : 'border-white/[0.08] bg-[#12151E] text-slate-300 hover:border-white/20 hover:bg-[#161A26]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleRole(role)}
                      className="rounded accent-emerald-500"
                    />
                    <span>{role}</span>
                  </label>
                );
              })}
            </div>
            {errors['details.roles'] && (
              <p className="text-xs text-rose-500 font-medium">{errors['details.roles']}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Number of Crew */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-100">
                Number of Crew Members <span className="text-emerald-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={details.numberOfCrew || 1}
                onChange={(e) => updateDetails({ numberOfCrew: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border bg-[#12151E] text-white border-white/[0.1] focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 text-sm font-mono"
              />
              {errors['details.numberOfCrew'] && (
                <p className="text-xs text-rose-500 font-medium">{errors['details.numberOfCrew']}</p>
              )}
            </div>

            {/* Experience Level */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-100">
                Experience Level <span className="text-emerald-500">*</span>
              </label>
              <select
                value={details.experienceLevel || ''}
                onChange={(e) => updateDetails({ experienceLevel: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border bg-[#12151E] text-white border-white/[0.1] focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 text-sm cursor-pointer"
              >
                <option value="">Select experience</option>
                {EXPERIENCE_OPTIONS.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
              {errors['details.experienceLevel'] && (
                <p className="text-xs text-rose-500 font-medium">{errors['details.experienceLevel']}</p>
              )}
            </div>

            {/* Shift Duration */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-100">
                Shift Duration <span className="text-emerald-500">*</span>
              </label>
              <input
                type="text"
                value={details.shiftDuration || ''}
                onChange={(e) => updateDetails({ shiftDuration: e.target.value })}
                placeholder="e.g. 8 hours, Full Day"
                className="w-full px-4 py-3 rounded-xl border bg-[#12151E] text-white border-white/[0.1] focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 text-sm placeholder:text-slate-500"
              />
              {errors['details.shiftDuration'] && (
                <p className="text-xs text-rose-500 font-medium">{errors['details.shiftDuration']}</p>
              )}
            </div>
          </div>

          {/* Required Skills */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-100">
              Required Skills &amp; Technologies <span className="text-emerald-500">*</span>
            </label>
            <input
              type="text"
              value={details.requiredSkills || ''}
              onChange={(e) => updateDetails({ requiredSkills: e.target.value })}
              placeholder="e.g. Yamaha CL5 mixing, GrandMA3, DMX protocol, Dante network"
              className="w-full px-4 py-3 rounded-xl border bg-[#12151E] text-white border-white/[0.1] focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 text-sm placeholder:text-slate-500"
            />
            {errors['details.requiredSkills'] && (
              <p className="text-xs text-rose-500 font-medium">{errors['details.requiredSkills']}</p>
            )}
          </div>

          {/* Equipment Provided / Needed */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-100">
              Equipment Provided / Required on Site
            </label>
            <input
              type="text"
              value={details.equipmentRequired || ''}
              onChange={(e) => updateDetails({ equipmentRequired: e.target.value })}
              placeholder="e.g. Safety harnesses, walkie-talkie sets, cable testers"
              className="w-full px-4 py-3 rounded-xl border bg-[#12151E] text-white border-white/[0.1] focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 text-sm placeholder:text-slate-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-100">
              Crew Requirement Description <span className="text-emerald-500">*</span>
            </label>
            <textarea
              rows={4}
              value={details.description || ''}
              onChange={(e) => updateDetails({ description: e.target.value })}
              placeholder="Describe the event workflow, shifts, coordination expectations, and safety measures..."
              className="w-full px-4 py-3 rounded-xl border bg-[#12151E] text-white border-white/[0.1] focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 text-sm placeholder:text-slate-500"
            />
            {errors['details.description'] && (
              <p className="text-xs text-rose-500 font-medium">{errors['details.description']}</p>
            )}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-[#151822] hover:bg-[#1A1F2C] border border-white/[0.08] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Basics</span>
        </button>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-black bg-amber-500 hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
        >
          <span>Next: Additional Requirements</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </form>
  );
}
