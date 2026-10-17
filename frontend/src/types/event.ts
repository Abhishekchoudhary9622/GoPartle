export type EventCategory = 'planner' | 'performer' | 'crew';

export type EventType =
  | 'Cultural'
  | 'Music'
  | 'Corporate'
  | 'Wedding'
  | 'Sports'
  | 'Educational'
  | 'Other';

export type ContactMethod = 'Email' | 'Phone' | 'WhatsApp';

export interface PlannerDetails {
  budget: number;
  expectedAudience: string;
  durationDays: number;
  services: string[];
  description: string;
}

export interface PerformerDetails {
  performanceType: string;
  genre: string;
  numberOfPerformers: number;
  performanceDuration: string;
  equipmentRequired?: string;
  stageRequirements?: string;
  description: string;
}

export interface CrewDetails {
  roles: string[];
  numberOfCrew: number;
  experienceLevel: string;
  requiredSkills: string;
  equipmentRequired?: string;
  shiftDuration: string;
  description: string;
}

export interface AdditionalRequirements {
  setupTimeline?: string;
  preferredContact: ContactMethod;
  contactInfo?: string;
  notes?: string;
  referenceFile?: string;
}

export interface EventRequirement {
  _id?: string;
  id?: string;
  eventName: string;
  eventType: EventType;
  startDate: string;
  endDate: string;
  location: string;
  venue?: string;
  category: EventCategory;
  details: Record<string, any>;
  additional?: AdditionalRequirements;
  status?: 'open' | 'in_progress' | 'closed';
  isDemo?: boolean;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryOption {
  id: EventCategory;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  accentColor: string;
  gradient: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
  total?: number;
  page?: number;
  totalPages?: number;
  stats?: {
    all: number;
    planner: number;
    performer: number;
    crew: number;
  };
  errors?: Array<{ path: string; message: string }>;
}
