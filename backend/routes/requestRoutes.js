/* eslint-env node */
const express = require('express');
const {
  submitRequest,
  getMentorRequests,
  getRequestById,
  acceptRequest,
  rejectRequest,
  getMyRequests,
  getMyMentors,
  checkMentorshipStatus,
} = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/requests/:mentorId
// @desc    Submit a mentorship request to a mentor
// @access  Private
router.post('/:mentorId', protect, submitRequest);

// Student Routes (must come before /:requestId to avoid conflict)
// @route   GET /api/requests/my-requests
// @desc    Get all requests submitted by logged-in student
// @access  Private (Student)
router.get('/my-requests', protect, getMyRequests);

// @route   GET /api/requests/my-mentors
// @desc    Get all mentors who accepted the student
// @access  Private (Student)
router.get('/my-mentors', protect, getMyMentors);

// @route   GET /api/requests/check-mentorship-status/:userId
// @desc    Check if two users have an accepted mentorship connection
// @access  Private
router.get('/check-mentorship-status/:userId', protect, checkMentorshipStatus);

// Mentor Routes
// @route   GET /api/requests
// @desc    Get all mentorship requests for logged-in mentor (with optional status filter)
// @access  Private
router.get('/', protect, getMentorRequests);

// @route   GET /api/requests/:requestId
// @desc    Get a specific mentorship request by ID
// @access  Private
router.get('/:requestId', protect, getRequestById);

// @route   PUT /api/requests/:requestId/accept
// @desc    Accept a mentorship request
// @access  Private (Mentor)
router.put('/:requestId/accept', protect, acceptRequest);

// @route   PUT /api/requests/:requestId/reject
// @desc    Reject a mentorship request
// @access  Private (Mentor)
router.put('/:requestId/reject', protect, rejectRequest);

module.exports = router;
