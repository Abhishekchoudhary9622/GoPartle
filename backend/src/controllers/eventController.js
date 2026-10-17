const mongoose = require('mongoose');
const Event = require('../models/Event');
const { createEventSchema, updateEventSchema } = require('../validators/eventValidator');

// Curated high quality Unsplash images for default event category visuals
const DEFAULT_IMAGES = {
  planner: [
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80',
  ],
  performer: [
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
  ],
  crew: [
    'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
  ],
};

const getRandomImage = (category) => {
  const list = DEFAULT_IMAGES[category] || DEFAULT_IMAGES.planner;
  return list[Math.floor(Math.random() * list.length)];
};

/**
 * Health check endpoint
 * GET /api/health
 */
const getHealth = (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];

  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: states[dbState] || 'Unknown',
      connected: dbState === 1,
    },
  });
};

/**
 * Create a new event requirement
 * POST /api/events
 */
const createEvent = async (req, res, next) => {
  try {
    // Validate request body using Zod schema
    const validatedData = createEventSchema.parse(req.body);

    // If imageUrl is empty, assign a high-quality default image based on category
    if (!validatedData.imageUrl || validatedData.imageUrl.trim() === '') {
      validatedData.imageUrl = getRandomImage(validatedData.category);
    }

    const event = new Event(validatedData);
    const savedEvent = await event.save();

    res.status(201).json({
      success: true,
      message: 'Event requirement created successfully',
      data: savedEvent,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List event requirements with search, filters, pagination
 * GET /api/events
 */
const getEvents = async (req, res, next) => {
  try {
    const {
      search,
      category,
      eventType,
      status,
      page = 1,
      limit = 12,
      sort = '-createdAt',
    } = req.query;

    const query = {};

    // Category filter
    if (category && category !== 'all') {
      query.category = category.toLowerCase();
    }

    // Event type filter
    if (eventType && eventType !== 'all') {
      query.eventType = eventType;
    }

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Keyword search across eventName, location, venue, description
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { eventName: searchRegex },
        { location: searchRegex },
        { venue: searchRegex },
        { 'details.description': searchRegex },
        { 'details.performanceType': searchRegex },
        { 'details.genre': searchRegex },
        { 'details.roles': searchRegex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const [events, total] = await Promise.all([
      Event.find(query).sort(sort).skip(skip).limit(limitNum).lean(),
      Event.countDocuments(query),
    ]);

    // Also get breakdown counts for quick UI filter badges
    const [plannerCount, performerCount, crewCount] = await Promise.all([
      Event.countDocuments({ category: 'planner' }),
      Event.countDocuments({ category: 'performer' }),
      Event.countDocuments({ category: 'crew' }),
    ]);

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      stats: {
        all: total,
        planner: plannerCount,
        performer: performerCount,
        crew: crewCount,
      },
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single event requirement by ID
 * GET /api/events/:id
 */
const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID format: '${id}' is not a valid MongoDB ObjectId.`,
      });
    }

    const event = await Event.findById(id).lean();

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event requirement with ID '${id}' was not found.`,
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an event requirement
 * PUT /api/events/:id
 */
const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID format: '${id}' is not a valid MongoDB ObjectId.`,
      });
    }

    const validatedData = updateEventSchema.parse(req.body);

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: `Event requirement with ID '${id}' was not found.`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event requirement updated successfully',
      data: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an event requirement
 * DELETE /api/events/:id
 */
const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID format: '${id}' is not a valid MongoDB ObjectId.`,
      });
    }

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({
        success: false,
        message: `Event requirement with ID '${id}' was not found.`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event requirement deleted successfully',
      data: { id: deletedEvent._id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHealth,
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
