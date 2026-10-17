const express = require('express');
const router = express.Router();
const {
  getHealth,
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');

// Health check endpoint
router.get('/health', getHealth);

// Event requirement CRUD endpoints
router.post('/events', createEvent);
router.get('/events', getEvents);
router.get('/events/:id', getEventById);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

module.exports = router;
