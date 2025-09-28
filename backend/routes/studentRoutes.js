const express = require('express');
const { createOrUpdateStudent, getStudentProfile, updateProfileImage } = require('../controllers/studentController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   POST /api/students
// @access  Public (temporarily for initial profile creation)
router.post('/', createOrUpdateStudent);

// @route   GET /api/students/profile
// @access  Private
router.get('/profile', protect, getStudentProfile);

// @route   PUT /api/students/profile-image
// @access  Private
router.put('/profile-image', protect, updateProfileImage);

// @route   POST /api/students/upload-image
// @access  Private
router.post('/upload-image', protect, upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const profileImage = req.file.path;
    const userId = req.user._id;

    // Update student profile with image URL
    const { updateProfileImage } = require('../controllers/studentController');
    req.body = { profileImage };
    return updateProfileImage(req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
