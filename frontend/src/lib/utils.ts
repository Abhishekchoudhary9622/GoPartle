import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyINR(amount?: number | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateRange(startDateStr?: string, endDateStr?: string): string {
  if (!startDateStr) return 'TBD';

  try {
    const start = new Date(startDateStr);
    const end = endDateStr ? new Date(endDateStr) : null;

    const startOptions: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };

    if (!end || isNaN(end.getTime()) || start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString('en-US', startOptions);
    }

    const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
    if (sameMonth) {
      return `${start.toLocaleDateString('en-US', { month: 'short' })} ${start.getDate()} – ${end.getDate()}, ${start.getFullYear()}`;
    }

    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  } catch (e) {
    return 'Invalid Date';
  }
}

export const CATEGORIES_CONFIG = {
  planner: {
    id: 'planner',
    label: 'Event Planner',
    pluralLabel: 'Event Planners',
    tagline: 'Plan and manage your event',
    description: 'Find experienced planners to handle budgeting, venue curation, scheduling, and overall execution.',
    badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/25',
    accentColor: '#6C4DFF',
  },
  performer: {
    id: 'performer',
    label: 'Performer',
    pluralLabel: 'Performers',
    tagline: 'Hire artists and performers',
    description: 'Connect with live bands, solo vocalists, DJ acts, classical dancers, and motivational speakers.',
    badgeColor: 'bg-pink-500/10 text-pink-600 dark:text-pink-300 border-pink-500/25',
    accentColor: '#EC4899',
  },
  crew: {
    id: 'crew',
    label: 'Crew',
    pluralLabel: 'Crew Members',
    tagline: 'Get technical and event support',
    description: 'Hire sound engineers, lighting operators, stage coordinators, camera crews, and security teams.',
    badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/25',
    accentColor: '#06B6D4',
  },
} as const;
