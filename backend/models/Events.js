const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  tagline: { type: String },
  eventType: {
    type: String,
    required: true,
    enum: ['Workshop', 'Seminar', 'Webinar', 'Hackathon', 'Competition', 'Other']
  },
  eventMode: {
    type: String,
    required: true,
    enum: ['Online', 'Offline']
  },
  isPaid: { type: Boolean, required: true, default: false },
  amount: { type: Number, default: 0 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  timings: { type: String, required: true },
  bannerImageUrl: { type: String },
  registrationLink: { type: String, required: true },
  details: { type: String, required: true },
  importantToRemember: { type: String },
  additionalInfo: { type: String },
  contactAddress: { type: String, required: true },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Event || mongoose.model("Event", eventSchema);
