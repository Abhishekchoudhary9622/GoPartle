'use client';

import React, { useState } from 'react';
import { EventCategory, EventType, ContactMethod } from '@/types/event';
import { Stepper } from '@/components/Stepper';
import { Step1Basics } from '@/components/wizard/Step1Basics';
import { Step2Details } from '@/components/wizard/Step2Details';
import { Step3Additional } from '@/components/wizard/Step3Additional';
import { Step4Review } from '@/components/wizard/Step4Review';
import { SuccessConfirmation } from '@/components/wizard/SuccessConfirmation';
import { createEventApi } from '@/lib/api';
import { Sparkles } from 'lucide-react';

interface WizardFormData {
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
}

const INITIAL_FORM_DATA: WizardFormData = {
  eventName: '',
  eventType: 'Cultural',
  startDate: '',
  endDate: '',
  location: '',
  venue: '',
  category: 'planner',
  details: {
    budget: 500000,
    expectedAudience: '500 - 1,000',
    durationDays: 1,
    services: ['Venue Booking', 'Event Management'],
    description: '',
  },
  additional: {
    setupTimeline: '',
    preferredContact: 'Email',
    contactInfo: '',
    notes: '',
    referenceFile: '',
  },
};

export default function NewRequirementPage() {
  const [currentStep, setCurrentStep] = useState<number | 'success'>(1);
  const [formData, setFormData] = useState<WizardFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);

  // Update top level basics
  const updateBasics = (data: Partial<WizardFormData>) => {
    setFormData((prev) => {
      const next = { ...prev, ...data };
      // If category changed, initialize fresh compatible details structure
      if (data.category && data.category !== prev.category) {
        if (data.category === 'planner') {
          next.details = {
            budget: 500000,
            expectedAudience: '500 - 1,000',
            durationDays: 1,
            services: ['Venue Booking', 'Event Management'],
            description: prev.details.description || '',
          };
        } else if (data.category === 'performer') {
          next.details = {
            performanceType: 'Band',
            genre: '',
            numberOfPerformers: 4,
            performanceDuration: '90 minutes',
            equipmentRequired: '',
            stageRequirements: '',
            description: prev.details.description || '',
          };
        } else if (data.category === 'crew') {
          next.details = {
            roles: ['Sound Technician'],
            numberOfCrew: 4,
            experienceLevel: '3-5 Years',
            requiredSkills: '',
            equipmentRequired: '',
            shiftDuration: '8 hours',
            description: prev.details.description || '',
          };
        }
      }
      return next;
    });

    // Clear related field errors
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      Object.keys(data).forEach((key) => delete newErrors[key]);
      return newErrors;
    });
  };

  // Update details object
  const updateDetails = (newDetails: Record<string, any>) => {
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        ...newDetails,
      },
    }));

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      Object.keys(newDetails).forEach((key) => delete newErrors[`details.${key}`]);
      return newErrors;
    });
  };

  // Update additional requirements
  const updateAdditional = (newAdditional: Partial<WizardFormData['additional']>) => {
    setFormData((prev) => ({
      ...prev,
      additional: {
        ...prev.additional,
        ...newAdditional,
      },
    }));

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      Object.keys(newAdditional).forEach((key) => delete newErrors[`additional.${key}`]);
      return newErrors;
    });
  };

  // Validate Step 1
  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.eventName || formData.eventName.trim().length < 3) {
      errs.eventName = 'Event name must be at least 3 characters long.';
    }

    if (!formData.startDate) {
      errs.startDate = 'Start date is required.';
    }

    if (!formData.endDate) {
      errs.endDate = 'End date is required.';
    } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      errs.endDate = 'End date cannot be earlier than start date.';
    }

    if (!formData.location || formData.location.trim().length < 2) {
      errs.location = 'Please specify city and state.';
    }

    if (!formData.category) {
      errs.category = 'Please select a category.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Validate Step 2
  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};

    if (formData.category === 'planner') {
      if (!formData.details.budget || Number(formData.details.budget) <= 0) {
        errs['details.budget'] = 'Please enter an estimated budget in INR.';
      }
      if (!formData.details.expectedAudience) {
        errs['details.expectedAudience'] = 'Please select expected audience size.';
      }
      if (!formData.details.durationDays || Number(formData.details.durationDays) < 1) {
        errs['details.durationDays'] = 'Number of event days must be at least 1.';
      }
      if (!formData.details.services || formData.details.services.length === 0) {
        errs['details.services'] = 'Please select at least one required service.';
      }
      if (!formData.details.description || formData.details.description.trim().length < 10) {
        errs['details.description'] = 'Please provide a description of at least 10 characters.';
      }
    } else if (formData.category === 'performer') {
      if (!formData.details.performanceType || formData.details.performanceType.trim().length < 2) {
        errs['details.performanceType'] = 'Performance type is required (e.g. Band, Singer, DJ).';
      }
      if (!formData.details.genre || formData.details.genre.trim().length < 2) {
        errs['details.genre'] = 'Genre / performance style is required.';
      }
      if (!formData.details.numberOfPerformers || Number(formData.details.numberOfPerformers) < 1) {
        errs['details.numberOfPerformers'] = 'Number of performers must be at least 1.';
      }
      if (!formData.details.performanceDuration || formData.details.performanceDuration.trim().length < 2) {
        errs['details.performanceDuration'] = 'Performance duration is required (e.g. 90 minutes).';
      }
      if (!formData.details.description || formData.details.description.trim().length < 10) {
        errs['details.description'] = 'Please provide a performance description of at least 10 characters.';
      }
    } else if (formData.category === 'crew') {
      if (!formData.details.roles || formData.details.roles.length === 0) {
        errs['details.roles'] = 'Please select at least one required crew role.';
      }
      if (!formData.details.numberOfCrew || Number(formData.details.numberOfCrew) < 1) {
        errs['details.numberOfCrew'] = 'Number of crew members must be at least 1.';
      }
      if (!formData.details.experienceLevel) {
        errs['details.experienceLevel'] = 'Please select required experience level.';
      }
      if (!formData.details.requiredSkills || formData.details.requiredSkills.trim().length < 3) {
        errs['details.requiredSkills'] = 'Please specify required skills or tools.';
      }
      if (!formData.details.shiftDuration || formData.details.shiftDuration.trim().length < 2) {
        errs['details.shiftDuration'] = 'Shift duration is required.';
      }
      if (!formData.details.description || formData.details.description.trim().length < 10) {
        errs['details.description'] = 'Please provide a crew description of at least 10 characters.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Validate Step 3
  const validateStep3 = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.additional.contactInfo || formData.additional.contactInfo.trim().length < 3) {
      errs['additional.contactInfo'] = `Please provide your ${formData.additional.preferredContact.toLowerCase()} contact info.`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Navigation handlers
  const handleNextFromStep1 = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextFromStep2 = () => {
    if (validateStep2()) {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextFromStep3 = () => {
    if (validateStep3()) {
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Step 4: Final submission to MongoDB REST API
  const handleSubmitRequirement = async () => {
    // Validate everything across all steps
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }
    if (!validateStep2()) {
      setCurrentStep(2);
      return;
    }
    if (!validateStep3()) {
      setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await createEventApi(formData);

      if (response && response.data && response.data._id) {
        const newId = response.data._id;
        setCreatedEventId(newId);

        // Save submitted ID to localStorage so /my-requirements can list it
        try {
          const stored = localStorage.getItem('gopratle_user_submissions');
          const list: string[] = stored ? JSON.parse(stored) : [];
          if (!list.includes(newId)) {
            list.unshift(newId);
            localStorage.setItem('gopratle_user_submissions', JSON.stringify(list));
          }
        } catch (e) {
          // ignore storage errors
        }

        setCurrentStep('success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error('Database did not return a valid record confirmation.');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'An error occurred while saving your requirement. Please check your data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setSubmitError(null);
    setCreatedEventId(null);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-[#08090C] text-[#F3F4F6]">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider bg-[#11131A] text-amber-400 border border-amber-500/25 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>PRODUCTION CALL SHEET CONSOLE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Post an Event Requirement
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl mx-auto">
            Find the perfect event directors, verified headline performers, and professional stage crew across India.
          </p>
        </div>

        {/* Stepper Indicator (shown only during steps 1-4) */}
        {currentStep !== 'success' && (
          <div className="mb-8">
            <Stepper
              currentStep={currentStep as number}
              onStepClick={(step) => {
                if (step < (currentStep as number)) {
                  setCurrentStep(step);
                }
              }}
            />
          </div>
        )}

        {/* Wizard Form Container */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#0F1117] p-6 sm:p-10 shadow-2xl">
          {currentStep === 1 && (
            <Step1Basics
              formData={formData}
              errors={errors}
              updateFormData={updateBasics}
              onNext={handleNextFromStep1}
            />
          )}

          {currentStep === 2 && (
            <Step2Details
              category={formData.category}
              details={formData.details}
              errors={errors}
              updateDetails={updateDetails}
              onNext={handleNextFromStep2}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <Step3Additional
              additional={formData.additional}
              errors={errors}
              updateAdditional={updateAdditional}
              onNext={handleNextFromStep3}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 4 && (
            <Step4Review
              formData={formData}
              isSubmitting={isSubmitting}
              submitError={submitError}
              onEditSection={(targetStep) => setCurrentStep(targetStep)}
              onSubmit={handleSubmitRequirement}
              onBack={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 'success' && createdEventId && (
            <SuccessConfirmation
              eventId={createdEventId}
              eventName={formData.eventName}
              category={formData.category}
              onReset={handleResetForm}
            />
          )}
        </div>
      </div>
    </div>
  );
}
