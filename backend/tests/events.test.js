import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';

const TEST_MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gopratle_test';

beforeAll(async () => {
  await mongoose.connect(TEST_MONGO_URI, { serverSelectionTimeoutMS: 5000 });
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    // Clean up test database
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
});

describe('GoPratle Backend API Test Suite', () => {
  let createdEventId = null;

  describe('1. Health Check Endpoint', () => {
    it('GET /api/health should return 200 and database status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.status).toBe('healthy');
      expect(res.body.database.connected).toBe(true);
    });
  });

  describe('2. POST /api/events - Requirement Creation & Validations', () => {
    it('should create a valid Event Planner requirement', async () => {
      const payload = {
        eventName: 'Annual Fintech Leaders Conclave 2026',
        eventType: 'Corporate',
        startDate: '2026-11-20T09:00:00.000Z',
        endDate: '2026-11-22T18:00:00.000Z',
        location: 'Bengaluru, Karnataka',
        venue: 'Whitefield Convention Center',
        category: 'planner',
        details: {
          budget: 850000,
          expectedAudience: '500 - 1,000',
          durationDays: 3,
          services: ['Venue Booking', 'Event Management', 'Technical Setup'],
          description: 'High-profile tech gathering requiring full AV and corporate stage management.',
        },
        additional: {
          setupTimeline: '24 hours prior',
          preferredContact: 'Email',
          contactInfo: 'organizer@fintechleaders.in',
          notes: 'Stage LED screens must support 4K resolution.',
        },
      };

      const res = await request(app).post('/api/events').send(payload);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBeDefined();
      expect(res.body.data.category).toBe('planner');
      expect(res.body.data.details.budget).toBe(850000);

      createdEventId = res.body.data._id;
    });

    it('should create a valid Performer requirement', async () => {
      const payload = {
        eventName: 'Campus Rock Fiesta 2026',
        eventType: 'Music',
        startDate: '2026-12-05T18:00:00.000Z',
        endDate: '2026-12-05T23:00:00.000Z',
        location: 'Pune, Maharashtra',
        venue: 'University Open Amphitheatre',
        category: 'performer',
        details: {
          performanceType: 'Band',
          genre: 'Alternative Rock',
          numberOfPerformers: 4,
          performanceDuration: '90 minutes',
          equipmentRequired: 'Drum kit, dual guitar amps',
          stageRequirements: '20x15 ft covered stage',
          description: 'High-voltage indie rock band needed to close college cultural fest.',
        },
        additional: {
          preferredContact: 'WhatsApp',
          contactInfo: '+91 98980 12345',
        },
      };

      const res = await request(app).post('/api/events').send(payload);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.category).toBe('performer');
      expect(res.body.data.details.performanceType).toBe('Band');
    });

    it('should create a valid Crew requirement', async () => {
      const payload = {
        eventName: 'South India Classical Sangeeth Utsav',
        eventType: 'Cultural',
        startDate: '2026-11-14T10:00:00.000Z',
        endDate: '2026-11-15T22:00:00.000Z',
        location: 'Chennai, Tamil Nadu',
        venue: 'Music Academy Auditorium',
        category: 'crew',
        details: {
          roles: ['Sound Technician', 'Stage Manager'],
          numberOfCrew: 4,
          experienceLevel: '3-5 Years',
          requiredSkills: 'Acoustic mixing for live carnatic instruments',
          equipmentRequired: 'Personal multimeters and audio monitors',
          shiftDuration: '8 hours',
          description: 'Need certified audio engineers with expertise in acoustic vocal and veena miking.',
        },
      };

      const res = await request(app).post('/api/events').send(payload);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.category).toBe('crew');
      expect(res.body.data.details.roles).toContain('Sound Technician');
    });

    it('should reject request when required basic fields are missing', async () => {
      const invalidPayload = {
        category: 'planner',
      };

      const res = await request(app).post('/api/events').send(invalidPayload);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Validation failed');
    });

    it('should reject invalid category', async () => {
      const invalidCategoryPayload = {
        eventName: 'Magic Show Extravaganza',
        eventType: 'Other',
        startDate: '2026-11-20T09:00:00.000Z',
        endDate: '2026-11-20T18:00:00.000Z',
        location: 'Delhi',
        category: 'magician', // invalid category
        details: {},
      };

      const res = await request(app).post('/api/events').send(invalidCategoryPayload);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject when endDate is earlier than startDate', async () => {
      const invalidDatesPayload = {
        eventName: 'Time Travel Fest',
        eventType: 'Corporate',
        startDate: '2026-11-20T09:00:00.000Z',
        endDate: '2026-11-18T09:00:00.000Z', // 2 days before start
        location: 'Hyderabad, Telangana',
        category: 'planner',
        details: {
          budget: 50000,
          expectedAudience: '100',
          durationDays: 1,
          services: ['Event Management'],
          description: 'Valid description with more than 10 characters',
        },
      };

      const res = await request(app).post('/api/events').send(invalidDatesPayload);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(JSON.stringify(res.body)).toContain('End date cannot be earlier than start date');
    });

    it('should reject planner missing budget or services', async () => {
      const invalidPlannerPayload = {
        eventName: 'Tech Meetup 2026',
        eventType: 'Corporate',
        startDate: '2026-11-20T09:00:00.000Z',
        endDate: '2026-11-20T18:00:00.000Z',
        location: 'Bengaluru, Karnataka',
        category: 'planner',
        details: {
          // missing budget
          expectedAudience: '100',
          durationDays: 1,
          services: [], // empty services array
          description: 'Brief description',
        },
      };

      const res = await request(app).post('/api/events').send(invalidPlannerPayload);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject performer missing genre or performanceType', async () => {
      const invalidPerformerPayload = {
        eventName: 'Indie Night',
        eventType: 'Music',
        startDate: '2026-11-20T09:00:00.000Z',
        endDate: '2026-11-20T18:00:00.000Z',
        location: 'Mumbai, Maharashtra',
        category: 'performer',
        details: {
          numberOfPerformers: 2,
          // missing performanceType and genre
          performanceDuration: '1 hour',
          description: 'Adequate description for test case.',
        },
      };

      const res = await request(app).post('/api/events').send(invalidPerformerPayload);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject crew missing roles or experienceLevel', async () => {
      const invalidCrewPayload = {
        eventName: 'Stage Setup',
        eventType: 'Other',
        startDate: '2026-11-20T09:00:00.000Z',
        endDate: '2026-11-20T18:00:00.000Z',
        location: 'Vijayawada, Andhra Pradesh',
        category: 'crew',
        details: {
          roles: [], // empty roles
          numberOfCrew: 2,
          // missing experienceLevel and requiredSkills
          shiftDuration: '6 hours',
          description: 'Crew description longer than 10 chars',
        },
      };

      const res = await request(app).post('/api/events').send(invalidCrewPayload);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('3. GET /api/events - Listing, Filtering, and Pagination', () => {
    it('should list events with count, total, and category breakdown stats', async () => {
      const res = await request(app).get('/api/events');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.stats).toBeDefined();
      expect(res.body.stats.planner).toBeGreaterThanOrEqual(1);
    });

    it('should filter events by category=performer', async () => {
      const res = await request(app).get('/api/events?category=performer');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      res.body.data.forEach((evt) => {
        expect(evt.category).toBe('performer');
      });
    });

    it('should search events by keyword', async () => {
      const res = await request(app).get('/api/events?search=Fintech');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data[0].eventName).toContain('Fintech');
    });
  });

  describe('4. Single Event Retrieval, Update & Deletion', () => {
    it('GET /api/events/:id should return single event by valid ID', async () => {
      const res = await request(app).get(`/api/events/${createdEventId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(createdEventId.toString());
      expect(res.body.data.eventName).toBe('Annual Fintech Leaders Conclave 2026');
    });

    it('GET /api/events/:id with malformed ID should return 400', async () => {
      const res = await request(app).get('/api/events/invalid-malformed-id');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid ID format');
    });

    it('GET /api/events/:id with non-existent ObjectId should return 404', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/events/${nonExistentId}`);
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('was not found');
    });

    it('PUT /api/events/:id should update event details', async () => {
      const res = await request(app)
        .put(`/api/events/${createdEventId}`)
        .send({ venue: 'Updated Grand Ballroom' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.venue).toBe('Updated Grand Ballroom');
    });

    it('DELETE /api/events/:id should remove the event requirement', async () => {
      const res = await request(app).delete(`/api/events/${createdEventId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify deletion
      const checkRes = await request(app).get(`/api/events/${createdEventId}`);
      expect(checkRes.status).toBe(404);
    });
  });
});
