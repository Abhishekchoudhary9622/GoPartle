const { z } = require('zod');

const eventTypeEnum = z.enum([
  'Cultural',
  'Music',
  'Corporate',
  'Wedding',
  'Sports',
  'Educational',
  'Other',
]);

const preferredContactEnum = z.enum(['Email', 'Phone', 'WhatsApp']);

const plannerDetailsSchema = z.object({
  budget: z.coerce.number().positive('Estimated budget must be greater than 0'),
  expectedAudience: z.string().min(1, 'Expected audience size is required'),
  durationDays: z.coerce.number().int().min(1, 'Number of event days must be at least 1'),
  services: z.array(z.string()).min(1, 'Select at least one required service'),
  description: z.string().min(10, 'Event description must be at least 10 characters'),
});

const performerDetailsSchema = z.object({
  performanceType: z.string().min(2, 'Performance type is required'),
  genre: z.string().min(2, 'Genre or performance style is required'),
  numberOfPerformers: z.coerce.number().int().min(1, 'Number of performers must be at least 1'),
  performanceDuration: z.string().min(2, 'Performance duration is required'),
  equipmentRequired: z.string().optional().default(''),
  stageRequirements: z.string().optional().default(''),
  description: z.string().min(10, 'Performance description must be at least 10 characters'),
});

const crewDetailsSchema = z.object({
  roles: z.array(z.string()).min(1, 'Select at least one crew role'),
  numberOfCrew: z.coerce.number().int().min(1, 'Number of crew members must be at least 1'),
  experienceLevel: z.string().min(2, 'Experience level is required'),
  requiredSkills: z.string().min(3, 'Required skills are required'),
  equipmentRequired: z.string().optional().default(''),
  shiftDuration: z.string().min(2, 'Shift duration is required'),
  description: z.string().min(10, 'Crew requirement description must be at least 10 characters'),
});

const additionalSchema = z
  .object({
    setupTimeline: z.string().optional().default(''),
    preferredContact: preferredContactEnum.optional().default('Email'),
    contactInfo: z.string().optional().default(''),
    notes: z.string().optional().default(''),
    referenceFile: z.string().optional().default(''),
  })
  .optional()
  .default({});

// Base Event Schema
const baseEventSchema = z.object({
  eventName: z
    .string({ required_error: 'Event name is required' })
    .trim()
    .min(3, 'Event name must be at least 3 characters')
    .max(120, 'Event name cannot exceed 120 characters'),
  eventType: eventTypeEnum,
  startDate: z.string().or(z.date()).refine((val) => !isNaN(new Date(val).getTime()), {
    message: 'Invalid start date format',
  }),
  endDate: z.string().or(z.date()).refine((val) => !isNaN(new Date(val).getTime()), {
    message: 'Invalid end date format',
  }),
  location: z
    .string({ required_error: 'Location is required' })
    .trim()
    .min(2, 'Location must be at least 2 characters'),
  venue: z.string().optional().default(''),
  category: z.enum(['planner', 'performer', 'crew'], {
    required_error: 'Category is required (planner, performer, or crew)',
  }),
  details: z.record(z.any()),
  additional: additionalSchema,
  imageUrl: z.string().optional().default(''),
  isDemo: z.boolean().optional().default(false),
});

// Main Event Creation Schema with cross-field refinements
const createEventSchema = baseEventSchema.superRefine((data, ctx) => {
  // 1. Date comparison validation
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  if (end < start) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['endDate'],
      message: 'End date cannot be earlier than start date',
    });
  }

  // 2. Category-specific details validation
  if (data.category === 'planner') {
    const result = plannerDetailsSchema.safeParse(data.details);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['details', ...issue.path],
          message: issue.message,
        });
      });
    }
  } else if (data.category === 'performer') {
    const result = performerDetailsSchema.safeParse(data.details);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['details', ...issue.path],
          message: issue.message,
        });
      });
    }
  } else if (data.category === 'crew') {
    const result = crewDetailsSchema.safeParse(data.details);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['details', ...issue.path],
          message: issue.message,
        });
      });
    }
  }
});

// Update schema (partial, allows updating any subset of fields)
const updateEventSchema = baseEventSchema.partial().passthrough();

module.exports = {
  createEventSchema,
  updateEventSchema,
  plannerDetailsSchema,
  performerDetailsSchema,
  crewDetailsSchema,
};
