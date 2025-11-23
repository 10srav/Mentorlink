/* eslint-env node */
/* eslint-disable no-undef */
const express = require('express');
const {
  createOrUpdateOrganizer,
  getOrganizerProfile,
  uploadProfileImage,
  uploadCoverImage,
  updateOrganizerProfile,
  upload,
  uploadToCloudinary
} = require('../controllers/organizerController');
const { protect } = require('../middleware/auth');
const router = express.Router();

// POST /api/organizers - Create or update organizer profile
router.post('/', createOrUpdateOrganizer);

// GET /api/organizers/profile - Get organizer profile for logged-in user
router.get('/profile', protect, getOrganizerProfile);

// PUT /api/organizers/profile - Update organizer profile
router.put('/profile', protect, updateOrganizerProfile);

// POST /api/organizers/upload-profile-image - Upload profile image
router.post('/upload-profile-image', protect, upload.single('profileImage'), uploadToCloudinary, uploadProfileImage);

// POST /api/organizers/upload-cover-image - Upload cover image
router.post('/upload-cover-image', protect, upload.single('coverImage'), uploadToCloudinary, uploadCoverImage);

module.exports = router;

