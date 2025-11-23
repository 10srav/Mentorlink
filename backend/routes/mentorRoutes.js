const express = require('express');
const {
  createOrUpdateMentor,
  getMentorProfile,
  getAllMentors,
  getMentorById,
  updateProfile,
  getMyMentees
} = require('../controllers/mentorController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/mentors
// @access  Public
router.get('/', getAllMentors);

// @route   GET /api/mentors/profile
// @access  Private
// IMPORTANT: This must come BEFORE /:id route
router.get('/profile', protect, getMentorProfile);

// @route   GET /api/mentors/my-mentees
// @access  Private
router.get('/my-mentees', protect, getMyMentees);

// @route   PUT /api/mentors/profile
// @access  Private
router.put('/profile', protect, updateProfile);

// @route   GET /api/mentors/:id
// @access  Public
router.get('/:id', getMentorById);

// @route   POST /api/mentors
// @access  Public (temporarily for initial profile creation)
router.post('/', createOrUpdateMentor);

module.exports = router;
