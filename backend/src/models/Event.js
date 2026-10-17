const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
      minlength: [3, 'Event name must be at least 3 characters'],
      maxlength: [120, 'Event name cannot exceed 120 characters'],
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      enum: {
        values: [
          'Cultural',
          'Music',
          'Corporate',
          'Wedding',
          'Sports',
          'Educational',
          'Other',
        ],
        message: '{VALUE} is not a supported event type',
      },
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function (value) {
          if (!this.startDate || !value) return true;
          return new Date(value) >= new Date(this.startDate);
        },
        message: 'End date cannot be earlier than start date',
      },
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    venue: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['planner', 'performer', 'crew'],
        message: '{VALUE} is not a valid category. Must be planner, performer, or crew',
      },
      index: true,
    },
    // Category-specific details object
    details: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Category details are required'],
      default: {},
    },
    // Additional requirements
    additional: {
      setupTimeline: {
        type: String,
        trim: true,
        default: '',
      },
      preferredContact: {
        type: String,
        enum: ['Email', 'Phone', 'WhatsApp'],
        default: 'Email',
      },
      contactInfo: {
        type: String,
        trim: true,
        default: '',
      },
      notes: {
        type: String,
        trim: true,
        default: '',
      },
      referenceFile: {
        type: String, // file name or preview url
        default: '',
      },
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'closed'],
      default: 'open',
      index: true,
    },
    isDemo: {
      type: Boolean,
      default: false,
      index: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search across eventName, location, venue, and description
EventSchema.index({
  eventName: 'text',
  location: 'text',
  venue: 'text',
});

module.exports = mongoose.model('Event', EventSchema);
