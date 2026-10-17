import { ApiResponse, EventRequirement } from '@/types/event';

const rawApiUrl =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const cleanApiUrl = rawApiUrl.replace(/\/+$/, '');
const API_BASE_URL = cleanApiUrl.endsWith('/api') ? cleanApiUrl : `${cleanApiUrl}/api`;

export interface GetEventsParams {
  search?: string;
  category?: string;
  eventType?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export async function fetchHealth() {
  const res = await fetch(`${API_BASE_URL}/health`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function fetchEvents(params: GetEventsParams = {}): Promise<ApiResponse<EventRequirement[]>> {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.category && params.category !== 'all') query.append('category', params.category);
  if (params.eventType && params.eventType !== 'all') query.append('eventType', params.eventType);
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.sort) query.append('sort', params.sort);

  const url = `${API_BASE_URL}/events${query.toString() ? `?${query.toString()}` : ''}`;

  const res = await fetch(url, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch events');
  }

  return data;
}

export async function fetchEventById(id: string): Promise<ApiResponse<EventRequirement>> {
  const res = await fetch(`${API_BASE_URL}/events/${id}`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Failed to fetch event with ID: ${id}`);
  }

  return data;
}

export async function createEventApi(payload: Partial<EventRequirement>): Promise<ApiResponse<EventRequirement>> {
  const res = await fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    // If backend returns field-level validation errors, format them clearly
    if (data.errors && Array.isArray(data.errors)) {
      const fieldErrors = data.errors.map((e: any) => `${e.path}: ${e.message}`).join(', ');
      throw new Error(`${data.message} (${fieldErrors})`);
    }
    throw new Error(data.message || 'Failed to submit event requirement');
  }

  return data;
}

export async function deleteEventApi(id: string): Promise<ApiResponse<{ id: string }>> {
  const res = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete event requirement');
  }

  return data;
}
