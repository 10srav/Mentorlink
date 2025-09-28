const Organizer = require('../models/organizer');

// @desc    Create or update organizer profile
// @route   POST /api/organizers
// @access  Public (or private if you add auth)
const createOrUpdateOrganizer = async (req, res) => {
  try {
    const {
      user,
      pastEvents,
      eventTypes,
      mode,
      domains,
      help,
      motivation,
      audience,
    } = req.body;

    if (!user) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Build organizer fields
    const organizerFields = {
      user,
      pastEvents,
      eventTypes,
      mode,
      domains,
      help,
      motivation,
      audience,
    };

    // Check if organizer already exists
    let organizer = await Organizer.findOne({ user });

    if (organizer) {
      // Update existing organizer
      organizer = await Organizer.findOneAndUpdate(
        { user },
        { $set: organizerFields },
        { new: true, runValidators: true }
      );
      return res.status(200).json({ message: 'Organizer profile updated', organizer });
    }

    // Create new organizer
    organizer = new Organizer(organizerFields);
    await organizer.save();
    res.status(201).json({ message: 'Organizer profile created', organizer });
  } catch (error) {
    console.error('Organizer error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createOrUpdateOrganizer };
