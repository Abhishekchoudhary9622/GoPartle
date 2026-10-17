'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StepItem {
  number: number;
  title: string;
  subtitle?: string;
}

interface StepperProps {
  currentStep: number;
  totalSteps?: number;
  onStepClick?: (stepNumber: number) => void;
}

const STEPS: StepItem[] = [
  { number: 1, title: 'Event Basics', subtitle: 'Type, dates & category' },
  { number: 2, title: 'Details', subtitle: 'Category-specific needs' },
  { number: 3, title: 'Requirements', subtitle: 'Timeline & contact' },
  { number: 4, title: 'Review', subtitle: 'Verify & submit' },
];

export function Stepper({ currentStep, onStepClick }: StepperProps) {
  return (
    <div className="w-full max-w-3xl mx-auto py-4 px-2">
      <div className="relative flex items-center justify-between">
        {/* Continuous Background Line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-[#181C26] -z-0" />

        {/* Dynamic Progress Fill Line */}
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 transition-all duration-300 -z-0 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
          style={{
            width: `${((Math.min(currentStep, STEPS.length) - 1) / (STEPS.length - 1)) * 100}%`,
          }}
        />

        {STEPS.map((step) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const isAccessible = step.number <= currentStep;

          return (
            <div key={step.number} className="flex flex-col items-center relative z-10">
              <button
                type="button"
                disabled={!isAccessible}
                onClick={() => isAccessible && onStepClick?.(step.number)}
                className={cn(
                  'w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200',
                  isCompleted &&
                    'bg-amber-500 text-black shadow-md shadow-amber-500/30 hover:bg-amber-400 cursor-pointer',
                  isCurrent &&
                    'bg-[#0F1117] text-amber-400 border-2 border-amber-500 shadow-lg shadow-amber-500/25 ring-4 ring-amber-500/20 scale-105',
                  !isCompleted &&
                    !isCurrent &&
                    'bg-[#12151E] text-slate-500 border border-white/[0.08] cursor-not-allowed'
                )}
                aria-label={`Step ${step.number}: ${step.title}`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 stroke-[2.8]" />
                ) : (
                  <span className="font-mono">{step.number}</span>
                )}
              </button>

              <span
                className={cn(
                  'mt-2 text-xs font-semibold whitespace-nowrap transition-colors duration-200 hidden sm:block',
                  isCurrent
                    ? 'text-amber-400 font-bold'
                    : isCompleted
                    ? 'text-slate-300'
                    : 'text-slate-500'
                )}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
