const mongoose = require('mongoose');

const organizerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pastEvents: {
    type: String,
    required: true,
  },
  eventTypes: {
    type: [String], // Array of strings for multiple checkboxes
    required: true,
  },
  mode: {
    type: [String], // Array of strings for multiple checkboxes
    required: true,
  },
  domains: {
    type: String,
    required: true,
  },
  help: {
    type: [String], // Array of strings for checkboxes
    required: true,
  },
  motivation: {
    type: String,
    required: true,
  },
  audience: {
    type: [String], // Array of strings for checkboxes
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Organizer', organizerSchema);
