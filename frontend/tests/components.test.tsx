import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CategorySelector } from '@/components/CategorySelector';
import { CategoryBadge } from '@/components/CategoryBadge';
import { Stepper } from '@/components/Stepper';
import { ThemeProvider, useTheme } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { EventCard } from '@/components/EventCard';
import { EventRequirement } from '@/types/event';

describe('GoPratle UI Components Test Suite', () => {
  describe('1. CategorySelector & CategoryBadge', () => {
    it('should render all 3 category options and trigger onChange on selection', () => {
      const handleChange = vi.fn();
      render(
        <CategorySelector
          value="planner"
          onChange={handleChange}
        />
      );

      expect(screen.getAllByText('Event Planner')[0]).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Performer' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Crew' })).toBeInTheDocument();

      // Click on Performer
      fireEvent.click(screen.getByText('Performer'));
      expect(handleChange).toHaveBeenCalledWith('performer');

      // Click on Crew
      fireEvent.click(screen.getByText('Crew'));
      expect(handleChange).toHaveBeenCalledWith('crew');
    });

    it('should display CategoryBadge with correct labels and colors', () => {
      const { rerender } = render(<CategoryBadge category="planner" />);
      expect(screen.getByText('Event Planner')).toBeInTheDocument();

      rerender(<CategoryBadge category="performer" />);
      expect(screen.getByText('Performer')).toBeInTheDocument();

      rerender(<CategoryBadge category="crew" />);
      expect(screen.getByText('Crew')).toBeInTheDocument();
    });
  });

  describe('2. Stepper Progress Navigation', () => {
    it('should render 4 steps with correct active and completed states', () => {
      const handleStepClick = vi.fn();
      render(<Stepper currentStep={2} onStepClick={handleStepClick} />);

      expect(screen.getByText('Event Basics')).toBeInTheDocument();
      expect(screen.getByText('Details')).toBeInTheDocument();
      expect(screen.getByText('Requirements')).toBeInTheDocument();
      expect(screen.getByText('Review')).toBeInTheDocument();

      // Clicking accessible step 1 should trigger callback
      const step1Button = screen.getByLabelText('Step 1: Event Basics');
      fireEvent.click(step1Button);
      expect(handleStepClick).toHaveBeenCalledWith(1);
    });
  });

  describe('3. Permanent Dark Theme Enforcement', () => {
    function ThemeTestComponent() {
      const { theme, resolvedTheme } = useTheme();
      return (
        <div>
          <span data-testid="resolved-theme">{resolvedTheme}</span>
        </div>
      );
    }

    it('should permanently enforce dark theme', () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );

      const resolvedTheme = screen.getByTestId('resolved-theme').textContent;
      expect(resolvedTheme).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('4. EventCard Component', () => {
    const mockEvent: EventRequirement = {
      _id: '675123456789abcdef123456',
      eventName: 'Bangalore Rock Night',
      eventType: 'Music',
      startDate: '2026-11-20T10:00:00.000Z',
      endDate: '2026-11-20T22:00:00.000Z',
      location: 'Bengaluru, Karnataka',
      venue: 'Palace Grounds',
      category: 'performer',
      details: {
        performanceType: 'Band',
        genre: 'Classic Rock',
        numberOfPerformers: 4,
        performanceDuration: '2 hours',
        description: 'Need an energetic rock band.',
      },
      isDemo: true,
    };

    it('should render event name, type, category badge, and details', () => {
      render(<EventCard event={mockEvent} />);

      expect(screen.getByText('Bangalore Rock Night')).toBeInTheDocument();
      expect(screen.getByText('Music')).toBeInTheDocument();
      expect(screen.getByText('Performer')).toBeInTheDocument();
      expect(screen.getByText('Classic Rock')).toBeInTheDocument();
      expect(screen.getByText('View Details')).toBeInTheDocument();
    });
  });
});
