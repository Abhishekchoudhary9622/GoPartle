import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewRequirementPage from '@/app/requirements/new/page';
import * as api from '@/lib/api';

// Mock confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('GoPratle 4-Step Requirement Wizard Tests', () => {
  it('should validate Step 1 fields and show error when event name is too short', async () => {
    render(<NewRequirementPage />);

    expect(screen.getByText("Let's start with the basics")).toBeInTheDocument();

    // Click Next without entering required fields
    const nextButton = screen.getByText('Next: Category Details');
    fireEvent.click(nextButton);

    expect(await screen.findByText('Event name must be at least 3 characters long.')).toBeInTheDocument();
    expect(await screen.findByText('Start date is required.')).toBeInTheDocument();
    expect(await screen.findByText('Please specify city and state.')).toBeInTheDocument();
  });

  it('should validate that end date cannot be earlier than start date', async () => {
    const { container } = render(<NewRequirementPage />);

    const nameInput = screen.getByPlaceholderText('e.g. Bangalore Cultural Youth Fest 2026');
    fireEvent.change(nameInput, { target: { value: 'Hyderabad Tech Summit' } });

    const locationInput = screen.getByPlaceholderText('e.g. Bengaluru, Karnataka');
    fireEvent.change(locationInput, { target: { value: 'Hyderabad, Telangana' } });

    // Set invalid dates: end date earlier than start date
    const dateInputs = container.querySelectorAll('input[type="date"]');
    // Start date: 2026-11-20
    fireEvent.change(dateInputs[0], { target: { value: '2026-11-20' } });
    // End date: 2026-11-15
    fireEvent.change(dateInputs[1], { target: { value: '2026-11-15' } });

    const nextButton = screen.getByText('Next: Category Details');
    fireEvent.submit(nextButton.closest('form')!);

    expect(await screen.findByText('End date cannot be earlier than start date.')).toBeInTheDocument();
  });

  it('should advance to Step 2 and display category-specific fields', async () => {
    const { container } = render(<NewRequirementPage />);

    // Fill valid Step 1 basics
    const nameInput = screen.getByPlaceholderText('e.g. Bangalore Cultural Youth Fest 2026');
    fireEvent.change(nameInput, { target: { value: 'Pune Indie Fest' } });

    const locationInput = screen.getByPlaceholderText('e.g. Bengaluru, Karnataka');
    fireEvent.change(locationInput, { target: { value: 'Pune, Maharashtra' } });

    const dateInputs = container.querySelectorAll('input[type="date"]');
    fireEvent.change(dateInputs[0], { target: { value: '2026-11-20' } });
    fireEvent.change(dateInputs[1], { target: { value: '2026-11-22' } });

    // Select Performer category
    fireEvent.click(screen.getByRole('heading', { name: 'Performer' }));

    const nextButton = screen.getByText('Next: Category Details');
    fireEvent.submit(nextButton.closest('form')!);

    // Verify Step 2 rendered with Performer fields
    expect(await screen.findByText('Performer Details')).toBeInTheDocument();
    expect(screen.getByText('Performance Type')).toBeInTheDocument();
    expect(screen.getByText('Genre / Performance Style')).toBeInTheDocument();
  });

  it('should render success screen with actual MongoDB record ID upon submission', async () => {
    const mockCreatedEvent = {
      _id: '675123456789abcdef123456',
      eventName: 'Grand Classical Utsav',
      eventType: 'Cultural' as const,
      startDate: '2026-12-01',
      endDate: '2026-12-03',
      location: 'Chennai, Tamil Nadu',
      category: 'planner' as const,
      details: {
        budget: 500000,
        expectedAudience: '500 - 1,000',
        durationDays: 3,
        services: ['Venue Booking', 'Event Management'],
        description: 'Detailed description for test submission with sufficient length.',
      },
      additional: {
        preferredContact: 'Email' as const,
        contactInfo: 'organizer@utsav.in',
      },
    };

    vi.spyOn(api, 'createEventApi').mockResolvedValue({
      success: true,
      data: mockCreatedEvent,
    });

    const { container } = render(<NewRequirementPage />);

    // Step 1
    fireEvent.change(screen.getByPlaceholderText('e.g. Bangalore Cultural Youth Fest 2026'), {
      target: { value: 'Grand Classical Utsav' },
    });
    fireEvent.change(screen.getByPlaceholderText('e.g. Bengaluru, Karnataka'), {
      target: { value: 'Chennai, Tamil Nadu' },
    });
    const dateInputs = container.querySelectorAll('input[type="date"]');
    fireEvent.change(dateInputs[0], { target: { value: '2026-12-01' } });
    fireEvent.change(dateInputs[1], { target: { value: '2026-12-03' } });
    const step1Btn = screen.getByText('Next: Category Details');
    fireEvent.submit(step1Btn.closest('form')!);

    // Step 2
    expect(await screen.findByText('Planner Details')).toBeInTheDocument();
    const descTextarea = screen.getByPlaceholderText(/Describe your event scope/i);
    fireEvent.change(descTextarea, {
      target: { value: 'Detailed description for test submission with sufficient length.' },
    });
    const step2Btn = screen.getByText('Next: Additional Requirements');
    fireEvent.submit(step2Btn.closest('form')!);

    // Step 3
    expect(await screen.findByText('Additional Requirements')).toBeInTheDocument();
    const contactInput = screen.getByPlaceholderText(/organizer@event.com/i);
    fireEvent.change(contactInput, {
      target: { value: 'organizer@utsav.in' },
    });
    const step3Btn = screen.getByText('Next: Review & Submit');
    fireEvent.submit(step3Btn.closest('form')!);

    // Step 4: Review
    expect(await screen.findByText('Review Your Requirement')).toBeInTheDocument();
    const submitBtn = screen.getByText('Submit Requirement');
    fireEvent.click(submitBtn);

    // Verify Success Screen
    expect(await screen.findByText('Requirement Posted Successfully!')).toBeInTheDocument();
    expect(screen.getByText('675123456789abcdef123456')).toBeInTheDocument();
  });
});
