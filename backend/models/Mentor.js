const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  primaryDomain: {
    type: String,
    required: true,
  },
  secondaryDomain: {
    type: String,
  },
  linkedin: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  requirements: {
    type: Boolean,
    default: false,
  },
  primaryExperience: {
    type: String,
    required: true,
  },
  mentorshipExperience: {
    type: String,
    required: true,
  },
  mentoringStyle: [{
    type: String,
    enum: ['Text', 'Call', 'Asynchronous'],
  }],
  weeklyAvailability: [{
    type: String,
    enum: ['1-2 hrs', '3-5 hrs', 'On-demand'],
  }],
  skills: [{
    type: String,
  }],
  postsCount: {
    type: Number,
    default: 0,
  },
  // Profile view tracking
  profileViews: [{
    viewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
    ipAddress: String,
  }],
  totalProfileViews: {
    type: Number,
    default: 0,
  },
  weeklyViewCount: {
    type: Number,
    default: 0,
  },
  monthlyViewCount: {
    type: Number,
    default: 0,
  },
  lastViewReset: {
    type: Date,
    default: Date.now,
  },
  activeMentees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  menteesCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.models.Mentor || mongoose.model('Mentor', mentorSchema);
